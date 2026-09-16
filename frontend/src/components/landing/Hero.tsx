import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Zap } from 'lucide-react'
import { useRef } from 'react'
import { MagneticButton } from './effects'
import { HeroVideoStage } from './HeroVideoStage'
import { useTranslation } from 'react-i18next'
import { landingCopy, type LandingLanguage } from '@/data/landingTranslations'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -55])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.035])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const { i18n } = useTranslation()
  const copy = landingCopy[(i18n.resolvedLanguage?.slice(0, 2) as LandingLanguage) || 'en'] ?? landingCopy.en

  return (
    <section ref={ref} className="hero-cinematic relative overflow-hidden pt-28 sm:pt-32">
      <div className="hero-ambient" />
      <div className="container-shell relative z-10 grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:py-16">
        <motion.div className="max-w-2xl" style={{ y: titleY }}>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .8 }} className="hero-title">{copy.heroTitle}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="hero-lead">{copy.heroLead}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} className="hero-actions">
            <MagneticButton><Link to="/register" className="hero-primary">{copy.startTraining} <ArrowRight size={17} /></Link></MagneticButton>
            <a href="#intelligence" className="hero-secondary">{copy.seeHowItWorks} <Zap size={15} /></a>
          </motion.div>
          <div className="hero-checks"><span><Check size={13} />{copy.personalizedWorkouts}</span><span><Check size={13} />{copy.adaptiveTraining}</span><span><Check size={13} />{copy.movementFeedback}</span></div>
        </motion.div>

        <motion.div className="hero-media" style={{ y: videoY, scale: videoScale }} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .2 }}>
          <HeroVideoStage />
        </motion.div>
      </div>
      <div className="hero-bottom"><span>{copy.scrollToExplore}</span><i /></div>
    </section>
  )
}
