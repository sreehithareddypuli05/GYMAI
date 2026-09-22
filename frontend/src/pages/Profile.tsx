import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Check, ChevronLeft, ChevronRight, Dumbbell, Gauge, Ruler, Scale, Target, Timer, UserRound, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { updateProfile } from '@/services/profileService'
import type { Equipment, FitnessLevel, Goal } from '@/types'

const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

const goals: Goal[] = ['Build Muscle', 'Lose Fat', 'Gain Strength', 'Improve Endurance', 'General Fitness']
const levels: FitnessLevel[] = ['Beginner', 'Intermediate', 'Advanced']
const equipmentOptions: Equipment[] = ['None', 'Dumbbell', 'Barbell', 'Machine', 'Full Gym', 'Cable', 'Kettlebell', 'Bands']
const frequencyOptions = [
  { value: 2, label: '1–2 days', helper: 'Flexible' },
  { value: 4, label: '3–4 days', helper: 'Balanced' },
  { value: 5, label: '5+ days', helper: 'Frequent' },
]

const avatarOptions = [
  { name: 'Athlete 01', skin: '#B97852', hair: '#241A17', shirt: '#FF5A00' },
  { name: 'Athlete 02', skin: '#8D5B3E', hair: '#111111', shirt: '#334155' },
  { name: 'Athlete 03', skin: '#D39A72', hair: '#5B3528', shirt: '#7C3AED' },
  { name: 'Athlete 04', skin: '#6E4937', hair: '#171717', shirt: '#059669' },
].map((a) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="128" fill="#111827"/><circle cx="128" cy="104" r="54" fill="${a.skin}"/><path d="M74 99c2-46 36-68 62-68 36 0 57 27 49 72-14-16-32-24-53-25-18 0-38 7-58 21z" fill="${a.hair}"/><path d="M52 236c5-51 35-78 76-78s71 27 76 78z" fill="${a.shirt}"/><circle cx="108" cy="106" r="5" fill="#241A17"/><circle cx="148" cy="106" r="5" fill="#241A17"/><path d="M111 131c10 7 22 7 32 0" fill="none" stroke="#6B3D2B" stroke-width="5" stroke-linecap="round"/></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
})

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0)
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
  const [workingDays, setWorkingDays] = useState<string[]>(user?.working_days ?? [])

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
    setWorkingDays(user.working_days ?? [])
  }, [user])
  const fields = [fullName.trim().length > 1, age, height, weight, goal, level, equipment.length > 0, frequency, workingDays.length > 0]
  const completion = useMemo(() => Math.round((fields.filter(Boolean).length / fields.length) * 100), [fullName, age, height, weight, goal, level, equipment, frequency, workingDays])
  const equipmentCompatible = level === 'Beginner' ? equipment.length > 0 : equipment.length > 0 && !equipment.includes('None')
  const valid = fields.every(Boolean) && Number(age) >= 13 && Number(height) >= 50 && Number(weight) >= 20 && equipmentCompatible

  const questions = [
    { key: 'name', title: 'What should we call you?', subtitle: 'This name will appear across your GymAI dashboard.', icon: <UserRound size={20} /> },
    { key: 'avatar', title: 'Choose your training identity', subtitle: 'Pick an avatar or upload your own photo.', icon: <Camera size={20} /> },
    { key: 'age', title: 'How old are you?', subtitle: 'This helps GymAI make safer training recommendations.', icon: <UserRound size={20} /> },
    { key: 'height', title: 'What is your height?', subtitle: 'Enter your height in centimetres.', icon: <Ruler size={20} /> },
    { key: 'weight', title: 'What is your current weight?', subtitle: 'Enter your weight in kilograms.', icon: <Scale size={20} /> },
    { key: 'goal', title: 'What is your main goal?', subtitle: 'Choose the outcome you want to train toward.', icon: <Target size={20} /> },
    { key: 'level', title: 'What is your training experience?', subtitle: 'Be honest — GymAI will adapt the starting point.', icon: <Gauge size={20} /> },
    { key: 'equipment', title: 'What equipment do you have?', subtitle: 'Select everything available to you. No equipment is valid too.', icon: <Dumbbell size={20} /> },
    { key: 'frequency', title: 'How often can you train?', subtitle: 'Choose the number of days you can realistically maintain.', icon: <Timer size={20} /> },
    { key: 'working_days', title: 'Which days will you train?', subtitle: 'Select the days of the week you plan to train.', icon: <Timer size={20} /> },
  ]

  const stepValid = [
    fullName.trim().length > 1,
    Boolean(avatarUrl),
    Number(age) >= 13 && Number(age) <= 120,
    Number(height) >= 50 && Number(height) <= 300,
    Number(weight) >= 20 && Number(weight) <= 500,
    Boolean(goal),
    Boolean(level),
    equipmentCompatible,
    Boolean(frequency),
    workingDays.length > 0,
  ][step]

  const selectEquipment = (item: Equipment) => {
    if (item === 'None') return setEquipment(['None'])
    setEquipment(current => {
      const withoutNone = current.filter(value => value !== 'None')
      return withoutNone.includes(item) ? withoutNone.filter(value => value !== item) : [...withoutNone, item]
    })
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return showToast('Please select an image file.', 'error')
    if (file.size > 5 * 1024 * 1024) return showToast('Please choose an image smaller than 5 MB.', 'error')

    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 320
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const scale = Math.max(size / image.width, size / image.height)
        const w = image.width * scale, h = image.height * scale
        ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h)
        setAvatarUrl(canvas.toDataURL('image/jpeg', 0.82))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const save = async () => {
    if (!user || !valid || !goal || !level || !frequency || !equipmentCompatible || workingDays.length === 0) {
      showToast('Please complete every question first.', 'error'); return
    }
    setSaving(true)
    try {
      const response = await updateProfile({
        age: Number(age), height_cm: Number(height), weight_kg: Number(weight),
        goal, fitness_level: level, equipment, training_frequency: frequency,
        working_days: workingDays,
      })
      const updated = await updateUser({
        full_name: fullName.trim(), avatar_url: avatarUrl,
        age: response.age ?? undefined, height_cm: response.height_cm ?? undefined, weight_kg: response.weight_kg ?? undefined,
        goal: response.goal ?? undefined, fitness_level: response.fitness_level ?? undefined,
        equipment: response.equipment ?? undefined, training_frequency: response.training_frequency ?? undefined,
        working_days: response.working_days ?? undefined,
        profile_completed: response.profile_completed,
      })
      setFullName(updated.full_name)
      setEditing(false)
      showToast('Your GymAI profile is ready.', 'success')
    } catch (error) {
      console.error(error)
      showToast('Could not save your profile. Please try again.', 'error')
    } finally { setSaving(false) }
  }

  if (!user) return null

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={fullName || user.full_name} src={avatarUrl} size="lg" />
              <div>
                <p className="label-eyebrow">Training identity</p>
                <h1 className="mt-1 text-2xl font-semibold text-ink">{fullName || user.full_name}</h1>
                <p className="text-sm text-ink-muted">{user.email}</p>
              </div>
            </div>
            <div className="min-w-[220px]">
              <div className="mb-2 flex justify-between text-xs"><span className="text-ink-muted">Profile progress</span><span className="font-mono text-orange">{completion}%</span></div>
              <div className="h-2 rounded-full bg-charcoal-soft"><motion.div className="h-full rounded-full bg-orange" animate={{ width: `${completion}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-surface-border bg-surface p-6 shadow-card sm:p-10">
          {!editing ? (
            <div>
              <div className="flex flex-col gap-4 border-b border-surface-border pb-7 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="label-eyebrow">Profile complete</p><h2 className="mt-2 text-2xl font-semibold text-ink">Your training blueprint</h2><p className="mt-1 text-sm text-ink-muted">GymAI uses these details to personalize your plans.</p></div>
                <Button variant="secondary" onClick={() => { setEditing(true); setStep(0) }}>Edit profile</Button>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard icon={<Target size={17} />} label="Goal" value={goal ?? 'Not set'} />
                <InfoCard icon={<Gauge size={17} />} label="Experience" value={level ?? 'Not set'} />
                <InfoCard icon={<Scale size={17} />} label="Weight" value={weight ? `${weight} kg` : 'Not set'} />
                <InfoCard icon={<Ruler size={17} />} label="Height" value={height ? `${height} cm` : 'Not set'} />
                <InfoCard icon={<Timer size={17} />} label="Frequency" value={frequency ? `${frequency} days/week` : 'Not set'} />
                <InfoCard icon={<Dumbbell size={17} />} label="Equipment" value={equipment.length ? equipment.map(item => item === 'None' ? 'No equipment' : item).join(', ') : 'Not set'} />
                <InfoCard icon={<Timer size={17} />} label="Working days" value={workingDays.length ? workingDays.join(', ') : 'Not set'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div><p className="label-eyebrow">Step {step + 1} of {questions.length}</p><h2 className="mt-2 text-xl font-semibold text-ink">Build your profile</h2></div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange/20 bg-orange/10 text-orange"><Sparkles size={18} /></div>
              </div>
              <div className="mb-8 flex gap-1.5">{questions.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-orange' : 'bg-charcoal-soft'}`} />)}</div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .2 }}>
                  <div className="mb-7 flex items-start gap-3">
                    <span className="mt-1 text-orange">{questions[step].icon}</span>
                    <div><h3 className="text-2xl font-semibold text-ink">{questions[step].title}</h3><p className="mt-1 text-sm text-ink-muted">{questions[step].subtitle}</p></div>
                  </div>

                  {step === 0 && <Input autoFocus label="Full name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-surface-borderStrong bg-charcoal-soft p-6">
                        <Avatar name={fullName || user.full_name} src={avatarUrl} size="xl" />
                        <div className="flex flex-wrap justify-center gap-2">
                          {avatarOptions.map((src, i) => <button key={src} type="button" onClick={() => setAvatarUrl(src)} className={`rounded-full p-1 transition ${avatarUrl === src ? 'ring-2 ring-orange ring-offset-2 ring-offset-surface' : 'hover:scale-105'}`}><img src={src} className="h-11 w-11 rounded-full" alt={`Avatar option ${i + 1}`} /></button>)}
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-surface-borderStrong bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-orange/50"><Camera size={16} /> Upload photo</button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </div>
                    </div>
                  )}
                  {step === 2 && <Input autoFocus label="Age" type="number" min={13} max={120} value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 21" />}
                  {step === 3 && <Input autoFocus label="Height (cm)" type="number" min={50} max={300} step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" />}
                  {step === 4 && <Input autoFocus label="Weight (kg)" type="number" min={20} max={500} step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65" />}
                  {step === 5 && <ChoiceGrid items={goals} selected={goal} onSelect={setGoal} />}
                  {step === 6 && <ChoiceGrid items={levels} selected={level} onSelect={setLevel} />}
                  {step === 7 && <div><div className="grid gap-3 sm:grid-cols-2">{equipmentOptions.map(item => <Choice key={item} selected={equipment.includes(item)} onClick={() => selectEquipment(item)}>{item === 'None' ? 'No Equipment' : item}</Choice>)}</div>{level && level !== 'Beginner' && <p className="mt-3 text-xs text-ink-faint">Intermediate and Advanced plans require at least one equipment option.</p>}</div>}
                  {step === 8 && <ChoiceGrid items={frequencyOptions.map(item => item.label)} selected={frequencyOptions.find(item => item.value === frequency)?.label ?? null} onSelect={label => setFrequency(frequencyOptions.find(item => item.label === label)?.value ?? null)} />}
                  {step === 9 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {WEEKDAYS.map(d => {
                        const selected = workingDays.includes(d)
                        return (
                          <Choice key={d} selected={selected} onClick={() => setWorkingDays(curr => curr.includes(d) ? curr.filter(x => x !== d) : [...curr, d])}>
                            {d}
                          </Choice>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-9 flex items-center justify-between border-t border-surface-border pt-6">
                <Button variant="ghost" onClick={() => step === 0 ? (user.profile_completed ? setEditing(false) : null) : setStep(step - 1)} disabled={step === 0 && !user.profile_completed}><ChevronLeft size={16} /> Back</Button>
                {step < questions.length - 1 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!stepValid}>Continue <ChevronRight size={16} /></Button>
                ) : (
                  <Button onClick={save} loading={saving} disabled={!stepValid || !valid}><Check size={16} /> Finish profile</Button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

function ChoiceGrid({ items, selected, onSelect }: { items: string[]; selected: string | null; onSelect: (value: any) => void }) {
  return <div className="grid gap-3 sm:grid-cols-2">{items.map(item => <Choice key={item} selected={selected === item} onClick={() => onSelect(item)}>{item}</Choice>)}</div>
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`min-h-[60px] rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${selected ? 'border-orange bg-orange/10 text-orange shadow-[0_0_0_1px_rgba(255,90,0,.12)]' : 'border-surface-borderStrong bg-charcoal-soft text-ink-muted hover:border-orange/40 hover:text-ink'}`}><span className="flex items-center justify-between gap-3">{children}{selected && <Check size={16} />}</span></button>
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-surface-border bg-charcoal-soft p-4"><div className="flex items-center gap-2 text-orange">{icon}<span className="text-xs font-medium uppercase tracking-wider text-ink-faint">{label}</span></div><p className="mt-3 text-sm font-medium leading-6 text-ink">{value}</p></div>
}
