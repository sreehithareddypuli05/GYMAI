import { motion } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
} from 'lucide-react'

import { RadialProgress } from '@/components/ui/Progress'

export function ReadinessCard({
  value,
}: {
  value: number
}) {
  const status =
    value >= 75
      ? 'Primed'
      : value >= 50
        ? 'Steady'
        : 'Recover'

  const message =
    value >= 75
      ? 'Good window for a productive training session.'
      : value >= 50
        ? 'Train normally, but keep intensity controlled.'
        : 'Prioritize recovery before pushing intensity.'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="border border-surface-border bg-surface p-5"
    >
      <div className="flex items-center justify-between">

        <p className="label-eyebrow flex items-center gap-1.5">
          <Activity size={12} />
          Readiness
        </p>

        <CheckCircle2
          size={15}
          className={
            value >= 75
              ? 'text-emerald'
              : 'text-ink-faint'
          }
        />

      </div>

      <div className="mt-5 flex items-center gap-5">

        <RadialProgress
          value={value}
          label="Ready"
        />

        <div className="min-w-0">

          <p className="text-xl font-semibold text-ink">
            {status}
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-faint">
            {message}
          </p>

        </div>

      </div>

      <div className="mt-5 border-t border-surface-border pt-4">

        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.1em]">
          <span className="text-ink-faint">
            Today's score
          </span>

          <span className="font-mono text-emerald">
            {value}/100
          </span>
        </div>

      </div>
    </motion.div>
  )
}