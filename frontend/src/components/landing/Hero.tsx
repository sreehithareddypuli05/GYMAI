import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Check, Dumbbell, Sparkles, Zap } from 'lucide-react'
import { MagneticButton } from './effects'

const femaleImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85'
const maleImage = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85'

export function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald/10 blur-[120px]" />

      <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-emerald/5 px-3.5 py-2">
            <Sparkles size={13} className="text-emerald" />
            <span className="label-eyebrow">AI-powered training system</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[5.2rem]">
            Train smarter.<br /><span className="text-emerald">Move better.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-7 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
            GymAI turns your age, goal, experience, equipment and training history into a workout that fits you — with real-time form guidance for beginners.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3.5 font-semibold text-charcoal shadow-emerald hover:bg-emerald-light">
                Build my training plan <ArrowRight size={16} />
              </Link>
            </MagneticButton>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-surface-borderStrong bg-surface/50 px-6 py-3.5 font-medium text-ink hover:bg-surface-raised">
              See how it works
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }} className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-ink-faint">
            {['Personalized workouts', '60+ exercises', 'Beginner AI form check'].map((item) => (
              <span key={item} className="flex items-center gap-2"><Check size={13} className="text-emerald" />{item}</span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
          <div className="absolute -inset-8 rounded-[3rem] bg-emerald/10 blur-3xl" />
          <div className="relative grid grid-cols-5 gap-3 sm:gap-4">
            <div className="col-span-3 pt-10 sm:pt-16">
              <div className="relative aspect-[0.78] overflow-hidden rounded-[2rem] border border-white/15 bg-surface shadow-2xl">
                <img src={femaleImage} alt="Woman training in a modern gym" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal/70 px-3 py-2 backdrop-blur-md">
                    <span className="text-xs font-medium text-white">Personalized training</span>
                    <Zap size={14} className="text-emerald" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="relative aspect-[0.72] overflow-hidden rounded-[2rem] border border-white/15 bg-surface shadow-2xl">
                <img src={maleImage} alt="Man training with weights in a gym" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-white/10 bg-charcoal/70 p-3 backdrop-blur-md">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-emerald">GymAI</p>
                  <p className="mt-1 text-xs font-medium text-white">Train with a plan.</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="absolute -bottom-5 left-2 rounded-2xl border border-emerald/25 bg-charcoal/90 p-3 shadow-2xl backdrop-blur-xl sm:left-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/10 text-emerald"><Camera size={16} /></div>
              <div><p className="text-[10px] uppercase tracking-wider text-ink-faint">Beginner mode</p><p className="text-xs font-semibold text-ink">AI form check</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.95 }} className="absolute right-2 top-5 rounded-2xl border border-white/10 bg-charcoal/90 p-3 shadow-2xl backdrop-blur-xl sm:right-7">
            <div className="flex items-center gap-3"><Dumbbell size={16} className="text-emerald" /><div><p className="text-[10px] text-ink-faint">Today</p><p className="text-xs font-semibold text-ink">Your workout is ready</p></div></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
