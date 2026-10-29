import { useEffect, useState } from 'react';

export const PageHead = ({ title, sub }) => <header className="page-head"><h1>{title}</h1>{sub && <p>{sub}</p>}</header>;
export const Empty = ({ children }) => <div className="empty">{children}</div>;
export const Pill = ({ s }) => <span className={`pill ${s}`}>{{ pending: 'Pending', accepted: 'Accepted', rejected: 'Declined', applied: 'Applied', shortlisted: 'Shortlisted', referred: 'Referred' }[s] || s}</span>;
export const Avatar = ({ name, lg }) => <span className={`avatar ${lg ? 'lg' : ''}`}>{(name || '?')[0]}</span>;

// Score ring: animates from empty to the match percentage on first paint
export function Ring({ value }) {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 80); return () => clearTimeout(t); }, [value]);
  const r = 31, c = 2 * Math.PI * r;
  return (
    <div className="ring" role="img" aria-label={`${value}% match`}>
      <svg width="72" height="72"><circle className="track" cx="36" cy="36" r={r} />
        <circle className="bar" cx="36" cy="36" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} /></svg>
      <b>{value}%</b>
    </div>
  );
}
