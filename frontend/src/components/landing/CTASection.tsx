import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal, MagneticButton } from './effects'

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-emerald/20 bg-gradient-to-br from-surface to-surface-raised p-10 sm:p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
            <div className="relative">
              <p className="label-eyebrow mb-4">Get started</p>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl max-w-lg mx-auto leading-tight">
                Start reading your training like a system
              </h2>
              <p className="mt-4 text-ink-muted max-w-md mx-auto">
                Free to join. Your first readiness and load readout is ready the moment you log your first session.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald px-7 py-3.5 font-semibold text-charcoal shadow-emerald hover:bg-emerald-light transition-colors"
                  >
                    Create your account <ArrowRight size={16} />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
