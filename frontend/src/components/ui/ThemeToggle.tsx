import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const KEY = 'gymai_theme'

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
  root.dataset.theme = theme
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(KEY)
    return saved === 'light' ? 'light' : 'dark'
  })

  useEffect(() => applyTheme(theme), [theme])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(KEY, next)
  }

  const light = theme === 'light'
  return (
    <button type="button" onClick={toggle} aria-label={`Switch to ${light ? 'dark' : 'light'} mode`} title={`Switch to ${light ? 'dark' : 'light'} mode`} className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-borderStrong bg-surface/70 text-ink transition hover:border-orange/50 hover:text-orange">
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
