import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Clock, Dumbbell, Target } from 'lucide-react'
import type { Exercise } from '@/types'

const difficultyVariant = { Beginner: 'emerald', Intermediate: 'warning', Advanced: 'danger' } as const

export function ExerciseModal({ exercise, open, onClose }: { exercise: Exercise | null; open: boolean; onClose: () => void }) {
  if (!exercise) return null
  return (
    <Modal open={open} onClose={onClose} title={exercise.name}>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={difficultyVariant[exercise.difficulty]}>{exercise.difficulty}</Badge>
        <Badge variant="neutral">{exercise.muscleGroup}</Badge>
        <Badge variant="neutral">{exercise.equipment}</Badge>
      </div>
      <p className="text-sm text-ink-muted leading-relaxed mb-5">{exercise.description}</p>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl bg-surface-raised p-3 text-center">
          <Target size={15} className="mx-auto mb-1.5 text-emerald" />
          <p className="data-figure text-sm font-semibold text-ink">{exercise.sets}</p>
          <p className="text-[10px] uppercase text-ink-faint">Sets</p>
        </div>
        <div className="rounded-xl bg-surface-raised p-3 text-center">
          <Dumbbell size={15} className="mx-auto mb-1.5 text-emerald" />
          <p className="data-figure text-sm font-semibold text-ink">{exercise.reps}</p>
          <p className="text-[10px] uppercase text-ink-faint">Reps</p>
        </div>
        <div className="rounded-xl bg-surface-raised p-3 text-center">
          <Clock size={15} className="mx-auto mb-1.5 text-emerald" />
          <p className="data-figure text-sm font-semibold text-ink">{exercise.restSeconds}s</p>
          <p className="text-[10px] uppercase text-ink-faint">Rest</p>
        </div>
      </div>
      <p className="label-eyebrow mb-2">Form cues</p>
      <ul className="space-y-1.5">
        {exercise.cues.map((cue) => (
          <li key={cue} className="text-sm text-ink-muted flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald shrink-0" />
            {cue}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
