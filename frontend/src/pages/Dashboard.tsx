import { useEffect, useState } from 'react'
import {
  Activity,
  Flame,
  Timer,
  Trophy,
} from 'lucide-react'
import { motion } from 'framer-motion'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'

import { DashboardMetric } from '@/components/gymai/DashboardMetric'
import { DashboardActivity } from '@/components/gymai/DashboardActivity'
import { DashboardWorkout } from '@/components/gymai/DashboardWorkout'
import { RecentWorkouts } from '@/components/gymai/RecentWorkouts'

import { SkeletonCard } from '@/components/ui/Skeleton'

import { useAuth } from '@/context/AuthContext'

import {
  getDashboard,
  type DashboardData,
} from '@/services/dashboardService'

import {
  getTodayWorkout,
} from '@/services/workoutService'

import type { Workout } from '@/types'


export default function Dashboard() {
  const { user } = useAuth()

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null)

  const [todayWorkout, setTodayWorkout] =
    useState<Workout | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const [
          dashboardData,
          workout,
        ] = await Promise.all([
          getDashboard(),
          getTodayWorkout(user),
        ])

        if (!active) return

        setDashboard(dashboardData)
        setTodayWorkout(workout)
      } catch {
        if (!active) return

        setError(
          'We could not load your training dashboard.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])


  const firstName =
    user?.full_name?.split(' ')[0] || 'there'


  if (loading) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Dashboard"
          title="Your training, at a glance."
          description="Loading your latest training activity."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    )
  }


  if (error || !dashboard) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Dashboard"
          title={`Welcome back, ${firstName}.`}
          description="Your training dashboard is temporarily unavailable."
        />

        <div className="border border-danger/30 bg-danger/5 p-6">
          <p className="text-sm text-danger">
            {error || 'Unable to load dashboard.'}
          </p>
        </div>
      </AppShell>
    )
  }


  const hasActivity =
    dashboard.total_workouts > 0


  return (
    <AppShell>
      <PageHeader
        eyebrow="Dashboard"
        title={`Good to see you, ${firstName}.`}
        description={
          hasActivity
            ? 'Here is what your training is looking like.'
            : 'Your training journey starts with your first session.'
        }
      />

      <div className="mx-auto w-full max-w-7xl">

        {/* -------------------------------- */}
        {/* Welcome / profile context        */}
        {/* -------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6"
        >
          {!hasActivity ? (
            <div className="border border-emerald/20 bg-emerald/[0.04] p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Welcome to GymAI.
                  </p>

                  <p className="mt-1 text-sm text-ink-muted">
                    Complete your first workout and
                    your dashboard will start learning
                    from your training.
                  </p>
                </div>

                <span className="text-xs font-medium text-emerald">
                  0 workouts recorded
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div>
                <p className="text-sm font-medium text-ink">
                  Your training journey
                </p>

                <p className="mt-1 text-xs text-ink-faint">
                  {dashboard.total_workouts} completed sessions
                </p>
              </div>

              <div className="text-right">
                <p className="data-figure text-lg font-semibold text-ink">
                  {dashboard.minutes_this_week}
                </p>

                <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                  min this week
                </p>
              </div>
            </div>
          )}
        </motion.div>


        {/* -------------------------------- */}
        {/* Today's workout                  */}
        {/* -------------------------------- */}

        <div className="mb-6">
          <DashboardWorkout
            workout={todayWorkout}
          />
        </div>


        {/* -------------------------------- */}
        {/* Real user metrics                */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardMetric
            label="Current streak"
            value={`${dashboard.current_streak} days`}
            description={
              dashboard.current_streak === 0
                ? 'Complete a workout to start your streak.'
                : 'Consecutive training days.'
            }
            icon={<Flame size={18} />}
          />

          <DashboardMetric
            label="This week"
            value={dashboard.workouts_this_week}
            description="Completed workout sessions this week."
            icon={<Activity size={18} />}
          />

          <DashboardMetric
            label="Training time"
            value={`${dashboard.minutes_this_week}m`}
            description="Total completed training minutes this week."
            icon={<Timer size={18} />}
          />

          <DashboardMetric
            label="Longest streak"
            value={`${dashboard.longest_streak} days`}
            description={
              dashboard.longest_streak === 0
                ? 'Your first streak is waiting.'
                : 'Your best consecutive training run.'
            }
            icon={<Trophy size={18} />}
          />

        </div>


        {/* -------------------------------- */}
        {/* Activity + recent history        */}
        {/* -------------------------------- */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">

          <div className="lg:col-span-3">
            <DashboardActivity
              activity={dashboard.activity}
            />
          </div>

          <div className="lg:col-span-2">
            <RecentWorkouts
              workouts={dashboard.recent_workouts}
            />
          </div>

        </div>

      </div>
    </AppShell>
  )
}