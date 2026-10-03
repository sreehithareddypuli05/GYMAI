import api from '@/lib/api'
import type { User, Goal, FitnessLevel, Equipment } from '@/types'

export interface ProfilePayload {
  age: number
  height_cm: number
  weight_kg: number
  goal: Goal
  fitness_level: FitnessLevel
  equipment: Equipment[]
  training_frequency: number
}

export interface ProfileCompletion {
  completion: number
  completed_fields: number
  total_fields: number
  missing_fields: string[]
  profile_completed: boolean
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>('/profile')
  return data
}

export async function updateProfile(payload: ProfilePayload): Promise<User> {
  const { data } = await api.put<User>('/profile', payload)
  return data
}

export async function getProfileCompletion(): Promise<ProfileCompletion> {
  const { data } = await api.get<ProfileCompletion>('/profile/completion')
  return data
}
