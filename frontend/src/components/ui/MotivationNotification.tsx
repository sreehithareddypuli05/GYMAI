import { useEffect, useState } from 'react'
import { HeartPulse, X } from 'lucide-react'

const messages = [
  ['Consistency beats intensity when you want lasting progress.', 'Show up today. Your next level is built one session at a time.'],
  ['Strong habits create strong bodies.', 'Keep moving, recover well, and make your next rep count.'],
  ['Your future self is built by what you do today.', 'Stay patient. Stay consistent. Keep training.'],
  ['Move with purpose. Train with patience.', 'Small improvements repeated often become real progress.'],
]

export function MotivationNotification() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(messages[0])

  useEffect(() => {
    const delay = 5 * 60 * 1000 + Math.floor(Math.random() * 5 * 60 * 1000)
    const timer = window.setTimeout(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)])
      setVisible(true)
      window.setTimeout(() => setVisible(false), 10000)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null
  return (
    <div className="motivation-toast" role="status">
      <div className="motivation-toast-icon"><HeartPulse size={18} /></div>
      <div className="min-w-0"><p>{message[0]}</p><span>{message[1]}</span></div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Close motivation"><X size={15} /></button>
    </div>
  )
}
