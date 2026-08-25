import api from '@/lib/api'
import type { Exercise, User, Workout } from '@/types'

export interface CompletedExercisePayload {
  exercise_id: string
  name: string
  planned_sets: number
  completed_sets: number
  planned_reps: string
  completed: boolean
}

export interface CompleteWorkoutPayload {
  workout_id: string
  workout_name: string
  focus: string
  duration_minutes: number
  exercise_count: number
  total_sets: number
  completed_sets: number
  completed_exercises: CompletedExercisePayload[]
}

interface WorkoutExerciseApi {
  id: string
  slug: string
  name: string
  muscle_group: Exercise['muscleGroup']
  equipment: Exercise['equipment']
  difficulty: Exercise['difficulty']
  sets: number
  reps: string
  rest_seconds: number
  description: string
  cues: string[]
  common_mistakes: string[]
  goal_tags: string[]
  image_url: string
  image_urls?: string[]
  pose_supported: boolean
  pose_type?: string | null
}

interface WorkoutApi {
  id: string
  name: string
  focus: string
  duration_minutes: number
  difficulty: Workout['difficulty']
  exercises: WorkoutExerciseApi[]
}

const mapExercise = (x: WorkoutExerciseApi): Exercise => ({
  id: x.id,
  slug: x.slug,
  name: x.name,
  muscleGroup: x.muscle_group,
  equipment: x.equipment,
  difficulty: x.difficulty,
  sets: x.sets,
  reps: x.reps,
  restSeconds: x.rest_seconds,
  description: x.description,
  cues: x.cues,
  commonMistakes: x.common_mistakes,
  goalTags: x.goal_tags,
  imageUrl: x.image_url,
  imageUrls: x.image_urls ?? [x.image_url],
  poseSupported: x.pose_supported,
  poseType: x.pose_type,
})

export async function getTodayWorkout(_user: User | null): Promise<Workout | null> {
  try {
    const { data } = await api.get<WorkoutApi>('/workouts/today')
    return {
      id: data.id,
      name: data.name,
      focus: data.focus,
      durationMinutes: data.duration_minutes,
      difficulty: data.difficulty,
      exercises: data.exercises.map((exercise) => ({
        ...mapExercise(exercise),
        completed: false,
        completedSets: 0,
      })),
    }
  } catch (error: any) {
    if (error?.response?.status === 422) return null
    throw error
  }
}

export async function completeWorkout(payload: CompleteWorkoutPayload) {
  const { data } = await api.post('/workouts/complete', payload)
  return data
}
