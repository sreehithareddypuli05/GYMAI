import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { ExerciseCard } from '@/components/gymai/ExerciseCard'
import { ExerciseModal } from '@/components/gymai/ExerciseModal'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { getProfile } from '@/services/profileService'
import { getExercises } from '@/services/exerciseService'
import type { Difficulty, Equipment, Exercise, MuscleGroup } from '@/types'

const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body']
const equipmentList: (Equipment | 'All')[] = ['All', 'No Equipment', 'Dumbbells', 'Barbell', 'Bench', 'Resistance Bands', 'Pull-up Bar', 'Kettlebell', 'Treadmill', 'Exercise Mat']
const difficulties: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

const userEquipmentMapping: Record<string, string[]> = {
  'No Equipment': ['None'],
  None: ['None'],
  Dumbbells: ['Dumbbell'],
  Dumbbell: ['Dumbbell'],
  Barbell: ['Barbell'],
  Bench: ['Bench'],
  'Resistance Bands': ['Bands'],
  Bands: ['Bands'],
  'Band(s)': ['Bands'],
  'Pull-up Bar': ['Pull-up Bar'],
  Kettlebell: ['Kettlebell'],
  Treadmill: ['Treadmill'],
  'Exercise Mat': ['Exercise Mat'],
  Machine: ['Machine'],
  Cable: ['Cable'],
  'Full Gym': ['Machine', 'Cable', 'Barbell', 'Dumbbell', 'Kettlebell', 'Bands', 'Bench', 'Pull-up Bar', 'Treadmill', 'Exercise Mat'],
}

function FilterPills<T extends string>({ options, active, onChange }: { options: T[]; active: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            active === opt
              ? 'border-emerald/40 bg-emerald/10 text-emerald'
              : 'border-surface-borderStrong text-ink-muted hover:text-ink'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function Exercises() {
  const [query, setQuery] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | 'All'>('All')
  const [equipment, setEquipment] = useState<Equipment | 'All'>('All')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [myEquipmentEnabled, setMyEquipmentEnabled] = useState(false)
  const [profileEquipment, setProfileEquipment] = useState<Equipment[]>([])
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [results, setResults] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Exercise | null>(null)

  useEffect(() => {
    let active = true

    getProfile()
      .then((user) => {
        if (!active) return
        setProfileEquipment(Array.isArray(user.equipment) ? user.equipment.filter((item): item is Equipment => Boolean(item)) : [])
        setProfileLoaded(true)
      })
      .catch(() => {
        if (!active) return
        setProfileEquipment([])
        setProfileLoaded(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => {
      getExercises({ query, muscleGroup, equipment, difficulty }).then((res) => {
        if (!myEquipmentEnabled || !profileLoaded || profileEquipment.length === 0) {
          setResults(res)
          setLoading(false)
          return
        }

        const allowedEquipment = new Set<string>()
        for (const item of profileEquipment) {
          const mappedValues = userEquipmentMapping[item] ?? [item]
          for (const value of mappedValues) {
            allowedEquipment.add(value)
          }
        }

        const filtered = res.filter((exercise) => {
          const exerciseEquipmentName = String(exercise.equipment)

          if (allowedEquipment.has('None')) {
            return exerciseEquipmentName === 'None'
          }

          if (exerciseEquipmentName === 'None') {
            return false
          }

          return allowedEquipment.has(exerciseEquipmentName)
        })

        setResults(filtered)
        setLoading(false)
      })
    }, 200)
    return () => clearTimeout(id)
  }, [query, muscleGroup, equipment, difficulty, myEquipmentEnabled, profileLoaded, profileEquipment])

  const myEquipmentAvailable = profileLoaded && profileEquipment.length > 0

  return (
    <AppShell>
      <PageHeader eyebrow="60+ movements" title="Exercise Library" description="Explore exercises by muscle group, equipment and difficulty. Video guidance will be added soon." />

      <div className="card-surface p-5 mb-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercises…"
              className="w-full rounded-xl border border-surface-borderStrong bg-surface pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/40"
            />
          </div>
          <button
            type="button"
            onClick={() => setMyEquipmentEnabled((prev) => !prev)}
            disabled={!myEquipmentAvailable}
            className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
              myEquipmentEnabled
                ? 'border-emerald/40 bg-emerald/10 text-emerald'
                : 'border-surface-borderStrong text-ink-muted hover:text-ink'
            } ${!myEquipmentAvailable ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            My Equipment
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-ink-faint mb-1.5">Muscle group</p>
            <FilterPills options={muscleGroups} active={muscleGroup} onChange={setMuscleGroup} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-ink-faint mb-1.5">Equipment</p>
            <FilterPills options={equipmentList} active={equipment} onChange={setEquipment} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-ink-faint mb-1.5">Difficulty</p>
            <FilterPills options={difficulties} active={difficulty} onChange={setDifficulty} />
          </div>
        </div>
      </div>

      {!loading && results.length > 0 && <div className="mb-4 flex items-center justify-between text-xs text-ink-faint"><span>{results.length} exercises available</span><span>Video guidance coming soon</span></div>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <p className="text-ink font-medium mb-1">No exercises match those filters</p>
          <p className="text-sm text-ink-faint">Try widening your search or clearing a filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onClick={() => setSelected(ex)} />
          ))}
        </div>
      )}

      <ExerciseModal exercise={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AppShell>
  )
}
