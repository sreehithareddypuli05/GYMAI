import api from '@/lib/api'

export interface PoseSessionPayload {
  exercise_id: string
  exercise_name: string
  pose_type: string
  reps: number
  form_score: number
  feedback: string
}

export async function savePoseSession(payload: PoseSessionPayload) {
  const { data } = await api.post('/workouts/pose-session', payload)
  return data
}
