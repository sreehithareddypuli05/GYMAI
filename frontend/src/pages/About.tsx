import { motion } from 'framer-motion'
import { BrainCircuit, Camera, ChartNoAxesCombined, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { useLanguage } from '@/context/LanguageContext'

const pillars = [
  { icon: BrainCircuit, title: 'Personalized intelligence', body: 'GymAI combines your goal, experience, schedule and available equipment to make training feel intentional rather than generic.' },
  { icon: Camera, title: 'Movement awareness', body: 'Supported movements can use camera-based feedback to help you pay attention to repetition quality and practical technique cues.' },
  { icon: ChartNoAxesCombined, title: 'Progress that connects', body: 'Completed sessions and progress signals create useful context for the next stage of your training journey.' },
  { icon: HeartPulse, title: 'Built around consistency', body: 'The product is designed to reduce decision fatigue and make it easier to return for the next session.' },
]

export default function About() {
  const { t } = useLanguage()
  return (
    <AppShell>
      <div className="about-page">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="about-hero">
          <div className="about-hero-copy"><p className="label-eyebrow">{t('About GymAI')}</p><h1>Training should feel <span>personal.</span></h1><p>GymAI brings personalized workouts, exercise guidance, movement feedback and progress tracking into one focused fitness experience.</p><div className="about-trust"><span><ShieldCheck size={15} /> Designed for practical training</span><span><Sparkles size={15} /> AI-assisted, human-focused</span></div></div>
          <div className="about-hero-visual"><div className="about-visual-glow" /><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=88" alt="Modern gym training space" /></div>
        </motion.section>
        <section className="about-intro"><p className="label-eyebrow">OUR APPROACH</p><h2>Less guessing.<br /><span>More training.</span></h2><p>From your first profile setup to your next completed session, GymAI is built around one simple idea: useful technology should make training clearer, not more complicated.</p></section>
        <section className="about-pillars">{pillars.map(({ icon: Icon, title, body }, i) => <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} className="about-pillar"><div><Icon size={20} /></div><h3>{title}</h3><p>{body}</p></motion.article>)}</section>
        <section className="about-statement"><p className="label-eyebrow">GYMAI PRINCIPLE</p><blockquote>“Technology should give you more confidence in the next rep — and less friction before you start it.”</blockquote></section>
      </div>
    </AppShell>
  )
}
