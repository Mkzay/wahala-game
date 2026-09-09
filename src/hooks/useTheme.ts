import { useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('wahala-theme', 'light')
  }, [theme])

  return { theme, toggleTheme: () => setTheme('light') }
}
