import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        scrolled ? 'bg-charcoal/85 backdrop-blur-md border-b border-surface-border' : 'bg-transparent'
      )}
    >
      <div className="container-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
            <Activity size={16} />
          </div>
          <span className="font-display text-lg font-semibold text-ink">GymAI</span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <a href="#intelligence" className="text-sm text-ink-muted hover:text-ink transition-colors">Intelligence</a>
          <a href="#library" className="text-sm text-ink-muted hover:text-ink transition-colors">Library</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-charcoal hover:bg-emerald-light transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
