import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { PageHead, Empty, Pill, Avatar } from './Ui';

export default function Requests({ user }) {
  const [list, setList] = useState(null); const [when, setWhen] = useState({});
  const alumni = user.role === 'alumni';
  const load = () => api.get('/requests/mine').then(r => setList(r.data));
  useEffect(() => { load(); }, []);
  const accept = async id => { await api.patch(`/requests/${id}/accept`, { scheduledAt: when[id] }); load(); };
  const reject = async id => { await api.patch(`/requests/${id}/reject`); load(); };

  return (
    <>
      <PageHead title="Mentorship" sub={alumni ? 'Students who asked for your guidance. Accept a request to pick a time and create a Google Meet link.' : 'Your requests to alumni and the sessions they scheduled.'} />
      {list && !list.length && <Empty>{alumni ? 'No requests yet. Students will appear here when they ask for your guidance.' : <>You have not asked anyone yet. <Link to="/">Find a mentor</Link> and send your first request.</>}</Empty>}
      <ul className="rows">{(list || []).map(r => { const who = alumni ? r.student : r.alumni; return (
        <li key={r._id}>
          <Avatar name={who.name} />
          <div className="grow">
            <div className="flex"><strong>{who.name}</strong><Pill s={r.status} /></div>
            <p className="muted" style={{ margin: 0 }}>{who.designation || who.email}{who.company && ` at ${who.company}`}</p>
            <p style={{ margin: '6px 0' }}>{r.message}</p>
            {r.status === 'accepted' && <div className="flex"><span>Session on {r.scheduledAt ? new Date(r.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'a time to be confirmed'}</span>
              {r.meetLink && <a className="btn" href={r.meetLink} target="_blank" rel="noreferrer">Join Google Meet</a>}</div>}
            {alumni && r.status === 'pending' && <div className="flex" style={{ marginTop: 8 }}>
              <input type="datetime-local" aria-label="Session time" style={{ width: 'auto' }} onChange={e => setWhen({ ...when, [r._id]: e.target.value })} />
              <button disabled={!when[r._id]} onClick={() => accept(r._id)}>Accept and schedule</button>
              <button className="quiet" onClick={() => reject(r._id)}>Decline</button></div>}
          </div>
        </li>); })}</ul>
    </>
  );
}
