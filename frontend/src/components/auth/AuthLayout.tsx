import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function AuthLayout({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: ReactNode
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="min-h-screen bg-charcoal bg-grid-lines bg-[length:32px_32px] flex">

      {/* LEFT: PRODUCT VISUAL PANEL */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r border-surface-border bg-surface/40 p-10 lg:flex">

        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

        {/* Subtle emerald glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/5 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* LOGO */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
            <Activity size={16} />
          </div>

          <span className="font-display text-lg font-semibold text-ink">
            GymAI
          </span>
        </Link>

        {/* MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h2 className="mb-10 max-w-sm font-display text-3xl font-semibold leading-tight text-ink">
            Every session adds a data point. GymAI turns them into a plan.
          </h2>

          {/* ANIMATED TRAINING VISUAL */}
          <motion.div
            className="relative h-40 max-w-sm overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            {/* Horizontal signal line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-emerald/20" />

            {/* Secondary lines */}
            <div className="absolute left-0 right-0 top-[35%] h-px bg-emerald/5" />
            <div className="absolute left-0 right-0 top-[65%] h-px bg-emerald/5" />

            {/* Animated pulse */}
            <motion.div
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald shadow-[0_0_20px_rgba(16,185,129,0.8)]"
              animate={{
                left: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Data points */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.div
                  key={item}
                  className="h-1.5 w-1.5 rounded-full bg-emerald"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.25, 1, 0.25],
                  }}
                  transition={{
                    duration: 2,
                    delay: item * 0.25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Vertical scanning line */}
            <motion.div
              className="absolute top-0 bottom-6 w-px bg-gradient-to-b from-transparent via-emerald/40 to-transparent"
              animate={{
                left: ['0%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Small data labels */}
            <div className="absolute bottom-2 left-0 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              Training intelligence
            </div>

            <div className="absolute bottom-2 right-0 font-mono text-[9px] text-ink-faint">
              LIVE
            </div>
          </motion.div>
        </motion.div>

        {/* FOOTER */}
        <p className="relative z-10 font-mono text-[11px] text-ink-faint">
          GymAI · Training Operating System
        </p>
      </div>

      {/* RIGHT: LOGIN / AUTH FORM */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 sm:px-10">

        <div className="w-full max-w-sm">

          {/* MOBILE LOGO */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15 text-emerald">
              <Activity size={16} />
            </div>

            <span className="font-display text-lg font-semibold text-ink">
              GymAI
            </span>
          </div>

          {/* AUTH HEADING */}
          <p className="label-eyebrow mb-2">
            {eyebrow}
          </p>

          <h1 className="mb-2 font-display text-2xl font-semibold text-ink">
            {title}
          </h1>

          <p className="mb-8 text-sm text-ink-muted">
            {subtitle}
          </p>

          {/* LOGIN / REGISTER CONTENT */}
          {children}

        </div>
      </div>

    </div>
  )
}