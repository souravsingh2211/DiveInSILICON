import { createContext, useContext, useEffect, useState } from 'react'

// One light/dark switch for the whole site. The choice is saved in the browser and
// applied as <html data-theme="dark">, which every page's CSS reads.
const Ctx = createContext({ dark: false, toggle: () => {} })
export const useTheme = () => useContext(Ctx)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('dive-theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    const el = document.documentElement
    if (dark) el.setAttribute('data-theme', 'dark'); else el.removeAttribute('data-theme')
    try { localStorage.setItem('dive-theme', dark ? 'dark' : 'light') } catch { /* private mode */ }
  }, [dark])
  return <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</Ctx.Provider>
}
