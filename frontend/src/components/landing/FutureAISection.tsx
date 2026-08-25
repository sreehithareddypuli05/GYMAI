import { Brain, Repeat, Target, MessagesSquare } from 'lucide-react'
import { ScrollReveal, SpotlightCard } from './effects'
import { Badge } from '@/components/ui/Badge'

const capabilities = [
  { icon: Brain, title: 'AI workout generation', body: 'Full programs generated from your goal, equipment, and history.' },
  { icon: Repeat, title: 'Adaptive workouts', body: 'Sessions that adjust mid-plan as your readiness and load shift.' },
  { icon: MessagesSquare, title: 'AI coach', body: 'A conversational coach grounded in your own training data via RAG.' },
  { icon: Target, title: 'Personalized recommendations', body: 'Exercise swaps and progressions tuned to what\u2019s working for you.' },
]

export function FutureAISection() {
  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal className="max-w-xl mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <p className="label-eyebrow">What's next</p>
            <Badge variant="emerald">In development</Badge>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
            The AI training operating system
          </h2>
          <p className="mt-4 text-ink-muted leading-relaxed">
            This release ships the training system. The next one plugs in the model.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 0.08}>
              <SpotlightCard className="p-5 h-full opacity-90">
                <c.icon size={18} className="text-emerald mb-4" />
                <p className="font-medium text-ink text-sm mb-1.5">{c.title}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{c.body}</p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
