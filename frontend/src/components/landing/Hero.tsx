import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Zap } from 'lucide-react'
import { useRef } from 'react'
import { MagneticButton } from './effects'
import { HeroVideoStage } from './HeroVideoStage'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -55])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.035])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <section ref={ref} className="hero-cinematic relative overflow-hidden pt-28 sm:pt-32">
      <div className="hero-ambient" />
      <div className="container-shell relative z-10 grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:py-16">
        <motion.div className="max-w-2xl" style={{ y: titleY }}>
          <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .8 }} className="hero-title">TRAIN<br /><i>WITH</i><br /><strong>PURPOSE.</strong></motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="hero-lead">GymAI combines smart planning, movement guidance and progress tracking to turn your fitness goal into a routine you can actually follow.</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} className="hero-actions">
            <MagneticButton><Link to="/register" className="hero-primary">START TRAINING <ArrowRight size={17} /></Link></MagneticButton>
            <a href="#intelligence" className="hero-secondary">SEE HOW IT WORKS <Zap size={15} /></a>
          </motion.div>
          <div className="hero-checks">{['Personalized workouts', 'Adaptive training', 'Movement feedback'].map(x => <span key={x}><Check size={13} />{x}</span>)}</div>
        </motion.div>

        <motion.div className="hero-media" style={{ y: videoY, scale: videoScale }} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .2 }}>
          <HeroVideoStage />
        </motion.div>
      </div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><i /></div>
    </section>
  )
}
