import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock3,
  Dumbbell,
} from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import type { Workout } from '@/types'

const difficultyVariant = {
  Beginner: 'emerald',
  Intermediate: 'warning',
  Advanced: 'danger',
} as const

export function WorkoutCard({
  workout,
  featured = false,
}: {
  workout: Workout
  featured?: boolean
}) {
  if (!featured) {
    return (
      <Link
        to="/workout"
        className="group block border border-surface-border bg-surface p-4 transition-all duration-200 hover:border-emerald/30 hover:bg-surface-raised"
      >
        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-surface-border bg-charcoal/30 text-emerald transition-colors group-hover:border-emerald/30">
            <Dumbbell size={17} />
          </div>

          <div className="min-w-0 flex-1">
            {workout.scheduledFor && (
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.13em] text-emerald">
                {workout.scheduledFor}
              </p>
            )}

            <h4 className="truncate text-sm font-semibold text-ink">
              {workout.name}
            </h4>

            <p className="mt-1 truncate text-xs text-ink-faint">
              {workout.focus}
            </p>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-xs text-ink-muted">
              {workout.durationMinutes} min
            </p>

            <p className="mt-1 text-[10px] text-ink-faint">
              {workout.exercises.length} exercises
            </p>
          </div>

          <ArrowRight
            size={15}
            className="shrink-0 text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-emerald"
          />
        </div>
      </Link>
    )
  }

  return (
    <div className="relative overflow-hidden border border-emerald/25 bg-surface">

      <div className="absolute right-0 top-0 h-32 w-32 bg-emerald/[0.06] blur-3xl" />

      <div className="relative p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">

            {workout.scheduledFor && (
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald">
                  {workout.scheduledFor}
                </p>
              </div>
            )}

            <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {workout.name}
            </h3>

            <p className="mt-1.5 text-sm text-ink-muted">
              {workout.focus}
            </p>

          </div>

          <Badge variant={difficultyVariant[workout.difficulty]}>
            {workout.difficulty}
          </Badge>

        </div>

        <div className="mt-6 grid grid-cols-2 border-y border-surface-border sm:grid-cols-3">

          <WorkoutMeta
            icon={<Clock3 size={14} />}
            label="Duration"
            value={`${workout.durationMinutes} min`}
          />

          <WorkoutMeta
            icon={<Dumbbell size={14} />}
            label="Exercises"
            value={`${workout.exercises.length}`}
          />

          <div className="col-span-2 border-t border-surface-border px-4 py-4 sm:col-span-1 sm:border-l sm:border-t-0">
            <p className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              Focus
            </p>

            <p className="mt-1 truncate text-xs font-medium text-ink">
              {workout.focus}
            </p>
          </div>

        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-ink-faint">
            {workout.exercises.length} exercises ·{' '}
            {workout.durationMinutes} minutes
          </p>

          <Link
            to="/workout"
            className="group inline-flex min-h-11 items-center justify-center gap-2 bg-emerald px-5 text-sm font-semibold text-charcoal transition-all hover:bg-emerald-light"
          >
            Start workout
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>
      </div>
    </div>
  )
}

function WorkoutMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 text-ink-faint">
        {icon}

        <span className="text-[10px] uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 text-sm font-semibold text-ink">
        {value}
      </p>
    </div>
  )
}