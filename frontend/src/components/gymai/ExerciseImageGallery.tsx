import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import type { Exercise } from '@/types'

export function ExerciseImageGallery({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  const candidates = useMemo(() => exercise.imageUrls?.length ? exercise.imageUrls : [exercise.imageUrl], [exercise.imageUrls, exercise.imageUrl])
  const [index, setIndex] = useState(0)
  const [angle, setAngle] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setIndex(0)
    setAngle(0)
    setFailed(false)
  }, [exercise.id])

  const current = candidates[index] ?? exercise.imageUrl
  const localFallback = `/media/exercises/${exercise.slug}.svg`
  const source = failed ? localFallback : angle === 1 ? current.replace('/0.jpg', '/1.jpg') : current

  const next = () => {
    if (candidates.length > 1) setIndex((value) => (value + 1) % candidates.length)
    setAngle(0)
  }

  const previous = () => {
    if (candidates.length > 1) setIndex((value) => (value - 1 + candidates.length) % candidates.length)
    setAngle(0)
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-charcoal ${compact ? 'aspect-[16/9]' : 'aspect-[16/8]'}`}>
      <img
        src={source}
        alt={`${exercise.name} exercise demonstration`}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => {
          if (angle === 0 && current.includes('/0.jpg')) {
            setAngle(1)
          } else {
            setFailed(true)
          }
        }}
      />

      {!compact && candidates.length > 1 && !failed && (
        <>
          <button type="button" onClick={previous} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/55 p-2 text-white backdrop-blur-md" aria-label="Previous exercise photo">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/55 p-2 text-white backdrop-blur-md" aria-label="Next exercise photo">
            <ChevronRight size={16} />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
        <ImageIcon size={13} className="text-emerald" />
        {failed ? 'Exercise guide' : angle === 1 ? 'Movement view' : 'Photo reference'}
      </div>

      {!compact && candidates.length > 1 && !failed && (
        <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur-md">
          {index + 1}/{candidates.length}
        </div>
      )}
    </div>
  )
}
