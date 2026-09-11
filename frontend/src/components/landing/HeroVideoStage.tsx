import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, VolumeX } from 'lucide-react'

const videos = [
  { src: '/videos/gym-training-wide.mp4', label: 'MOVEMENT / STRENGTH FLOOR' },
  { src: '/videos/gym-training-portrait.mp4', label: 'PERFORMANCE / CONDITIONING' },
]

export function HeroVideoStage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.playbackRate = 0.62
    video.play().catch(() => undefined)
  }, [index])

  const handleEnded = () => setIndex((value) => (value + 1) % videos.length)

  return (
    <div className="hero-video-stage">
      <div className="hero-video-frame">
        <AnimatePresence mode="wait">
          <motion.video
            key={videos[index].src}
            ref={videoRef}
            className="hero-video"
            src={videos[index].src}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleEnded}
            initial={{ opacity: 0, scale: 1.045 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        <div className="hero-video-shade" />
        <div className="hero-video-scan" />
        <div className="hero-video-label"><span>{videos[index].label}</span><b>GYMAI TRAINING</b></div>
        <div className="hero-video-badge"><Play size={11} fill="currentColor" /><span>CINEMATIC TRAINING</span><VolumeX size={12} /></div>
        <div className="hero-video-progress" aria-hidden="true"><i style={{ width: `${((index + 1) / videos.length) * 100}%` }} /></div>
      </div>
    </div>
  )
}
