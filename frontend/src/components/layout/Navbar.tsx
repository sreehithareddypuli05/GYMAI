import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Activity,
  Dumbbell,
  History,
  LayoutDashboard,
  Library,
  Menu,
  TrendingUp,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workout', label: 'Workout', icon: Dumbbell },
  { to: '/exercises', label: 'Exercises', icon: Library },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
      <div className="rounded-2xl border border-surface-borderStrong bg-charcoal px-3 py-2 shadow-card">

        {/* Top Navbar */}
        <div className="flex items-center justify-between gap-3">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/15 text-emerald">
              <Activity size={17} />
            </div>

            <span className="font-display text-base font-semibold text-ink">
              Gym<span className="text-emerald">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                    isActive
                      ? 'bg-emerald/10 text-emerald'
                      : 'text-ink-muted hover:bg-surface-raised hover:text-ink',
                  )
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop User Menu */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink lg:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mt-2 border-t border-surface-borderStrong pt-2 lg:hidden">
            <div className="flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-emerald/10 text-emerald'
                        : 'text-ink-muted hover:bg-surface-raised hover:text-ink',
                    )
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}

              {/* Mobile User Menu */}
              <div className="mt-1 border-t border-surface-borderStrong pt-2">
                <UserMenu />
              </div>
            </div>
          </nav>
        )}

      </div>
    </header>
  )
}