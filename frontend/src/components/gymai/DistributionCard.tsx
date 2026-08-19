import type { ProgressPoint } from '@/types'

interface DistributionCardProps {
  title: string
  data: ProgressPoint[]
  description?: string
}

export function DistributionCard({
  title,
  data,
  description,
}: DistributionCardProps) {
  const hasData = data.some(
    (point) => point.value > 0,
  )

  return (
    <div className="card-surface p-5">
      <div className="mb-5">
        <p className="label-eyebrow">
          {title}
        </p>

        {description && (
          <p className="mt-2 text-xs text-ink-faint">
            {description}
          </p>
        )}
      </div>

      {!hasData ? (
        <div className="flex h-44 items-center justify-center border border-dashed border-surface-border">
          <div className="text-center">
            <p className="text-sm font-medium text-ink">
              No workout distribution yet
            </p>

            <p className="mt-1 text-xs text-ink-faint">
              Complete different workouts to see your training focus.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((point) => (
            <div key={point.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-ink">
                  {point.label}
                </span>

                <span className="text-xs font-medium text-emerald">
                  {point.value}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-dark to-emerald-light transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      point.value,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}