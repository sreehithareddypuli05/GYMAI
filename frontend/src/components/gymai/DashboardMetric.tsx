import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardMetricProps {
  label: string
  value: string | number
  description: string
  icon: ReactNode
}

export function DashboardMetric({
  label,
  value,
  description,
  icon,
}: DashboardMetricProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="card-surface p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label-eyebrow">
            {label}
          </p>

          <p className="mt-3 data-figure text-3xl font-semibold text-ink">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-faint">
        {description}
      </p>
    </motion.div>
  )
}