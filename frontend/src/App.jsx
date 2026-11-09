import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import Home from './Home'
import Login from './Login'
import Dashboard from './Dashboard'
import Courses from './Courses'
import Catalog from './Catalog'

function HomePage() {
  const nav = useNavigate()
  return <Home onLogin={() => nav('/login')} onStart={() => nav('/signup')} onCourses={() => nav('/courses')} onNavigate={p => nav(p)} />
}

// /login and /signup share one page; the route decides which tab opens first
function AuthPage({ mode }) {
  const nav = useNavigate()
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <Login key={mode} defaultMode={mode} onBack={() => nav('/')} onSuccess={() => nav('/dashboard', { replace: true })} />
}

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="in" />} />
          <Route path="/signup" element={<AuthPage mode="up" />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/interview" element={<Catalog kind="interview" />} />
          <Route path="/projects" element={<Catalog kind="projects" />} />
          <Route path="/internships" element={<Catalog kind="internships" />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
