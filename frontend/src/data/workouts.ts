import type { Workout } from '@/types'
import { exercises } from './exercises'

const byId = (id: string) => exercises.find((e) => e.id === id)!

export const todayWorkout: Workout = {
  id: 'w-today',
  name: 'Push Day — Strength Focus',
  focus: 'Chest, Shoulders, Triceps',
  durationMinutes: 55,
  difficulty: 'Intermediate',
  scheduledFor: 'Today',
  exercises: [
    { ...byId('ex-2') },
    { ...byId('ex-5') },
    { ...byId('ex-9') },
    { ...byId('ex-12') },
    { ...byId('ex-15') },
  ],
}

export const upcomingWorkouts: Workout[] = [
  {
    id: 'w-2',
    name: 'Pull Day — Hypertrophy',
    focus: 'Back, Biceps',
    durationMinutes: 50,
    difficulty: 'Intermediate',
    scheduledFor: 'Tomorrow',
    exercises: [byId('ex-3'), byId('ex-4'), byId('ex-7')],
  },
  {
    id: 'w-3',
    name: 'Leg Day — Power',
    focus: 'Quads, Glutes, Hamstrings',
    durationMinutes: 60,
    difficulty: 'Advanced',
    scheduledFor: 'Thursday',
    exercises: [byId('ex-1'), byId('ex-6'), byId('ex-8'), byId('ex-13'), byId('ex-16')],
  },
  {
    id: 'w-4',
    name: 'Conditioning + Core',
    focus: 'Full Body',
    durationMinutes: 35,
    difficulty: 'Beginner',
    scheduledFor: 'Saturday',
    exercises: [byId('ex-11'), byId('ex-10'), byId('ex-14')],
  },
]
