import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle, Clock3, Pause, Play, SkipForward, Camera } from 'lucide-react'
import { motion } from 'framer-motion'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { WorkoutProgress } from '@/components/gymai/WorkoutProgress'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { completeWorkout, getTodayWorkout } from '@/services/workoutService'
import { BeginnerPoseTrainer } from '@/components/gymai/BeginnerPoseTrainer'
import type { Workout as WorkoutType, WorkoutExercise } from '@/types'

export default function Workout() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [workout, setWorkout] = useState<WorkoutType | null>(null)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [poseOpen, setPoseOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getTodayWorkout(user)
      .then((result) => {
        setWorkout(result)
        setExercises(result?.exercises.map((exercise) => ({ ...exercise, completed: false, completedSets: 0 })) ?? [])
      })
      .catch(() => showToast('Unable to load your workout.', 'error'))
      .finally(() => setLoading(false))
  }, [user, showToast])

  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(interval)
  }, [running])

  const completedCount = useMemo(() => exercises.filter((exercise) => exercise.completed).length, [exercises])
  const totalSets = useMemo(() => exercises.reduce((sum, exercise) => sum + exercise.sets, 0), [exercises])
  const completedSets = useMemo(() => exercises.reduce((sum, exercise) => sum + (exercise.completedSets ?? 0), 0), [exercises])
  const active = exercises[activeIndex]
  const elapsedMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60))
  const timerLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`

  const completeSet = (id: string) => {
    setExercises((previous) => previous.map((exercise) => {
      if (exercise.id !== id) return exercise
      const nextSets = Math.min(exercise.sets, (exercise.completedSets ?? 0) + 1)
      return { ...exercise, completedSets: nextSets, completed: nextSets >= exercise.sets }
    }))
  }

  const nextExercise = () => {
    if (activeIndex < exercises.length - 1) setActiveIndex((index) => index + 1)
  }

  const finishWorkout = async () => {
    if (!workout || saving) return
    setSaving(true)
    try {
      await completeWorkout({
        workout_id: workout.id,
        workout_name: workout.name,
        focus: workout.focus,
        duration_minutes: elapsedSeconds ? elapsedMinutes : workout.durationMinutes,
        exercise_count: completedCount,
        total_sets: totalSets,
        completed_sets: completedSets,
        completed_exercises: exercises.map((exercise) => ({
          exercise_id: exercise.id,
          name: exercise.name,
          planned_sets: exercise.sets,
          completed_sets: exercise.completedSets ?? 0,
          planned_reps: exercise.reps,
          completed: Boolean(exercise.completed),
        })),
      })
      setRunning(false)
      setFinished(true)
      showToast('Workout saved to your training history.', 'success')
    } catch {
      showToast('Workout could not be saved. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!user || loading) {
    return <AppShell><div className="space-y-4"><SkeletonCard /><SkeletonCard /></div></AppShell>
  }

  if (!workout) {
    return (
      <AppShell>
        <PageHeader eyebrow="Workout" title="Your workout isn't ready yet." description="Complete your training profile so GymAI can select exercises from your available equipment." />
        <div className="mx-auto max-w-2xl border border-surface-border bg-surface p-6">
          <p className="text-sm text-ink-muted">GymAI needs your fitness level, goal, and equipment before it can build a personalized workout.</p>
          <Button className="mt-5" onClick={() => window.location.assign('/profile')}>Complete profile</Button>
        </div>
      </AppShell>
    )
  }

  if (finished) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl py-16 text-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-emerald">
            <CheckCircle2 size={30} />
          </motion.div>
          <h1 className="font-display text-2xl font-semibold text-ink">Workout complete</h1>
          <p className="mt-2 text-sm text-ink-muted">{completedCount} of {exercises.length} exercises · {completedSets}/{totalSets} sets completed</p>
          <p className="mt-1 text-xs text-ink-faint">{elapsedMinutes} minute{elapsedMinutes === 1 ? '' : 's'} recorded</p>
          <Button className="mt-8" onClick={() => window.location.assign('/dashboard')}>Back to dashboard</Button>
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
        action={<div className="flex items-center gap-2 border border-surface-border bg-surface px-3 py-2"><Clock3 size={15} className="text-emerald" /><span className="font-mono text-sm text-ink">{timerLabel}</span></div>}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <WorkoutProgress completed={completedCount} total={exercises.length} />

          {active && (
            <motion.section key={active.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="card-surface overflow-hidden p-6 sm:p-7">
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-raised">
                  <img src={active.imageUrl} alt={`${active.name} exercise demonstration`} className="aspect-square h-full w-full object-cover" />
                </div>

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="emerald" className="mb-3">Exercise {activeIndex + 1} of {exercises.length}</Badge>
                      <h2 className="font-display text-2xl font-semibold text-ink">{active.name}</h2>
                      <p className="mt-1 text-sm text-ink-faint">{active.muscleGroup} · {active.equipment}</p>
                    </div>
                    {active.completed && <CheckCircle2 size={22} className="shrink-0 text-emerald" />}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2 border-y border-surface-border py-5">
                    <Stat value={active.sets} label="Sets" />
                    <Stat value={active.reps} label="Reps" />
                    <Stat value={`${active.restSeconds}s`} label="Rest" />
                  </div>

                  {user.fitness_level === 'Beginner' && active.poseSupported && !active.completed && (
                    <Button className="mt-5 w-full sm:w-auto" onClick={() => setPoseOpen(true)}><Camera size={16} /> Start AI form check</Button>
                  )}

                  <div className="mt-5 rounded-lg border border-surface-border bg-surface-raised p-4">
                    <div className="flex items-center justify-between text-sm"><span className="text-ink-muted">Set progress</span><span className="font-semibold text-ink">{active.completedSets ?? 0}/{active.sets}</span></div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-border"><div className="h-full rounded-full bg-emerald transition-all" style={{ width: `${((active.completedSets ?? 0) / active.sets) * 100}%` }} /></div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm leading-relaxed text-ink-muted">{active.description}</p>
                <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Form cues</p><ul className="mt-3 space-y-2">{active.cues.map((cue) => <li key={cue} className="flex gap-2 text-sm text-ink-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />{cue}</li>)}</ul></div>
              </div>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Pause' : 'Start timer'}</Button>
                {user.fitness_level === 'Beginner' && active.poseSupported ? (
                  <Button disabled={Boolean(active.completed)} onClick={() => setPoseOpen(true)}><Camera size={16} />{active.completed ? 'Exercise complete' : 'Run AI form check'}</Button>
                ) : (
                  <Button disabled={Boolean(active.completed)} onClick={() => completeSet(active.id)}><CheckCircle2 size={16} />{active.completed ? 'Exercise complete' : `Complete set ${(active.completedSets ?? 0) + 1}`}</Button>
                )}
                <Button variant="ghost" onClick={nextExercise}><SkipForward size={16} />Next</Button>
              </div>
            </motion.section>
          )}

          <Button variant="secondary" fullWidth loading={saving} onClick={finishWorkout}>Finish workout</Button>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between"><div><p className="label-eyebrow">Workout plan</p><h2 className="mt-2 text-lg font-semibold text-ink">Exercises</h2></div><span className="text-xs text-ink-faint">{completedCount}/{exercises.length}</span></div>
            <div className="mt-5 space-y-1">{exercises.map((exercise, index) => <button key={exercise.id} type="button" onClick={() => setActiveIndex(index)} className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-colors ${index === activeIndex ? 'border-emerald bg-emerald/[0.06]' : 'border-transparent hover:bg-surface-raised'}`}>
              {exercise.completed ? <CheckCircle2 size={17} className="shrink-0 text-emerald" /> : <Circle size={17} className="shrink-0 text-ink-faint" />}
              <div className="min-w-0 flex-1"><p className="truncate text-sm text-ink">{exercise.name}</p><p className="mt-0.5 text-xs text-ink-faint">{exercise.completedSets ?? 0}/{exercise.sets} sets · {exercise.reps}</p></div>
            </button>)}</div>
          </div>
        </aside>
      </div>
      {poseOpen && active && (
        <BeginnerPoseTrainer
          exercise={active}
          onClose={() => setPoseOpen(false)}
          onComplete={(reps, score) => {
            setExercises((previous) => previous.map((item) => item.id === active.id ? { ...item, poseReps: reps, poseFormScore: score } : item))
            setPoseOpen(false)
            completeSet(active.id)
            showToast(`AI form check saved · ${reps} reps · ${score}% form`, 'success')
          }}
        />
      )}
    </AppShell>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return <div className="text-center"><p className="data-figure text-lg font-semibold text-ink">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-ink-faint">{label}</p></div>
}
