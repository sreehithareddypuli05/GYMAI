import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Gauge,
  HeartPulse,
  Ruler,
  Scale,
  Sparkles,
  Target,
  Timer,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { updateProfile } from '@/services/profileService'
import type { Equipment, FitnessLevel, Goal } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const goals: { value: Goal; title: string; description: string; icon: typeof Target }[] = [
  { value: 'Lose Fat', title: 'Lose fat', description: 'Build consistency and improve conditioning.', icon: Flame },
  { value: 'Build Muscle', title: 'Build muscle', description: 'Progressively train for muscle growth.', icon: Dumbbell },
  { value: 'Gain Strength', title: 'Get stronger', description: 'Build strength with structured training.', icon: Gauge },
  { value: 'Improve Endurance', title: 'Improve endurance', description: 'Build stamina and work capacity.', icon: HeartPulse },
  { value: 'General Fitness', title: 'General fitness', description: 'Move better and build a strong base.', icon: Sparkles },
]

const levels: { value: FitnessLevel; title: string; description: string }[] = [
  { value: 'Beginner', title: 'Beginner', description: 'New to structured training.' },
  { value: 'Intermediate', title: 'Intermediate', description: 'Comfortable training consistently.' },
  { value: 'Advanced', title: 'Advanced', description: 'Experienced with structured training.' },
]

const equipmentOptions: { value: Equipment; title: string; description: string }[] = [
  { value: 'None', title: 'No equipment', description: 'Train with your bodyweight.' },
  { value: 'Dumbbell', title: 'Dumbbells', description: 'Free weights for versatile training.' },
  { value: 'Barbell', title: 'Barbell', description: 'Barbell and plate-based training.' },
  { value: 'Machine', title: 'Machines', description: 'Gym machines and guided resistance.' },
  { value: 'Full Gym', title: 'Full gym', description: 'Access to a complete gym setup.' },
]

const frequencies = [
  { value: 2, title: '1–2 days', description: 'A flexible weekly routine.' },
  { value: 4, title: '3–4 days', description: 'A balanced training schedule.' },
  { value: 5, title: '5+ days', description: 'A frequent training routine.' },
]

const totalSteps = 7

