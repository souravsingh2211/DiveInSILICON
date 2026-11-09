import { useEffect, useRef } from 'react'
import { STAGES, COURSES } from './courses.data'
import { startScene } from './footerScene'
import './Footer.css'

/**
 * Full-height footer: brand block, link columns, an animated blue-hour circuit
 * landscape and a frosted-glass wordmark. Props are optional click handlers.
 */
export default function Footer({ onStart, onCourses, onLogin, onHome, onNavigate }) {
  const root = useRef(null), cv = useRef(null), word = useRef(null)
  const go = (cb, e) => { if (cb) { e.preventDefault(); cb() } }

  // animated background
  useEffect(() => startScene(cv.current, matchMedia('(prefers-reduced-motion:reduce)').matches), [])

  // scale the wordmark so it always spans the same share of the footer
  useEffect(() => {
    const fit = () => {
      const el = word.current, w = innerWidth, h = innerHeight
      const target = w <= 767 ? w * .92 : w <= 1023 ? 880 * Math.min(w / 1040, h / 672) : 1200 * Math.min(w / 1440, h / 672)
      el.style.fontSize = '100px'
      el.style.fontSize = (100 * target / el.scrollWidth) + 'px'
    }
    fit()
    addEventListener('resize', fit)
    document.fonts && document.fonts.ready.then(fit)
    return () => removeEventListener('resize', fit)
  }, [])

  return (
    <footer className="ft" ref={root}>
      <div className="ft-stage" aria-hidden="true"><canvas className="ft-cv" ref={cv} /></div>
      <p className="ft-word" aria-hidden="true" ref={word}>DiveInSILICON</p>
      <div className="ft-fog" aria-hidden="true" />

      <div className="ft-content">
        <div className="ft-brand">
          <a className="ft-logo" href="/" aria-label="DiveInSILICON home" onClick={e => go(onHome, e)}><span className="ft-mark" />DiveInSILICON</a>
          <h2 className="ft-title">Learn how chips get made</h2>
          <p className="ft-text">DiveInSILICON takes you from transistors to tape-out. VLSI courses follow the chip design flow: RTL, verification, timing, physical design and more.</p>
          <a className="ft-cta" href="/signup" onClick={e => go(onStart, e)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" /></svg>
            Start learning today
          </a>
          <p className="ft-copy">&copy; 2026 DiveInSILICON. All rights reserved.</p>
          <p className="ft-by">Made with <span aria-label="love">💙</span> for VLSI learners</p>
          <ul className="ft-status" aria-label="DiveInSILICON at a glance">
            <li className="ft-chip"><span className="ft-dot" aria-hidden="true" />{STAGES.length} flow stages</li>
            <li className="ft-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v12H3zM9 8V5h6v3M3 13h18" /></svg>
              {COURSES.length} courses
            </li>
            <li className="ft-chip">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8Z" /></svg>
              Free to start
            </li>
          </ul>
        </div>

        <div className="ft-first" role="navigation" aria-label="Explore">
          <h3 className="ft-ct">Explore</h3>
          <ul className="ft-list">
            <li><a href="/" onClick={e => go(onHome, e)}>Home</a></li>
            <li><a href="/courses" onClick={e => go(onCourses, e)}>Courses</a></li>
            <li><a href="/interview" onClick={e => go(onNavigate && (() => onNavigate('/interview')), e)}>Interview prep</a></li>
            <li><a href="/projects" onClick={e => go(onNavigate && (() => onNavigate('/projects')), e)}>Projects</a></li>
            <li><a href="/internships" onClick={e => go(onNavigate && (() => onNavigate('/internships')), e)}>Internships</a></li>
            <li><a href="/login" onClick={e => go(onLogin, e)}>Log in</a></li>
            <li><a href="/signup" onClick={e => go(onStart, e)}>Sign up</a></li>
          </ul>
        </div>

        <div role="navigation" aria-label="Support">
          <h3 className="ft-ct">Support</h3>
          <ul className="ft-list">
            <li><a href="#help">Help centre</a></li>
            <li><a href="#contact">Contact us</a></li>
            <li><a href="#privacy">Privacy notice</a></li>
            <li><a href="#terms">Terms of use</a></li>
            <li><a href="#feedback">Send feedback</a></li>
          </ul>
        </div>

        <div className="ft-stages" role="navigation" aria-label="Learning stages">
          <h3 className="ft-ct">Learning stages</h3>
          <ul className="ft-list">
            {STAGES.map(s => <li key={s.id}><a href="/courses" onClick={e => go(onCourses, e)}>{s.label}</a></li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}
