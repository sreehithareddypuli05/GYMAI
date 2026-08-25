import { ArrowUpRight, Camera, Clock, Dumbbell, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Workout } from '@/types'

interface DashboardWorkoutProps { workout: Workout | null }

export function DashboardWorkout({ workout }: DashboardWorkoutProps) {
  if (!workout) {
    return (
      <section className="relative overflow-hidden border border-surface-border bg-surface px-6 py-8 sm:px-8">
        <div className="absolute left-0 top-0 h-full w-1 bg-emerald" />
        <div className="max-w-3xl">
          <p className="label-eyebrow">Training engine</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Your plan starts with your profile.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">GymAI uses your goal, level, equipment and training frequency to build a session that fits you.</p>
          <Link to="/profile" className="mt-6 inline-flex items-center gap-2 bg-emerald px-5 py-3 text-sm font-semibold text-charcoal hover:bg-emerald-light">
            Complete profile <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    )
  }

  const heroImage = workout.exercises[0]?.imageUrl
  const poseCount = workout.exercises.filter((exercise) => exercise.poseSupported).length

  return (
    <section className="relative min-h-[330px] overflow-hidden border border-surface-border bg-surface">
      {heroImage && <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/45" />
      <div className="relative flex min-h-[330px] flex-col justify-between p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 border border-emerald/40 bg-emerald/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald">
            <Sparkles size={13} /> Personalized today
          </span>
          <span className="text-xs text-ink-faint">{workout.difficulty} training</span>
        </div>

        <div className="max-w-3xl">
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-emerald">{workout.focus}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-5xl">{workout.name}</h2>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {workout.durationMinutes} min</span>
            <span className="flex items-center gap-1.5"><Dumbbell size={14} /> {workout.exercises.length} exercises</span>
            {poseCount > 0 && <span className="flex items-center gap-1.5"><Camera size={14} /> {poseCount} AI form checks</span>}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/workout" className="inline-flex items-center gap-2 bg-emerald px-6 py-3 text-sm font-semibold text-charcoal transition-transform hover:-translate-y-0.5 hover:bg-emerald-light">
            Start today's workout <ArrowUpRight size={16} />
          </Link>
          <Link to="/exercises" className="border border-white/15 px-5 py-3 text-sm font-medium text-ink hover:bg-white/5">Browse exercises</Link>
        </div>
      </div>
    </section>
  )
}
