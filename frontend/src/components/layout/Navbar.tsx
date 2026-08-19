import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

import { UserMenu } from './UserMenu'


export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-surface-border bg-charcoal/80 px-5 py-3.5 backdrop-blur-md lg:px-8">

      <Link
        to="/dashboard"
        className="flex items-center gap-2 lg:hidden"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
          <Activity size={15} />
        </div>

        <span className="font-display text-base font-semibold text-ink">
          GymAI
        </span>
      </Link>


      <div className="hidden lg:block" />


      <div className="flex items-center">
        <UserMenu />
      </div>

    </header>
  )
}