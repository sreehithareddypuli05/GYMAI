import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DashboardWorkout } from '@/services/dashboardService'

interface RecentWorkoutsProps { workouts: DashboardWorkout[] }

export function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  return (
    <section className="border-t border-surface-border pt-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Momentum</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Recent training</h2>
        </div>
        {workouts.length > 0 && <Link to="/history" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald hover:text-emerald-light">View history <ArrowRight size={13} /></Link>}
      </div>

      {workouts.length === 0 ? (
        <div className="mt-5 border border-dashed border-surface-borderStrong px-5 py-8">
          <p className="text-sm font-medium text-ink">Your first session will appear here.</p>
          <p className="mt-1 text-xs leading-5 text-ink-faint">Finish a workout and GymAI will start building your training history.</p>
        </div>
      ) : (
        <div className="mt-5 border-y border-surface-border">
          {workouts.map((workout, index) => (
            <div key={workout.id} className="grid grid-cols-[36px_1fr_auto] items-center gap-4 border-b border-surface-border py-4 last:border-b-0">
              <div className="flex h-9 w-9 items-center justify-center border border-surface-border bg-surface-raised text-emerald">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{workout.workout_name}</p>
                <p className="mt-1 truncate text-xs text-ink-faint">{workout.focus || 'Training session'}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink-faint"><Clock size={12} /> {workout.duration_minutes}m</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
