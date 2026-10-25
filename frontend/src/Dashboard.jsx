import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './Dashboard.css'

// Placeholder page shown after login. Replace the card with your real dashboard.
export default function Dashboard() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const first = (user?.name || '').split(' ')[0] || 'there'

  return (
    <div className="db">
      <nav className="db-nav">
        <div className="db-logo">DiveInSILICON</div>
        <button type="button" className="db-pill" onClick={() => { logout(); nav('/') }}>Log out</button>
      </nav>
      <main className="db-main">
        <div className="db-card">
          <h1>Welcome, {first}</h1>
          <p>You are signed in as {user?.email}.</p>
          <p className="db-note">Your courses, mock interviews and progress will show up here.</p>
        </div>
      </main>
    </div>
  )
}
