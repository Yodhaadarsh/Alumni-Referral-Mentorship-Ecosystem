import { useState } from 'react';
import { api } from '../api';
import { PageHead } from './Ui';
import { CATEGORIES } from '../landingData';

const csv = s => s.split(',').map(x => x.trim()).filter(Boolean);

export default function Profile({ user, setUser }) {
  const alumni = user.role === 'alumni';
  const [f, setF] = useState({ company: user.company || '', designation: user.designation || '', branch: user.branch || '',
    skills: (user.skills || []).join(', '), interests: (user.interests || []).join(', '), openToMentor: user.openToMentor !== false,
    batch: user.batch || '', course: user.course || '', location: user.location || '', domain: user.domain || '', linkedin: user.linkedin || '', careerPath: user.careerPath || '' });
  const [saved, setSaved] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const save = async () => {
    const body = { ...f, skills: csv(f.skills), interests: csv(f.interests), batch: f.batch ? Number(f.batch) : undefined };
    const r = await api.put('/auth/me', body);
    setUser(r.data); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <>
      <PageHead title="Your profile" sub={alumni ? 'Students find you through your skills, interests and company. Details below also appear on the public alumni page.' : 'Your skills, interests and target company decide which alumni we match you with.'} />
      <div className="panel" style={{ maxWidth: 620 }}>
        <label className="field">{alumni ? 'Current company' : 'Target company'}<input value={f.company} onChange={set('company')} /></label>
        {alumni && <label className="field">Designation<input value={f.designation} onChange={set('designation')} /></label>}
        <label className="field">Branch<input value={f.branch} onChange={set('branch')} /></label>
        {alumni && <>
          <div className="flex" style={{ alignItems: 'flex-start' }}>
            <label className="field grow">Batch (graduation year)<input inputMode="numeric" value={f.batch} onChange={set('batch')} placeholder="2019" /></label>
            <label className="field grow">Course<input value={f.course} onChange={set('course')} placeholder="B.Tech CSE" /></label>
          </div>
          <label className="field">Location<input value={f.location} onChange={set('location')} placeholder="Bengaluru, India" /></label>
          <label className="field">Domain<input value={f.domain} onChange={set('domain')} placeholder="Software Engineering" /></label>
          <label className="field">Career path<select value={f.careerPath} onChange={set('careerPath')}><option value="">Not set</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="field">LinkedIn profile link<input value={f.linkedin} onChange={set('linkedin')} placeholder="https://www.linkedin.com/in/..." /></label>
        </>}
        <label className="field">Skills <span className="muted">(separate with commas)</span><input value={f.skills} onChange={set('skills')} placeholder="react, node, aws" /></label>
        <div>{csv(f.skills).map(s => <span className="chip" key={s}>{s}</span>)}</div>
        <label className="field" style={{ marginTop: 12 }}>Interests <span className="muted">(separate with commas)</span><input value={f.interests} onChange={set('interests')} placeholder="cloud computing, fintech" /></label>
        {alumni && <label className="flex" style={{ margin: '4px 0 14px' }}><input type="checkbox" style={{ width: 'auto' }} checked={f.openToMentor} onChange={set('openToMentor')} /> I am open to mentoring students</label>}
        <div className="flex"><button onClick={save}>Save profile</button>{saved && <span className="muted" role="status">Profile saved</span>}</div>
      </div>
    </>
  );
}
