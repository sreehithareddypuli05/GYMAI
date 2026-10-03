import { motion } from 'framer-motion'
import {
  Flame,
  Trophy,
} from 'lucide-react'

export function TrainingStatus({
  streak,
  longest,
}: {
  streak: number
  longest: number
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="border border-surface-border bg-surface p-5"
    >
      <div className="flex items-start justify-between">

        <p className="label-eyebrow">
          Consistency
        </p>

        <Flame
          size={17}
          className="text-emerald"
        />

      </div>

      <div className="mt-5 flex items-end gap-2">

        <span className="data-figure text-3xl font-semibold text-ink">
          {streak}
        </span>

        <span className="mb-1 text-xs text-ink-faint">
          day streak
        </span>

      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-surface-border pt-4">

        <Trophy
          size={13}
          className="text-ink-faint"
        />

        <p className="text-xs text-ink-faint">
          Personal best:{' '}
          <span className="font-medium text-ink">
            {longest} days
          </span>
        </p>

      </div>
    </motion.div>
  )
}