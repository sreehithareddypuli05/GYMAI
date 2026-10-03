import api from '@/lib/api'

import type {
  ProgressPoint,
} from '@/types'


export interface ProgressSnapshot {
  completionRate: number

  currentStreak: number

  longestStreak: number

  sessionsPerWeek: number
  totalWorkouts: number
  totalMinutes: number
  totalSets: number
  completedSets: number
  averageFormScore: number | null
  bestFormScore: number | null
  poseSessions: number

  volumeByWeek: ProgressPoint[]

  frequencyByWeek: ProgressPoint[]

  strengthProgression: ProgressPoint[]

  muscleDistribution: ProgressPoint[]
  setsByWeek: ProgressPoint[]
  formByWeek: ProgressPoint[]
}


export async function getProgressSnapshot(): Promise<ProgressSnapshot> {
  const { data } =
    await api.get<ProgressSnapshot>(
      '/progress',
    )

  return data
}