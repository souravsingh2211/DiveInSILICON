import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { preloadGoogle } from './google'
import './Login.css'

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
)

function PasswordField({ id, value, onChange, autoComplete, placeholder, minLength }) {
  const [show, setShow] = useState(false)
  return (
    <div className="lg-f">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} minLength={minLength} required />
      <button type="button" className="lg-sh" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>
    </div>
  )
}

/**
 * Props:
 *   defaultMode - 'in' (log in) or 'up' (sign up)
 *   onBack()    - logo / "Back to home"
 *   onSuccess() - called after a successful login or signup
 * Talks to the FastAPI backend through AuthContext.
 */
export default function Login({ defaultMode = 'in', onBack, onSuccess }) {
  const { login, signup, googleLogin } = useAuth()
  const [mode, setMode] = useState(defaultMode)
  const [dx, setDx] = useState('18px')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [lg, setLg] = useState({ email: '', password: '', remember: true })
  const [su, setSu] = useState({ name: '', email: '', password: '' })

  useEffect(() => { preloadGoogle().catch(() => {}) }, [])

  const go = m => { if (m === mode) return; setError(''); setDx(m === 'up' ? '18px' : '-18px'); setMode(m) }

  const run = async fn => {
    setError(''); setBusy(true)
    try { await fn(); onSuccess && onSuccess() }
    catch (e) { setError(e.message || 'Something went wrong') }
    finally { setBusy(false) }
  }
  const submitLogin = e => { e.preventDefault(); run(() => login(lg)) }
  const submitSignup = e => { e.preventDefault(); run(() => signup(su)) }
  const google = () => run(googleLogin)

  const label = (idle) => (busy ? 'Please wait…' : idle)

  return (
    <div className="lg">
      <nav className="lg-nav">
        <button type="button" className="lg-logo" onClick={() => onBack && onBack()}>DiveInSILICON</button>
        <button type="button" className="lg-pill" onClick={() => onBack && onBack()}>Back to home</button>
      </nav>

      <main className="lg-main">
        <div className="lg-card" data-m={mode} style={{ '--dx': dx }}>
          <div className="lg-tabs" role="tablist">
            <i />
            <button type="button" role="tab" aria-selected={mode === 'in'} onClick={() => go('in')}>Log in</button>
            <button type="button" role="tab" aria-selected={mode === 'up'} onClick={() => go('up')}>Sign up</button>
          </div>

          {mode === 'in' ? (
            <form className="lg-panel" key="in" onSubmit={submitLogin}>
              <h1>Welcome back</h1>
              <p className="lg-sub">Sign in to continue your learning.</p>
              <button type="button" className="lg-btn lg-g" onClick={google} disabled={busy}><GoogleIcon />Continue with Google</button>
              <div className="lg-or">or sign in with email</div>
              <label htmlFor="le">Email</label>
              <div className="lg-f"><input id="le" type="email" autoComplete="email" placeholder="you@college.ac.in" value={lg.email} onChange={e => setLg({ ...lg, email: e.target.value })} required /></div>
              <label htmlFor="lp">Password</label>
              <PasswordField id="lp" autoComplete="current-password" placeholder="Your password" value={lg.password} onChange={e => setLg({ ...lg, password: e.target.value })} />
              <div className="lg-row">
                <label><input type="checkbox" checked={lg.remember} onChange={e => setLg({ ...lg, remember: e.target.checked })} /> Keep me signed in</label>
                <a href="#forgot">Forgot password?</a>
              </div>
              {error && <div className="lg-err" role="alert">{error}</div>}
              <button type="submit" className="lg-btn" disabled={busy}>{label('Sign in')}</button>
              <p className="lg-sw">New to DiveInSILICON? <button type="button" onClick={() => go('up')}>Create an account</button></p>
            </form>
          ) : (
            <form className="lg-panel" key="up" onSubmit={submitSignup}>
              <h1>Create account</h1>
              <p className="lg-sub">Free to start. No card needed.</p>
              <label htmlFor="sn">Full name</label>
              <div className="lg-f"><input id="sn" type="text" autoComplete="name" placeholder="Your name" value={su.name} onChange={e => setSu({ ...su, name: e.target.value })} required /></div>
              <label htmlFor="se">College email</label>
              <div className="lg-f"><input id="se" type="email" autoComplete="email" placeholder="you@college.ac.in" value={su.email} onChange={e => setSu({ ...su, email: e.target.value })} required /></div>
              <label htmlFor="sp">Password</label>
              <PasswordField id="sp" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} value={su.password} onChange={e => setSu({ ...su, password: e.target.value })} />
              {error && <div className="lg-err" role="alert">{error}</div>}
              <button type="submit" className="lg-btn lg-mt" disabled={busy}>{label('Create account')}</button>
              <div className="lg-or">or</div>
              <button type="button" className="lg-btn lg-g" onClick={google} disabled={busy}><GoogleIcon />Sign up with Google</button>
              <p className="lg-sw">Already have an account? <button type="button" onClick={() => go('in')}>Log in</button></p>
            </form>
          )}
        </div>
      </main>

      <footer className="lg-foot">&copy; 2026 DiveInSILICON</footer>
    </div>
  )
}
