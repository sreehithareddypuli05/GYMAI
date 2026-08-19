import type { ProgressPoint } from '@/types'

interface ProgressCardProps {
  title: string
  data: ProgressPoint[]
  unit?: string
  description?: string
}

export function ProgressCard({
  title,
  data,
  unit = '',
  description,
}: ProgressCardProps) {
  const max = Math.max(
    ...data.map((point) => point.value),
    1,
  )

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
              No data yet
            </p>

            <p className="mt-1 text-xs text-ink-faint">
              Complete workouts to start tracking progress.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-52 items-end gap-2">
          {data.map((point) => {
            const height =
              (point.value / max) * 100

            return (
              <div
                key={point.label}
                className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] text-emerald opacity-0 transition-opacity group-hover:opacity-100">
                  {point.value}
                  {unit}
                </span>

                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-dark to-emerald-light transition-all duration-300 group-hover:opacity-80"
                    style={{
                      height: `${Math.max(
                        height,
                        3,
                      )}%`,
                    }}
                    title={`${point.label}: ${point.value}${unit}`}
                  />
                </div>

                <span className="whitespace-nowrap text-[10px] font-mono text-ink-faint">
                  {point.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}