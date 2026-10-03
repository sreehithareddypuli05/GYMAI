import {
  useState,
  useRef,
  useEffect,
} from 'react'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'

export function UserMenu() {
  const { user, logout } = useAuth()

  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      onClick,
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        onClick,
      )
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-surface-borderStrong hover:bg-surface"
      >
        <Avatar
          name={user.full_name}
          src={user.avatar_url}
          size="sm"
        />

        <span className="hidden text-sm text-ink sm:block">
          {user.full_name.split(' ')[0]}
        </span>

        <ChevronDown
          size={14}
          className="text-ink-faint"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.97,
              transition: {
                duration: 0.12,
              },
            }}
            transition={{
              duration: 0.15,
            }}
            className="absolute right-0 z-50 mt-2 w-52 card-surface p-1.5"
          >
            <div className="mb-1 border-b border-surface-border px-3 py-2">
              <p className="truncate text-sm font-medium text-ink">
                {user.full_name}
              </p>

              <p className="truncate text-xs text-ink-faint">
                {user.email}
              </p>
            </div>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              <UserIcon size={15} />
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              <Settings size={15} />
              Settings
            </Link>

            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut size={15} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}