import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { ALUMNI as SAMPLE_ALUMNI, CATEGORIES, OPPORTUNITIES as SAMPLE_OPPS, TESTIMONIALS } from '../landingData';

const PAIRS = [['#8c2a3a', '#d9697a'], ['#14213d', '#3f5fa8'], ['#1e7f6b', '#6cc3a9'], ['#a15c07', '#e9b04f'], ['#4b2c7a', '#9a7fd1'], ['#1b5e8c', '#5fb0e0']];
const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2);
const pair = id => PAIRS[[...String(id)].reduce((s, c) => s + c.charCodeAt(0), 0) % PAIRS.length];

const ICONS = {
  company: <><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 9h1M9 13h1M14 9h1M14 13h1" /></>,
  batch: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></>,
  place: <><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
};
const Icon = ({ k }) => <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>;

// Turns a user record from the API into the shape the cards use
const toCard = a => ({ id: a._id, name: a.name, role: a.designation || 'Alumnus', company: a.company || '', batch: a.batch || '', course: a.course || '',
  location: a.location || '', domain: a.domain || '', cats: a.careerPath ? [a.careerPath] : [], linkedin: a.linkedin });

export default function Landing({ go }) {
  const [live, setLive] = useState(null);
  useEffect(() => { api.get('/public/overview').then(r => setLive(r.data)).catch(() => setLive(null)); }, []);
  const real = !!live && live.alumni.length > 0;   // real database data, else sample data
  const ALUMNI = useMemo(() => real ? live.alumni.map(toCard) : SAMPLE_ALUMNI, [live]);
  const OPPS = real ? live.opportunities : SAMPLE_OPPS;

  const [draft, setDraft] = useState({ company: '', batch: '', domain: '', location: '' });
  const [applied, setApplied] = useState(draft);
  const [cat, setCat] = useState('');
  const set = k => e => setDraft({ ...draft, [k]: e.target.value });
  const has = (v, q) => String(v).toLowerCase().includes(q.trim().toLowerCase());

  const shown = useMemo(() => ALUMNI.filter(a =>
    has(a.company, applied.company) && has(a.batch, applied.batch) && has(a.domain, applied.domain) && has(a.location, applied.location) &&
    (!cat || a.cats.includes(cat))), [applied, cat, ALUMNI]);

  const stats = [
    ['Alumni', ALUMNI.length], ['Companies and institutes', new Set(ALUMNI.map(a => a.company).filter(Boolean)).size],
    ['Countries', new Set(ALUMNI.map(a => a.location.split(',').pop().trim()).filter(Boolean)).size], ['Opportunities shared', OPPS.length],
  ];
  const clear = () => { const e = { company: '', batch: '', domain: '', location: '' }; setDraft(e); setApplied(e); setCat(''); };

  return (
    <div className="site">
      <header className="site-nav">
        <a className="site-brand" href="#top"><img src="/crest.png" alt="" /><span>Alumni Ecosystem<small>IILM University</small></span></a>
        <nav aria-label="Site"><a href="#alumni">Alumni</a><a href="#opps">Opportunities</a><a href="#stories">Stories</a></nav>
        <button onClick={() => go('login', 'student')}>Log in</button>
      </header>

      <section className="site-hero" id="top">
        <div className="wrap">
          <h1>Our Alumni Network</h1>
          <p>Building careers across the globe through mentorship, referrals and real-time opportunities.</p>
          <div className="flex">
            <button className="maroon" onClick={() => go('register', 'alumni')}>Register as Alumni</button>
            <button className="ghostlight" onClick={() => go('login', 'alumni')}>Alumni login</button>
            <a className="btn light" href="#opps">Explore opportunities</a>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="site-stats">{stats.map(([l, n]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>

        <section id="alumni" className="site-sec">
          <div className="site-filters">
            <form onSubmit={e => { e.preventDefault(); setApplied(draft); }}>
              <input aria-label="Company" placeholder="Filter by company" value={draft.company} onChange={set('company')} />
              <input aria-label="Batch" placeholder="Batch (2019)" value={draft.batch} onChange={set('batch')} />
              <input aria-label="Domain" placeholder="Domain" value={draft.domain} onChange={set('domain')} />
              <input aria-label="Location" placeholder="Location" value={draft.location} onChange={set('location')} />
              <button>Apply filters</button>
            </form>
            <div className="chips" role="group" aria-label="Career path">
              {CATEGORIES.map(c => <button key={c} type="button" aria-pressed={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(cat === c ? '' : c)}>{c}</button>)}
            </div>
          </div>

          <div className="flex" style={{ justifyContent: 'space-between', margin: '34px 0 16px' }}>
            <h2>Alumni showcase</h2><span className="muted">Real network. Real referrals. Real outcomes.</span>
          </div>
          <div className="alumni-grid">
            {shown.map(a => { const [c1, c2] = pair(a.id); return (
              <article className="acard" key={a.id}>
                <div className="flex" style={{ gap: 14, flexWrap: 'nowrap' }}>
                  <span className="tile" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>{initials(a.name)}</span>
                  <div><h3>{a.name}</h3><p className="muted" style={{ margin: 0 }}>{a.role}</p></div>
                </div>
                <ul>
                  {a.company && <li><Icon k="company" />{a.company}</li>}
                  {(a.batch || a.course) && <li><Icon k="batch" />{a.batch && `Batch ${a.batch}`}{a.batch && a.course && ', '}{a.course}</li>}
                  {a.location && <li><Icon k="place" />{a.location}</li>}
                </ul>
                <div className="flex" style={{ justifyContent: 'space-between' }}>
                  {(a.linkedin || !real) ? <a href={a.linkedin || 'https://www.linkedin.com'} target="_blank" rel="noreferrer">LinkedIn profile</a> : <span />}
                  <button className="quiet" onClick={() => go('login', 'student')}>Connect</button>
                </div>
                {!real && <p className="sample">Sample alumni profile</p>}
              </article>); })}
          </div>
          {!shown.length && <div className="empty">No alumni match these filters. <button className="quiet" onClick={clear}>Clear filters</button></div>}
        </section>

        <div className="site-two">
          <section id="stories" className="stories">
            <h2>Testimonials</h2>
            {TESTIMONIALS.map(t => <blockquote key={t.who}><p>{t.text}</p><footer>{t.who}</footer></blockquote>)}
          </section>
          <section id="opps" className="opps">
            <h2>Recent opportunities</h2>
            {!OPPS.length && <p className="muted">No openings yet. Alumni will post them here.</p>}
            <ul className="rows">{OPPS.map(o => (
              <li key={o.id}><div className="grow"><h4>{o.title} at {o.company}</h4>
                <p className="muted" style={{ margin: 0 }}>{[o.location, o.type].filter(Boolean).join(', ')}{o.by && `. Shared by ${o.by}`}</p></div>
                <button className="quiet" onClick={() => go('login', 'student')}>Log in to apply</button></li>))}</ul>
          </section>
        </div>
      </div>
      <footer className="site-foot">Alumni Referral and Mentorship Ecosystem. IILM University, Greater Noida.{!real && ' Sample data shown.'}</footer>
    </div>
  );
}
