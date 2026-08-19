import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10 text-emerald mb-6">
        <Activity size={22} />
      </div>
      <p className="label-eyebrow mb-3">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">This page hasn't been logged yet</h1>
      <p className="text-sm text-ink-muted mb-8 max-w-sm">
        The route you're looking for doesn't exist. Let's get you back on track.
      </p>
      <Link to="/">
        <Button>Back to GymAI</Button>
      </Link>
    </div>
  )
}
