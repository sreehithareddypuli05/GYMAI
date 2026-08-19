import api from '@/lib/api'

import type {
  ProgressPoint,
} from '@/types'


export interface ProgressSnapshot {
  completionRate: number

  currentStreak: number

  longestStreak: number

  sessionsPerWeek: number

  volumeByWeek: ProgressPoint[]

  frequencyByWeek: ProgressPoint[]

  strengthProgression: ProgressPoint[]

  muscleDistribution: ProgressPoint[]
}


export async function getProgressSnapshot(): Promise<ProgressSnapshot> {
  const { data } =
    await api.get<ProgressSnapshot>(
      '/progress',
    )

  return data
}