import { motion } from 'framer-motion'
import { Brain, Camera, Dumbbell, MessagesSquare, Repeat, ScanLine, Sparkles, Target, Wrench, ArrowUpRight } from 'lucide-react'
import { ScrollReveal } from './effects'
import { GymImageField } from './GymImageField'
import { useLandingContent } from '@/data/landingContent'

const capabilities = [
  { icon: Brain, title: 'Smart workout planning', body: 'Build focused sessions from your goal, equipment, recent training and preferred pace.', tag: 'PLAN' },
  { icon: Repeat, title: 'Adaptive sessions', body: 'Your training can respond to changes in energy, schedule and recent workload.', tag: 'ADAPT' },
  { icon: MessagesSquare, title: 'Personal AI coach', body: 'Get clear coaching guidance based on your goals, history and current routine.', tag: 'COACH' },
  { icon: Target, title: 'Personalized progression', body: 'Choose useful swaps and progressions that match your current ability and momentum.', tag: 'TUNE' },
  { icon: ScanLine, title: 'Form awareness', body: 'Visual movement feedback highlights useful technique cues during supported exercises.', tag: 'ANALYZE' },
  { icon: Wrench, title: 'Equipment matching', body: 'Find practical exercise alternatives using the equipment you already have access to.', tag: 'EQUIP' },
]

export function FutureAISection() {
  const copy = useLandingContent()
  return (
    <section id="ai-features" className="ai-feature-section relative overflow-hidden border-t border-white/10 py-24 sm:py-32">
      <GymImageField />
      <div className="ai-feature-light" />
      <div className="container-shell relative z-10">
        <ScrollReveal className="mb-14 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <p className="label-eyebrow">{copy.aiLabel}</p>
            <span className="orange-pill"><Sparkles size={11} /> {copy.smartTraining}</span>
          </div>
          <h2 className="cinematic-heading">{copy.aiTitle}</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
            {copy.aiBody}
          </p>
        </ScrollReveal>

        <div className="feature-rail">
          {copy.capabilities.map(([title, body, tag], i) => { const c = capabilities[i]; return (
            <motion.article
              key={title}
              className="ai-feature-card"
              initial={{ opacity: 0, y: 45, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: .65, delay: i * .06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, rotateX: -2, rotateY: i % 2 ? 1 : -1 }}
            >
              <div className="feature-card-top"><span className="text-[#ff5a00]">{copy.core}</span><ArrowUpRight size={17} /></div>
              <div className="feature-icon"><c.icon size={22} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="feature-card-bottom"><span>{tag}</span><i /></div>
            </motion.article>
          )})}
        </div>
      </div>
    </section>
  )
}
