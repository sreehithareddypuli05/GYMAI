import {
  useEffect,
  useState,
} from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { HistoryCard } from '@/components/gymai/HistoryCard'
import { SkeletonCard } from '@/components/ui/Skeleton'

import {
  getHistory,
} from '@/services/historyService'

import type {
  HistoryEntry,
} from '@/types'


export default function History() {
  const [entries, setEntries] =
    useState<HistoryEntry[]>([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {
    getHistory()
      .then((res) => {
        setEntries(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  return (
    <AppShell>
      <PageHeader
        eyebrow="Log"
        title="History"
        description="Every completed workout, in order."
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({
            length: 4,
          }).map((_, i) => (
            <SkeletonCard
              key={i}
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card-surface p-12 text-center">

          <p className="mb-1 font-medium text-ink">
            No workouts logged yet
          </p>

          <p className="text-sm text-ink-faint">
            Finish your first session to see it here.
          </p>

        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <HistoryCard
              key={entry.id}
              entry={entry}
            />
          ))}
        </div>
      )}
    </AppShell>
  )
}