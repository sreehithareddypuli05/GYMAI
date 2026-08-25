export interface User {
  id: string
  full_name: string
  email: string

  avatar_url?: string | null

  fitness_level?: FitnessLevel | null

  goal?: Goal | null

  training_frequency?: number | null

  equipment?: Equipment[] | null

  age?: number | null

  height_cm?: number | null

  weight_kg?: number | null

  profile_completed?: boolean

  created_at?: string
}

export type FitnessLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'

export type Goal =
  | 'Build Muscle'
  | 'Lose Fat'
  | 'Gain Strength'
  | 'Improve Endurance'
  | 'General Fitness'

export type Difficulty =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body'

export type Equipment =
  | 'None'
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Bodyweight'
  | 'Cable'
  | 'Kettlebell'
  | 'Bands'
  | 'Full Gym'

export interface Exercise {
  id: string
  slug: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  sets: number
  reps: string
  restSeconds: number
  description: string
  cues: string[]
  commonMistakes: string[]
  goalTags: string[]
  imageUrl: string
  imageUrls?: string[]
  poseSupported: boolean
  poseType?: string | null
}

export interface WorkoutExercise extends Exercise {
  completed?: boolean
  completedSets?: number
  poseReps?: number
  poseFormScore?: number
}

export interface Workout {
  id: string
  name: string
  focus: string
  durationMinutes: number
  difficulty: Difficulty
  exercises: WorkoutExercise[]
  scheduledFor?: string
}

export interface ProgressPoint {
  label: string
  value: number
}

export interface HistoryEntry {
  id: string
  workoutName: string
  date: string
  durationMinutes: number
  exerciseCount: number
  completion: number
  focus?: string | null
  totalSets?: number
  completedSets?: number
  formScore?: number | null
}

export interface AIInsight {
  id: string
  title: string
  body: string
  tag:
    | 'Recovery'
    | 'Programming'
    | 'Performance'
    | 'Nutrition'
}

export interface UserProfile {
  fitnessLevel: FitnessLevel
  goal: Goal
  trainingFrequency: number
  equipment: Equipment[]
}