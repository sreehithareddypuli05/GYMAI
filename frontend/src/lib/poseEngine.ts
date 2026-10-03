export type Landmark = { x: number; y: number; z?: number; visibility?: number }

export function angle(a: Landmark, b: Landmark, c: Landmark) {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y)
  if (!mag) return 180
  return Math.round((Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI)
}

const L = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_WRIST: 15, RIGHT_WRIST: 16,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
}

function visible(points: Landmark[], ids: number[]) {
  return ids.every((id) => points[id] && (points[id].visibility ?? 1) > 0.42)
}

function avg(a: number, b: number) { return (a + b) / 2 }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)) }
function scoreFromRange(value: number, idealMin: number, idealMax: number, tolerance = 35) {
  if (value >= idealMin && value <= idealMax) return 98
  const distance = value < idealMin ? idealMin - value : value - idealMax
  return Math.round(clamp(98 - (distance / tolerance) * 35, 55, 98))
}

export type PoseAnalysis = {
  phase: string
  reps: number
  formScore: number
  feedback: string
  metric: number
}

/**
 * Lightweight exercise-specific heuristics built on MediaPipe Pose Landmarker.
 * It intentionally keeps the video local to the browser and only sends the
 * summarized result to the API. This is a training aid, not medical analysis.
 */
export class PoseAnalyzer {
  private reps = 0
  private phase = 'start'
  private lastScore = 100
  private holdFrames = 0

  reset() {
    this.reps = 0
    this.phase = 'start'
    this.lastScore = 100
    this.holdFrames = 0
  }

  analyze(type: string, points: Landmark[]): PoseAnalysis {
    if (!points?.length) return this.wait()
    const t = type.toLowerCase()

    if (t === 'squat' || t === 'chair_squat') return this.squat(points)
    if (t === 'pushup' || t === 'wall_pushup' || t === 'incline_pushup') return this.pushup(points)
    if (t === 'lunge' || t === 'split_squat') return this.lunge(points)
    if (t === 'glute_bridge') return this.gluteBridge(points)
    if (t === 'step_up') return this.stepUp(points)
    if (t === 'calf_raise') return this.calfRaise(points)
    if (t === 'plank' || t === 'side_plank' || t === 'bear_plank') return this.plank(points, t)
    if (t === 'dead_bug') return this.deadBug(points)
    if (t === 'bird_dog') return this.birdDog(points)
    if (t === 'mountain_climber') return this.mountainClimber(points)
    if (t === 'high_knees') return this.highKnees(points)
    if (t === 'good_morning') return this.goodMorning(points)
    if (t === 'superman') return this.superman(points)
    if (t === 'crunch') return this.crunch(points)
    if (t === 'bicep_curl') return this.curl(points)
    if (t === 'shoulder_press') return this.press(points)

    return this.generic(points)
  }

