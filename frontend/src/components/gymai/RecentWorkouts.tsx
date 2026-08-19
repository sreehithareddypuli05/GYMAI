import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DashboardWorkout } from '@/services/dashboardService'

interface RecentWorkoutsProps {
  workouts: DashboardWorkout[]
}

export function RecentWorkouts({
  workouts,
}: RecentWorkoutsProps) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label-eyebrow">
            Recent activity
          </p>

          <h2 className="mt-2 font-display text-lg font-semibold text-ink">
            Your training history
          </h2>
        </div>

        {workouts.length > 0 && (
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald transition-colors hover:text-emerald-light"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {workouts.length === 0 ? (
        <div className="mt-6 border border-dashed border-surface-borderStrong p-6 text-center">
          <p className="text-sm font-medium text-ink">
            Your history starts here.
          </p>

          <p className="mt-1 text-xs leading-relaxed text-ink-faint">
            Complete your first workout and GymAI
            will begin tracking your progress.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-surface-border">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald/10 text-emerald">
                <CalendarDays size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {workout.workout_name}
                </p>

                <p className="mt-1 truncate text-xs text-ink-faint">
                  {workout.focus || 'Training session'}
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-1.5 text-xs text-ink-faint sm:flex">
                <Clock size={12} />
                {workout.duration_minutes} min
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}