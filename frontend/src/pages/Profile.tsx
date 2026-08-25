import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Check,
  Dumbbell,
  Gauge,
  Ruler,
  Scale,
  Target,
  Timer,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { updateProfile } from '@/services/profileService'
import type { Equipment, FitnessLevel, Goal } from '@/types'

const goals: Goal[] = [
  'Build Muscle',
  'Lose Fat',
  'Gain Strength',
  'Improve Endurance',
  'General Fitness',
]

const levels: FitnessLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const equipmentOptions: Equipment[] = [
  'None',
  'Dumbbell',
  'Barbell',
  'Machine',
  'Full Gym',
  'Cable',
  'Kettlebell',
  'Bands',
]

const frequencyOptions = [
  { value: 2, label: '1–2 days', helper: 'Flexible' },
  { value: 4, label: '3–4 days', helper: 'Balanced' },
  { value: 5, label: '5+ days', helper: 'Frequent' },
]

export default function Profile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(!user?.profile_completed)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? null)
  const [age, setAge] = useState(user?.age?.toString() ?? '')
  const [height, setHeight] = useState(user?.height_cm?.toString() ?? '')
  const [weight, setWeight] = useState(user?.weight_kg?.toString() ?? '')
  const [goal, setGoal] = useState<Goal | null>(user?.goal ?? null)
  const [level, setLevel] = useState<FitnessLevel | null>(user?.fitness_level ?? null)
  const [equipment, setEquipment] = useState<Equipment[]>(user?.equipment ?? [])
  const [frequency, setFrequency] = useState<number | null>(user?.training_frequency ?? null)

  useEffect(() => {
    if (!user) return
    setFullName(user.full_name)
    setAvatarUrl(user.avatar_url ?? null)
    setAge(user.age?.toString() ?? '')
    setHeight(user.height_cm?.toString() ?? '')
    setWeight(user.weight_kg?.toString() ?? '')
    setGoal(user.goal ?? null)
    setLevel(user.fitness_level ?? null)
    setEquipment(user.equipment ?? [])
    setFrequency(user.training_frequency ?? null)
  }, [user])

  const completion = useMemo(() => {
    const fields = [age, height, weight, goal, level, equipment.length > 0, frequency]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [age, height, weight, goal, level, equipment, frequency])

  const equipmentCompatible = level === 'Beginner' ? equipment.length > 0 : equipment.length > 0 && !equipment.includes('None')

  const valid =
    fullName.trim().length > 1 &&
    Number(age) >= 13 &&
    Number(height) >= 50 &&
    Number(weight) >= 20 &&
    Boolean(goal) &&
    Boolean(level) &&
    equipmentCompatible &&
    Boolean(frequency)

  const selectEquipment = (item: Equipment) => {
    if (item === 'None') {
      setEquipment(['None'])
      return
    }

    setEquipment((current) => {
      const withoutNone = current.filter((value) => value !== 'None')
      return withoutNone.includes(item)
        ? withoutNone.filter((value) => value !== item)
        : [...withoutNone, item]
    })
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Please choose an image smaller than 2 MB.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => {
    if (!user) return
    setFullName(user.full_name)
    setAvatarUrl(user.avatar_url ?? null)
    setAge(user.age?.toString() ?? '')
    setHeight(user.height_cm?.toString() ?? '')
    setWeight(user.weight_kg?.toString() ?? '')
    setGoal(user.goal ?? null)
    setLevel(user.fitness_level ?? null)
    setEquipment(user.equipment ?? [])
    setFrequency(user.training_frequency ?? null)
    setEditing(false)
  }

  const save = async () => {
    if (!user || !valid || !goal || !level || !frequency || !equipmentCompatible) {
      showToast('Complete all training profile fields first.', 'error')
      return
    }

    setSaving(true)
    try {
      const response = await updateProfile({
        age: Number(age),
        height_cm: Number(height),
        weight_kg: Number(weight),
        goal,
        fitness_level: level,
        equipment,
        training_frequency: frequency,
      })

      const updated = await updateUser({
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        age: response.age,
        height_cm: response.height_cm,
        weight_kg: response.weight_kg,
        goal: response.goal,
        fitness_level: response.fitness_level,
        equipment: response.equipment,
        training_frequency: response.training_frequency,
        profile_completed: response.profile_completed,
      })

      setFullName(updated.full_name)
      setEditing(false)
      showToast('Training profile saved.', 'success')
      if (!user.profile_completed && updated.profile_completed) {
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      console.error(error)
      showToast('Could not save your profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <AppShell>
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-emerald/20 bg-surface"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.18),transparent_34%)]" />
          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar name={fullName || user.full_name} src={avatarUrl} size="xl" />
                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-surface-borderStrong bg-surface-raised text-emerald shadow-card"
                    aria-label="Change profile photo"
                  >
                    <Camera size={16} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="label-eyebrow mb-2">Your training identity</p>
                <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{fullName || user.full_name}</h1>
                <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {goal && <Badge>{goal}</Badge>}
                  {level && <Badge>{level}</Badge>}
                  {user.profile_completed && <Badge>Profile ready</Badge>}
                </div>
              </div>
            </div>

            <div className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-ink-muted">Profile completion</span>
                <span className="font-mono text-emerald">{completion}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-charcoal">
                <motion.div
                  className="h-full rounded-full bg-emerald"
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {!user.profile_completed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 rounded-2xl border border-emerald/20 bg-emerald/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-ink">Finish your training profile</p>
              <p className="mt-1 text-sm text-ink-muted">
                GymAI uses these details to build the right workouts for your goal, level and equipment.
              </p>
            </div>
            <span className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1.5 text-xs font-medium text-emerald">Complete the form below</span>
          </motion.div>
        )}

        <section className="rounded-2xl border border-surface-border bg-surface p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-surface-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-eyebrow">Training profile</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">The details GymAI trains around</h2>
              <p className="mt-1 text-sm text-ink-muted">Keep these accurate so future recommendations stay relevant.</p>
            </div>
            {!editing && (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit profile
              </Button>
            )}
          </div>

          {editing ? (
            <div className="mt-7 space-y-9">
              <div>
                <SectionTitle icon={<UserRound size={17} />} title="Personal information" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <Input label="Age" type="number" min={13} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
                  <Input label="Weight (kg)" type="number" min={20} max={500} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  <Input label="Height (cm)" type="number" min={50} max={300} step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
                  <Input label="Email" value={user.email} disabled />
                </div>
              </div>

              <div>
                <SectionTitle icon={<Target size={17} />} title="Primary goal" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {goals.map((item) => (
                    <Choice key={item} selected={goal === item} onClick={() => setGoal(item)}>
                      {item}
                    </Choice>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle icon={<Gauge size={17} />} title="Training experience" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {levels.map((item) => (
                    <Choice key={item} selected={level === item} onClick={() => setLevel(item)}>
                      {item}
                    </Choice>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle icon={<Dumbbell size={17} />} title="Available equipment" />
                <p className="mb-3 text-xs text-ink-faint">Choose all that you have. No equipment is a complete option.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {equipmentOptions.map((item) => (
                    <Choice
                      key={item}
                      selected={equipment.includes(item)}
                      onClick={() => selectEquipment(item)}
                    >
                      {item === 'None' ? 'No Equipment' : item}
                    </Choice>
                  ))}
                </div>
                {level && level !== 'Beginner' && (
                  <p className="mt-3 text-xs text-ink-faint">Intermediate and Advanced plans require access to training equipment. Choose at least one equipment option other than No Equipment.</p>
                )}
              </div>

              <div>
                <SectionTitle icon={<Timer size={17} />} title="Training frequency" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {frequencyOptions.map((item) => (
                    <Choice key={item.value} selected={frequency === item.value} onClick={() => setFrequency(item.value)}>
                      <span>
                        <span className="block">{item.label}</span>
                        <span className="mt-1 block text-xs font-normal text-ink-faint">{item.helper}</span>
                      </span>
                    </Choice>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-6 sm:flex-row sm:justify-end">
                {user.profile_completed && (
                  <Button variant="ghost" onClick={reset}>Cancel</Button>
                )}
                <Button onClick={save} loading={saving} disabled={!valid}>
                  <Check size={16} />
                  Save training profile
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={<Target size={18} />} label="Goal" value={goal ?? 'Not set'} />
              <InfoCard icon={<Gauge size={18} />} label="Experience" value={level ?? 'Not set'} />
              <InfoCard icon={<Scale size={18} />} label="Weight" value={weight ? `${weight} kg` : 'Not set'} />
              <InfoCard icon={<Ruler size={18} />} label="Height" value={height ? `${height} cm` : 'Not set'} />
              <InfoCard icon={<Timer size={18} />} label="Frequency" value={frequency ? `${frequency} days/week` : 'Not set'} />
              <InfoCard icon={<Dumbbell size={18} />} label="Equipment" value={equipment.length ? equipment.map((item) => item === 'None' ? 'No equipment' : item).join(', ') : 'Not set'} />
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-emerald/20 bg-emerald/10 px-2.5 py-1 text-[11px] font-medium text-emerald">{children}</span>
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-emerald">{icon}</span>
      <h3 className="font-semibold text-ink">{title}</h3>
    </div>
  )
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[58px] rounded-xl border px-4 py-3 text-left text-sm transition-all ${
        selected
          ? 'border-emerald bg-emerald/10 text-emerald shadow-[0_0_0_1px_rgba(16,185,129,0.12)]'
          : 'border-surface-borderStrong bg-charcoal/30 text-ink-muted hover:border-emerald/40 hover:bg-surface-raised hover:text-ink'
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        {children}
        {selected && <Check size={16} className="shrink-0" />}
      </span>
    </button>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-charcoal/30 p-4">
      <div className="flex items-center gap-2 text-emerald">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</span>
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-ink">{value}</p>
    </div>
  )
}
