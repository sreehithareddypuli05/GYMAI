import { motion } from 'framer-motion'
import type { DashboardActivityPoint } from '@/services/dashboardService'

interface DashboardActivityProps {
  activity: DashboardActivityPoint[]
}

export function DashboardActivity({
  activity,
}: DashboardActivityProps) {
  const max = Math.max(
    ...activity.map((point) => point.minutes),
    1,
  )

  const hasActivity = activity.some(
    (point) => point.minutes > 0,
  )

  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-eyebrow">
            Training activity
          </p>

          <h2 className="mt-2 font-display text-lg font-semibold text-ink">
            This week
          </h2>
        </div>

        <span className="text-xs text-ink-faint">
          {hasActivity
            ? 'Based on completed sessions'
            : 'No sessions yet'}
        </span>
      </div>

      <div className="mt-7 flex h-44 items-end gap-2 sm:gap-3">
        {activity.map((point, index) => {
          const height =
            point.minutes > 0
              ? Math.max(
                  (point.minutes / max) * 100,
                  8,
                )
              : 3

          return (
            <div
              key={point.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end">
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: `${height}%`,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.06,
                    ease: 'easeOut',
                  }}
                  className={`w-full rounded-sm ${
                    point.minutes > 0
                      ? 'bg-emerald'
                      : 'bg-surface-border'
                  }`}
                  title={
                    point.minutes > 0
                      ? `${point.minutes} minutes`
                      : 'No workout'
                  }
                />
              </div>

              <span className="text-[10px] font-mono text-ink-faint">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>

      {!hasActivity && (
        <div className="mt-5 border-t border-surface-border pt-4">
          <p className="text-sm text-ink-muted">
            Complete your first workout to start
            building your activity history.
          </p>
        </div>
      )}
    </section>
  )
}