import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PoseAnalyzer, poseLabel, type Landmark, type PoseAnalysis } from '@/lib/poseEngine'
import { savePoseSession } from '@/services/poseService'
import type { WorkoutExercise } from '@/types'

type Props = { exercise: WorkoutExercise; onClose: () => void; onComplete: (reps: number, score: number) => void }

export function BeginnerPoseTrainer({ exercise, onClose, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)
  const analyzerRef = useRef(new PoseAnalyzer())
  const [status, setStatus] = useState<'loading' | 'ready' | 'running' | 'error'>('loading')
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<PoseAnalysis>({ phase: 'waiting', reps: 0, formScore: 0, feedback: 'Loading camera…', metric: 0 })
  const [started, setStarted] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false
    const start = async () => {
      try {
        setStatus('loading')
        const moduleUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/vision_bundle.mjs'
        const vision = await import(/* @vite-ignore */ moduleUrl)
        const resolver = await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm')
        landmarkerRef.current = await vision.PoseLandmarker.createFromOptions(resolver, {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task', delegate: 'GPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } }, audio: false })
        if (cancelled || !videoRef.current) return
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStatus('ready')
      } catch (err) {
        console.error(err)
        setError('Camera or MediaPipe could not start. Check browser camera permission and use HTTPS (or localhost).')
        setStatus('error')
      }
    }
    start()
    return () => {
      cancelled = true
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      stream?.getTracks().forEach((track) => track.stop())
      landmarkerRef.current?.close?.()
    }
  }, [])

  useEffect(() => {
    if (!started || status === 'error') return
    const loop = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const landmarker = landmarkerRef.current
      if (video && canvas && landmarker && video.readyState >= 2) {
        canvas.width = video.videoWidth || 960
        canvas.height = video.videoHeight || 720
        const result = landmarker.detectForVideo(video, performance.now())
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        const points = result?.landmarks?.[0] as Landmark[] | undefined
        if (points && ctx) {
          ctx.fillStyle = '#10B981'
          points.forEach((p) => { if ((p.visibility ?? 1) > 0.35) { ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2); ctx.fill() } })
          const lines = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]]
          ctx.strokeStyle = '#34D399'; ctx.lineWidth = 3
          lines.forEach(([a,b]) => { const x = points[a], y = points[b]; if (x && y) { ctx.beginPath(); ctx.moveTo(x.x*canvas.width,x.y*canvas.height); ctx.lineTo(y.x*canvas.width,y.y*canvas.height); ctx.stroke() } })
        }
        const next = analyzerRef.current.analyze(exercise.poseType ?? '', points ?? [])
        setAnalysis(next)
      }
      animationRef.current = requestAnimationFrame(loop)
    }
    animationRef.current = requestAnimationFrame(loop)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [started, status, exercise.poseType])

  const finish = async () => {
    if (saving) return
    setSaving(true)
    try {
      await savePoseSession({ exercise_id: exercise.id, exercise_name: exercise.name, pose_type: exercise.poseType ?? 'unknown', reps: analysis.reps, form_score: analysis.formScore, feedback: analysis.feedback })
      onComplete(analysis.reps, analysis.formScore)
    } catch { setError('The set was completed, but the pose metrics could not be saved.') }
    finally { setSaving(false) }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 p-4 backdrop-blur-sm">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <div><Badge variant="emerald">Beginner AI Form Check</Badge><h2 className="mt-2 font-display text-xl font-semibold text-ink">{poseLabel(exercise.poseType)}</h2></div>
        <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-ink-muted hover:bg-surface-raised hover:text-ink"><X size={20} /></button>
      </div>
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="relative aspect-video bg-black">
          <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover -scale-x-100" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover -scale-x-100" />
          {status === 'loading' && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white"><Loader2 className="animate-spin" /><p className="mt-3 text-sm">Loading MediaPipe and camera…</p></div>}
          {status === 'error' && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center text-white"><Camera size={30} /><p className="mt-4 max-w-md text-sm">{error}</p><Button className="mt-5" onClick={onClose}>Close</Button></div>}
          {status !== 'error' && <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-2 text-xs text-white"><ShieldCheck size={13} className="mr-1 inline text-emerald" /> Video processed locally</div>}
        </div>
        <aside className="space-y-5 p-5">
          <div><p className="text-xs uppercase tracking-wider text-ink-faint">Repetitions</p><p className="mt-1 font-display text-4xl font-semibold text-ink">{analysis.reps}</p></div>
          <div><p className="text-xs uppercase tracking-wider text-ink-faint">Form score</p><p className="mt-1 font-display text-4xl font-semibold text-emerald">{analysis.formScore ? `${analysis.formScore}%` : '—'}</p></div>
          <div className="rounded-xl border border-surface-border bg-surface-raised p-4"><p className="text-xs uppercase tracking-wider text-ink-faint">Live feedback</p><p className="mt-2 text-sm leading-6 text-ink">{analysis.feedback}</p></div>
          <p className="text-xs leading-5 text-ink-faint">GymAI uses body landmarks and movement rules to estimate form. It is not medical advice.</p>
          {!started && status === 'ready' && <Button fullWidth onClick={() => { analyzerRef.current.reset(); setStarted(true); setStatus('running') }}>Start set</Button>}
          {started && <Button fullWidth loading={saving} disabled={analysis.reps < 1} onClick={finish}><CheckCircle2 size={16} /> Complete set</Button>}
        </aside>
      </div>
    </motion.div>
  </div>
}
