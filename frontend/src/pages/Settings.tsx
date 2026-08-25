import {
  useState,
} from 'react'

import {
  LogOut,
  Shield,
  User,
} from 'lucide-react'

import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'

import {
  useAuth,
} from '@/context/AuthContext'

import {
  useToast,
} from '@/context/ToastContext'

import {
  changePassword,
} from '@/services/authService'


export default function Settings() {
  const [currentPw, setCurrentPw] =
    useState('')

  const [newPw, setNewPw] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const {
    logout,
  } = useAuth()

  const {
    showToast,
  } = useToast()


  async function handlePasswordChange() {
    if (
      !currentPw ||
      !newPw
    ) {
      showToast(
        'Please enter both passwords.',
        'error',
      )

      return
    }

    if (
      newPw.length < 6
    ) {
      showToast(
        'New password must be at least 6 characters.',
        'error',
      )

      return
    }

    try {
      setLoading(true)

      await changePassword(
        currentPw,
        newPw,
      )

      showToast(
        'Password updated successfully.',
        'success',
      )

      setCurrentPw('')
      setNewPw('')
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        'Could not update password.'

      showToast(
        message,
        'error',
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Manage your account and security."
      />

      <div className="max-w-2xl space-y-6">

        {/* Security */}

        <div className="card-surface p-6">

          <p className="label-eyebrow mb-3 flex items-center gap-1.5">
            <Shield size={12} />
            Security
          </p>

          <div className="mb-4 space-y-3">

            <PasswordInput
              label="Current password"
              placeholder="Enter current password"
              value={currentPw}
              onChange={(e) =>
                setCurrentPw(
                  e.target.value,
                )
              }
            />

            <PasswordInput
              label="New password"
              placeholder="At least 6 characters"
              value={newPw}
              onChange={(e) =>
                setNewPw(
                  e.target.value,
                )
              }
            />

          </div>

          <Button
            variant="secondary"
            onClick={
              handlePasswordChange
            }
            disabled={loading}
          >
            {loading
              ? 'Updating...'
              : 'Update password'}
          </Button>

        </div>


        {/* Account */}

        <div className="card-surface p-6">

          <p className="label-eyebrow mb-1 flex items-center gap-1.5">
            <User size={12} />
            Account
          </p>

          <p className="mb-4 text-xs text-ink-faint">
            Sign out of GymAI on this device.
          </p>

          <Button
            variant="danger"
            onClick={() =>
              logout()
            }
          >
            <LogOut size={15} />
            Log out
          </Button>

        </div>

      </div>
    </AppShell>
  )
}