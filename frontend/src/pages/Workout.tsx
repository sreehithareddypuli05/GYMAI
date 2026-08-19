import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock3,
  Pause,
  Play,
  SkipForward,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { WorkoutProgress } from '@/components/gymai/WorkoutProgress'
import { SkeletonCard } from '@/components/ui/Skeleton'

import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'

import {
  completeWorkout,
  getTodayWorkout,
} from '@/services/workoutService'

import type {
  Workout as WorkoutType,
  WorkoutExercise,
} from '@/types'

export default function Workout() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [workout, setWorkout] =
    useState<WorkoutType | null>(null)

  const [exercises, setExercises] =
    useState<WorkoutExercise[]>([])

  const [activeIndex, setActiveIndex] =
    useState(0)

  const [running, setRunning] =
    useState(false)

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0)

  const [finished, setFinished] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  useEffect(() => {
    if (!user) return

    getTodayWorkout(user).then((result) => {
      setWorkout(result)

      if (result) {
        setExercises(
          result.exercises.map((exercise) => ({
            ...exercise,
            completed: false,
          })),
        )
      }
    })
  }, [user])

  useEffect(() => {
    if (!running) return

    const interval = window.setInterval(() => {
      setElapsedSeconds(
        (seconds) => seconds + 1,
      )
    }, 1000)

    return () =>
      window.clearInterval(interval)
  }, [running])

  const completedCount = useMemo(
    () =>
      exercises.filter(
        (exercise) => exercise.completed,
      ).length,
    [exercises],
  )

  const active = exercises[activeIndex]

  const elapsedMinutes = Math.max(
    1,
    Math.ceil(elapsedSeconds / 60),
  )

  const timerLabel = `${String(
    Math.floor(elapsedSeconds / 60),
  ).padStart(2, '0')}:${String(
    elapsedSeconds % 60,
  ).padStart(2, '0')}`

  const completeExercise = (id: string) => {
    setExercises((previous) =>
      previous.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              completed: true,
            }
          : exercise,
      ),
    )
  }

  const nextExercise = () => {
    if (
      activeIndex <
      exercises.length - 1
    ) {
      setActiveIndex(
        (index) => index + 1,
      )
    }
  }

  const finishWorkout = async () => {
    if (!workout || saving) return

    setSaving(true)

    try {
      await completeWorkout({
        workout_id: workout.id,
        workout_name: workout.name,
        focus: workout.focus,
        duration_minutes: elapsedSeconds
          ? elapsedMinutes
          : workout.durationMinutes,
        exercise_count: completedCount,
      })

      setRunning(false)
      setFinished(true)

      showToast(
        'Workout saved to your training history.',
        'success',
      )
    } catch {
      showToast(
        'Workout could not be saved. Please try again.',
        'error',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!user || workout === undefined) {
    return (
      <AppShell>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    )
  }

  if (!workout) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Workout"
          title="Your workout isn't ready yet."
          description="Complete your training profile so GymAI can select exercises from your available equipment."
        />

        <div className="mx-auto max-w-2xl border border-surface-border bg-surface p-6">
          <p className="text-sm text-ink-muted">
            GymAI needs your fitness level,
            goal, and equipment before it can
            build a personalized workout.
          </p>

          <Button
            className="mt-5"
            onClick={() =>
              window.location.assign('/profile')
            }
          >
            Complete profile
          </Button>
        </div>
      </AppShell>
    )
  }

  if (finished) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl py-16 text-center">
          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-emerald"
          >
            <CheckCircle2 size={30} />
          </motion.div>

          <h1 className="font-display text-2xl font-semibold text-ink">
            Workout complete
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            You completed {completedCount} of{' '}
            {exercises.length} exercises.
          </p>

          <p className="mt-1 text-xs text-ink-faint">
            {elapsedMinutes} minute
            {elapsedMinutes === 1 ? '' : 's'} recorded
          </p>

          <Button
            className="mt-8"
            onClick={() =>
              window.location.assign('/dashboard')
            }
          >
            Back to dashboard
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={workout.focus}
        title={workout.name}
        description={`${workout.durationMinutes} min · ${workout.difficulty}`}
        action={
          <div className="flex items-center gap-2 border border-surface-border bg-surface px-3 py-2">
            <Clock3
              size={15}
              className="text-emerald"
            />
            <span className="font-mono text-sm text-ink">
              {timerLabel}
            </span>
          </div>
        }
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <WorkoutProgress
            completed={completedCount}
            total={exercises.length}
          />

          {active && (
            <motion.section
              key={active.id}
              initial={{
                opacity: 0,
                x: 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="card-surface overflow-hidden p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant="emerald"
                    className="mb-3"
                  >
                    Exercise {activeIndex + 1} of{' '}
                    {exercises.length}
                  </Badge>

                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {active.name}
                  </h2>

                  <p className="mt-1 text-sm text-ink-faint">
                    {active.muscleGroup} ·{' '}
                    {active.equipment}
                  </p>
                </div>

                {active.completed && (
                  <CheckCircle2
                    size={22}
                    className="shrink-0 text-emerald"
                  />
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 border-y border-surface-border py-5">
                <Stat
                  value={active.sets}
                  label="Sets"
                />

                <Stat
                  value={active.reps}
                  label="Reps"
                />

                <Stat
                  value={`${active.restSeconds}s`}
                  label="Rest"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm leading-relaxed text-ink-muted">
                  {active.description}
                </p>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Form cues
                  </p>

                  <ul className="mt-3 space-y-2">
                    {active.cues.map((cue) => (
                      <li
                        key={cue}
                        className="flex gap-2 text-sm text-ink-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setRunning(
                      (value) => !value,
                    )
                  }
                >
                  {running ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}

                  {running
                    ? 'Pause'
                    : 'Start timer'}
                </Button>

                <Button
                  onClick={() => {
                    completeExercise(
                      active.id,
                    )

                    nextExercise()
                  }}
                >
                  <CheckCircle2 size={16} />
                  Complete exercise
                </Button>

                <Button
                  variant="ghost"
                  onClick={nextExercise}
                >
                  <SkipForward size={16} />
                  Next
                </Button>
              </div>
            </motion.section>
          )}

          <Button
            variant="secondary"
            fullWidth
            loading={saving}
            onClick={finishWorkout}
          >
            Finish workout
          </Button>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-eyebrow">
                  Workout plan
                </p>

                <h2 className="mt-2 text-lg font-semibold text-ink">
                  Exercises
                </h2>
              </div>

              <span className="text-xs text-ink-faint">
                {completedCount}/
                {exercises.length}
              </span>
            </div>

            <div className="mt-5 space-y-1">
              {exercises.map(
                (exercise, index) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-colors ${
                      index === activeIndex
                        ? 'border-emerald bg-emerald/[0.06]'
                        : 'border-transparent hover:bg-surface-raised'
                    }`}
                  >
                    {exercise.completed ? (
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-emerald"
                      />
                    ) : (
                      <Circle
                        size={17}
                        className="shrink-0 text-ink-faint"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">
                        {exercise.name}
                      </p>

                      <p className="mt-0.5 text-xs text-ink-faint">
                        {exercise.sets} ×{' '}
                        {exercise.reps}
                      </p>
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

interface StatProps {
  value: string | number
  label: string
}

function Stat({
  value,
  label,
}: StatProps) {
  return (
    <div className="text-center">
      <p className="data-figure text-lg font-semibold text-ink">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </p>
    </div>
  )
}