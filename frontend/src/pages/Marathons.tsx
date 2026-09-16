import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Trophy, ExternalLink, Clock3 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { createMarathonReminder, getMarathonReminderStatus, getUpcomingMarathons, removeMarathonReminder, type MarathonEvent } from '@/services/marathonService'

function formatDate(value: string | null): string {
  if (!value) return 'TBD'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'TBD'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function Marathons() {
  const [events, setEvents] = useState<MarathonEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reminderState, setReminderState] = useState<Record<string, boolean>>({})
  const [reminderLoading, setReminderLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let active = true

    getUpcomingMarathons()
      .then(async (res) => {
        if (!active) return
        setEvents(res)

        const reminderEntries = await Promise.all(
          res.map(async (event) => {
            const reminder = await getMarathonReminderStatus(event.id)
            return [event.id, Boolean(reminder)] as const
          }),
        )

        if (!active) return
        setReminderState(Object.fromEntries(reminderEntries))
      })
      .catch(() => {
        if (!active) return
        setError('We could not load the upcoming marathon events.')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const toggleReminder = async (eventId: string, hasReminder: boolean) => {
    setReminderLoading((previous) => ({ ...previous, [eventId]: true }))

    try {
      if (hasReminder) {
        await removeMarathonReminder(eventId)
      } else {
        await createMarathonReminder(eventId)
      }

      setReminderState((previous) => ({ ...previous, [eventId]: !hasReminder }))
    } catch {
      setError('We could not update your marathon reminder.')
    } finally {
      setReminderLoading((previous) => ({ ...previous, [eventId]: false }))
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Running"
        title="Marathons & Running Events"
        description="Explore upcoming races and events to keep your training plans aligned with real-world goals."
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card-surface p-12 text-center">
          <p className="mb-1 font-medium text-ink">Unable to load marathon events</p>
          <p className="text-sm text-ink-faint">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <p className="mb-1 font-medium text-ink">No upcoming marathons</p>
          <p className="text-sm text-ink-faint">Check back soon for future race events.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="card-surface overflow-hidden">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.name}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="label-eyebrow mb-1">Race event</p>
                    <h2 className="text-xl font-semibold text-ink">{event.name}</h2>
                  </div>
                  <div className="rounded-full border border-emerald/20 bg-emerald/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-emerald">
                    {event.distance}
                  </div>
                </div>

                <p className="text-sm leading-6 text-ink-muted">{event.description}</p>

                <div className="space-y-2 text-sm text-ink-muted">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-emerald" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} className="text-emerald" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  {event.registration_deadline && (
                    <div className="flex items-center gap-2">
                      <Clock3 size={15} className="text-emerald" />
                      <span>Registration deadline: {formatDate(event.registration_deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 px-3.5 py-2 text-sm font-medium text-emerald transition-colors hover:bg-emerald/15"
                    >
                      <Trophy size={15} />
                      Register now
                      <ExternalLink size={14} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleReminder(event.id, Boolean(reminderState[event.id]))}
                    disabled={Boolean(reminderLoading[event.id])}
                    className={
                      reminderState[event.id]
                        ? 'inline-flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 px-3.5 py-2 text-sm font-medium text-emerald transition-colors hover:bg-emerald/15 disabled:cursor-not-allowed disabled:opacity-70'
                        : 'inline-flex items-center gap-2 rounded-xl border border-surface-borderStrong bg-surface px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-emerald/40 hover:text-emerald disabled:cursor-not-allowed disabled:opacity-70'
                    }
                  >
                    {reminderLoading[event.id] ? 'Updating…' : reminderState[event.id] ? 'Reminder Set' : 'Remind Me'}
                  </button>

                  {reminderState[event.id] && (
                    <button
                      type="button"
                      onClick={() => toggleReminder(event.id, true)}
                      disabled={Boolean(reminderLoading[event.id])}
                      className="inline-flex items-center gap-2 rounded-xl border border-surface-borderStrong bg-transparent px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Remove reminder
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  )
}
