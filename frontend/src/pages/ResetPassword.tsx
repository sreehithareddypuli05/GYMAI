import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, LockKeyhole } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { useToast } from '@/context/ToastContext'
import { resetPasswordWithCode } from '@/services/authService'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('gymai_reset_email') || ''
    const savedCode = sessionStorage.getItem('gymai_reset_code') || ''
    if (!savedEmail || !/^\d{6}$/.test(savedCode)) navigate('/forgot-password', { replace: true })
    setEmail(savedEmail)
    setCode(savedCode)
  }, [navigate])

  const reset = async (event: FormEvent) => {
    event.preventDefault()
    if (newPassword.length < 6 || newPassword !== confirmPassword || loading) return
    setLoading(true)
    try {
      await resetPasswordWithCode(email, code, newPassword, confirmPassword)
      sessionStorage.removeItem('gymai_reset_email')
      sessionStorage.removeItem('gymai_reset_code')
      setSuccess(true)
      showToast('Password changed successfully.', 'success')
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Could not change your password.', 'error')
    } finally { setLoading(false) }
  }

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  return (
    <AuthLayout
      eyebrow="New password"
      title={success ? 'Password updated' : 'Choose a new password'}
      subtitle={success ? 'Your GymAI account is ready. Sign in with your new password.' : 'Create a strong password to finish securing your GymAI account.'}
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange/20 bg-orange/10 text-orange"><CheckCircle2 size={28} /></div>
          <div><p className="font-semibold text-ink">Your password has been changed.</p><p className="mt-1 text-sm text-ink-muted">Use your new password the next time you sign in.</p></div>
          <Link to="/login" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-4 py-3 text-sm font-semibold text-white hover:bg-orange-dark"><ArrowLeft size={16} /> Back to login</Link>
        </div>
      ) : (
        <form onSubmit={reset} className="space-y-4" noValidate>
          <div className="rounded-xl border border-surface-border bg-surface/70 px-4 py-3 text-sm text-ink-muted">
            <div className="flex items-center gap-2 font-medium text-ink"><LockKeyhole size={16} className="text-orange" /> Verification complete</div>
            <p className="mt-1 text-xs">Set a new password for <span className="text-ink">{email}</span>.</p>
          </div>
          <PasswordInput label="New password" autoComplete="new-password" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <PasswordInput label="Confirm new password" autoComplete="new-password" placeholder="Re-enter your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {mismatch && <p className="text-xs text-danger">Passwords do not match.</p>}
          <Button type="submit" disabled={newPassword.length < 6 || mismatch || loading} className="w-full">
            {loading ? 'Changing password…' : 'Change password'}
          </Button>
          <Link to="/login" className="inline-flex w-full items-center justify-center gap-2 text-xs text-ink-faint hover:text-ink"><ArrowLeft size={14} /> Cancel</Link>
        </form>
      )}
    </AuthLayout>
  )
}
