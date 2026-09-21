import type { UserProfile } from '@/types'

export const mockProfile: UserProfile = {
  fitnessLevel: 'Intermediate',
  goal: 'Build Muscle',
  trainingFrequency: 5,
  equipment: ['Barbell', 'Dumbbell', 'Cable', 'Bodyweight'],
}

export const readiness = 82
export const trainingLoad = { current: 68, status: 'Optimal' as const }
