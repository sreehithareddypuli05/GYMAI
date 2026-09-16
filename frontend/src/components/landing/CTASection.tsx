import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal, MagneticButton } from './effects'
import { useLandingContent } from '@/data/landingContent'

export function CTASection() {
  const copy = useLandingContent()
  return (
    <section className="py-20 sm:py-28 border-t border-surface-border">
      <div className="container-shell">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-orange/25 bg-[#0c0c0c] p-10 sm:p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
            <div className="relative">
              <p className="label-eyebrow mb-4">{copy.ctaLabel}</p>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl max-w-lg mx-auto leading-tight">
                {copy.ctaTitle}
              </h2>
              <p className="mt-4 text-ink-muted max-w-md mx-auto">
                {copy.ctaBody}
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange px-7 py-3.5 font-semibold text-charcoal shadow-orange hover:bg-orange-light transition-colors"
                  >
                    {copy.ctaButton} <ArrowRight size={16} />
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
