import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API, api, roomId } from '../api';
import { PageHead, Empty, Avatar } from './Ui';

export default function Chat({ user }) {
  const [peers, setPeers] = useState(null); const [peer, setPeer] = useState(null);
  const [msgs, setMsgs] = useState([]); const [text, setText] = useState('');
  const socket = useRef(null); const box = useRef(null);

  // Chat is available with anyone whose mentorship request has been accepted
  useEffect(() => {
    api.get('/requests/mine').then(r => {
      const map = new Map();
      r.data.filter(x => x.status === 'accepted').forEach(x => { const p = user.role === 'alumni' ? x.student : x.alumni; map.set(p._id, p); });
      setPeers([...map.values()]);
    });
  }, []);

  useEffect(() => {
    if (!peer) return;
    const room = roomId(user._id, peer._id);
    socket.current = io(API, { auth: { token: localStorage.getItem('token') } });
    socket.current.emit('join', room);
    api.get(`/chat/${room}`).then(r => setMsgs(r.data));
    socket.current.on('message', m => setMsgs(prev => [...prev, m]));
    return () => socket.current.disconnect();
  }, [peer]);

  useEffect(() => { box.current?.scrollTo(0, box.current.scrollHeight); }, [msgs]);

  const send = e => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.current.emit('message', { room: roomId(user._id, peer._id), text }); setText('');
  };

  return (
    <>
      <PageHead title="Chat" sub="Message the people you are connected with." />
      {peers && !peers.length ? <Empty>Chat opens once a mentor accepts a request. {user.role === 'student' && <><Link to="/">Find a mentor</Link> to get started.</>}</Empty> :
        <div className="chatbox">
          <div className="contacts">{(peers || []).map(p => <button key={p._id} className={peer?._id === p._id ? 'on' : ''} onClick={() => { setMsgs([]); setPeer(p); }}><Avatar name={p.name} />{p.name}</button>)}</div>
          <div className="thread">
            {peer ? <>
              <div className="msgs" ref={box}>{msgs.length ? msgs.map(m => <div key={m._id} className={`bubble ${m.sender === user._id ? 'me' : ''}`}>{m.text}</div>) : <p className="none">Say hello to {peer.name}.</p>}</div>
              <form onSubmit={send}><input aria-label="Message" value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${peer.name}`} /><button>Send</button></form></>
              : <p className="none">Choose someone to start chatting.</p>}
          </div>
        </div>}
    </>
  );
}
