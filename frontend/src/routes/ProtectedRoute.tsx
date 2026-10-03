import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { LockKeyhole, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
  allowIncomplete?: boolean
}

export function ProtectedRoute({
  children,
  allowIncomplete = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <FullPageSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!allowIncomplete && user && !user.profile_completed && location.pathname !== '/profile') {
    return (
      <div className="min-h-screen bg-charcoal px-5 py-10 text-ink">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-surface-border bg-surface p-8 text-center shadow-card sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-orange/20 bg-orange/10 text-orange">
              <LockKeyhole size={28} />
            </div>
            <p className="label-eyebrow mt-6">Profile required</p>
            <h1 className="mt-2 text-3xl font-semibold">Complete your profile to unlock this page</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-muted">
              Tell GymAI a little about you first. Your goal, experience, equipment and training schedule are used to build your personalized experience.
            </p>
            <Link to="/profile" className="mx-auto mt-7 inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-dark">
              Complete my profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
