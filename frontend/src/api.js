// Small fetch wrapper for the FastAPI backend.
// In dev the Vite proxy forwards /api -> http://localhost:8000 (see vite.config.js).
// For production set VITE_API_URL, e.g. https://api.yourdomain.com/api
const BASE = import.meta.env.VITE_API_URL || '/api'
const KEY = 'diveinsilicon_token'

export const getToken = () => localStorage.getItem(KEY) || sessionStorage.getItem(KEY)
export const clearToken = () => { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) }
// remember = true keeps the user signed in after the browser closes
export const setToken = (token, remember = true) => {
  clearToken()
  ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const d = data && data.detail
    let msg = 'Something went wrong'
    if (typeof d === 'string') msg = d
    else if (Array.isArray(d) && d[0]) msg = String(d[0].msg || msg).replace(/^Value error, /, '')
    throw new Error(msg)
  }
  return data
}
