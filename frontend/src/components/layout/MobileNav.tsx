import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, Library, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const nav = [
  { to: '/dashboard', label: 'home', icon: LayoutDashboard },
  { to: '/workout', label: 'workout', icon: Dumbbell },
  { to: '/exercises', label: 'exercises', icon: Library },
  { to: '/progress', label: 'progress', icon: TrendingUp },
  { to: '/profile', label: 'profile', icon: User },
]

export function MobileNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-surface-border bg-surface  px-2 py-2 lg:hidden">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-emerald' : 'text-ink-faint'
            )
          }
        >
          <Icon size={19} />
          {t(`nav.${label}`)}
        </NavLink>
      ))}
    </nav>
  )
}
