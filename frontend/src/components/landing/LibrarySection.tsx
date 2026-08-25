import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { ScrollReveal } from './effects'

const preview = [
  { name: 'Bodyweight Squat', muscle: 'Quads · Glutes', level: 'Beginner', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=700&q=80' },
  { name: 'Push Up', muscle: 'Chest · Triceps', level: 'Beginner', image: 'https://images.unsplash.com/photo-1598971639058-999f0c7b4b4b?auto=format&fit=crop&w=700&q=80' },
  { name: 'Dumbbell Press', muscle: 'Chest · Shoulders', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=700&q=80' },
  { name: 'Barbell Squat', muscle: 'Legs · Glutes', level: 'Advanced', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80' },
]

export function LibrarySection() {
  return (
    <section id="training" className="border-t border-surface-border py-20 sm:py-28">
      <div className="container-shell">
        <ScrollReveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="label-eyebrow mb-3">Exercise library</p><h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Real movement guidance, not text-only plans.</h2><p className="mt-4 max-w-xl text-ink-muted">Every exercise has visual guidance, equipment context, instructions, sets, reps and form cues.</p></div>
          <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:text-emerald-light">Explore GymAI <ArrowRight size={14} /></Link>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((ex, i) => (
            <ScrollReveal key={ex.name} delay={i * 0.06}>
              <article className="group overflow-hidden rounded-2xl border border-surface-border bg-surface">
                <div className="relative aspect-[4/3] overflow-hidden"><img src={ex.image} alt={ex.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" /><span className="absolute bottom-3 left-3 rounded-full bg-charcoal/75 px-2.5 py-1 text-[10px] font-medium text-emerald backdrop-blur">{ex.level}</span></div>
                <div className="p-4"><div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/10 text-emerald"><Dumbbell size={14} /></div><p className="font-medium text-ink">{ex.name}</p><p className="mt-1 text-xs text-ink-faint">{ex.muscle}</p></div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
