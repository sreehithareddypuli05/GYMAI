import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

const stories = [
  { name: 'ARJUN K.', role: 'STRENGTH / 24', quote: 'My sessions finally feel purposeful. I know what to train, how to approach it and what to work on next.', image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=900&q=88', stat: '+18%', statLabel: 'STRENGTH' },
  { name: 'MEERA S.', role: 'FITNESS / 21', quote: 'Seeing each completed session adds up keeps me consistent and makes progress easier to recognize.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=88', stat: '42', statLabel: 'SESSIONS' },
  { name: 'ROHAN P.', role: 'PERFORMANCE / 27', quote: 'It feels like a coach that remembers how I train instead of sending me the same routine every week.', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=900&q=88', stat: '17D', statLabel: 'STREAK' },
  { name: 'ANANYA R.', role: 'WELLNESS / 23', quote: 'The visual guidance keeps my sessions focused and makes good technique easier to repeat.', image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=88', stat: '94%', statLabel: 'CONSISTENCY' },
  { name: 'KARTHIK V.', role: 'HYPERTROPHY / 26', quote: 'I no longer waste time deciding what comes next. The plan is clear and my progress feels connected.', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=88', stat: '+22%', statLabel: 'VOLUME' },
  { name: 'PRIYA M.', role: 'FITNESS / 25', quote: 'The workouts fit around my schedule, which makes showing up consistently much easier.', image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=88', stat: '5X', statLabel: 'WEEKLY' },
  { name: 'DEV A.', role: 'PERFORMANCE / 29', quote: 'The equipment alternatives are incredibly useful. I can keep training even when my gym setup changes.', image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=900&q=88', stat: '31', statLabel: 'EXERCISES' },
  { name: 'ISHA N.', role: 'STRENGTH / 22', quote: 'GymAI gives me structure and accountability without making every workout feel restrictive.', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=88', stat: '88%', statLabel: 'ADHERENCE' },
]

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const story = stories[index]
  const go = (dir: number) => setIndex((index + dir + stories.length) % stories.length)

  return (
    <section id="testimonials" className="testimonials-section relative overflow-hidden border-t border-white/10 py-24 sm:py-32">
      <div className="container-shell">
        <div className="testimonial-heading"><div><p className="label-eyebrow">Athlete stories</p><h2 className="cinematic-heading mt-5">REAL WORK.<br /><span>REAL PROGRESS.</span></h2></div><p>See how different training goals become easier to follow when every session has a clear purpose, useful feedback and visible momentum.</p></div>

        <div className="testimonial-stage">
          <div className="testimonial-orb" />
          <div className="testimonial-card-stack">
            {stories.map((s, i) => {
              const offset = (i - index + stories.length) % stories.length
              const visual = offset === 0 ? { x: 0, scale: 1, opacity: 1, z: 5 } : offset === 1 ? { x: 185, scale: .88, opacity: .34, z: 3 } : offset === stories.length - 1 ? { x: -185, scale: .88, opacity: .34, z: 3 } : { x: 0, scale: .72, opacity: 0, z: 0 }
              return (
                <motion.article key={s.name} className="testimonial-card" animate={visual} transition={{ duration: .6, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="testimonial-image"><img src={s.image} alt={`GymAI athlete ${s.name}`} /><div /></div>
                  <div className="testimonial-content"><Quote size={18} className="text-orange" /><p>“{s.quote}”</p><div className="testimonial-person"><div><b>{s.name}</b><span>{s.role}</span></div><div className="testimonial-stat"><b>{s.stat}</b><span>{s.statLabel}</span></div></div></div>
                </motion.article>
              )
            })}
          </div>
          <button className="carousel-arrow carousel-left" onClick={() => go(-1)} aria-label="Previous testimonial"><ArrowLeft size={18} /></button>
          <button className="carousel-arrow carousel-right" onClick={() => go(1)} aria-label="Next testimonial"><ArrowRight size={18} /></button>
          <div className="carousel-dots">{stories.map((s, i) => <button key={s.name} aria-label={`Show testimonial ${i + 1}`} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} />)}</div>
        </div>
      </div>
    </section>
  )
}
