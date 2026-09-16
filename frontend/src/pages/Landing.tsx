import { motion } from 'framer-motion'
import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { IntelligenceSection } from '@/components/landing/IntelligenceSection'
import { PersonalizationSection } from '@/components/landing/PersonalizationSection'
import { LibrarySection } from '@/components/landing/LibrarySection'
import { FutureAISection } from '@/components/landing/FutureAISection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/layout/Footer'
import { useLandingContent } from '@/data/landingContent'

export default function Landing() {
  const copy = useLandingContent()
  return (
    <div className="gymai-site min-h-screen overflow-x-hidden bg-charcoal">
      <LandingNav />
      <main className="landing-pre-testimonials">
        <div className="landing-content-layer">
          <Hero />
          <IntelligenceSection />
          <PersonalizationSection />
          <LibrarySection />
          <FutureAISection />
        </div>
      </main>
      <TestimonialsSection />
      <section id="how-it-works" className="process-section border-t border-white/10 py-20 sm:py-28">
        <div className="container-shell">
          <div className="mb-12 max-w-2xl"><p className="label-eyebrow mb-3">{copy.processLabel}</p><h2 className="cinematic-heading text-4xl sm:text-5xl">{copy.processTitle}</h2></div>
          <div className="process-grid">
              {copy.process.map(([title, body], index) => {
                const number = `0${index + 1}`
                const icon = ['◎', '◈', '◉', '↗'][index]
                return (
                <motion.div
                  key={title}
                  className={`process-card process-card-${index + 1}`}
                >
                  <div className="process-card-top">
                    <span className="process-number">{number}</span>
                    <span className="process-icon">{icon}</span>
                  </div>

                  <div className="process-card-content">
                    <span className="process-step">STEP {number}</span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </motion.div>
                )
              })}
            </div>
          
        </div>
      </section>
      <section id="ai-form" className="form-section border-t border-white/10 py-20 sm:py-28">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div><p className="label-eyebrow mb-3">{copy.formLabel}</p><h2 className="cinematic-heading text-4xl sm:text-5xl">{copy.formTitle}</h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">{copy.formBody}</p><div className="mt-7 flex flex-wrap gap-2">{copy.formTags.map(x => <span key={x} className="orange-tag">{x}</span>)}</div></div>
          <div className="posture-panel"><img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=88" alt={copy.athleteAlt} loading="lazy" /><div className="posture-overlay"><span>{copy.formAnalysis}</span><b>92%</b><i /></div></div>
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  )
}