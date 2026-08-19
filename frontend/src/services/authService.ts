import api from '@/lib/api'

import type {
  User,
  FitnessLevel,
  Goal,
  Equipment,
} from '@/types'

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ProfileUpdateData {
  full_name?: string
  avatar_url?: string | null
  fitness_level?: FitnessLevel
  goal?: Goal
  training_frequency?: number
  equipment?: Equipment[]
  profile_completed?: boolean
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    '/auth/register',
    {
      full_name: fullName,
      email,
      password,
    },
  )

  return data
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    '/auth/login',
    {
      email,
      password,
    },
  )

  return data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>(
    '/auth/me',
  )

  return data
}

export async function updateCurrentUser(
  payload: ProfileUpdateData,
): Promise<User> {
  const { data } = await api.put<User>(
    '/auth/me',
    payload,
  )

  return data
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await api.put(
    '/auth/change-password',
    {
      current_password: currentPassword,
      new_password: newPassword,
    },
  )
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
}