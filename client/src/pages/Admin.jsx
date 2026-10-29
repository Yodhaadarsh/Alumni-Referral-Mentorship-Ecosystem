import { useEffect, useState } from 'react';
import { api } from '../api';
import { PageHead } from './Ui';

const STATS = [['students', 'Students'], ['alumni', 'Alumni'], ['pending', 'Requests waiting'], ['accepted', 'Active mentorships'],
  ['referrals', 'Referral openings'], ['applications', 'Applications'], ['referred', 'Students referred'], ['messages', 'Chat messages']];

export default function Admin() {
  const [stats, setStats] = useState(null); const [users, setUsers] = useState([]); const [q, setQ] = useState('');
  const load = () => { api.get('/admin/stats').then(r => setStats(r.data)); api.get('/admin/users').then(r => setUsers(r.data)); };
  useEffect(load, []);
  const remove = async u => { if (confirm(`Remove ${u.name} from the platform?`)) { await api.delete(`/admin/users/${u._id}`); load(); } };
  const shown = users.filter(u => `${u.name} ${u.email} ${u.company || ''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="Placement cell overview" sub="How students and alumni are using the platform." />
      {stats && <div className="figures">{STATS.map(([k, l]) => <div key={k}><b>{stats[k]}</b><span className="muted">{l}</span></div>)}</div>}
      <section>
        <div className="flex" style={{ justifyContent: 'space-between' }}><h2>People</h2>
          <input aria-label="Filter people" placeholder="Filter by name, email or company" value={q} onChange={e => setQ(e.target.value)} style={{ maxWidth: 300 }} /></div>
        <div className="tablewrap"><table><thead><tr><th>Name</th><th>Role</th><th>Company</th><th>Skills</th><th /></tr></thead>
          <tbody>{shown.map(u => <tr key={u._id}>
            <td><strong>{u.name}</strong><div className="muted">{u.email}</div></td><td style={{ textTransform: 'capitalize' }}>{u.role}</td><td>{u.company}</td>
            <td>{(u.skills || []).slice(0, 4).map(s => <span className="chip" key={s}>{s}</span>)}</td>
            <td><button className="quiet" onClick={() => remove(u)}>Remove</button></td></tr>)}</tbody></table></div>
        {!shown.length && <p className="muted" style={{ marginTop: 10 }}>No one matches that filter.</p>}
      </section>
    </>
  );
}
