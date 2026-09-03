import { NavLink, Link } from 'react-router-dom'
import { Activity, Dumbbell, History, LayoutDashboard, Library, TrendingUp, User } from 'lucide-react'
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
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-surface-borderStrong bg-charcoal/85 px-3 py-2 shadow-card backdrop-blur-xl">
        <Link to="/dashboard" className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/15 text-emerald">
            <Activity size={17} />
          </div>
          <span className="font-display text-base font-semibold text-ink">Gym<span className="text-emerald">AI</span></span>
        </Link>

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

        <div className="flex items-center gap-2"><ThemeToggle /><UserMenu /></div>
      </div>
    </header>
  )
}
