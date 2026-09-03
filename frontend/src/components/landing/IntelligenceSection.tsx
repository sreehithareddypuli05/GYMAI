import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Brain, Camera, Dumbbell, MessageCircle, RefreshCw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon:Sparkles, title:'Smart workout planning', body:'Build focused sessions from your goal, available equipment, training history and preferred pace.', tag:'PLAN / BUILT FOR YOU', image:'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1100&q=88' },
  { icon:RefreshCw, title:'Adaptive training', body:'Keep progressing as your schedule, energy and recent workload change from session to session.', tag:'LOAD / RESPONDING', image:'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1100&q=88' },
  { icon:MessageCircle, title:'Personal AI coach', body:'Get practical guidance grounded in your goals, completed workouts and the way you like to train.', tag:'COACH / PERSONAL', image:'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1100&q=88' },
  { icon:Brain, title:'Training recommendations', body:'Discover useful exercise swaps, progressions and next steps that fit your current level.', tag:'RECOMMEND / REFINED', image:'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1100&q=88' },
  { icon:Camera, title:'Movement feedback', body:'Camera-based guidance helps you notice key form cues and track rep quality during supported movements.', tag:'FORM / AWARENESS', image:'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1100&q=88' },
  { icon:Dumbbell, title:'Equipment-aware options', body:'Make the most of the machines, dumbbells, bands or bodyweight tools available to you.', tag:'EQUIPMENT / READY', image:'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1100&q=88' },
]

export function IntelligenceSection() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setActive(v => (v + 1) % features.length), 3200)
    return () => window.clearInterval(timer)
  }, [])
  const current = features[active]

  return (
    <section id="intelligence" className="ai-feature-section relative overflow-hidden border-t border-white/10 py-24 sm:py-32">
      <div className="ai-feature-light" />
      <div className="container-shell relative z-10">
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.7}} className="max-w-3xl">
          <p className="label-eyebrow">AI fitness engine</p>
          <h2 className="cinematic-heading mt-5 text-5xl sm:text-7xl">YOUR TRAINING<br/><span>EVOLVES.</span></h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-muted">Explore the intelligence behind every session. Each capability connects your goals, movement, equipment and training history to make the next workout more useful.</p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
          <div className="relative h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
            <AnimatePresence mode="wait">
              <motion.div key={current.title} initial={{opacity:0,scale:1.08,x:40}} animate={{opacity:1,scale:1,x:0}} exit={{opacity:0,scale:.94,x:-40}} transition={{duration:.65,ease:[.16,1,.3,1]}} className="absolute inset-0">
                <img src={current.image} alt={current.title} className="h-full w-full object-cover grayscale-[.35]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/10" />
                <motion.div initial={{x:'-100%'}} animate={{x:'100%'}} transition={{duration:1.1,ease:'easeInOut'}} className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#ff5a00]/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/75 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between"><span className="font-mono text-[9px] tracking-[.2em] text-[#ff5a00]">{current.tag}</span><span className="font-mono text-[10px] text-white/35">LIVE</span></div>
                  <div className="mt-3 flex items-center gap-2 text-white"><current.icon size={16} className="text-[#ff5a00]"/><span className="text-xs font-semibold tracking-[.12em]">LIVE TRAINING INTELLIGENCE</span></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            {features.map((f, i) => (
              <motion.button key={f.title} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} whileHover={{x:6}} className={`feature-effect-card w-full border p-4 text-left transition-all duration-300 ${i===active?'feature-effect-card-active':'border-white/10 bg-[#0b0b0b] hover:border-white/25'}`}>
                <div className="flex items-center gap-4">
                  <div className="feature-thumb" aria-hidden="true"><img src={f.image} alt=""/><span className="feature-thumb-handle" /></div>
                  <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h3 className="text-base font-semibold text-white">{f.title}</h3><f.icon size={17} className={i===active?'text-[#ff5a00]':'text-white/25'}/></div><p className="mt-1.5 text-xs leading-5 text-white/45">{f.body}</p></div>
                  <ArrowRight size={16} className={`shrink-0 transition ${i===active?'translate-x-1 text-[#ff5a00]':'text-white/20'}`}/>
                </div>
                {i===active && <motion.div layoutId="feature-progress" className="mt-3 h-px bg-[#ff5a00]" initial={{scaleX:0,transformOrigin:'left'}} animate={{scaleX:1}} transition={{duration:3.1,ease:'linear'}}/>}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3"><Link to="/register" className="inline-flex items-center gap-2 bg-[#ff5a00] px-5 py-3 text-sm font-semibold text-black">BUILD MY TRAINING PLAN <ArrowRight size={15}/></Link><span className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-[10px] font-mono tracking-[.12em] text-white/45">GOAL + ROUTINE + HISTORY → SMARTER TRAINING</span></div>
      </div>
    </section>
  )
}
