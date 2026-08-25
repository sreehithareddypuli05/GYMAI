import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { ExerciseCard } from '@/components/gymai/ExerciseCard'
import { ExerciseModal } from '@/components/gymai/ExerciseModal'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { getExercises } from '@/services/exerciseService'
import type { Difficulty, Equipment, Exercise, MuscleGroup } from '@/types'

const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body']
const equipmentList: (Equipment | 'All')[] = ['All', 'None', 'Dumbbell', 'Barbell', 'Machine', 'Cable', 'Kettlebell', 'Bands', 'Full Gym']
const difficulties: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

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
  const [results, setResults] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Exercise | null>(null)

  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => {
      getExercises({ query, muscleGroup, equipment, difficulty }).then((res) => {
        setResults(res)
        setLoading(false)
      })
    }, 200)
    return () => clearTimeout(id)
  }, [query, muscleGroup, equipment, difficulty])

  return (
    <AppShell>
      <PageHeader eyebrow="60+ movements" title="Exercise Library" description="Explore guided exercises across beginner, intermediate and advanced training." />

      <div className="card-surface p-5 mb-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises…"
            className="w-full rounded-xl border border-surface-borderStrong bg-surface pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/40"
          />
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

      {!loading && results.length > 0 && <div className="mb-4 flex items-center justify-between text-xs text-ink-faint"><span>{results.length} exercises available</span><span>Every movement includes visual guidance</span></div>}

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
