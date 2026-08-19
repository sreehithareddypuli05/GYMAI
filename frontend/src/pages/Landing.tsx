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
    <div className="min-h-screen bg-charcoal">
      <LandingNav />
      <Hero />
      <IntelligenceSection />
      <PersonalizationSection />
      <LibrarySection />
      <FutureAISection />
      <CTASection />
      <Footer />
    </div>
  )
}
