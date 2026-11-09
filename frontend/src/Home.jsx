import { useEffect, useRef, useState } from 'react'
import { STAGES, COURSES } from './courses.data'
import Footer from './Footer'
import { useTheme } from './ThemeContext'
import './Home.css'

const FEATURED = ['verilog-zero', 'sta', 'uvm'].map(id => COURSES.find(c => c.id === id))

// banner tiles: one big slide with the next one peeking in
const SLIDES = [
  {
    "pill": "All Courses",
    "title": "DiveInSILICON Courses",
    "sub": "Make your next move a smart one.",
    "btn": "Explore",
    "href": "/courses",
    "g": [
      "#a63a0b",
      "#f59e0b"
    ],
    "mt": "Your next skill is one course away.",
    "chips": [
      "RTL",
      "Verification",
      "STA",
      "Physical Design"
    ],
    "mb": "Explore all courses"
  },
  {
    "pill": "Interview Prep",
    "title": "Crack your VLSI interview",
    "sub": "Question banks, timed RTL coding and mock rounds.",
    "btn": "Start practising",
    "href": "/interview",
    "g": [
      "#27407a",
      "#7a97d6"
    ],
    "mt": "Practise like the real round.",
    "chips": [
      "Question banks",
      "RTL coding",
      "Mock rounds"
    ],
    "mb": "Start practising"
  },
  {
    "pill": "Projects",
    "title": "Build things recruiters can see",
    "sub": "From an 8-bit ALU to a pipelined RISC-V core.",
    "btn": "See projects",
    "href": "/projects",
    "g": [
      "#0b6b5c",
      "#34c58a"
    ],
    "mt": "Ship a project, not just a certificate.",
    "chips": [
      "ALU",
      "UART",
      "FIFO",
      "RISC-V"
    ],
    "mb": "See projects"
  },
  {
    "pill": "Internships",
    "title": "Take your first step into the industry",
    "sub": "Role-based tracks for RTL, verification and physical design.",
    "btn": "Explore internships",
    "href": "/internships",
    "g": [
      "#4b2a9a",
      "#e060b0"
    ],
    "mt": "Find the track that fits your skills.",
    "chips": [
      "RTL",
      "Verification",
      "Physical Design",
      "DFT"
    ],
    "mb": "View tracks"
  },
  {
    "pill": "Free to start",
    "title": "Create your account in a minute",
    "sub": "No card needed. Start with Stage 1 today.",
    "btn": "Sign up free",
    "href": "/signup",
    "g": [
      "#0b2a5c",
      "#2f9fe0"
    ],
    "mt": "Your VLSI journey starts here.",
    "chips": [
      "Free",
      "No card",
      "Learn at your pace"
    ],
    "mb": "Sign up"
  }
]

// gradient pair for each of the 8 stages, used on the course tiles
const GRAD = [["#3b5bdb", "#74c0fc"], ["#7048e8", "#da77f2"], ["#0ca678", "#63e6be"], ["#f76707", "#ffd43b"], ["#1971c2", "#4dabf7"], ["#c2255c", "#faa2c1"], ["#5f3dc4", "#91a7ff"], ["#e8590c", "#ffa94d"]]

