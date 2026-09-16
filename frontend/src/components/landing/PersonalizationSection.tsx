import { useState } from 'react'
import { ScrollReveal } from './effects'
import { useLandingContent } from '@/data/landingContent'

export function PersonalizationSection() {
  const [goal, setGoal] = useState('Build Muscle')
  const [level, setLevel] = useState('Intermediate')
  const copy = useLandingContent()

  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal>
          <p className="label-eyebrow mb-3">{copy.personalLabel}</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight mb-4">
            {copy.personalTitle}
          </h2>
          <p className="text-ink-muted leading-relaxed mb-8 max-w-2xl">
            {copy.personalBody}
          </p>

          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5">{copy.goal}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {copy.goals.map((g) => (
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

          <p className="text-xs uppercase tracking-wide text-ink-faint mb-2.5">{copy.experience}</p>
          <div className="flex flex-wrap gap-2">
            {copy.levels.map((l) => (
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
