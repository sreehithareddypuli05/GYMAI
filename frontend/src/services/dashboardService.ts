import api from '@/lib/api'

export interface DashboardActivityPoint {
  label: string
  sessions: number
  minutes: number
}

export interface DashboardWorkout {
  id: string
  workout_id: string
  workout_name: string
  focus: string | null
  duration_minutes: number
  exercise_count: number
  completed_at: string
}

export interface DashboardData {
  current_streak: number
  longest_streak: number
  workouts_this_week: number
  total_workouts: number
  minutes_this_week: number
  activity: DashboardActivityPoint[]
  recent_workouts: DashboardWorkout[]
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/dashboard')

  return data
}