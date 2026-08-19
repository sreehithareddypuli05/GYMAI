import {
  ArrowUpRight,
  Bot,
  Clock,
  Dumbbell,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Workout } from '@/types'

interface DashboardWorkoutProps {
  workout: Workout | null
}

export function DashboardWorkout({
  workout,
}: DashboardWorkoutProps) {
  if (!workout) {
    return (
      <section className="card-surface overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-eyebrow">
              Today's training
            </p>

            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Your plan starts with your profile.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              Complete your fitness preferences and
              GymAI will build today's workout from
              your available equipment and training level.
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-emerald px-5 py-3 text-sm font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:bg-emerald-light"
          >
            Complete profile
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-6 border-t border-surface-border pt-5">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 border border-surface-borderStrong px-4 py-2.5 text-sm font-medium text-ink-faint"
          >
            <Bot size={16} />
            AI Generated Workout
            <span className="text-[10px] uppercase tracking-wider">
              Coming soon
            </span>
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border border-emerald/20 bg-surface p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label-eyebrow">
              Today's training
            </p>

            <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {workout.name}
            </h2>

            <p className="mt-2 text-sm text-ink-muted">
              {workout.focus}
            </p>
          </div>

          <div className="border border-emerald/20 bg-emerald/[0.05] px-3 py-2 text-xs text-emerald">
            Personalized
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {workout.durationMinutes} min
          </span>

          <span className="flex items-center gap-1.5">
            <Dumbbell size={13} />
            {workout.exercises.length} exercises
          </span>

          <span>
            {workout.difficulty}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/workout"
            className="inline-flex items-center justify-center gap-2 bg-emerald px-5 py-3 text-sm font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:bg-emerald-light"
          >
            Start workout
            <ArrowUpRight size={16} />
          </Link>

          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 border border-surface-borderStrong px-5 py-3 text-sm font-medium text-ink-faint"
          >
            <Bot size={16} />
            AI Generated Workout
            <span className="text-[10px] uppercase tracking-wider">
              Soon
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}