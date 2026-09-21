import { useState } from 'react'
import { Dumbbell, PlayCircle, X, ExternalLink } from 'lucide-react'
import { ExerciseImageGallery } from '@/components/gymai/ExerciseImageGallery'
import { useLanguage } from '@/context/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { getExerciseYoutubeEmbedUrl, getExerciseYoutubeWatchUrl } from '@/data/exerciseVideos'
import type { Difficulty, Exercise } from '@/types'

const difficultyVariant = { Beginner: 'emerald', Intermediate: 'warning', Advanced: 'danger' } as const

export function ExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick?: () => void }) {
  const { t } = useLanguage()
  const [demoOpen, setDemoOpen] = useState(false)
  const [level, setLevel] = useState<Difficulty>(exercise.difficulty)

  const embedUrl = getExerciseYoutubeEmbedUrl(exercise, level)
  const watchUrl = getExerciseYoutubeWatchUrl(exercise)

  return (
    <article onClick={onClick} className="card-surface p-4 text-left w-full hover:border-orange/30 transition-colors group cursor-pointer">
      <ExerciseImageGallery exercise={exercise} compact />
      <div className="flex items-start justify-between mb-3 mt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-raised text-emerald group-hover:bg-emerald/10 transition-colors">
          <Dumbbell size={16} />
        </div>
        <Badge variant={difficultyVariant[exercise.difficulty]}>{t(exercise.difficulty)}</Badge>
      </div>
      <p className="font-medium text-ink mb-1">{exercise.name}</p>
      <p className="text-xs text-ink-faint">{t(exercise.muscleGroup)} · {t(exercise.equipment)}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-ink-muted font-mono">
        <span>{exercise.sets} {t('Sets')}</span>
        <span>{exercise.reps} {t('Reps')}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-surface-border pt-3">
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); setDemoOpen((value) => !value) }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange px-3 py-2.5 text-xs font-semibold text-charcoal transition hover:bg-orange-light"
        >
          <PlayCircle size={15} /> {t('View Me')}
        </button>
      </div>

      {demoOpen && (
        <div onClick={(event) => event.stopPropagation()} className="mt-4 overflow-hidden rounded-2xl border border-orange/30 bg-black shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5">
            <div className="flex flex-wrap gap-1.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition ${level === item ? 'border-orange bg-orange text-charcoal' : 'border-white/15 text-white/70 hover:border-orange/60 hover:text-white'}`}
                >
                  {t(item)}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setDemoOpen(false)} aria-label={t('Close')} className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/65 hover:bg-white/10 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="relative aspect-video bg-black">
            <iframe
              key={`${exercise.id}-${level}-${embedUrl}`}
              title={`${exercise.name} ${t(level)} ${t('Exercise video')}`}
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <a href={watchUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 border-t border-white/10 px-3 py-2.5 text-xs font-semibold text-orange hover:text-white">
            <ExternalLink size={13} /> {t('YouTube')}
          </a>
        </div>
      )}
    </article>
  )
}