function Banner({ route, go }) {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const x0 = useRef(null)
  const n = SLIDES.length
  const step = d => setI(k => (k + d + n) % n)

  useEffect(() => {
    if (hover || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const t = setInterval(() => setI(k => (k + 1) % n), 5500)
    return () => clearInterval(t)
  }, [hover, n, i])

  const up = e => {
    if (x0.current === null) return
    const dx = e.clientX - x0.current
    x0.current = null
    if (dx < -50) step(1); else if (dx > 50) step(-1)
  }

  return (
    <div className="hm7">
      <div className="hm7-view" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onPointerDown={e => { x0.current = e.clientX }} onPointerUp={up}>
        <button type="button" className="hm7-arr hm7-prev" aria-label="Previous" onClick={() => step(-1)}><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg></button>
        <button type="button" className="hm7-arr hm7-next" aria-label="Next" onClick={() => step(1)}><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
        <div className="hm7-track" style={{ '--i': i }}>
          {SLIDES.map((s, k) => (
            <article key={s.href} className={'hm7-slide' + (k === i ? ' on' : '')} style={{ '--g1': s.g[0], '--g2': s.g[1] }}
              onClick={e => { if (k !== i && !e.target.closest('a')) setI(k) }}>
              <div className="hm7-txt">
                <span className="hm7-pill">{s.pill}</span>
                <h3>{s.title}</h3>
                <p>{s.sub}</p>
                <a className="hm7-btn" href={s.href} onClick={e => go(route(s.href), e)}>{s.btn} &rarr;</a>
              </div>
              <div className="hm7-art" aria-hidden="true">
                <div className="hm7-mock">
                  <span className="hm7-mt">{s.mt}</span>
                  <div className="hm7-chs">{s.chips.map(c => <i key={c}>{c}</i>)}</div>
                  <span className="hm7-mb">{s.mb} &rarr;</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="hm7-dots">
        {SLIDES.map((s, k) => <button key={s.href} type="button" aria-label={`Slide ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}
      </div>
    </div>
  )
}

// words that swap in the "Need help with ..." heading
const HELP_WORDS = ["RTL design?", "Timing closure?", "Interview prep?", "A first project?", "An internship?"]

function Rotator() {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(-1)
  const cur = useRef(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const t = setInterval(() => {
      setPrev(cur.current)
      cur.current = (cur.current + 1) % HELP_WORDS.length
      setI(cur.current)
    }, 2400)
    return () => clearInterval(t)
  }, [])
  return HELP_WORDS.map((w, k) => <span key={w} className={'hm8-w' + (k === i ? ' on' : '') + (k === prev && k !== i ? ' out' : '')}>{w}</span>)
}

const PARTS = [
  { l: 5, title: 'Lid: copper', text: 'Spreads heat. Nickel coat stops rust.' },
  { l: 4, title: 'Die: silicon', text: 'Refined sand, doped with boron and phosphorus.' },
  { l: 3, title: 'Traces: copper', text: 'Carry signals on an epoxy board.' },
  { l: 2, title: 'Pins: gold', text: 'Gold-plated copper for clean contact.' },
  { l: 1, title: 'Base: resin', text: 'Epoxy or ceramic. Holds it together.' },
]

/**
 * Props (all optional):
 *   onLogin()  - called when "Log in" is clicked (e.g. navigate('/login'))
 *   onStart()  - called when "Start learning" is clicked (e.g. navigate('/signup'))
 *   onCourses() - called when "Courses" in the nav is clicked (e.g. navigate('/courses'))
 * If you don't pass them, the buttons are plain links to /login and /signup.
 */
export default function Home({ onLogin, onStart, onCourses, onNavigate }) {
  const root = useRef(null)

  useEffect(() => {
    const R = root.current
    const $ = s => R.querySelector(s)
    const NS = 'http://www.w3.org/2000/svg'
    let sd = 9
    const rnd = () => { sd = sd * 16807 % 2147483647; return sd / 2147483647 }
    const el = (p, n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e }

    // clear anything drawn earlier (React StrictMode runs effects twice in dev)
    R.querySelectorAll('.hm-tr,.hm-pins,.hm-lines').forEach(s => { s.innerHTML = '' })

    /* circuit traces: from the die edge outward with one jog */
    const traces = (svg, col) => {
      sd = 9
      const N = 9
      for (let s = 0; s < 4; s++) for (let i = 0; i < N; i++) {
        const f = 100 + (i + .5) * (100 / N), dx = [0, 1, 0, -1][s], dy = [-1, 0, 1, 0][s]
        const x = dx ? (dx > 0 ? 200 : 100) : f, y = dx ? f : (dy > 0 ? 200 : 100)
        const a = 14 + rnd() * 40, b = (8 + rnd() * 26) * (rnd() < .5 ? -1 : 1), ux = Math.abs(dy), uy = Math.abs(dx)
        const x1 = x + dx * a, y1 = y + dy * a, x2 = x1 + ux * b, y2 = y1 + uy * b
        const x3 = x2 + dx * (30 + rnd() * 34), y3 = y2 + dy * (30 + rnd() * 34)
        el(svg, 'path', { d: `M${x} ${y}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`, fill: 'none', stroke: col || (rnd() < .3 ? '#8a5cff' : '#2f5bff'), 'stroke-width': 1.5, 'stroke-linejoin': 'round' })
        el(svg, 'circle', { cx: x3, cy: y3, r: 3, fill: 'none', stroke: col || '#2f5bff', 'stroke-width': 1.3 })
      }
    }
    R.querySelectorAll('.hm-tr').forEach(s => traces(s, s.classList.contains('hm-w') ? '#fff' : null))

    /* pins around the frame */
    const pins = $('.hm-pins'), P = 26
    for (let s = 0; s < 4; s++) for (let i = 0; i < P; i++) {
      const f = 22 + i * (256 / (P - 1)), h = s < 2
      const o = h ? { x: f - 2, y: s ? 274 : 12, width: 4, height: 14 } : { x: s === 2 ? 12 : 274, y: f - 2, width: 14, height: 4 }
      el(pins, 'rect', { ...o, rx: 1.5, fill: '#7fa2ff', opacity: .9 })
    }

    /* motion */
    const chip = $('.hm-chip'), stage = $('.hm-stage'), rig = $('.hm-rig'), glow = $('.hm-glow'), lsvg = $('.hm-lines')
    const cos = R.querySelectorAll('.hm-co')
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
    const mq = matchMedia('(max-width:860px)')
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
    let rx = 60, rz = -45, e = 0, trx = 60, trz = -45, te = 0, ST = {}, raf = 0

    // rotate only while the pointer moves over the chip area
    stage.addEventListener('pointermove', ev => {
      const b = stage.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2
      const nx = clamp((ev.clientX - cx) / (b.width / 2), -1, 1), ny = clamp((ev.clientY - cy) / (b.height / 2), -1, 1)
      trz = -45 + nx * 45; trx = 60 - ny * 16
    }, { passive: true })
    // mouse wheel over the chip pulls the layers apart (tap toggles on touch screens)
    stage.addEventListener('wheel', ev => {
      if ((ev.deltaY > 0 && te < 1) || (ev.deltaY < 0 && te > 0)) { ev.preventDefault(); te = clamp(te + ev.deltaY * .0014, 0, 1) }
    }, { passive: false })
    stage.addEventListener('click', () => { te = te > .5 ? 0 : 1 })

    const LN = []
    cos.forEach(() => LN.push([el(lsvg, 'line', {}), el(lsvg, 'circle', { r: 3.5 })]))

    const labels = () => {
      const vis = clamp((e - .3) / .4, 0, 1), sb = stage.getBoundingClientRect(), m = mq.matches
      rig.style.transform = m ? 'none' : `scale(${1 - .28 * e})`
      glow.style.transform = `translate(-50%,-50%) scale(${m ? 1 : 1 - .22 * e})`
      glow.style.opacity = .8 + .2 * e
      cos.forEach(c => { c.style.opacity = vis })
      if (m || vis <= 0) { ST = {}; LN.forEach(p => { p[0].style.opacity = 0; p[1].style.opacity = 0 }); return }
      const W = 108
      const items = [5, 4, 3, 2, 1].map(q => {
        const c = $(`.hm-co[data-l="${q}"]`), b = $(`.hm-l${q}`).getBoundingClientRect()
        return { q, c, i: [].indexOf.call(cos, c), y: b.top + b.height / 2 - sb.top, bl: b.left - sb.left, br: b.right - sb.left, R: q % 2 === 1 }
      })
      const place = (arr, right) => {
        const hs = arr.map(t => t.c.offsetHeight), pos = []
        arr.forEach((it, k) => { let t = it.y - hs[k] / 2; if (k) t = Math.max(t, pos[k - 1] + hs[k - 1] + 8); pos.push(t) })
        const cnt = pos.length, sh = Math.min(0, sb.height - 12 - (pos[cnt - 1] + hs[cnt - 1]))
        const cx = right ? Math.min(sb.width - W, Math.max(...arr.map(t => t.br)) + 22) : Math.max(0, Math.min(...arr.map(t => t.bl)) - 22 - W)
        arr.forEach((it, k) => {
          const tt = Math.max(8, pos[k] + sh), s = ST[it.q] || (ST[it.q] = { top: tt, cx }), ax = right ? it.br - 4 : it.bl + 4
          s.top += (tt - s.top) * .14; s.cx += (cx - s.cx) * .14
          const l = LN[it.i][0], c = LN[it.i][1]
          it.c.style.top = s.top + 'px'; it.c.style.left = s.cx + 'px'; it.c.style.right = 'auto'
          l.setAttribute('x1', ax); l.setAttribute('y1', it.y); l.setAttribute('x2', right ? s.cx : s.cx + W); l.setAttribute('y2', s.top + it.c.offsetHeight / 2)
          c.setAttribute('cx', ax); c.setAttribute('cy', it.y)
          l.style.opacity = .55 * vis; c.style.opacity = vis
        })
      }
      place(items.filter(t => t.R), true); place(items.filter(t => !t.R), false)
    }

    const tick = () => {
      if (reduce) { rx = trx = 60; rz = trz = -45 }
      rx += (trx - rx) * .06; rz += (trz - rz) * .06; e += (te - e) * .07
      chip.style.transform = `rotateX(${rx}deg) rotateZ(${rz}deg)`
      chip.style.setProperty('--e', e.toFixed(3))
      labels()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('hm-in'); io.unobserve(e.target) } }), { threshold: .12 })
    root.current.querySelectorAll('.hm-rv').forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])

  const { dark, toggle: toggleTheme } = useTheme()

  const go = (cb, e) => { if (cb) { e.preventDefault(); cb() } }

  const route = p => (p === '/courses' ? onCourses : p === '/signup' ? onStart : p === '/login' ? onLogin : onNavigate && (() => onNavigate(p)))

  return (
    <div className="hm" ref={root}>
      <nav>
        <div className="hm-logo">DiveInSILICON</div>
        <ul>
          <li><a href="/courses" onClick={e => go(onCourses, e)}>Courses</a></li>
          <li><a href="/interview" onClick={e => go(onNavigate && (() => onNavigate('/interview')), e)}>Interview prep</a></li>
          <li><a href="/projects" onClick={e => go(onNavigate && (() => onNavigate('/projects')), e)}>Projects</a></li>
          <li><a href="/internships" onClick={e => go(onNavigate && (() => onNavigate('/internships')), e)}>Internships</a></li>
        </ul>
        <div className="hm-navr">
          <button type="button" className="hm-tgl" aria-label="Switch between light and dark mode" aria-pressed={dark} onClick={toggleTheme}>
            <svg className="tg-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <svg className="tg-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          </button>
          <a className="hm-pill" href="/login" onClick={e => go(onLogin, e)}>Log in</a>
        </div>
      </nav>

      <section className="hm-hero">
        <div>
          <h1>VLSI and ECE, explained clearly.</h1>
          <p className="hm-sub">From ECE fundamentals to chip design. VLSI courses, interview prep, projects and internships, all in one place.</p>
          <div className="hm-cta">
            <a className="hm-pill hm-dark" href="/signup" onClick={e => go(onStart, e)}>Start learning</a>
            <a className="hm-pill" href="/login" onClick={e => go(onLogin, e)}>Log in</a>
          </div>
          <p className="hm-hint">Move your mouse over the chip to rotate it. Scroll the mouse wheel over it to pull its layers apart.</p>
        </div>

        <div className="hm-stage" aria-label="Interactive 3D microchip">
          <div className="hm-glow" />
          <div className="hm-rig">
            <div className="hm-chip">
              <div className="hm-ly hm-l1" />
              <div className="hm-ly hm-l2"><svg className="hm-pins" viewBox="0 0 300 300" /></div>
              <div className="hm-ly hm-l3"><svg className="hm-tr" viewBox="0 0 300 300" /></div>
              <div className="hm-ly hm-l4" />
              <div className="hm-ly hm-l5"><svg className="hm-tr hm-w" viewBox="0 0 300 300" /></div>
            </div>
          </div>
          <svg className="hm-lines" />
          <div className="hm-cos">
            {PARTS.map(p => (
              <div className="hm-co" data-l={p.l} key={p.l}><b>{p.title}</b><span>{p.text}</span></div>
            ))}
          </div>
        </div>
      </section>

<section className="hm-sec hm-rv hm7-sec" id="explore">
<span className="hm7-top">Explore DiveInSILICON</span>
<Banner route={route} go={go} />
</section>
<section className="hm-sec hm-rv" id="offer">
<p className="hm-kick">What you get</p>
<h2>Everything you need to get hired in VLSI.</h2>
<p className="hm-lead">Learn the skills, practise for interviews, build projects and land your first internship, all in one place.</p>
<div className="hm4-grid"><article className="hm4-card"><span className="hm4-num">01</span><div className="hm4-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5 9-5zM5 12v5c0 1.5 3 3 7 3s7-1.5 7-3v-5" /></svg></div><h3>Courses</h3><p>Structured VLSI courses that follow the chip design flow, from CMOS basics to physical design.</p><ul><li>14 courses, beginner to advanced</li><li>Track your progress</li><li>Learn at your own pace</li></ul><a className="hm4-go" href="/courses" onClick={e => go(onCourses, e)}>Browse courses &rarr;</a></article><article className="hm4-card" id="interview"><span className="hm4-num">02</span><div className="hm4-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg></div><h3>Interview prep</h3><p>Practise VLSI interview questions and timed RTL coding problems, with model answers.</p><ul><li>Topic-wise question banks</li><li>RTL coding practice</li><li>Know what to expect</li></ul><a className="hm4-go" href="/interview" onClick={e => go(onNavigate && (() => onNavigate('/interview')), e)}>Start practising &rarr;</a></article><article className="hm4-card"><span className="hm4-num">03</span><div className="hm4-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" /></svg></div><h3>Projects</h3><p>Build hands-on VLSI projects you can show to recruiters, from RTL blocks to verified designs.</p><ul><li>Guided, step-by-step builds</li><li>Verilog and SystemVerilog</li><li>Portfolio-ready write-ups</li></ul><a className="hm4-go" href="/projects" onClick={e => go(onNavigate && (() => onNavigate('/projects')), e)}>See projects &rarr;</a></article><article className="hm4-card"><span className="hm4-num">04</span><div className="hm4-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg></div><h3>Internships</h3><p>Find internship tracks in VLSI and apply with the skills and projects you have built.</p><ul><li>Role-based internship tracks</li><li>Apply from your dashboard</li><li>A profile recruiters can read</li></ul><a className="hm4-go" href="/internships" onClick={e => go(onNavigate && (() => onNavigate('/internships')), e)}>Explore internships &rarr;</a></article></div>
</section>
<section className="hm-sec hm-rv">
<p className="hm-kick">How it works</p>
<h2>Your path to a VLSI job.</h2>
<ol className="hm5-row">
<li><span className="hm-n">1</span><b>Learn</b><small>Follow a course from the basics to advanced topics.</small></li>
<li><span className="hm-n">2</span><b>Practise</b><small>Prepare with interview questions and RTL coding problems.</small></li>
<li><span className="hm-n">3</span><b>Build</b><small>Turn what you learn into projects you can show.</small></li>
<li><span className="hm-n">4</span><b>Apply</b><small>Use your projects and skills to apply for internships.</small></li>
</ol>
</section>
<section className="hm-sec hm-rv">
<p className="hm-kick">Why DiveInSILICON</p>
<h2>Built for people who want to work in VLSI.</h2>
<div className="hm-why"><div className="hm-wc"><div className="hm-wi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h14M13 6l6 6-6 6" /></svg></div><h3>A clear learning path</h3><p>Courses follow the chip design flow, from CMOS basics to physical design, so nothing feels random.</p></div><div className="hm-wc"><div className="hm-wi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14" /></svg></div><h3>Learn the real tools of the trade</h3><p>Verilog, SystemVerilog and UVM, taught step by step with examples you can follow.</p></div><div className="hm-wc"><div className="hm-wi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v12H3zM9 8V5h6v3M3 13h18" /></svg></div><h3>Interview ready</h3><p>Practise VLSI interview questions and RTL coding problems with model answers.</p></div><div className="hm-wc"><div className="hm-wi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg></div><h3>See your progress</h3><p>Track every course and pick up exactly where you left off.</p></div></div>
</section>
<section className="hm-sec hm-rv">
<p className="hm-kick">Popular courses</p>
<h2>Start with the basics, then go deeper.</h2>
<div className="hm-cgrid">{FEATURED.map(c => {
            const si = STAGES.findIndex(s => s.id === c.stage)
            return (
              <div className="hm-cc" key={c.id} style={{ '--g1': GRAD[si][0], '--g2': GRAD[si][1] }}>
                <div className="hm-cv">
                  <span className="hm-cb">COURSE</span>
                  <span className="hm-ct">{STAGES[si].label}</span>
                  <h3>{c.title}</h3>
                  <div className="hm-cart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAGES[si].icon} /></svg></div>
                </div>
                <div className="hm-cbody">
                  <p>{c.blurb}</p>
                  <div className="hm-cm"><span>{c.level}</span><span>{c.lessons} lessons</span><span>{c.hours} hours</span></div>
                </div>
              </div>
            )
          })}</div>
<div className="hm-more"><a className="hm-pill" href="/courses" onClick={e => go(onCourses, e)}>View all courses</a></div>
</section>
<section className="hm-sec hm-rv">
<div className="hm6-cols">
<div id="projects"><p className="hm-kick">Projects</p><h2>Build things recruiters can see.</h2><div className="hm6-list"><div className="hm6-i"><b>8-bit ALU in Verilog</b><small>Write, simulate and test a complete arithmetic unit.</small><span>Beginner · RTL Design</span></div><div className="hm6-i"><b>UART transmitter and receiver</b><small>Design a serial interface and check it with a testbench.</small><span>Intermediate · RTL Design</span></div><div className="hm6-i"><b>Synchronous FIFO with a testbench</b><small>Build a FIFO, then verify it with constrained-random tests.</small><span>Intermediate · Verification</span></div></div></div>
<div id="internships"><p className="hm-kick">Internships</p><h2>Take your first step into the industry.</h2><div className="hm6-list"><div className="hm6-i"><b>RTL Design Intern</b><small>Write and review Verilog for real design blocks.</small><span>Track · Front-end</span></div><div className="hm6-i"><b>Design Verification Intern</b><small>Build testbenches and find bugs before tape-out.</small><span>Track · Verification</span></div><div className="hm6-i"><b>Physical Design Intern</b><small>Work on floorplanning, timing and layout.</small><span>Track · Back-end</span></div></div></div>
</div>
</section>
<section className="hm-sec hm-rv" id="help">
<div className="hm8">
<div className="hm8-main">
<div className="hm8-l">
<h2>Need help with</h2>
<div className="hm8-rot" aria-live="polite"><Rotator /></div>
<p className="hm8-p">Ask your doubts, get clear answers and a plan that fits you, from your first Verilog module to your first interview.</p>
<a className="hm-pill hm-dark" href="/signup" onClick={e => go(onStart, e)}>Get started free</a>
</div>
<div className="hm8-r" aria-hidden="true">
<div className="hm8-av hm8-a1"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="gc7d2fe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c7d2fe" /><stop offset="1" stopColor="#f5c6e8" /></linearGradient></defs><rect width="100" height="100" fill="url(#gc7d2fe)" /><path d="M14 100c2-22 16-34 36-34s34 12 36 34z" fill="#27325a" /><circle cx="50" cy="42" r="19" fill="#f1c7a5" /><path d="M31 40c0-13 8-21 19-21s19 8 19 21c-5-7-11-10-19-10s-14 3-19 10z" fill="#2b2433" /></svg></div><div className="hm8-b hm8-b1">&ldquo;How do I fix a hold violation?&rdquo;</div>
<div className="hm8-av hm8-a2"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="gbbf7d0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bbf7d0" /><stop offset="1" stopColor="#a5d8ff" /></linearGradient></defs><rect width="100" height="100" fill="url(#gbbf7d0)" /><path d="M14 100c2-22 16-34 36-34s34 12 36 34z" fill="#27325a" /><circle cx="50" cy="42" r="19" fill="#e5b48f" /><path d="M31 40c0-13 8-21 19-21s19 8 19 21c-5-7-11-10-19-10s-14 3-19 10z" fill="#1c1c28" /></svg></div><div className="hm8-b hm8-b2">&ldquo;Which project should I build first?&rdquo;</div>
<div className="hm8-av hm8-a3"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="gfde68a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#fbb6a1" /></linearGradient></defs><rect width="100" height="100" fill="url(#gfde68a)" /><path d="M14 100c2-22 16-34 36-34s34 12 36 34z" fill="#27325a" /><circle cx="50" cy="42" r="19" fill="#d9a27d" /><path d="M31 40c0-13 8-21 19-21s19 8 19 21c-5-7-11-10-19-10s-14 3-19 10z" fill="#2a1f1a" /></svg></div><div className="hm8-b hm8-b3">&ldquo;Tips for an RTL design interview?&rdquo;</div>
</div>
</div>
<div className="hm8-feats"><div className="hm8-f" style={{ '--c': '#7c5cff' }}><span className="hm8-fi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg></span>Ask your doubts</div><div className="hm8-f" style={{ '--c': '#e0489a' }}><span className="hm8-fi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h14M13 6l6 6-6 6" /></svg></span>A personalised path</div><div className="hm8-f" style={{ '--c': '#2f8cff' }}><span className="hm8-fi"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg></span>Learn at your pace</div><div className="hm8-f" style={{ '--c': '#f08a2e' }}><span className="hm8-fi"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="18" r="2" /><path d="M8 7h8M7 9l4 7M17 9l-4 7" /></svg></span>Build your network</div></div>
</div>
</section>
<section className="hm-sec hm-rv">
<p className="hm-kick">Questions</p>
<h2>Good to know before you start.</h2>
<div className="hm-faq"><details><summary>Do I need prior knowledge?</summary><p>Basic digital electronics helps. The Foundations stage covers CMOS and digital logic from scratch.</p></details><details><summary>What do I get on DiveInSILICON?</summary><p>VLSI courses, interview preparation, hands-on projects and internship tracks, all in one place.</p></details><details><summary>Are the projects guided?</summary><p>Yes. Each project is built step by step, so you finish with something you can show to recruiters.</p></details><details><summary>How do internships work?</summary><p>Pick an internship track that fits your skills and apply from your dashboard.</p></details><details><summary>Is it free to start?</summary><p>Yes. Creating an account is free and needs no card.</p></details><details><summary>Can I learn on my phone?</summary><p>Yes. The site works on phones, tablets and laptops.</p></details></div>
</section>
<section className="hm-sec hm-rv">
<div className="hm-cband">
<h2>Ready to dive in?</h2>
<p className="hm-lead">Create a free account and start with Stage 1 today.</p>
<div className="hm-ctab"><a className="hm-pill hm-dark" href="/signup" onClick={e => go(onStart, e)}>Start learning</a><a className="hm-pill" href="/login" onClick={e => go(onLogin, e)}>Log in</a></div>
</div>
</section>
<Footer onStart={onStart} onCourses={onCourses} onLogin={onLogin} onNavigate={onNavigate} onHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  )
}
