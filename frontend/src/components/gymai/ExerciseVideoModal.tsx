import { useEffect, useState } from 'react'
import { ExternalLink, PlayCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useLanguage } from '@/context/LanguageContext'
import { getExerciseYoutubeEmbedUrl, getExerciseYoutubeWatchUrl } from '@/data/exerciseVideos'
import type { Difficulty, Exercise } from '@/types'

export function ExerciseVideoModal({ exercise, open, onClose }: { exercise: Exercise | null; open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const [level, setLevel] = useState<Difficulty>(exercise?.difficulty ?? 'Beginner')

  useEffect(() => {
    if (exercise) setLevel(exercise.difficulty ?? 'Beginner')
  }, [exercise])

  const embed = exercise ? getExerciseYoutubeEmbedUrl(exercise, level) : ''
  const youtubeWatch = exercise ? getExerciseYoutubeWatchUrl(exercise) : '#'

  return (
    <Modal open={open} onClose={onClose} title={exercise ? `${exercise.name} — ${t('View Demo')}` : ''} className="max-w-5xl">
      {exercise && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2" aria-label="Exercise level">
            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((item) => (
              <button key={item} type="button" onClick={() => setLevel(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${level === item ? 'border-orange bg-orange text-charcoal' : 'border-surface-borderStrong text-ink-muted hover:border-orange/50 hover:text-orange'}`}>
                {t(item)}
              </button>
            ))}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-surface-border bg-black shadow-card">
            <iframe
              key={`${exercise.id}-${level}-${embed}`}
              title={`${exercise.name} ${level} ${t('View Demo')}`}
              src={embed}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <PlayCircle size={16} className="text-orange" />
              {t('Exercise video')} · {t(level)}
            </div>
            <a href={youtubeWatch} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-orange/40 px-3 py-2 text-xs font-semibold text-orange hover:bg-orange hover:text-charcoal">
              <ExternalLink size={14} />
              {t('YouTube')}
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}
