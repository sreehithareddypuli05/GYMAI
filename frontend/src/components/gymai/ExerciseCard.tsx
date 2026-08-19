import { Dumbbell } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Exercise } from '@/types'

const difficultyVariant = { Beginner: 'emerald', Intermediate: 'warning', Advanced: 'danger' } as const

export function ExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card-surface p-4 text-left w-full hover:border-emerald/30 transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-raised text-emerald group-hover:bg-emerald/10 transition-colors">
          <Dumbbell size={16} />
        </div>
        <Badge variant={difficultyVariant[exercise.difficulty]}>{exercise.difficulty}</Badge>
      </div>
      <p className="font-medium text-ink mb-1">{exercise.name}</p>
      <p className="text-xs text-ink-faint">{exercise.muscleGroup} · {exercise.equipment}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted font-mono">
        <span>{exercise.sets} sets</span>
        <span>{exercise.reps} reps</span>
      </div>
    </button>
  )
}
