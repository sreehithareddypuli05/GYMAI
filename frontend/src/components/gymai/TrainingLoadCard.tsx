import { motion } from 'framer-motion'
import {
  Gauge,
  TrendingUp,
} from 'lucide-react'

import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'

export function TrainingLoadCard({
  current,
  status,
}: {
  current: number
  status: string
}) {
  const loadMessage =
    current >= 80
      ? 'High training demand'
      : current >= 60
        ? 'Balanced training demand'
        : 'Light training demand'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="border border-surface-border bg-surface p-5"
    >
      <div className="flex items-center justify-between">

        <p className="label-eyebrow flex items-center gap-1.5">
          <Gauge size={12} />
          Training load
        </p>

        <Badge variant="emerald">
          {status}
        </Badge>

      </div>

      <div className="mt-5 flex items-end justify-between">

        <div>
          <span className="data-figure text-3xl font-semibold text-ink">
            {current}
          </span>

          <span className="ml-1 text-xs text-ink-faint">
            / 100
          </span>
        </div>

        <TrendingUp
          size={17}
          className="mb-1 text-emerald"
        />

      </div>

      <div className="mt-4">
        <Progress value={current} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-faint">
          {loadMessage}
        </p>

        <span className="text-[10px] font-mono text-ink-faint">
          ACWR
        </span>
      </div>
    </motion.div>
  )
}