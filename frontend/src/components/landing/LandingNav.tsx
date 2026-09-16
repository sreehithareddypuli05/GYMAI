import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const links = [
  { href: '#ai-features', label: 'aiTraining' },
  { href: '#training', label: 'exerciseLibrary' },
  { href: '#testimonials', label: 'memberStories' },
  { href: '#ai-form', label: 'formFeedback' },
]

export function LandingNav() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2">
      <div className={cn('px-1 py-2 transition-all duration-300')}>
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-2 py-1.5" onClick={() => setOpen(false)}>
            <img src="/gymai-logo.svg" alt={t('brandLogoAlt')} className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                {t(`landing.${link.label}`)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/login" className="rounded-xl px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink">
              {t('landing.signIn')}
            </Link>
            <Link to="/register" className="rounded-xl bg-orange px-4 py-2.5 text-xs font-semibold text-charcoal shadow-orange transition hover:bg-orange-light">
              {t('landing.startPlan')}
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? t('landing.closeMenu') : t('landing.openMenu')}
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
                    {t(`landing.${link.label}`)}
                  </a>
                ))}
                <div className="flex items-center gap-2 px-1 pb-1 pt-2"><LanguageSwitcher /><ThemeToggle />
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-surface-borderStrong px-3 py-2.5 text-center text-sm text-ink-muted">{t('landing.signIn')}</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-xl bg-orange px-3 py-2.5 text-center text-sm font-semibold text-charcoal">{t('landing.startPlan')}</Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
