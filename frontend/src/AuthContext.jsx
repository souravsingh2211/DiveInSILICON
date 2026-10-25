import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken } from './api'
import { requestGoogleAccessToken } from './google'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!getToken()) // true while we check a saved token

  useEffect(() => {
    if (!getToken()) return
    api('/auth/me').then(setUser).catch(() => clearToken()).finally(() => setLoading(false))
  }, [])

  const finish = (data, remember = true) => { setToken(data.access_token, remember); setUser(data.user); return data.user }

  const login = async ({ email, password, remember }) =>
    finish(await api('/auth/login', { method: 'POST', body: { email, password } }), remember)

  const signup = async ({ name, email, password }) =>
    finish(await api('/auth/signup', { method: 'POST', body: { name, email, password } }))

  const googleLogin = async () => {
    const access_token = await requestGoogleAccessToken()
    return finish(await api('/auth/google', { method: 'POST', body: { access_token } }))
  }

  const logout = () => { clearToken(); setUser(null) }

  return <Ctx.Provider value={{ user, loading, login, signup, googleLogin, logout }}>{children}</Ctx.Provider>
}
