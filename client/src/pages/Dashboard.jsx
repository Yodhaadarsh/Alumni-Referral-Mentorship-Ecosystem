import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { PageHead, Empty, Ring } from './Ui';

function AlumniCard({ a, score, mine }) {
  const [open, setOpen] = useState(false); const [msg, setMsg] = useState(''); const [sent, setSent] = useState(false);
  const mineSet = new Set((mine || []).map(s => s.toLowerCase()));
  const shared = (a.skills || []).filter(s => mineSet.has(s.toLowerCase()));
  const send = async () => { await api.post('/requests', { alumni: a._id, message: msg }); setSent(true); };
  return (
    <article className="alum">
      {score !== undefined ? <Ring value={score} /> : <span className="avatar lg">{a.name[0]}</span>}
      <div>
        <h4>{a.name}</h4>
        <p className="muted" style={{ margin: 0 }}>{a.designation}{a.company && ` at ${a.company}`}</p>
        <div style={{ marginTop: 6 }}>{(a.skills || []).map(s => <span key={s} className={`chip ${mineSet.has(s.toLowerCase()) ? 'hit' : ''}`}>{s}</span>)}</div>
        {shared.length > 0 && <p className="why">You both know {shared.slice(0, 3).join(', ')}</p>}
      </div>
      <div className="ask">
        {sent ? <p className="muted" role="status">Request sent. You will see the reply under Mentorship.</p> :
          open ? <div className="flex"><input className="grow" autoFocus placeholder="What would you like help with?" value={msg} onChange={e => setMsg(e.target.value)} />
            <button disabled={!msg.trim()} onClick={send}>Send request</button><button className="quiet" onClick={() => setOpen(false)}>Cancel</button></div>
          : <button className="maroon" onClick={() => setOpen(true)}>Ask for mentorship</button>}
      </div>
    </article>
  );
}

export default function Dashboard({ user }) {
  const [matches, setMatches] = useState([]); const [list, setList] = useState([]); const [q, setQ] = useState('');
  const search = e => { e?.preventDefault(); api.get('/alumni', { params: { q } }).then(r => setList(r.data)); };
  useEffect(() => { api.get('/alumni/match').then(r => setMatches(r.data)); search(); }, []);
  const hasSkills = (user.skills || []).length > 0;

  return (
    <>
      <PageHead title="Find a mentor" sub="Alumni ranked by how closely their skills, interests and company match yours." />
      <section>
        <h2>Best matches for you</h2>
        {!hasSkills && <Empty>Your matches get better with a few details. <Link to="/profile">Add your skills and interests</Link> and the ranking updates right away.</Empty>}
        {matches.map(m => <AlumniCard key={m.alumni._id} a={m.alumni} score={m.score} mine={user.skills} />)}
      </section>
      <section>
        <h2>Search all alumni</h2>
        <form className="search" onSubmit={search}><input aria-label="Search alumni" placeholder="Name, company or skill" value={q} onChange={e => setQ(e.target.value)} /><button>Search</button></form>
        {list.length ? list.map(a => <AlumniCard key={a._id} a={a} mine={user.skills} />) : <Empty>No alumni match "{q}". Try a company or a skill like python.</Empty>}
      </section>
    </>
  );
}
