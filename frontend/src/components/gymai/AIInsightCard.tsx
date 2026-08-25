import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import type { AIInsight } from '@/types'

export function AIInsightCard({
  insight,
}: {
  insight: AIInsight
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden border border-emerald/20 bg-surface"
    >
      {/* ambient AI glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />

      <div className="relative p-5 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center border border-emerald/20 bg-emerald/10 text-emerald">
              <BrainCircuit size={18} />
            </div>

            <div>
              <p className="label-eyebrow flex items-center gap-1.5">
                <Sparkles size={11} />
                GymAI insight
              </p>

              <p className="mt-1 text-[10px] text-ink-faint">
                Based on your recent training
              </p>
            </div>

          </div>

          <Badge variant="emerald">
            {insight.tag}
          </Badge>

        </div>

        <div className="mt-5">

          <h3 className="font-display text-lg font-semibold text-ink">
            {insight.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {insight.body}
          </p>

        </div>

        <div className="mt-5 border-t border-surface-border pt-4">

          <Link
            to="/progress"
            className="group inline-flex items-center gap-2 text-xs font-medium text-emerald transition-colors hover:text-emerald-light"
          >
            See training analysis

            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>
    </motion.div>
  )
}