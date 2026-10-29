import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './api';
import { enableNotifications } from './firebase';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Referrals from './pages/Referrals';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import { Avatar } from './pages/Ui';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState({ view: 'landing' });
  const nav = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) return setReady(true);
    api.get('/auth/me').then(r => { setUser(r.data); enableNotifications(); })
      .catch(() => localStorage.removeItem('token')).finally(() => setReady(true));
  }, []);

  const onAuth = ({ token, user }) => { localStorage.setItem('token', token); setUser(user); enableNotifications(); nav('/'); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); setScreen({ view: 'landing' }); nav('/'); };

  if (!ready) return null;
  if (!user) return screen.view === 'auth'
    ? <Auth onAuth={onAuth} initialMode={screen.mode} initialRole={screen.role} onBack={() => setScreen({ view: 'landing' })} />
    : <Landing go={(mode, role) => setScreen({ view: 'auth', mode, role })} />;

  const links = user.role === 'admin' ? [['/', 'Overview']]
    : user.role === 'student' ? [['/', 'Find mentors'], ['/requests', 'Mentorship'], ['/referrals', 'Referrals'], ['/chat', 'Chat'], ['/profile', 'Profile']]
    : [['/', 'Mentorship'], ['/referrals', 'Referrals'], ['/chat', 'Chat'], ['/profile', 'Profile']];
  const home = user.role === 'admin' ? <Admin /> : user.role === 'student' ? <Dashboard user={user} /> : <Requests user={user} />;

  return (
    <div className="shell">
      <div className="topbar"><span>Alumni Ecosystem</span><button onClick={logout}>Log out</button></div>
      <aside className="sidebar">
        <div className="brand">Alumni Ecosystem<small>IILM University</small></div>
        <nav aria-label="Main">{links.map(([to, label]) => <NavLink key={to} to={to} end>{label}</NavLink>)}</nav>
        <div className="me"><Avatar name={user.name} /><div><strong>{user.name}</strong><span>{user.role}</span></div><button onClick={logout}>Log out</button></div>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={home} />
          <Route path="/requests" element={<Requests user={user} />} />
          <Route path="/referrals" element={<Referrals user={user} />} />
          <Route path="/chat" element={<Chat user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
