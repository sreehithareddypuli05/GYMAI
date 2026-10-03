import {
  useEffect,
  useState,
} from 'react'

import {
  TrendingUp,
  Repeat,
  CheckCircle2,
  Flame,
  Clock3,
  Dumbbell,
  Camera,
} from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'

import { StatCard } from '@/components/gymai/StatCard'
import { ProgressCard } from '@/components/gymai/ProgressCard'
import { DistributionCard } from '@/components/gymai/DistributionCard'

import { SkeletonCard } from '@/components/ui/Skeleton'

import {
  getProgressSnapshot,
} from '@/services/progressService'


type Snapshot =
  Awaited<
    ReturnType<
      typeof getProgressSnapshot
    >
  >


export default function ProgressPage() {
  const [data, setData] =
    useState<Snapshot | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {
    let active = true

    async function loadProgress() {
      try {
        setLoading(true)
        setError(null)

        const progress =
          await getProgressSnapshot()

        if (!active) return

        setData(progress)
      } catch {
        if (!active) return

        setError(
          'We could not load your progress data.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProgress()

    return () => {
      active = false
    }
  }, [])


  if (loading) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Analytics"
          title="Progress"
          description="Loading your training progress."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <SkeletonCard
              key={index}
            />
          ))}
        </div>
      </AppShell>
    )
  }


  if (error || !data) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Analytics"
          title="Progress"
          description="Track your real training activity and consistency."
        />

        <div className="border border-danger/30 bg-danger/5 p-6">
          <p className="text-sm text-danger">
            {error ||
              'Unable to load progress data.'}
          </p>
        </div>
      </AppShell>
    )
  }


  return (
    <AppShell>
      <PageHeader
        eyebrow="Analytics"
        title="Progress"
        description="See how your workouts, consistency, and training focus change over time."
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Completion rate"
          value={data.completionRate}
          suffix="%"
          icon={
            <CheckCircle2
              size={16}
            />
          }
        />

        <StatCard
          label="Current streak"
          value={data.currentStreak}
          suffix=" days"
          icon={
            <Flame
              size={16}
            />
          }
        />

        <StatCard
          label="Longest streak"
          value={data.longestStreak}
          suffix=" days"
          icon={
            <TrendingUp
              size={16}
            />
          }
        />

        <StatCard label="Average sessions / week" value={data.sessionsPerWeek} icon={<Repeat size={16} />} />

        <StatCard label="Total training time" value={data.totalMinutes} suffix=" min" icon={<Clock3 size={16} />} />

        <StatCard label="Sets completed" value={data.completedSets} suffix={` / ${data.totalSets}`} icon={<Dumbbell size={16} />} />

        <StatCard label="Average AI form" value={data.averageFormScore ?? '—'} suffix={data.averageFormScore != null ? '%' : ''} icon={<Camera size={16} />} />

      </div>


      <section className="streak-board mb-6">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="label-eyebrow">Streak health</p><h2 className="mt-1 font-display text-2xl font-bold text-ink">Keep the chain moving</h2><p className="mt-1 text-sm text-ink-muted">Today is complete when you finish at least one workout session.</p></div>
          <div className="flex items-center gap-3"><Flame className="streak-fire text-orange" size={34} fill="currentColor" /><div><p className="font-mono text-2xl font-bold text-ink">{data.currentStreak} days</p><p className="text-[10px] uppercase tracking-wider text-ink-faint">current streak</p></div></div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        <ProgressCard
          title="Training time"
          description="Minutes completed during each of the last eight weeks."
          data={data.volumeByWeek}
          unit=" min"
        />

        <ProgressCard
          title="Workout frequency"
          description="Number of completed workout sessions each week."
          data={data.frequencyByWeek}
          unit=" sessions"
        />

        <ProgressCard
          title="Training consistency"
          description="Your weekly workout completion activity."
          data={data.strengthProgression}
          unit="%"
        />

        <DistributionCard title="Workout focus distribution" description="How your completed workouts are distributed by training focus." data={data.muscleDistribution} />

        <ProgressCard title="Sets completed" description="Completed sets recorded from your workout sessions." data={data.setsByWeek} unit=" sets" />

        <ProgressCard title="AI form quality" description="Average form score from your supported Beginner pose sessions." data={data.formByWeek} unit="%" />

      </div>
    </AppShell>
  )
}