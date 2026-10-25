import { useState } from 'react'
import Home from './Home'
import Login from './Login'

// Simple version: no extra packages, just state.
// Home -> "Log in" / "Start learning" opens the Login page.
export default function App() {
  const [page, setPage] = useState('home')

  if (page === 'login') {
    return (
      <Login
        onLogin={({ email, password, remember }) => {
          // call your existing login API here
          console.log('login', email, remember)
        }}
        onSignup={({ name, email, password }) => {
          // call your existing signup API here
          console.log('signup', name, email)
        }}
        onGoogle={() => {
          // start your existing Google sign-in here
        }}
      />
    )
  }

  return <Home onLogin={() => setPage('login')} onStart={() => setPage('login')} />
}

/* ---------- OR, if the project already uses react-router-dom ----------
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function HomePage() {
  const nav = useNavigate()
  return <Home onLogin={() => nav('/login')} onStart={() => nav('/login')} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
*/
