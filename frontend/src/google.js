// Google sign-in with a custom button (Google Identity Services, token client).
// Needs VITE_GOOGLE_CLIENT_ID in .env
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
let loader

export function preloadGoogle() {
  if (!CLIENT_ID || window.google?.accounts) return Promise.resolve()
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.onload = resolve
      s.onerror = () => reject(new Error('Could not load Google sign-in'))
      document.head.appendChild(s)
    })
  }
  return loader
}

export function requestGoogleAccessToken() {
  if (!CLIENT_ID) return Promise.reject(new Error('Google sign-in is not set up yet (missing VITE_GOOGLE_CLIENT_ID).'))
  if (!window.google?.accounts) return Promise.reject(new Error('Google sign-in is still loading. Try again in a moment.'))
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'openid email profile',
      callback: r => (r.access_token ? resolve(r.access_token) : reject(new Error(r.error_description || 'Google sign-in was cancelled'))),
      error_callback: () => reject(new Error('Google sign-in was cancelled')),
    })
    client.requestAccessToken()
  })
}
