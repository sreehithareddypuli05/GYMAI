import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { ScrollReveal, SpotlightCard } from './effects'
import { Badge } from '@/components/ui/Badge'

const goals = ['Build Muscle', 'Lose Fat', 'Gain Strength', 'Endurance'] as const
const experience = ['Beginner', 'Intermediate', 'Advanced'] as const

const splitPreview: Record<string, { day: string; focus: string }[]> = {
  'Build Muscle': [
    { day: 'Mon', focus: 'Push — Chest / Shoulders' },
    { day: 'Wed', focus: 'Pull — Back / Biceps' },
    { day: 'Fri', focus: 'Legs — Quads / Hams' },
  ],
  'Lose Fat': [
    { day: 'Mon', focus: 'Full Body + Conditioning' },
    { day: 'Wed', focus: 'Upper Body Circuit' },
    { day: 'Fri', focus: 'Lower Body + HIIT' },
  ],
  'Gain Strength': [
    { day: 'Mon', focus: 'Squat Focus + Accessories' },
    { day: 'Wed', focus: 'Bench Focus + Accessories' },
    { day: 'Fri', focus: 'Deadlift Focus + Accessories' },
  ],
  Endurance: [
    { day: 'Mon', focus: 'Tempo Full Body' },
    { day: 'Wed', focus: 'Circuit Conditioning' },
    { day: 'Fri', focus: 'Long Interval Session' },
  ],
}

export function PersonalizationSection() {
  const [goal, setGoal] = useState<(typeof goals)[number]>('Build Muscle')
  const [level, setLevel] = useState<(typeof experience)[number]>('Intermediate')

  const preview = useMemo(() => splitPreview[goal], [goal])

  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
        <ScrollReveal>
          <p className="label-eyebrow mb-3">Personalized workouts</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight mb-4">
            Built around your goal, not a template
          </h2>
          <p className="text-ink-muted leading-relaxed mb-8 max-w-md">
            Pick a goal and a level — the split updates instantly. This is the same logic
            that will eventually drive full AI-generated programming.
          </p>

          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5">Goal</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  goal === g
                    ? 'border-emerald/40 bg-emerald/10 text-emerald'
                    : 'border-surface-borderStrong text-ink-muted hover:text-ink'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5">Experience</p>
          <div className="flex flex-wrap gap-2">
            {experience.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  level === l
                    ? 'border-emerald/40 bg-emerald/10 text-emerald'
                    : 'border-surface-borderStrong text-ink-muted hover:text-ink'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <SpotlightCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">Preview split</p>
              <Badge variant="emerald">{level}</Badge>
            </div>
            <div className="space-y-3">
              {preview.map((d) => (
                <div
                  key={d.day}
                  className="flex items-center gap-4 rounded-xl bg-surface-raised px-4 py-3.5"
                >
                  <span className="font-mono text-xs text-emerald w-9 shrink-0">{d.day}</span>
                  <span className="text-sm text-ink flex-1">{d.focus}</span>
                  <Check size={14} className="text-emerald/60" />
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-ink-faint">Goal: {goal} · Updates instantly as you choose</p>
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
