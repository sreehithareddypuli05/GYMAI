import { Calendar, Clock, Flame } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import type { HistoryEntry } from '@/types'

export function HistoryCard({ entry }: { entry: HistoryEntry }) {
  return (
    <div className="card-surface p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink truncate">{entry.workoutName}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {entry.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={12} /> {entry.durationMinutes} min</span>
          <span className="flex items-center gap-1.5"><Flame size={12} /> {entry.calories} cal</span>
          <span>{entry.exerciseCount} exercises</span>
        </div>
      </div>
      <div className="w-full sm:w-36 shrink-0">
        <Progress value={entry.completion} label="Completion" />
      </div>
    </div>
  )
}
