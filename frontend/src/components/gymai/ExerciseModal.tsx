import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Clock, Dumbbell, Target } from 'lucide-react'
import { ExerciseImageGallery } from '@/components/gymai/ExerciseImageGallery'
import type { Exercise } from '@/types'

const difficultyVariant = { Beginner: 'emerald', Intermediate: 'warning', Advanced: 'danger' } as const

export function ExerciseModal({ exercise, open, onClose }: { exercise: Exercise | null; open: boolean; onClose: () => void }) {
  if (!exercise) return null
  return (
    <Modal open={open} onClose={onClose} title={exercise.name}>
      <div className="mb-5"><ExerciseImageGallery exercise={exercise} /></div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
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
      <p className="label-eyebrow mt-5 mb-2">Common mistakes</p>
      <ul className="space-y-1.5">{exercise.commonMistakes.map((mistake) => <li key={mistake} className="text-sm text-ink-muted flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-danger shrink-0" />{mistake}</li>)}</ul>
      {exercise.poseSupported && <div className="mt-5 rounded-xl border border-emerald/20 bg-emerald/[0.06] p-3 text-xs text-ink-muted"><span className="font-semibold text-emerald">Beginner AI form support:</span> This movement is prepared for the MediaPipe training flow.</div>}
    </Modal>
  )
}
