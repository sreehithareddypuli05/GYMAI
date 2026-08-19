import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, Library, TrendingUp, History, User, Settings, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workout', label: 'My Workout', icon: Dumbbell },
  { to: '/exercises', label: 'Exercises', icon: Library },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col border-r border-surface-border bg-surface/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
          <Activity size={17} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">GymAI</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald/10 text-emerald border border-emerald/20'
                  : 'text-ink-muted hover:bg-surface-raised hover:text-ink border border-transparent'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-4">
          <p className="label-eyebrow mb-1">Coming soon</p>
          <p className="text-xs text-ink-muted leading-relaxed">AI-generated programming, adaptive to your recovery.</p>
        </div>
      </div>
    </aside>
  )
}
