import api from '@/lib/api'

import type {
  HistoryEntry,
} from '@/types'


export async function getHistory(): Promise<
  HistoryEntry[]
> {
  const { data } =
    await api.get<HistoryEntry[]>(
      '/history',
    )

  return data
}