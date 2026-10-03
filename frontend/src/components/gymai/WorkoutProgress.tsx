import { Progress } from '@/components/ui/Progress'

export function WorkoutProgress({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-ink">Workout progress</p>
        <span className="data-figure text-sm text-ink-muted">
          {completed} / {total}
        </span>
      </div>
      <Progress value={completed} max={total} />
    </div>
  )
}
