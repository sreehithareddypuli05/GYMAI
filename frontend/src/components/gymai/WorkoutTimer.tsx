import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function WorkoutTimer({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-borderStrong bg-surface px-4 py-2.5">
      <Timer size={16} className={running ? 'text-emerald' : 'text-ink-faint'} />
      <span className="data-figure text-lg font-semibold text-ink">{formatTime(seconds)}</span>
    </div>
  )
}
