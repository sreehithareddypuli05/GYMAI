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

export default function Landing() {
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
          <div className="mb-12 max-w-2xl"><p className="label-eyebrow mb-3">Simple from the first session</p><h2 className="cinematic-heading text-4xl sm:text-5xl">TURN YOUR GOAL<br /><span>INTO A ROUTINE.</span></h2></div>
          <div className="process-grid">
            {[['Set your direction','Choose your goal, experience, schedule and the equipment you can use.'],['Get a focused session','GymAI turns those details into a practical workout you can start immediately.'],['Train with guidance','Follow visual exercise cues and keep your attention on quality movement.'],['Build momentum','Completed sessions become useful context for smarter training ahead.']].map(([t,b]) => <motion.div key={t} className="process-card"><h3>{t}</h3><p>{b}</p></motion.div>)}
          </div>
        </div>
      </section>
      <section id="ai-form" className="form-section border-t border-white/10 py-20 sm:py-28">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div><p className="label-eyebrow mb-3">Movement feedback</p><h2 className="cinematic-heading text-4xl sm:text-5xl">TRAIN WITH<br /><span>BETTER FORM.</span></h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">For supported exercises, GymAI uses camera-based movement tracking to help count repetitions and surface simple technique cues while you train.</p><div className="mt-7 flex flex-wrap gap-2">{['Squat','Push-up','Lunge','Bicep curl','Shoulder press'].map(x => <span key={x} className="orange-tag">{x}</span>)}</div></div>
          <div className="posture-panel"><img src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=88" alt="Athlete performing a gym exercise" loading="lazy" /><div className="posture-overlay"><span>AI FORM ANALYSIS</span><b>92%</b><i /></div></div>
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  )
}
