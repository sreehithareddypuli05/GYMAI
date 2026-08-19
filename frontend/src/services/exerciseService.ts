import { exercises } from '@/data/exercises'
import type { Difficulty, Equipment, Exercise, MuscleGroup } from '@/types'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export interface ExerciseFilters {
  query?: string
  muscleGroup?: MuscleGroup | 'All'
  equipment?: Equipment | 'All'
  difficulty?: Difficulty | 'All'
}

export async function getExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
  await delay()
  return exercises.filter((ex) => {
    if (filters.query && !ex.name.toLowerCase().includes(filters.query.toLowerCase())) return false
    if (filters.muscleGroup && filters.muscleGroup !== 'All' && ex.muscleGroup !== filters.muscleGroup) return false
    if (filters.equipment && filters.equipment !== 'All' && ex.equipment !== filters.equipment) return false
    if (filters.difficulty && filters.difficulty !== 'All' && ex.difficulty !== filters.difficulty) return false
    return true
  })
}
