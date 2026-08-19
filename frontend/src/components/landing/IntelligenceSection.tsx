import { Activity, Gauge, Sparkles } from 'lucide-react'
import { ScrollReveal, SpotlightCard } from './effects'

const pillars = [
  {
    icon: Activity,
    title: 'Readiness, tracked daily',
    body: 'A running read on recovery built from your recent sessions — so intensity decisions aren\u2019t a guess.',
  },
  {
    icon: Gauge,
    title: 'Load, kept in range',
    body: 'Acute-to-chronic training load is tracked in the background, flagging when volume is climbing too fast.',
  },
  {
    icon: Sparkles,
    title: 'Insights, in plain language',
    body: 'Plateaus, trends, and recovery windows surface as short, specific notes — not a wall of charts.',
  },
]

export function IntelligenceSection() {
  return (
    <section id="intelligence" className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal className="max-w-xl mb-14">
          <p className="label-eyebrow mb-3">Training intelligence</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
            The system behind every workout
          </h2>
          <p className="mt-4 text-ink-muted leading-relaxed">
            GymAI keeps a continuous read on how you're actually recovering and adapting —
            the same signals a coach would track, computed automatically.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.1}>
              <SpotlightCard className="p-6 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald mb-5">
                  <p.icon size={19} />
                </div>
                <h3 className="font-medium text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
