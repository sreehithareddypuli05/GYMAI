import { useEffect, useState } from 'react'
import { Activity, Flame, Timer, Trophy, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardMetric } from '@/components/gymai/DashboardMetric'
import { DashboardActivity } from '@/components/gymai/DashboardActivity'
import { DashboardWorkout } from '@/components/gymai/DashboardWorkout'
import { RecentWorkouts } from '@/components/gymai/RecentWorkouts'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useAuth } from '@/context/AuthContext'
import { getDashboard, type DashboardData } from '@/services/dashboardService'
import { getTodayWorkout } from '@/services/workoutService'
import type { Workout } from '@/types'

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function loadDashboard() {
      try {
        setLoading(true); setError(null)
        const [dashboardData, workout] = await Promise.all([getDashboard(), getTodayWorkout(user)])
        if (!active) return 
        setDashboard(dashboardData); setTodayWorkout(workout)
      } catch {
        if (active) setError('We could not load your training dashboard.')
      } finally { if (active) setLoading(false) }
    }
    //loads dashboard
    loadDashboard()
    return () => { active = false }
  }, [user])

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  if (loading) return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-5"><SkeletonCard /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div></div>
    </AppShell>
  )

  if (error || !dashboard) return (
    <AppShell>
      <div className="mx-auto max-w-7xl border-l-2 border-danger bg-surface p-6"><p className="text-sm text-danger">{error || 'Unable to load dashboard.'}</p></div>
    </AppShell>
  )

  const hasActivity = dashboard.total_workouts > 0
  const goal = user?.goal || 'General Fitness'
  const level = user?.fitness_level || 'Beginner'
  const equipment = user?.equipment?.length ? user.equipment.join(' · ') : 'No equipment'

  return (
    //full dashboard page
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 border-b border-surface-border pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-eyebrow">GymAI / Training command</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">Good to see you, {firstName}.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">Your plan adapts around your goal, experience and equipment. Today is about showing up and moving with intent.</p>
          </div>
          <Link to="/profile" className="inline-flex items-center gap-2 self-start border border-surface-borderStrong bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-emerald/50 hover:text-emerald lg:self-auto">Edit training profile <Target size={14} /></Link>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="border border-surface-border bg-surface p-5"><p className="label-eyebrow">Goal</p><p className="mt-3 font-display text-xl font-semibold text-ink">{goal}</p></div>
          <div className="border border-surface-border bg-surface p-5"><p className="label-eyebrow">Training level</p><p className="mt-3 font-display text-xl font-semibold text-ink">{level}</p></div>
          <div className="border border-surface-border bg-surface p-5"><p className="label-eyebrow">Equipment</p><p className="mt-3 font-display text-xl font-semibold text-ink">{equipment}</p></div>
        </section>

        <DashboardWorkout workout={todayWorkout} />

        <section>
          <div className="mb-4 flex items-end justify-between"><div><p className="label-eyebrow">Training pulse</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">Your numbers</h2></div><span className="text-xs text-ink-faint">Updated from your saved sessions</span></div>
          <div className="grid grid-cols-1 divide-y divide-surface-border border-y border-surface-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
            <DashboardMetric label="Current streak" value={`${dashboard.current_streak} days`} description={dashboard.current_streak ? 'Consecutive training days.' : 'Complete a session to start.'} icon={<Flame size={17} />} />
            <DashboardMetric label="This week" value={dashboard.workouts_this_week} description="Completed workout sessions." icon={<Activity size={17} />} />
            <DashboardMetric label="Training time" value={`${dashboard.minutes_this_week}m`} description="Completed minutes this week." icon={<Timer size={17} />} />
            <DashboardMetric label="Longest streak" value={`${dashboard.longest_streak} days`} description="Your best training run." icon={<Trophy size={17} />} />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-4"><p className="label-eyebrow">Training signal</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">Activity this week</h2></div>
            <div className="border border-surface-border bg-surface p-5 sm:p-6"><DashboardActivity activity={dashboard.activity} /></div>
          </div>
          <RecentWorkouts workouts={dashboard.recent_workouts} />
        </section>

        {!hasActivity && (
          <section className="relative overflow-hidden border border-emerald/30 bg-emerald/[0.05] p-6 sm:p-8">
            <div className="absolute -right-10 -top-20 text-emerald/10"><Zap size={220} /></div>
            <div className="relative max-w-2xl"><p className="label-eyebrow">Your next milestone</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">Finish your first session.</h2><p className="mt-2 text-sm leading-6 text-ink-muted">Once you complete a workout, GymAI can start turning your sessions into meaningful progress signals.</p><Link to="/workout" className="mt-5 inline-flex bg-emerald px-5 py-3 text-sm font-semibold text-charcoal hover:bg-emerald-light">Start training</Link></div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
