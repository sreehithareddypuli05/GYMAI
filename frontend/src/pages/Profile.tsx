import { useRef, useState } from 'react'

import {
  Camera,
  Dumbbell,
  Target,
  CalendarDays,
  Wrench,
  Check,
} from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

import type {
  Equipment,
  FitnessLevel,
  Goal,
} from '@/types'

const levels: FitnessLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
]

const goals: Goal[] = [
  'Build Muscle',
  'Lose Fat',
  'Gain Strength',
  'Improve Endurance',
  'General Fitness',
]

const equipmentOptions: Equipment[] = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Bodyweight',
  'Cable',
  'Kettlebell',
  'Bands',
]

export default function Profile() {
  const { user, updateUser } = useAuth()

  const { showToast } = useToast()

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] =
    useState(!user?.profile_completed)

  const [isSaving, setIsSaving] =
    useState(false)

  const [fullName, setFullName] =
    useState(user?.full_name ?? '')

  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(
      user?.avatar_url ?? null,
    )

  const [level, setLevel] =
    useState<FitnessLevel | null>(
      user?.fitness_level ?? null,
    )

  const [goal, setGoal] =
    useState<Goal | null>(
      user?.goal ?? null,
    )

  const [frequency, setFrequency] =
    useState<number | null>(
      user?.training_frequency ?? null,
    )

  const [equipment, setEquipment] =
    useState<Equipment[]>(
      user?.equipment ?? [],
    )

  if (!user) return null

  const isComplete =
    Boolean(fullName.trim()) &&
    Boolean(level) &&
    Boolean(goal) &&
    Boolean(frequency) &&
    equipment.length > 0

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast(
        'Please select an image file.',
        'error',
      )
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast(
        'Please choose an image smaller than 2 MB.',
        'error',
      )
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  const toggleEquipment = (
    item: Equipment,
  ) => {
    setEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((e) => e !== item)
        : [...prev, item],
    )
  }

  const resetProfile = () => {
    setFullName(user.full_name)

    setAvatarUrl(
      user.avatar_url ?? null,
    )

    setLevel(
      user.fitness_level ?? null,
    )

    setGoal(
      user.goal ?? null,
    )

    setFrequency(
      user.training_frequency ?? null,
    )

    setEquipment(
      user.equipment ?? [],
    )

    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      showToast(
        'Please enter your full name.',
        'error',
      )
      return
    }

    setIsSaving(true)

    try {
      const updated = await updateUser({
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        fitness_level: level ?? undefined,
        goal: goal ?? undefined,
        training_frequency:
          frequency ?? undefined,
        equipment,
        profile_completed: isComplete,
      })

      setFullName(updated.full_name)

      setAvatarUrl(
        updated.avatar_url ?? null,
      )

      setLevel(
        updated.fitness_level ?? null,
      )

      setGoal(
        updated.goal ?? null,
      )

      setFrequency(
        updated.training_frequency ?? null,
      )

      setEquipment(
        updated.equipment ?? [],
      )

      setIsEditing(false)

      showToast(
        isComplete
          ? 'Your profile has been updated.'
          : 'Changes saved. Complete your training profile anytime.',
        'success',
      )
    } catch {
      showToast(
        'Could not update your profile. Please try again.',
        'error',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const memberSince = user.created_at
    ? new Date(
        user.created_at,
      ).toLocaleDateString(
        undefined,
        {
          month: 'long',
          year: 'numeric',
        },
      )
    : null

  return (
    <AppShell>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your account and training preferences."
      />

      <div className="mx-auto w-full max-w-5xl">

        {/* Profile completion notice */}
        {!user.profile_completed && (
          <section className="mb-6 border border-emerald/25 bg-emerald/[0.06] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-ink">
                  Complete your training profile
                </p>

                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  Add your fitness preferences so GymAI can personalize
                  your training experience.
                </p>
              </div>

             
            </div>
          </section>
        )}

        {/* Profile identity */}
        <section className="border border-surface-border bg-surface">

          <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-7">

            {/* Avatar */}
            <div className="relative shrink-0 self-start sm:self-auto">
              <Avatar
                name={fullName || user.full_name}
                src={avatarUrl}
                size="xl"
              />

              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center border border-surface-borderStrong bg-surface-raised text-emerald transition-colors hover:border-emerald/50"
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

            {/* User information */}
            <div className="min-w-0 flex-1">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">
                  <h2 className="truncate font-display text-xl font-semibold text-ink sm:text-2xl">
                    {fullName || user.full_name}
                  </h2>

                  <p className="mt-1 break-all text-sm text-ink-muted">
                    {user.email}
                  </p>

                  {memberSince && (
                    <p className="mt-3 text-xs text-ink-faint">
                      Member since {memberSince}
                    </p>
                  )}
                </div>

                {/* Only ONE edit button */}
                {!isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      setIsEditing(true)
                    }
                  >
                    Edit profile
                  </Button>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* PROFILE VIEW */}
        {!isEditing && user.profile_completed && (
          <section className="mt-6 border border-surface-border bg-surface">

            <div className="border-b border-surface-border px-5 py-5 sm:px-7">
              <p className="label-eyebrow">
                Training profile
              </p>

              <h3 className="mt-2 text-lg font-semibold text-ink sm:text-xl">
                Your fitness preferences
              </h3>

              <p className="mt-1 text-sm text-ink-muted">
                A quick overview of how you prefer to train.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2">

              <SummaryItem
                icon={<Target size={18} />}
                label="Primary goal"
                value={goal ?? 'Not set'}
              />

              <SummaryItem
                icon={<Dumbbell size={18} />}
                label="Training experience"
                value={level ?? 'Not set'}
              />

              <SummaryItem
                icon={<CalendarDays size={18} />}
                label="Training schedule"
                value={
                  frequency
                    ? `${frequency} ${
                        frequency === 1
                          ? 'day'
                          : 'days'
                      } per week`
                    : 'Not set'
                }
              />

              <SummaryItem
                icon={<Wrench size={18} />}
                label="Available equipment"
                value={
                  equipment.length
                    ? `${equipment.length} selected`
                    : 'Not set'
                }
              />

            </div>

          </section>
        )}

        {/* EDIT PROFILE */}
        {isEditing && (
          <div className="mt-6 border border-surface-border bg-surface">

            {/* Account details */}
            <section className="p-5 sm:p-7">

              <div className="mb-6">
                <p className="label-eyebrow">
                  Account details
                </p>

                <h3 className="mt-2 text-lg font-semibold text-ink sm:text-xl">
                  Personal information
                </h3>

                <p className="mt-1 text-sm text-ink-muted">
                  Update the basic details associated with your account.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Input
                  label="Full name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                />

                <Input
                  label="Email"
                  value={user.email}
                  disabled
                />

              </div>
            </section>

            <div className="border-t border-surface-border" />

            {/* Training preferences */}
            <section className="p-5 sm:p-7">

              <div className="mb-8">
                <p className="label-eyebrow">
                  Training preferences
                </p>

                <h3 className="mt-2 text-lg font-semibold text-ink sm:text-xl">
                  Personalize your training
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  These preferences help GymAI understand your training
                  style and goals.
                </p>
              </div>

              <div className="space-y-8">

                {/* Goal */}
                <PreferenceSection
                  label="What is your primary goal?"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {goals.map((item) => {
                      const selected = goal === item

                      return (
                        <OptionButton
                          key={item}
                          selected={selected}
                          onClick={() =>
                            setGoal(item)
                          }
                        >
                          {item}
                        </OptionButton>
                      )
                    })}
                  </div>
                </PreferenceSection>

                {/* Experience */}
                <PreferenceSection
                  label="Training experience"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {levels.map((item) => {
                      const selected = level === item

                      return (
                        <OptionButton
                          key={item}
                          selected={selected}
                          onClick={() =>
                            setLevel(item)
                          }
                        >
                          {item}
                        </OptionButton>
                      )
                    })}
                  </div>
                </PreferenceSection>

                {/* Frequency */}
                <PreferenceSection
                  label="How often do you usually train?"
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {[2, 3, 4, 5, 6, 7].map(
                      (days) => {
                        const selected =
                          frequency === days

                        return (
                          <button
                            type="button"
                            key={days}
                            onClick={() =>
                              setFrequency(days)
                            }
                            className={`min-h-[74px] border px-3 py-3 text-left text-sm transition-colors ${
                              selected
                                ? 'border-emerald bg-emerald/10 text-emerald'
                                : 'border-surface-borderStrong bg-charcoal/30 text-ink-muted hover:border-emerald/40 hover:text-ink'
                            }`}
                          >
                            <span className="block font-medium">
                              {days === 7
                                ? 'Every day'
                                : `${days} days`}
                            </span>

                            <span className="mt-1 block text-xs opacity-70">
                              per week
                            </span>
                          </button>
                        )
                      },
                    )}
                  </div>
                </PreferenceSection>

                {/* Equipment */}
                <PreferenceSection
                  label="What equipment do you have access to?"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

                    {equipmentOptions.map(
                      (item) => {
                        const selected =
                          equipment.includes(item)

                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() =>
                              toggleEquipment(item)
                            }
                            className={`flex min-h-[52px] items-center justify-between border px-4 py-3 text-left text-sm transition-colors ${
                              selected
                                ? 'border-emerald bg-emerald/10 text-emerald'
                                : 'border-surface-borderStrong bg-charcoal/30 text-ink-muted hover:border-emerald/40 hover:text-ink'
                            }`}
                          >
                            <span>
                              {item}
                            </span>

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                                selected
                                  ? 'border-emerald bg-emerald text-charcoal'
                                  : 'border-surface-borderStrong'
                              }`}
                            >
                              {selected && (
                                <Check size={13} />
                              )}
                            </span>
                          </button>
                        )
                      },
                    )}

                  </div>
                </PreferenceSection>

              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-surface-border p-5 sm:flex-row sm:items-center sm:justify-end sm:p-7">

              {user.profile_completed && (
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={resetProfile}
                >
                  Cancel
                </Button>
              )}

              <Button
                onClick={handleSave}
                loading={isSaving}
                className="w-full sm:w-auto"
              >
                {user.profile_completed
                  ? 'Save changes'
                  : 'Complete profile'}
              </Button>

            </div>

          </div>
        )}

      </div>
    </AppShell>
  )
}

interface PreferenceSectionProps {
  label: string
  children: React.ReactNode
}

function PreferenceSection({
  label,
  children,
}: PreferenceSectionProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-ink">
        {label}
      </label>

      {children}
    </div>
  )
}

interface OptionButtonProps {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}

function OptionButton({
  children,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[52px] items-center justify-between border px-4 py-3 text-left text-sm transition-colors ${
        selected
          ? 'border-emerald bg-emerald/10 text-emerald'
          : 'border-surface-borderStrong bg-charcoal/30 text-ink-muted hover:border-emerald/40 hover:text-ink'
      }`}
    >
      <span>{children}</span>

      {selected && (
        <Check
          size={17}
          className="shrink-0"
        />
      )}
    </button>
  )
}

interface SummaryItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-4 border-b border-surface-border p-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r sm:p-6">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-ink-faint">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-ink">
          {value}
        </p>
      </div>

    </div>
  )
}