export default function Onboarding() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [age, setAge] = useState(user?.age?.toString() ?? '')
  const [weight, setWeight] = useState(user?.weight_kg?.toString() ?? '')
  const [height, setHeight] = useState(user?.height_cm?.toString() ?? '')
  const [goal, setGoal] = useState<Goal | null>(user?.goal ?? null)
  const [level, setLevel] = useState<FitnessLevel | null>(user?.fitness_level ?? null)
  const [equipment, setEquipment] = useState<Equipment[]>(
    user?.equipment?.length ? user.equipment : [],
  )
  const [frequency, setFrequency] = useState<number | null>(user?.training_frequency ?? null)
  const [saving, setSaving] = useState(false)

  const stepValid = useMemo(() => {
    if (step === 1) return Number(age) >= 13 && Number(age) <= 120
    if (step === 2) return Number(weight) >= 20 && Number(weight) <= 500
    if (step === 3) return Number(height) >= 50 && Number(height) <= 300
    if (step === 4) return Boolean(goal)
    if (step === 5) return Boolean(level)
    if (step === 6) return equipment.length > 0
    return Boolean(frequency)
  }, [step, age, weight, height, goal, level, equipment, frequency])

  const selectEquipment = (value: Equipment) => {
    if (value === 'None') {
      setEquipment(['None'])
      return
    }

    setEquipment((current) => {
      const withoutNone = current.filter((item) => item !== 'None')
      return withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value]
    })
  }

  const next = () => {
    if (!stepValid) return
    if (step < totalSteps) {
      setStep((current) => current + 1)
    }
  }

  const back = () => {
    if (step > 1) setStep((current) => current - 1)
  }

  const finish = async () => {
    if (!stepValid || !goal || !level || !frequency || !equipment.length) return

    setSaving(true)
    try {
      const payload = {
        age: Number(age),
        weight_kg: Number(weight),
        height_cm: Number(height),
        goal,
        fitness_level: level,
        equipment,
        training_frequency: frequency,
      }

      const updated = await updateProfile(payload)
      updateUser({
        age: updated.age,
        weight_kg: updated.weight_kg,
        height_cm: updated.height_cm,
        goal: updated.goal,
        fitness_level: updated.fitness_level,
        equipment: updated.equipment,
        training_frequency: updated.training_frequency,
        profile_completed: updated.profile_completed,
      })

      showToast('Your training profile is ready.', 'success')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error(error)
      showToast('We could not save your profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const title = [
    'Let’s build your training profile.',
    'What’s your current weight?',
    'How tall are you?',
    'What is your main training goal?',
    'What is your training experience?',
    'What equipment do you have access to?',
    'How often do you want to train?',
  ][step - 1]

  const subtitle = [
    'A few details help GymAI make your training more relevant.',
    'Use kilograms so your training profile stays consistent.',
    'Use centimetres for your height.',
    'Choose the result you want GymAI to prioritize.',
    'This determines the difficulty of your training plan.',
    'No equipment is completely fine — GymAI can build bodyweight workouts.',
    'Choose a routine you can realistically maintain.',
  ][step - 1]

  return (
    <div className="min-h-screen overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_42%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="font-display text-lg font-semibold text-ink"
          >
            Gym<span className="text-emerald">AI</span>
          </button>
          <span className="text-xs font-medium text-ink-faint">Training profile</span>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-10">
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-xs text-ink-faint">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface">
              <motion.div
                className="h-full rounded-full bg-emerald"
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-10 max-w-2xl">
                <p className="label-eyebrow mb-3">Personalized training</p>
                <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted sm:text-base">{subtitle}</p>
              </div>

              {step === 1 && (
                <div className="max-w-md">
                  <Input
                    label="Age"
                    type="number"
                    min={13}
                    max={120}
                    inputMode="numeric"
                    placeholder="20"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    icon={<Target size={16} />}
                  />
                  <p className="mt-3 text-xs text-ink-faint">This helps us keep your training profile relevant.</p>
                </div>
              )}

              {step === 2 && (
                <div className="max-w-md">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min={20}
                    max={500}
                    step="0.1"
                    inputMode="decimal"
                    placeholder="60"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    icon={<Scale size={16} />}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="max-w-md">
                  <Input
                    label="Height (cm)"
                    type="number"
                    min={50}
                    max={300}
                    step="0.1"
                    inputMode="decimal"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    icon={<Ruler size={16} />}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map(({ value, title: itemTitle, description, icon: Icon }) => {
                    const selected = goal === value
                    return (
                      <SelectionCard key={value} selected={selected} onClick={() => setGoal(value)}>
                        <Icon size={21} />
                        <div>
                          <p className="font-semibold text-ink">{itemTitle}</p>
                          <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
                        </div>
                      </SelectionCard>
                    )
                  })}
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {levels.map(({ value, title: itemTitle, description }) => (
                    <SelectionCard key={value} selected={level === value} onClick={() => setLevel(value)}>
                      <div>
                        <p className="font-semibold text-ink">{itemTitle}</p>
                        <p className="mt-2 text-xs leading-5 text-ink-muted">{description}</p>
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {equipmentOptions.map(({ value, title: itemTitle, description }) => {
                    const selected = equipment.includes(value)
                    return (
                      <SelectionCard key={value} selected={selected} onClick={() => selectEquipment(value)}>
                        <Dumbbell size={20} />
                        <div>
                          <p className="font-semibold text-ink">{itemTitle}</p>
                          <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
                        </div>
                        {selected && <Check className="ml-auto text-emerald" size={18} />}
                      </SelectionCard>
                    )
                  })}
                </div>
              )}

              {step === 7 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {frequencies.map(({ value, title: itemTitle, description }) => (
                    <SelectionCard key={value} selected={frequency === value} onClick={() => setFrequency(value)}>
                      <Timer size={20} />
                      <div>
                        <p className="font-semibold text-ink">{itemTitle}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={back} disabled={step === 1}>
              <ArrowLeft size={16} />
              Back
            </Button>

            {step < totalSteps ? (
              <Button size="lg" onClick={next} disabled={!stepValid}>
                Continue
                <ArrowRight size={17} />
              </Button>
            ) : (
              <Button size="lg" onClick={finish} loading={saving} disabled={!stepValid}>
                Build my training
                <Sparkles size={17} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectionCard({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[92px] items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
        selected
          ? 'border-emerald bg-emerald/[0.10] shadow-emerald'
          : 'border-surface-borderStrong bg-surface/70 hover:-translate-y-0.5 hover:border-emerald/40 hover:bg-surface'
      }`}
    >
      {children}
    </button>
  )
}
