import api from '@/lib/api'
import { exercises } from '@/data/exercises'

import type {
  Difficulty,
  Equipment,
  Exercise,
  FitnessLevel,
  Goal,
  User,
  Workout,
} from '@/types'

const delay = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export interface CompleteWorkoutPayload {
  workout_id: string
  workout_name: string
  focus: string
  duration_minutes: number
  exercise_count: number
}

const difficultyRank: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

function getDifficulty(level: FitnessLevel): Difficulty {
  return level
}

function getGoalMuscles(goal: Goal): string[] {
  switch (goal) {
    case 'Build Muscle':
      return ['Chest', 'Back', 'Legs', 'Shoulders']

    case 'Gain Strength':
      return ['Legs', 'Back', 'Chest', 'Shoulders']

    case 'Lose Fat':
      return ['Full Body', 'Legs', 'Core', 'Back']

    case 'Improve Endurance':
      return ['Full Body', 'Legs', 'Core', 'Shoulders']

    case 'General Fitness':
    default:
      return ['Full Body', 'Legs', 'Back', 'Chest', 'Core']
  }
}

function getFocus(goal: Goal): string {
  switch (goal) {
    case 'Build Muscle':
      return 'Muscle building'

    case 'Gain Strength':
      return 'Strength'

    case 'Lose Fat':
      return 'Full-body conditioning'

    case 'Improve Endurance':
      return 'Endurance'

    case 'General Fitness':
    default:
      return 'General fitness'
  }
}

function scoreExercise(
  exercise: Exercise,
  user: User,
): number {
  let score = 0

  const level = user.fitness_level
  const goal = user.goal

  if (
    level &&
    exercise.difficulty === level
  ) {
    score += 5
  }

  if (
    level &&
    difficultyRank[exercise.difficulty] <=
      difficultyRank[level]
  ) {
    score += 3
  }

  if (
    user.equipment?.includes(exercise.equipment)
  ) {
    score += 10
  }

  const preferredMuscles = goal
    ? getGoalMuscles(goal)
    : ['Full Body', 'Legs', 'Back', 'Chest', 'Core']

  if (
    preferredMuscles.includes(
      exercise.muscleGroup,
    )
  ) {
    score += 6
  }

  if (exercise.muscleGroup === 'Full Body') {
    score += 2
  }

  return score
}

function selectExercises(user: User): Exercise[] {
  const equipment = user.equipment ?? []

  const usableExercises = exercises.filter(
    (exercise) =>
      equipment.includes(exercise.equipment),
  )

  /*
   * If the user has not selected equipment,
   * only bodyweight exercises are safe to use.
   */
  const available =
    usableExercises.length > 0
      ? usableExercises
      : exercises.filter(
          (exercise) =>
            exercise.equipment === 'Bodyweight',
        )

  const ranked = [...available].sort(
    (a, b) =>
      scoreExercise(b, user) -
      scoreExercise(a, user),
  )

  const selected: Exercise[] = []
  const usedMuscles = new Set<string>()

  /*
   * Try to avoid giving the user five exercises
   * targeting exactly the same muscle group.
   */
  for (const exercise of ranked) {
    if (
      selected.length >= 5
    ) {
      break
    }

    if (
      !usedMuscles.has(
        exercise.muscleGroup,
      )
    ) {
      selected.push(exercise)
      usedMuscles.add(
        exercise.muscleGroup,
      )
    }
  }

  /*
   * Fill remaining slots if we couldn't get
   * five different muscle groups.
   */
  for (const exercise of ranked) {
    if (
      selected.length >= 5
    ) {
      break
    }

    if (
      !selected.some(
        (item) => item.id === exercise.id,
      )
    ) {
      selected.push(exercise)
    }
  }

  return selected
}

function buildWorkout(user: User): Workout | null {
  if (
    !user.profile_completed ||
    !user.fitness_level ||
    !user.goal ||
    !user.equipment?.length
  ) {
    return null
  }

  const selected = selectExercises(user)

  if (!selected.length) {
    return null
  }

  const difficulty = getDifficulty(
    user.fitness_level,
  )

  const durationMinutes =
    selected.length * 7

  return {
    id: `profile-${user.id}-${user.goal}-${user.fitness_level}`,
    name: 'Personalized Training',
    focus: getFocus(user.goal),
    durationMinutes,
    difficulty,
    exercises: selected.map(
      (exercise) => ({
        ...exercise,
        completed: false,
      }),
    ),
  }
}

export async function getTodayWorkout(
  user: User | null,
): Promise<Workout | null> {
  await delay()

  if (!user) {
    return null
  }

  return buildWorkout(user)
}

export async function getUpcomingWorkouts(): Promise<Workout[]> {
  return []
}

export async function completeWorkout(
  payload: CompleteWorkoutPayload,
) {
  const { data } =
    await api.post(
      '/workouts/complete',
      payload,
    )

  return data
}