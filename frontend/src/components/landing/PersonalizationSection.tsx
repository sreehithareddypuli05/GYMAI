import { useState } from 'react'
import { ScrollReveal } from './effects'

const goals = ['Build Muscle', 'Lose Fat', 'Gain Strength', 'Endurance'] as const
const experience = ['Beginner', 'Intermediate', 'Advanced'] as const

export function PersonalizationSection() {
  const [goal, setGoal] = useState<(typeof goals)[number]>('Build Muscle')
  const [level, setLevel] = useState<(typeof experience)[number]>('Intermediate')

  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal>
          <p className="label-eyebrow mb-3">Personal training</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight mb-4">
            A plan shaped around the way you train
          </h2>
          <p className="text-ink-muted leading-relaxed mb-8 max-w-2xl">
            Choose the outcome you want and the experience you bring. GymAI uses those signals to guide exercise selection, training volume, recovery and progression without forcing you into a one-size-fits-all routine.
          </p>

          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5">Goal</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  goal === g
                    ? 'border-orange/40 bg-orange/10 text-orange'
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
                    ? 'border-orange/40 bg-orange/10 text-orange'
                    : 'border-surface-borderStrong text-ink-muted hover:text-ink'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
