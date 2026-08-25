import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardMetricProps {
  label: string
  value: string | number
  description: string
  icon: ReactNode
}

export function DashboardMetric({ label, value, description, icon }: DashboardMetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-l-2 border-emerald/40 bg-surface px-5 py-4 transition-colors hover:border-emerald hover:bg-surface-raised"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="label-eyebrow">{label}</p>
        <span className="text-emerald opacity-70 transition-opacity group-hover:opacity-100">{icon}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-ink-faint">{description}</p>
    </motion.div>
  )
}
