import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { AnimatedHeading, MagneticButton, SpotlightCard, CountUp } from './effects'
import { RadialProgress } from '@/components/ui/Progress'

const liveTicks = [82, 84, 81, 86, 83, 85, 88, 84]

export function Hero() {
  const [tickIndex, setTickIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTickIndex((i) => (i + 1) % liveTicks.length), 2400)
    return () => clearInterval(id)
  }, [])

  const readiness = liveTicks[tickIndex]

  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="container-shell relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-emerald/5 px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            <span className="label-eyebrow">Training intelligence, live</span>
          </motion.div>

          <AnimatedHeading
            text="Your training, read like a system."
            className="font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 max-w-lg text-base text-ink-muted leading-relaxed sm:text-lg"
          >
            GymAI reads your readiness, load, and history the way an engineer reads a dashboard —
            then turns it into workouts built for the shape you're actually in today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3.5 font-semibold text-charcoal shadow-emerald transition-colors hover:bg-emerald-light"
              >
                Start training free <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-borderStrong px-6 py-3.5 font-medium text-ink hover:border-emerald/40 hover:bg-surface transition-colors"
            >
              I have an account
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 flex items-center gap-8"
          >
            <div>
              <p className="data-figure text-2xl font-semibold text-ink">
                <CountUp value={16} suffix="" />
              </p>
              <p className="text-xs text-ink-faint mt-0.5">exercises in library</p>
            </div>
            <div className="h-8 w-px bg-surface-border" />
            <div>
              <p className="data-figure text-2xl font-semibold text-ink">
                <CountUp value={87} suffix="%" />
              </p>
              <p className="text-xs text-ink-faint mt-0.5">avg. completion rate</p>
            </div>
          </motion.div>
        </div>

        {/* Signature moment: live-reading training console */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <SpotlightCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
                  Training Console
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl bg-surface-raised p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
                <RadialProgress value={readiness} size={64} strokeWidth={6} />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-ink-faint">Readiness</p>
                  <p className="text-sm font-medium text-ink mt-0.5">Primed to train</p>
                </div>
              </div>
              <div className="rounded-xl bg-surface-raised p-4 col-span-2 sm:col-span-1">
                <p className="text-[10px] uppercase tracking-wide text-ink-faint mb-2">Training Load</p>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="data-figure text-xl font-semibold text-ink">68</span>
                  <span className="text-xs text-ink-faint">/ 100</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-dark to-emerald-light" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-surface-border p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">Today</p>
                <span className="flex items-center gap-1 text-[10px] text-ink-faint">
                  <Flame size={11} className="text-emerald" /> 12 day streak
                </span>
              </div>
              <p className="font-medium text-ink text-sm">Push Day — Strength Focus</p>
              <p className="text-xs text-ink-faint mt-0.5">5 exercises · 55 min · Intermediate</p>
            </div>

            <div className="rounded-xl bg-emerald/5 border border-emerald/20 p-4 flex gap-3">
              <Sparkles size={15} className="text-emerald shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-ink mb-0.5">AI Insight</p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Readiness has stayed above 75 for four days — a good window to push intensity.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-ink-faint">
              <span className="flex items-center gap-1">
                <TrendingUp size={11} /> Volume +18% this month
              </span>
              <span>Updated just now</span>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  )
}
