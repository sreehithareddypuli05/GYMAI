import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  suffix?: string
  icon?: ReactNode
  trend?: { value: string; positive?: boolean }
  className?: string
}

export function StatCard({ label, value, suffix, icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('card-surface p-5', className)}
    >
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">{label}</p>
        {icon && <span className="text-emerald/70">{icon}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="data-figure text-3xl font-semibold text-ink">{value}</span>
        {suffix && <span className="text-sm text-ink-faint">{suffix}</span>}
      </div>
      {trend && (
        <p className={cn('mt-2 text-xs font-medium', trend.positive ? 'text-emerald' : 'text-danger')}>
          {trend.value}
        </p>
      )}
    </motion.div>
  )
}
