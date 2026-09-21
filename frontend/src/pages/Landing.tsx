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
              {[
                [
                  '01',
                  'Set your direction',
                  'Choose your goal, experience, schedule and the equipment you can use.',
                  '◎'
                ],
                [
                  '02',
                  'Get a focused session',
                  'GymAI turns those details into a practical workout you can start immediately.',
                  '◈'
                ],
                [
                  '03',
                  'Train with guidance',
                  'Follow visual exercise cues and keep your attention on quality movement.',
                  '◉'
                ],
                [
                  '04',
                  'Build momentum',
                  'Completed sessions become useful context for smarter training ahead.',
                  '↗'
                ]
              ].map(([number, title, body, icon], index) => (
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
              ))}
            </div>
          
        </div>
      </section>
      <section id="ai-form" className="form-section border-t border-white/10 py-20 sm:py-28">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div><p className="label-eyebrow mb-3">Movement feedback</p><h2 className="cinematic-heading text-4xl sm:text-5xl">TRAIN WITH<br /><span>BETTER FORM.</span></h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">Your goals don’t care how you feel; they only require you to show up.
Every rep you finish is a promise kept to your future self, building a body that matches your ambition.
Stop waiting for the perfect moment or the right mood to strike—action beats intention every single time.
The discomfort you accept today will seamlessly transform into the undeniable strength you display tomorrow.
Step through our doors, leave your excuses at the baseline, and let your daily hustle do all the talking.</p><div className="mt-7 flex flex-wrap gap-2">{['Squat','Push-up','Lunge','Bicep curl','Shoulder press'].map(x => <span key={x} className="orange-tag">{x}</span>)}</div></div>
          <div className="posture-panel"><img src="https://img.freepik.com/premium-photo/cropped-photo-strong-athlrtic-man-taking-dumbbells-from-floor-work-out-modern-gym-warm-orange-light_116317-20357.jpg" alt="Athlete performing a gym exercise" loading="lazy" /><div className="posture-overlay"><span>AI FORM ANALYSIS</span><b>92%</b><i /></div></div>
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  )
}