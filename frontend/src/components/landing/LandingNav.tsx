import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#training', label: 'Training' },
  { href: '#ai-form', label: 'AI Form Check' },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2">
      <div
        className={cn(
          'rounded-2xl border px-3 py-2 transition-all duration-300',
          scrolled
            ? 'border-surface-borderStrong bg-charcoal/90 shadow-card backdrop-blur-xl'
            : 'border-white/10 bg-charcoal/65 backdrop-blur-lg'
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-2 py-1.5" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/15 text-emerald">
              <Activity size={17} />
            </div>
            <span className="font-display text-base font-semibold text-ink">Gym<span className="text-emerald">AI</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <Link to="/login" className="rounded-xl px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink">
              Log in
            </Link>
            <Link to="/register" className="rounded-xl bg-emerald px-4 py-2.5 text-xs font-semibold text-charcoal shadow-emerald transition hover:bg-emerald-light">
              Start training
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-xl p-2 text-ink sm:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden sm:hidden"
            >
              <div className="mt-2 border-t border-surface-border pt-2">
                {links.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm text-ink-muted hover:bg-surface-raised hover:text-ink">
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 px-1 pb-1 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-surface-borderStrong px-3 py-2.5 text-center text-sm text-ink-muted">Log in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-xl bg-emerald px-3 py-2.5 text-center text-sm font-semibold text-charcoal">Start training</Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