  private squat(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE, L.RIGHT_HIP, L.RIGHT_KNEE, L.RIGHT_ANKLE])) return this.wait()
    const left = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    const right = angle(p[L.RIGHT_HIP], p[L.RIGHT_KNEE], p[L.RIGHT_ANKLE])
    const knee = avg(left, right)
    if (knee < 105 && this.phase !== 'down') this.phase = 'down'
    if (knee > 158 && this.phase === 'down') { this.reps += 1; this.phase = 'up' }
    const score = scoreFromRange(knee, 85, 115, 55)
    this.lastScore = score
    const feedback = knee < 115 ? 'Good depth. Keep knees tracking over your feet.' : knee > 158 ? 'Stand tall and brace before the next rep.' : 'Sit your hips back and lower with control.'
    return { phase: this.phase, reps: this.reps, formScore: score, feedback, metric: knee }
  }

  private pushup(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_ELBOW, L.LEFT_WRIST, L.LEFT_HIP, L.LEFT_ANKLE])) return this.wait()
    const elbow = angle(p[L.LEFT_SHOULDER], p[L.LEFT_ELBOW], p[L.LEFT_WRIST])
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_ANKLE])
    if (elbow < 90 && this.phase !== 'down') this.phase = 'down'
    if (elbow > 155 && this.phase === 'down') { this.reps += 1; this.phase = 'up' }
    const score = Math.round((scoreFromRange(elbow, 55, 105, 70) + scoreFromRange(trunk, 155, 180, 45)) / 2)
    this.lastScore = score
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: trunk < 150 ? 'Keep your body in one straight line.' : elbow < 105 ? 'Good depth. Keep elbows controlled.' : 'Lower your body slowly and stay braced.', metric: elbow }
  }

  private lunge(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE, L.RIGHT_HIP, L.RIGHT_KNEE, L.RIGHT_ANKLE])) return this.wait()
    const left = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    const right = angle(p[L.RIGHT_HIP], p[L.RIGHT_KNEE], p[L.RIGHT_ANKLE])
    const knee = Math.min(left, right)
    if (knee < 115 && this.phase !== 'down') this.phase = 'down'
    if (knee > 160 && this.phase === 'down') { this.reps += 1; this.phase = 'up' }
    const score = scoreFromRange(knee, 85, 115, 60)
    this.lastScore = score
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: knee < 115 ? 'Good lunge depth. Keep your front knee stable.' : 'Lower under control and keep your torso tall.', metric: knee }
  }

  private gluteBridge(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE])) return this.wait()
    const hip = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    if (hip > 155 && this.phase === 'down') { this.reps += 1; this.phase = 'up' }
    if (hip < 145) this.phase = 'down'
    const score = scoreFromRange(hip, 150, 180, 55)
    this.lastScore = score
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: hip > 150 ? 'Drive through your heels and squeeze at the top.' : 'Lift your hips while keeping your ribs controlled.', metric: hip }
  }

  private stepUp(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE])) return this.wait()
    const knee = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    if (knee < 105 && this.phase !== 'up') this.phase = 'up'
    if (knee > 155 && this.phase === 'up') { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(knee, 80, 115, 60)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: knee < 115 ? 'Drive through the working foot.' : 'Stand tall before starting the next step.', metric: knee }
  }

  private calfRaise(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_KNEE, L.LEFT_ANKLE, L.LEFT_HIP])) return this.wait()
    const knee = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    const ankleHeight = p[L.LEFT_ANKLE].y
    if (this.phase === 'start' && ankleHeight < p[L.LEFT_KNEE].y - 0.03) this.phase = 'up'
    if (this.phase === 'up' && ankleHeight > p[L.LEFT_KNEE].y + 0.08) { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(knee, 155, 180, 50)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: this.phase === 'up' ? 'Hold the top briefly.' : 'Rise onto your toes without bouncing.', metric: knee }
  }

  private plank(p: Landmark[], type: string): PoseAnalysis {
    const ids = type === 'side_plank'
      ? [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_ANKLE]
      : [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_ANKLE]
    if (!visible(p, ids)) return this.wait()
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_ANKLE])
    const score = scoreFromRange(trunk, 160, 180, 35)
    if (score >= 82) this.holdFrames += 1
    if (this.holdFrames >= 45) { this.reps = Math.max(1, this.reps + 1); this.holdFrames = 0 }
    this.lastScore = score
    return { phase: 'hold', reps: this.reps, formScore: score, feedback: score >= 90 ? 'Strong line. Keep your core braced.' : 'Keep your hips aligned with your shoulders.', metric: trunk }
  }

  private deadBug(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE])) return this.wait()
    const knee = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    if (knee < 95 && this.phase !== 'extended') this.phase = 'extended'
    if (knee > 145 && this.phase === 'extended') { this.reps += 1; this.phase = 'start' }
    const score = scoreFromRange(knee, 80, 120, 60)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: knee < 120 ? 'Keep your lower back controlled.' : 'Extend slowly and keep your core braced.', metric: knee }
  }

  private birdDog(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE, L.LEFT_WRIST])) return this.wait()
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    const arm = angle(p[L.LEFT_HIP], p[L.LEFT_SHOULDER], p[L.LEFT_ELBOW])
    if (trunk > 155 && arm > 150) this.phase = 'extended'
    if (this.phase === 'extended' && trunk < 145) { this.reps += 1; this.phase = 'start' }
    const score = Math.round((scoreFromRange(trunk, 160, 180, 40) + scoreFromRange(arm, 150, 180, 45)) / 2)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: score > 88 ? 'Great control. Reach long without rotating.' : 'Keep your hips square to the floor.', metric: trunk }
  }

  private mountainClimber(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE])) return this.wait()
    const knee = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    if (knee < 95 && this.phase !== 'drive') this.phase = 'drive'
    if (knee > 145 && this.phase === 'drive') { this.reps += 1; this.phase = 'reset' }
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_ANKLE])
    const score = Math.round((scoreFromRange(knee, 65, 110, 60) + scoreFromRange(trunk, 150, 180, 45)) / 2)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: trunk < 145 ? 'Keep your shoulders, hips and legs stable.' : 'Drive one knee forward while keeping your torso braced.', metric: knee }
  }

  private highKnees(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE, L.RIGHT_HIP, L.RIGHT_KNEE, L.RIGHT_ANKLE])) return this.wait()
    const left = angle(p[L.LEFT_HIP], p[L.LEFT_KNEE], p[L.LEFT_ANKLE])
    const right = angle(p[L.RIGHT_HIP], p[L.RIGHT_KNEE], p[L.RIGHT_ANKLE])
    const knee = Math.min(left, right)
    if (knee < 95 && this.phase !== 'up') this.phase = 'up'
    if (knee > 145 && this.phase === 'up') { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(knee, 65, 105, 65)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: knee < 105 ? 'Good knee drive. Stay light on your feet.' : 'Bring the knee higher with control.', metric: knee }
  }

  private goodMorning(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE, L.LEFT_ANKLE])) return this.wait()
    const hip = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    if (hip < 125 && this.phase !== 'hinge') this.phase = 'hinge'
    if (hip > 155 && this.phase === 'hinge') { this.reps += 1; this.phase = 'stand' }
    const score = scoreFromRange(hip, 80, 130, 55)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: hip < 130 ? 'Good hinge. Keep your spine long.' : 'Push your hips back before returning to standing.', metric: hip }
  }

  private superman(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE])) return this.wait()
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    if (trunk > 155 && this.phase === 'start') this.phase = 'lift'
    if (trunk < 145 && this.phase === 'lift') { this.reps += 1; this.phase = 'start' }
    const score = scoreFromRange(trunk, 155, 180, 45)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: score > 88 ? 'Lift smoothly and keep your neck neutral.' : 'Lift only as far as you can control.', metric: trunk }
  }

  private crunch(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE])) return this.wait()
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    if (trunk < 105 && this.phase !== 'up') this.phase = 'up'
    if (trunk > 140 && this.phase === 'up') { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(trunk, 80, 115, 55)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: trunk < 115 ? 'Curl through your core without pulling your neck.' : 'Return slowly and keep your core engaged.', metric: trunk }
  }

  private curl(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_ELBOW, L.LEFT_WRIST])) return this.wait()
    const elbow = angle(p[L.LEFT_SHOULDER], p[L.LEFT_ELBOW], p[L.LEFT_WRIST])
    if (elbow < 55 && this.phase !== 'up') this.phase = 'up'
    if (elbow > 150 && this.phase === 'up') { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(elbow, 45, 75, 65)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: elbow < 80 ? 'Squeeze at the top and keep your elbow close.' : 'Lower slowly without swinging.', metric: elbow }
  }

  private press(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_ELBOW, L.LEFT_WRIST])) return this.wait()
    const elbow = angle(p[L.LEFT_SHOULDER], p[L.LEFT_ELBOW], p[L.LEFT_WRIST])
    if (elbow > 155 && this.phase !== 'up') this.phase = 'up'
    if (elbow < 85 && this.phase === 'up') { this.reps += 1; this.phase = 'down' }
    const score = scoreFromRange(elbow, 150, 180, 60)
    return { phase: this.phase, reps: this.reps, formScore: score, feedback: elbow > 150 ? 'Good lockout. Keep your ribs controlled.' : 'Press up smoothly and keep wrists stacked.', metric: elbow }
  }

  private generic(p: Landmark[]): PoseAnalysis {
    if (!visible(p, [L.LEFT_SHOULDER, L.LEFT_HIP, L.LEFT_KNEE])) return this.wait()
    const trunk = angle(p[L.LEFT_SHOULDER], p[L.LEFT_HIP], p[L.LEFT_KNEE])
    const score = scoreFromRange(trunk, 145, 180, 50)
    return { phase: 'tracking', reps: this.reps, formScore: score, feedback: score > 85 ? 'Good alignment. Move slowly and stay controlled.' : 'Reset your posture and keep your body aligned.', metric: trunk }
  }

  private wait(): PoseAnalysis {
    return { phase: 'waiting', reps: this.reps, formScore: 0, feedback: 'Make sure your full body is visible in the camera.', metric: 0 }
  }
}

export const poseLabel = (type?: string | null) => {
  const labels: Record<string, string> = {
    squat: 'Squat', glute_bridge: 'Glute Bridge', pushup: 'Knee Push-Up', wall_pushup: 'Wall Push-Up',
    lunge: 'Reverse Lunge', step_up: 'Step-Up', split_squat: 'Split Squat', calf_raise: 'Standing Calf Raise',
    plank: 'Forearm Plank', dead_bug: 'Dead Bug', bird_dog: 'Bird Dog', mountain_climber: 'Mountain Climber',
    high_knees: 'High Knees', good_morning: 'Good Morning', superman: 'Superman', side_plank: 'Side Plank',
    chair_squat: 'Chair Squat', incline_pushup: 'Incline Push-Up', crunch: 'Crunch', bear_plank: 'Bear Plank',
    bicep_curl: 'Dumbbell Bicep Curl', shoulder_press: 'Dumbbell Shoulder Press',
  }
  return labels[type ?? ''] ?? 'Exercise Form Check'
}
