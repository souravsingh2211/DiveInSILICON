import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { CATALOG, NAV } from './catalog.data'
import ThemeToggle from './ThemeToggle'
import './Courses.css'   // shares the Courses page look
import './Catalog.css'

/** One page component for 'interview', 'projects' and 'internships'. */
export default function Catalog({ kind }) {
  const cfg = CATALOG[kind]
  const nav = useNavigate()
  const { user } = useAuth()
  const [tag, setTag] = useState('All')
  const [q, setQ] = useState('')
  const [toast, setToast] = useState('')
  const timer = useRef(0)
  const here = NAV.find(([, p]) => p === '/' + kind)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return cfg.items.filter(c => (tag === 'All' || c.tag === tag) && (c.title + ' ' + c.blurb + ' ' + c.skills.join(' ')).toLowerCase().includes(s))
  }, [cfg, tag, q])

  const open = c => {
    if (!user) { nav('/login'); return }
    // TODO: open the real page for this item once it exists
    setToast(`${c.title} will open here once its page is added.`)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2600)
  }
  const spot = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }

  return (
    <div className="cr">
      <nav className="cr-nav">
        <button type="button" className="cr-logo" onClick={() => nav('/')}>DiveInSILICON</button>
        <div className="cr-links">
          {NAV.map(([label, path]) => (
            <button key={path} type="button" className={path === here[1] ? 'cr-on' : ''} onClick={() => nav(path)}>{label}</button>
          ))}
          {user && <button type="button" onClick={() => nav('/dashboard')}>Dashboard</button>}
        </div>
        <div className="tt-right">
          <ThemeToggle />
          {user
            ? <button type="button" className="cr-pill" onClick={() => nav('/dashboard')}>Dashboard</button>
            : <button type="button" className="cr-pill" onClick={() => nav('/login')}>Log in</button>}
        </div>
      </nav>

      <header className="cr-head">
        <h1>{cfg.title}</h1>
        <p>{cfg.sub}</p>
      </header>

      <div className="cr-bar">
        <label className="cr-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" placeholder={cfg.search} aria-label="Search" value={q} onChange={e => setQ(e.target.value)} />
        </label>
        <div className="cr-chips" role="tablist">
          {cfg.filters.map(f => (
            <button key={f} type="button" role="tab" aria-selected={tag === f} className={'cr-chip' + (tag === f ? ' cr-on' : '')} onClick={() => setTag(f)}>{f}</button>
          ))}
        </div>
        <span className="cr-found">{list.length} {list.length === 1 ? 'result' : 'results'}</span>
      </div>

      <main className="cr-grid">
        {list.map((c, i) => (
          <article className="cr-card" key={c.id} style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }} onPointerMove={spot}>
            <div className="cr-top">
              <div className="cr-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={cfg.icon} /></svg></div>
              <span className="cr-tag">{c.tag}</span>
            </div>
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
            <div className="cr-skills">{c.skills.map(k => <span key={k}>{k}</span>)}</div>
            <div className="cr-meta">{c.meta.map(m => <span key={m}>{m}</span>)}</div>
            <div className="cr-foot cr-end"><button type="button" className="cr-go" onClick={() => open(c)}>{cfg.cta}</button></div>
          </article>
        ))}
        {list.length === 0 && <p className="cr-empty">Nothing matches. Try another filter or a different search.</p>}
      </main>

      {toast && <div className="cr-toast" role="status">{toast}</div>}
    </div>
  )
}
