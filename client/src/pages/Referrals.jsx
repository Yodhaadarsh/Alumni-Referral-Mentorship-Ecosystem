import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHead, Empty, Pill } from './Ui';

export default function Referrals({ user }) {
  const [list, setList] = useState(null); const [f, setF] = useState({ title: '', company: '', description: '', requiredSkills: '' });
  const [resume, setResume] = useState({}); const [note, setNote] = useState('');
  const alumni = user.role === 'alumni';
  const load = () => api.get('/referrals').then(r => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const post = async () => {
    await api.post('/referrals', { ...f, requiredSkills: f.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) });
    setF({ title: '', company: '', description: '', requiredSkills: '' }); setNote('Referral posted'); load();
  };
  const apply = async id => {
    try { await api.post(`/referrals/${id}/apply`, { resumeUrl: resume[id] }); setNote('Application sent'); load(); }
    catch (e) { setNote(e.response?.data?.error || 'Could not apply. Try again.'); }
  };
  const setStatus = async (id, sid, status) => { await api.patch(`/referrals/${id}/applicants/${sid}`, { status }); load(); };

  return (
    <>
      <PageHead title="Referrals" sub={alumni ? 'Post openings at your company and decide which students you refer.' : 'Openings that alumni will refer you for. Add your resume link and apply.'} />
      {note && <p className="muted" role="status">{note}</p>}
      {alumni && <section><details className="panel"><summary style={{ cursor: 'pointer', fontWeight: 600 }}>Post a referral opening</summary>
        <div style={{ marginTop: 14 }}>
          <label className="field">Job title<input value={f.title} onChange={set('title')} /></label>
          <label className="field">Company<input value={f.company} onChange={set('company')} /></label>
          <label className="field">What the role involves<textarea rows="2" value={f.description} onChange={set('description')} /></label>
          <label className="field">Skills needed <span className="muted">(separate with commas)</span><input value={f.requiredSkills} onChange={set('requiredSkills')} /></label>
          <button disabled={!f.title || !f.company} onClick={post}>Post opening</button></div></details></section>}
      {list && !list.length && <Empty>No openings yet. {alumni ? 'Post the first one above.' : 'Check back soon, alumni add new ones regularly.'}</Empty>}
      <ul className="rows">{(list || []).map(r => (
        <li key={r._id}><div className="grow">
          <h4>{r.title}</h4>
          <p className="muted" style={{ margin: 0 }}>{r.company}, posted by {r.alumni?.name}</p>
          <p style={{ margin: '6px 0' }}>{r.description}</p>
          <div>{(r.requiredSkills || []).map(s => <span className="chip" key={s}>{s}</span>)}</div>
          {!alumni && <div className="flex" style={{ marginTop: 10 }}><input className="grow" placeholder="Link to your resume" aria-label="Resume link" onChange={e => setResume({ ...resume, [r._id]: e.target.value })} />
            <button className="maroon" onClick={() => apply(r._id)}>Apply for referral</button></div>}
          {alumni && r.alumni?._id === user._id && r.applicants.length > 0 && <div style={{ marginTop: 10 }}><strong>{r.applicants.length} applicant{r.applicants.length > 1 ? 's' : ''}</strong>
            {r.applicants.map(a => <div className="flex" key={a.student} style={{ marginTop: 6 }}>
              <span>{a.studentName || `Student ${String(a.student).slice(-5)}`}</span><Pill s={a.status} />{a.resumeUrl && <a href={a.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
              <select aria-label="Update status" style={{ width: 'auto' }} value={a.status} onChange={e => setStatus(r._id, a.student, e.target.value)}>
                {['applied', 'shortlisted', 'referred', 'rejected'].map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select></div>)}</div>}
        </div></li>))}</ul>
    </>
  );
}
