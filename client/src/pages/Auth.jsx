import { useState } from 'react';
import { api, DEMO } from '../api';

const DEMOS = [['Student', 'student@demo.com', 'demo123'], ['Alumni', 'riya@demo.com', 'demo123'], ['Admin', 'admin@demo.com', 'admin123']];

export default function Auth({ onAuth, initialMode = 'login', initialRole = 'student', onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [f, setF] = useState({ role: initialRole, name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const go = async (path, body) => {
    setErr('');
    try { onAuth((await api.post(`/auth/${path}`, body)).data); }
    catch (x) { setErr(x.response ? (x.response.data?.error || 'Something went wrong. Try again.') : 'Cannot reach the server. Start the backend on port 5000 and try again.'); }
  };
  const submit = e => { e.preventDefault(); go(mode, f); };

  return (
    <div className="login">
      <div className="story">
        <h1>Learn from alumni who sat where you sit</h1>
        <ul>
          <li>Find mentors by skill, company and interest.</li>
          <li>Apply for referrals that alumni post for current students.</li>
          <li>Chat with your mentor and meet on Google Meet once they accept.</li>
        </ul>
      </div>
      <div className="formside">
        <form onSubmit={submit}>
          {onBack && <button type="button" className="quiet" style={{ marginBottom: 18 }} onClick={onBack}>Back to home</button>}
          <h2>{mode === 'login' ? 'Log in to your account' : 'Create your account'}</h2>
          {mode === 'register' && <>
            <div className="seg" role="group" aria-label="I am a">
              {['student', 'alumni'].map(r => <button type="button" key={r} className={f.role === r ? 'on' : ''} onClick={() => setF({ ...f, role: r })}>{r === 'student' ? 'Student' : 'Alumni'}</button>)}
            </div>
            <label className="field">Full name<input required value={f.name} onChange={set('name')} /></label>
          </>}
          <label className="field">Email<input type="email" required value={f.email} onChange={set('email')} /></label>
          <label className="field">Password<input type="password" required minLength={4} value={f.password} onChange={set('password')} /></label>
          {err && <p className="err" role="alert">{err}</p>}
          <div className="flex">
            <button>{mode === 'login' ? 'Log in' : 'Create account'}</button>
            <button type="button" className="quiet" onClick={() => { setErr(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
              {mode === 'login' ? 'Create an account' : 'I already have an account'}
            </button>
          </div>
          {DEMO && <div className="demo"><span className="muted">No account yet? Try a demo:</span>
            <div className="flex">{DEMOS.map(([l, email, password]) => <button type="button" className="quiet" key={l} onClick={() => go('login', { email, password })}>{l}</button>)}</div></div>}
        </form>
      </div>
    </div>
  );
}
