import api from '@/lib/api'

export interface MarathonEvent {
  id: string
  name: string
  description: string
  location: string
  event_date: string
  distance: string
  registration_deadline: string | null
  registration_url: string | null
  image_url: string | null
  created_at: string
}

export interface MarathonReminder {
  id: string
  user_id: string
  marathon_id: string
  status: string
  created_at: string
}

export interface MarathonNotification {
  id: string
  user_id: string
  marathon_id: string | null
  title: string
  message: string
  notification_type: string
  is_read: boolean
  created_at: string
}

export async function getUpcomingMarathons(): Promise<MarathonEvent[]> {
  const { data } = await api.get<MarathonEvent[]>('/marathons')
  return data
}

export async function createMarathonReminder(marathonId: string): Promise<MarathonReminder> {
  const { data } = await api.post<MarathonReminder>(`/marathons/${marathonId}/reminder`)
  return data
}

export async function removeMarathonReminder(marathonId: string): Promise<void> {
  await api.delete(`/marathons/${marathonId}/reminder`)
}

export async function getMarathonReminderStatus(marathonId: string): Promise<MarathonReminder | null> {
  const { data } = await api.get<MarathonReminder | null>(`/marathons/${marathonId}/reminder`)
  return data
}

export async function getMarathonNotifications(marathonId: string): Promise<MarathonNotification[]> {
  const { data } = await api.get<MarathonNotification[]>(`/marathons/${marathonId}/notifications`)
  return data
}

export async function markMarathonNotificationRead(marathonId: string): Promise<MarathonNotification> {
  const { data } = await api.post<MarathonNotification>(`/marathons/${marathonId}/notifications/mark-read`)
  return data
}

export async function getUserMarathonNotifications(): Promise<MarathonNotification[]> {
  const marathons = await getUpcomingMarathons()

  const allNotifications = await Promise.all(
    marathons.map(async (marathon) => {
      try {
        const notifications = await getMarathonNotifications(marathon.id)
        return notifications
      } catch {
        return []
      }
    }),
  )

  return allNotifications
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
