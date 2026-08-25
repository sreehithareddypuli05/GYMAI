import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FullPageSpinner } from '@/components/ui/Spinner'

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

  if (
    !allowIncomplete &&
    user &&
    !user.profile_completed &&
    location.pathname !== '/profile'
  ) {
    return <Navigate to="/profile" replace />
  }

  return <>{children}</>
}
