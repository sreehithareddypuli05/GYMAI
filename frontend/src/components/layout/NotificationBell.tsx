import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, Clock3, Loader2 } from 'lucide-react'
import { getUserMarathonNotifications, markMarathonNotificationRead, type MarathonNotification } from '@/services/marathonService'

function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<MarathonNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getUserMarathonNotifications()
      setNotifications(data)
    } catch {
      setError('Could not load your notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications().catch(() => undefined)
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  )

  const handleMarkRead = async (notification: MarathonNotification) => {
    if (!notification.marathon_id) {
      return
    }

    setMarkingId(notification.id)

    try {
      const updated = await markMarathonNotificationRead(notification.marathon_id)
      setNotifications((previous) =>
        previous.map((item) =>
          item.id === updated.id ? { ...item, is_read: updated.is_read } : item,
        ),
      )
    } catch {
      setError('Could not update the notification.')
    } finally {
      setMarkingId(null)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-surface-borderStrong bg-surface text-ink-muted transition-colors hover:border-emerald/40 hover:text-emerald"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald px-1 text-[9px] font-semibold text-charcoal">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.12 } }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-surface-borderStrong bg-charcoal/95 p-2 shadow-card backdrop-blur"
          >
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              {unreadCount > 0 && <span className="text-[10px] uppercase tracking-wide text-emerald">{unreadCount} unread</span>}
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-ink-muted">
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </div>
            ) : error ? (
              <div className="px-3 py-4 text-sm text-danger">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-ink-muted">No notifications yet.</div>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-xl border p-3 ${notification.is_read ? 'border-surface-border bg-surface' : 'border-emerald/30 bg-emerald/5'}`}
                  >
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{notification.title}</p>
                        <p className="mt-1 text-xs text-ink-faint">{formatDateTime(notification.created_at)}</p>
                      </div>

                      {!notification.is_read && (
                        <span className="mt-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-emerald" aria-label="Unread notification" />
                      )}
                    </div>

                    <p className="text-sm leading-5 text-ink-muted">{notification.message}</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-ink-faint">
                        <Clock3 size={10} />
                        {notification.is_read ? 'Read' : 'Unread'}
                      </span>

                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(notification)}
                          disabled={markingId === notification.id || !notification.marathon_id}
                          className="inline-flex items-center gap-1 rounded-lg border border-surface-borderStrong bg-surface px-2 py-1 text-[11px] font-medium text-ink transition-colors hover:border-emerald/40 hover:text-emerald disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {markingId === notification.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
