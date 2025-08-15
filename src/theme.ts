// theme.ts - Utility for dark/light mode across the app

export type Theme = 'dark' | 'light'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  // Default: match system or dark
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function setTheme(theme: Theme) {
  localStorage.setItem('theme', theme)
  document.body.classList.toggle('light-mode', theme === 'light')
  document.body.classList.toggle('dark-mode', theme === 'dark')
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

export function syncThemeWithBody() {
  const theme = getTheme()
  setTheme(theme)
}
