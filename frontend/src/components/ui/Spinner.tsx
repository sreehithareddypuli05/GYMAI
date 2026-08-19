import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn('animate-spin text-emerald', className)} />
}

export function FullPageSpinner({ label = 'Loading GymAI…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-charcoal">
      <Spinner size={28} />
      <p className="text-sm text-ink-muted">{label}</p>
    </div>
  )
}
