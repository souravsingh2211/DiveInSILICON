import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { STAGES, COURSES } from './courses.data'
import './Courses.css'

export default function Courses() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [stage, setStage] = useState('all')
  const [q, setQ] = useState('')
  const [toast, setToast] = useState('')
  const timer = useRef(0)

  const totals = useMemo(() => ({
    courses: COURSES.length,
    lessons: COURSES.reduce((a, c) => a + c.lessons, 0),
    hours: COURSES.reduce((a, c) => a + c.hours, 0),
  }), [])
  const count = id => COURSES.filter(c => c.stage === id).length
  const active = STAGES.find(s => s.id === stage)
  const idx = STAGES.findIndex(s => s.id === stage)   // pulse sits on the clicked stage (-1 = none)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return COURSES.filter(c => (stage === 'all' || c.stage === stage) && (c.title + ' ' + c.blurb + ' ' + c.skills.join(' ')).toLowerCase().includes(s))
  }, [stage, q])

  const open = c => {
    if (!user) { nav('/login'); return }
    // TODO: navigate to the course page once it exists, e.g. nav(`/courses/${c.id}`)
    setToast(`${c.title} will open here once the course page is added.`)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2600)
  }

  // soft light that follows the cursor inside a card
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
          <button type="button" onClick={() => nav('/')}>Home</button>
          <button type="button" className="cr-on">Courses</button>
          {user && <button type="button" onClick={() => nav('/dashboard')}>Dashboard</button>}
        </div>
        {user
          ? <button type="button" className="cr-pill" onClick={() => nav('/dashboard')}>Dashboard</button>
          : <button type="button" className="cr-pill" onClick={() => nav('/login')}>Log in</button>}
      </nav>

      <header className="cr-head">
        <h1>Learn how chips get made.</h1>
        <p>From transistors to tape-out. Every course sits on the chip design flow, so you always know what comes next.</p>
        <div className="cr-stats">
          <span><b>{totals.courses}</b> courses</span>
          <span><b>{STAGES.length}</b> flow stages</span>
          <span><b>{totals.lessons}</b> lessons</span>
          <span><b>{totals.hours}</b> hours</span>
        </div>
      </header>

      <section className="cr-road" aria-label="Chip design flow">
        <div className="cr-panel">
          <div className="cr-scroll">
            <div className="cr-flow">
              <i className="cr-fill" style={{ width: idx < 0 ? 0 : idx * 12.5 + '%', opacity: idx < 0 ? 0 : 1 }} />
              <i className="cr-pulse" style={{ left: (idx < 0 ? .5 : idx + .5) * 12.5 + '%', opacity: idx < 0 ? 0 : 1 }} />
              {STAGES.map((s, i) => (
                <button key={s.id} type="button" className={'cr-node' + (idx === i ? ' cr-on' : '') + (idx > i ? ' cr-done' : '')} aria-pressed={idx === i}
                  onClick={() => setStage(stage === s.id ? 'all' : s.id)}>
                  <span className="cr-dot"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.icon} /></svg></span>
                  <span className="cr-step">Stage {i + 1}</span>
                  <span className="cr-name">{s.label}</span>
                  <span className="cr-cnt">{count(s.id)} {count(s.id) === 1 ? 'course' : 'courses'}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="cr-stagedesc">
            {active ? <><span><b>{active.label}.</b> {active.desc}</span><button type="button" className="cr-clear" onClick={() => setStage('all')}>Show all</button></> : 'Pick a stage to see its courses, or start at Stage 1 and follow the flow.'}
          </p>
        </div>
      </section>

      <div className="cr-bar">
        <label className="cr-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" placeholder="Search courses or skills (e.g. UVM, STA)" aria-label="Search courses" value={q} onChange={e => setQ(e.target.value)} />
        </label>
        <span className="cr-found">{list.length} {list.length === 1 ? 'course' : 'courses'}</span>
      </div>

      <main className="cr-grid">
        {list.map((c, i) => {
          const p = user ? c.progress : 0
          const si = STAGES.findIndex(s => s.id === c.stage)
          return (
            <article className="cr-card" key={c.id} style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }} onPointerMove={spot}>
              <div className="cr-top">
                <div className="cr-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAGES[si].icon} /></svg></div>
                <span className="cr-tag">Stage {si + 1} · {STAGES[si].label}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <div className="cr-skills">{c.skills.map(k => <span key={k}>{k}</span>)}</div>
              <div className="cr-meta"><span>{c.level}</span><span>{c.lessons} lessons</span><span>{c.hours} hours</span></div>
              {p > 0 && <div className="cr-bar2" role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100"><i style={{ width: p + '%' }} /></div>}
              <div className="cr-foot">
                <span className="cr-pct">{p === 100 ? 'Completed' : p > 0 ? `${p}% done` : 'Not started'}</span>
                <button type="button" className="cr-go" onClick={() => open(c)}>{p === 100 ? 'Review' : p > 0 ? 'Continue' : 'Start'}</button>
              </div>
            </article>
          )
        })}
        {list.length === 0 && <p className="cr-empty">No courses match. Try another stage or a different search.</p>}
      </main>

      {toast && <div className="cr-toast" role="status">{toast}</div>}
    </div>
  )
}
