import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { ScrollReveal } from './effects'
import { exercises } from '@/data/exercises'

const preview = exercises.slice(0, 4)
const difficultyVariant: Record<string, string> = {
  Beginner: 'text-emerald',
  Intermediate: 'text-warning',
  Advanced: 'text-danger',
}

export function LibrarySection() {
  return (
    <section id="library" className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="label-eyebrow mb-3">Exercise library</p>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl leading-tight">
              Every movement, fully specified
            </h2>
          </div>
          <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-light transition-colors">
            Browse the full library <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((ex, i) => (
            <ScrollReveal key={ex.id} delay={i * 0.06}>
              <div className="card-surface p-4 h-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-raised text-emerald mb-3">
                  <Dumbbell size={16} />
                </div>
                <p className="font-medium text-ink text-sm mb-1">{ex.name}</p>
                <p className="text-xs text-ink-faint mb-3">{ex.muscleGroup} · {ex.equipment}</p>
                <span className={`text-[10px] font-mono uppercase ${difficultyVariant[ex.difficulty]}`}>
                  {ex.difficulty}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
