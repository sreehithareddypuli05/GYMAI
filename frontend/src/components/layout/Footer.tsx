import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Training Intelligence', to: '/#intelligence' },
      { label: 'Exercise Library', to: '/#library' },
      { label: 'Progress Analytics', to: '/#progress' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact', to: '/' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Create account', to: '/register' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface/30">
      <div className="container-shell py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
                <Activity size={15} />
              </div>
              <span className="font-display text-base font-semibold text-ink">GymAI</span>
            </Link>
            <p className="mt-3 text-sm text-ink-faint leading-relaxed max-w-[220px]">
              A training operating system built on readiness, load, and adaptive programming.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="label-eyebrow mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-muted hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-surface-border pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GymAI. All rights reserved.</p>
          <p className="font-mono">Built for the AI training era.</p>
        </div>
      </div>
    </footer>
  )
}
