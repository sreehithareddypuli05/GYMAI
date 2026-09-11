import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const movementPhotos = [
  ['SQUAT','https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=500&q=88'],
  ['PLANK','https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=500&q=88'],
  ['JUMP','https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=88'],
  ['PULL','https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=500&q=88'],
]

export function AuthLayout({ children, eyebrow, title, subtitle }: { children: ReactNode; eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-charcoal text-ink flex overflow-hidden">
      <div className="relative hidden w-[48%] flex-col justify-between overflow-hidden border-r border-surface-border bg-[#080808] p-9 xl:p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <motion.div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[100px]" animate={{scale:[1,1.2,1],opacity:[.25,.55,.25]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}} />
        <Link to="/" className="relative z-10 flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-orange text-charcoal"><Activity size={17}/></div><span className="font-display text-xl font-semibold">Gym<span className="text-orange">AI</span></span></Link>
        <div className="relative z-10">
          <p className="label-eyebrow mb-4">TRAIN / TRANSFORM / REPEAT</p>
          <h2 className="max-w-md font-display text-4xl font-semibold leading-[.95] tracking-[-.05em] text-ink xl:text-5xl">Your body is the interface. <span className="text-orange">Movement is the language.</span></h2>
          <div className="relative mx-auto mt-9 h-[330px] max-w-md">
            {movementPhotos.map(([label,img],i)=>{const pos=[['0%','5%'],['57%','0%'],['8%','57%'],['64%','54%']][i]; return <motion.div key={label} className="absolute h-36 w-36 overflow-hidden rounded-full border-2 border-white/15 bg-black shadow-2xl" style={{left:pos[0],top:pos[1]}} animate={{y:[0,i%2?12:-10,0],scale:[1,1.08,1],rotate:[0,i%2?3:-3,0]}} transition={{duration:4+i*.3,repeat:Infinity,ease:'easeInOut',delay:i*.15}} whileHover={{scale:1.2,zIndex:30,borderColor:'#FF5A00'}}><img src={img} alt={`${label} exercise`} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-black/15"/><span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-2 py-1 text-[8px] font-mono tracking-[.18em] text-white">{label}</span></motion.div>})}
            <motion.div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/50" animate={{scale:[.75,1.35,.75],opacity:[.7,.15,.7]}} transition={{duration:2.5,repeat:Infinity}} />
          </div>
          <p className="mt-2 max-w-md text-sm leading-6 text-ink-muted">Squat. Brace. Jump. Pull. Four movement patterns orbit your account as you begin your transformation.</p>
        </div>
        <p className="relative z-10 font-mono text-[10px] tracking-[.15em] text-ink-faint">GYMAI · INTELLIGENT FITNESS SYSTEM</p>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="absolute right-5 top-5"><ThemeToggle /></div>
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-xl bg-orange text-charcoal"><Activity size={17}/></div><span className="font-display text-xl font-semibold">Gym<span className="text-orange">AI</span></span></div>
          <p className="label-eyebrow mb-2">{eyebrow}</p><h1 className="mb-2 font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1><p className="mb-8 text-sm leading-6 text-ink-muted">{subtitle}</p>{children}
        </div>
      </div>
    </div>
  )
}
