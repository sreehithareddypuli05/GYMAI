import { ExternalLink, PlayCircle, X } from 'lucide-react'
import type { Difficulty, Exercise } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { getExerciseYoutubeEmbedUrl, getExerciseYoutubeWatchUrl } from '@/data/exerciseVideos'

export function ExerciseInlineVideo({ exercise, level, onClose }: { exercise: Exercise; level: Difficulty; onClose: () => void }) {
  const { t } = useLanguage()
  const embed = getExerciseYoutubeEmbedUrl(exercise, level)
  const watchUrl = getExerciseYoutubeWatchUrl(exercise)

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-orange/30 bg-black shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <PlayCircle size={17} className="text-orange" />
          {exercise.name} · {t(level)}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('Close')}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative aspect-video w-full bg-black">
        <iframe
          title={`${exercise.name} ${t('Exercise video')}`}
          src={embed}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-white/70">
        <span>{t('Exercise video')} · {t(level)}</span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-orange hover:text-white"
        >
          <ExternalLink size={13} />
          {t('YouTube')}
        </a>
      </div>
    </div>
  )
}
