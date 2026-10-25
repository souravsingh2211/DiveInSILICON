import { useEffect, useRef } from 'react'
import './Home.css'

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
 * If you don't pass them, the buttons are plain links to /login and /signup.
 */
export default function Home({ onLogin, onStart }) {
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
    stage.addEventListener('wheel', ev => { ev.preventDefault(); te = clamp(te + ev.deltaY * .0014, 0, 1) }, { passive: false })
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

  const go = (cb, e) => { if (cb) { e.preventDefault(); cb() } }

  return (
    <div className="hm" ref={root}>
      <nav>
        <div className="hm-logo">DiveInSILICON</div>
        <ul>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#interviews">Mock interviews</a></li>
          <li><a href="#placement">Placement prep</a></li>
        </ul>
        <a className="hm-pill" href="/login" onClick={e => go(onLogin, e)}>Log in</a>
      </nav>

      <section className="hm-hero">
        <div>
          <h1>Electronics and communication, explained clearly.</h1>
          <p className="hm-sub">Structured ECE courses, interview practice and placement preparation, all in one place.</p>
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
    </div>
  )
}
