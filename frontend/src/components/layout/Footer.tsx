import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { useLandingContent } from '@/data/landingContent'

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
  const copy = useLandingContent()
  const localizedColumns = [
    { title: copy.product, links: [{ label: copy.trainingIntelligence, to: '/#intelligence' }, { label: copy.libraryLabel, to: '/#training' }, { label: copy.progressAnalytics, to: '/#progress' }] },
    { title: copy.company, links: [{ label: copy.about, to: '/' }, { label: copy.careers, to: '/' }, { label: copy.contact, to: '/' }] },
    { title: copy.account, links: [{ label: copy.logIn, to: '/login' }, { label: copy.createAccount, to: '/register' }] },
  ]
  return (
    <footer className="border-t border-surface-border bg-surface">
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
              {copy.footerBody}
            </p>
          </div>
          {localizedColumns.map((col) => (
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
          <p>© 2026 GymAI. {copy.allRights}</p>
          <p className="font-mono">{copy.footerEnd}</p>
        </div>
      </div>
    </footer>
  )
}
