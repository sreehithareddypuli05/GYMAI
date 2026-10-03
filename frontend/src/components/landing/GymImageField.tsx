import { motion } from 'framer-motion'

const gymPhotos = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=900&q=85',
]

export function GymImageField() {
  const left = [...gymPhotos, ...gymPhotos.slice(0, 5)]
  const right = [...gymPhotos.slice(5), ...gymPhotos, ...gymPhotos.slice(0, 3)]

  return (
    <div className="gym-image-field" aria-hidden="true">
      <div className="gym-image-field-glow" />
      <div className="gym-image-field-column gym-image-field-left">
        {left.map((src, i) => (
          <motion.div key={`left-${i}`} className="gym-image-tile" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: Math.min(i * .035, .5) }}>
            <img src={src} alt="" loading="lazy" />
          </motion.div>
        ))}
      </div>
      <div className="gym-image-field-column gym-image-field-right">
        {right.map((src, i) => (
          <motion.div key={`right-${i}`} className="gym-image-tile gym-image-tile-right" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: Math.min(i * .035, .5) }}>
            <img src={src} alt="" loading="lazy" />
          </motion.div>
        ))}
      </div>
      <div className="gym-image-field-vignette" />
    </div>
  )
}
