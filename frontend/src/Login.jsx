import { useEffect, useRef, useState } from "react";
import "./Login.css";

const BRAND = "DiveinSILICON";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Oscilloscope-style canvas: the signal gets busier as the person types. */
function Signal({ energy }) {
  const canvasRef = useRef(null);
  const energyRef = useRef(energy);
  energyRef.current = energy;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let phase = 0;
    let smooth = energyRef.current;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, w, h);

      // graticule
      ctx.strokeStyle = "rgba(241,244,236,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += w / 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += h / 6) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      smooth += (energyRef.current - smooth) * 0.06;
      const cycles = 2 + smooth * 0.35;
      const amp = h * (0.18 + Math.min(smooth, 14) * 0.012);

      const wave = (color, width, harmonic) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const t = (x / w) * Math.PI * 2 * cycles + phase;
          const y =
            h / 2 +
            Math.sin(t) * amp +
            Math.sin(t * 3 + phase) * amp * harmonic;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      wave("rgba(208,138,62,0.25)", 6, 0.22);
      wave("#E9A858", 2, 0.22);

      if (!reduce) {
        phase += 0.025;
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal" aria-hidden="true" />;
}

/* Static copper traces and solder pads behind the left panel. */
function Traces() {
  return (
    <svg className="traces" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 120 H140 L180 160 H320" />
        <path d="M0 160 H90 L130 200 H260 L300 240 H600" />
        <path d="M600 90 H470 L430 130 H360" />
        <path d="M0 640 H120 L160 600 H380 L420 640 H600" />
        <path d="M0 690 H200 L240 730 H600" />
        <path d="M600 560 H520 L480 520 H440" />
      </g>
      <g fill="currentColor">
        <circle cx="320" cy="160" r="6" />
        <circle cx="360" cy="130" r="6" />
        <circle cx="440" cy="520" r="6" />
        <circle cx="380" cy="600" r="6" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="320" cy="160" r="12" />
        <circle cx="360" cy="130" r="12" />
        <circle cx="440" cy="520" r="12" />
        <circle cx="380" cy="600" r="12" />
      </g>
    </svg>
  );
}

function FeatureIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function Login({ onLogin, onGoogle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with your real API call, e.g.
      // const res = await fetch("/api/login", { method: "POST", ... });
      if (onLogin) await onLogin({ email: email.trim(), password, remember });
      else await new Promise((r) => setTimeout(r, 900));
    } catch (err) {
      setFormError(err?.message || "Couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const energy = email.length + password.length;

  return (
    <main className="login">
      <section className="login__board">
        <Traces />
        <div className="login__brand">
          <span className="login__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h4l3-7 4 14 3-7h6" />
            </svg>
          </span>
          {BRAND}
        </div>

        <div className="login__pitch">
          <h1>Go deeper into electronics and communication.</h1>
          <p>
            Structured ECE courses, interview practice and placement
            preparation, all in one place.
          </p>
          <ul className="login__features">
            <li>
              <FeatureIcon d="M4 5h16v11H4zM8 20h8M12 16v4" />
              Courses mapped to the ECE syllabus
            </li>
            <li>
              <FeatureIcon d="M12 3a4 4 0 0 1 4 4v3a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM5 11a7 7 0 0 0 14 0M12 18v3" />
              Mock interviews with real feedback
            </li>
            <li>
              <FeatureIcon d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
              Progress tracking across every subject
            </li>
          </ul>
        </div>

        <Signal energy={energy} />
      </section>

      <section className="login__panel">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <h2>Welcome back</h2>
          <p className="form__sub">Sign in to continue your learning.</p>

          <button type="button" className="btn btn--ghost" onClick={onGoogle}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2-1.9 3.3-4.700 3.3-8z" />
              <path fill="#34A853" d="M12 23c3 0 5.500-1 7.300-2.700l-3.500-2.700c-1 .7-2.200 1-3.800 1-2.900 0-5.400-2-6.300-4.600H2.100v2.800C3.900 20.400 7.700 23 12 23z" />
              <path fill="#FBBC05" d="M5.700 14c-.2-.7-.4-1.300-.4-2s.1-1.400.4-2V7.200H2.100C1.400 8.700 1 10.300 1 12s.4 3.300 1.100 4.800L5.700 14z" />
              <path fill="#EA4335" d="M12 5.400c1.600 0 3.100.6 4.200 1.700l3.100-3.100C17.500 2.200 15 1 12 1 7.700 1 3.900 3.600 2.100 7.200L5.700 10c.9-2.600 3.400-4.600 6.300-4.600z" />
            </svg>
            Continue with Google
          </button>

          <div className="form__divider"><span>or sign in with email</span></div>

          {formError && (
            <div className="form__alert" role="alert">{formError}</div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@college.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && <span id="email-err" className="field__error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="field__password">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-err" : undefined}
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span id="password-err" className="field__error">{errors.password}</span>}
          </div>

          <div className="form__row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Keep me signed in
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="form__foot">
            New to {BRAND}? <a href="/signup">Create an account</a>
          </p>
        </form>

        <footer className="login__legal">
          <span>© {new Date().getFullYear()} {BRAND}</span>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </footer>
      </section>
    </main>
  );
}
