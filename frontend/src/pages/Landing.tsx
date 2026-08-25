import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { IntelligenceSection } from '@/components/landing/IntelligenceSection'
import { PersonalizationSection } from '@/components/landing/PersonalizationSection'
import { LibrarySection } from '@/components/landing/LibrarySection'
import { FutureAISection } from '@/components/landing/FutureAISection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/layout/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-charcoal">
      <LandingNav />
      <Hero />
      <IntelligenceSection />
      <PersonalizationSection />
      <LibrarySection />
      <section id="how-it-works" className="border-t border-surface-border py-20 sm:py-28">
        <div className="container-shell">
          <div className="mb-12 max-w-xl"><p className="label-eyebrow mb-3">How GymAI works</p><h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Your profile becomes your training system.</h2></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[['01','Tell us about you','Age, weight, goal, experience, equipment and frequency.'],['02','Get your plan','GymAI filters exercises and builds a workout around your profile.'],['03','Train your way','Follow visual exercise guidance and complete each set.'],['04','Learn from training','Sessions, progress and beginner form scores build your history.']].map(([n,t,b]) => <div key={n} className="rounded-2xl border border-surface-border bg-surface p-6"><span className="font-mono text-xs text-emerald">{n}</span><h3 className="mt-7 font-display text-xl font-semibold text-ink">{t}</h3><p className="mt-3 text-sm leading-6 text-ink-muted">{b}</p></div>)}
          </div>
        </div>
      </section>
      <section id="ai-form" className="border-t border-surface-border py-20 sm:py-28">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div><p className="label-eyebrow mb-3">Beginner AI form check</p><h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Your first workouts can teach you how to move.</h2><p className="mt-5 max-w-xl leading-7 text-ink-muted">For supported beginner exercises, GymAI uses MediaPipe Pose Landmarker in your browser to track body landmarks, count reps and provide short form feedback during the workout.</p><div className="mt-7 flex flex-wrap gap-2">{['Squat','Push-up','Lunge','Bicep curl','Shoulder press'].map(x => <span key={x} className="rounded-full border border-emerald/20 bg-emerald/5 px-3 py-1.5 text-xs text-emerald">{x}</span>)}</div></div>
          <div className="relative overflow-hidden rounded-[2rem] border border-surface-border bg-surface p-3"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85" alt="Athlete training in a gym" loading="lazy" className="aspect-[4/3] w-full rounded-[1.4rem] object-cover" /><div className="absolute bottom-7 left-7 right-7 flex items-center justify-between rounded-xl border border-white/10 bg-charcoal/80 px-4 py-3 backdrop-blur-xl"><span className="text-xs font-medium text-white">Live beginner form analysis</span><span className="font-mono text-sm text-emerald">92%</span></div></div>
        </div>
      </section>
      <FutureAISection />
      <CTASection />
      <Footer />
    </div>
  )
}
