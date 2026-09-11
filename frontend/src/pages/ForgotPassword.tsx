import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { useToast } from '@/context/ToastContext'
import { requestPasswordReset, resetPassword } from '@/services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleRequest(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@') || loading) return
    setLoading(true); setError('')
    try {
      await requestPasswordReset(email)
      setStep(2)
      showToast('If that email is registered, a verification code has been sent.', 'success')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not send the verification code.')
    } finally { setLoading(false) }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    if (code.length !== 6 || newPassword.length < 6 || loading) return
    setLoading(true); setError('')
    try {
      await resetPassword(email, code, newPassword)
      showToast('Password reset successfully. Please log in.', 'success')
      navigate('/login')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not reset your password.')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title={step === 1 ? 'Forgot your password?' : 'Enter your verification code'}
      subtitle={step === 1 ? 'We will email you a 6-digit code so you can securely create a new password.' : `Enter the 6-digit code sent to ${email}.`}
    >
      {step === 1 ? (
        <form onSubmit={handleRequest} className="space-y-4" noValidate>
          <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p role="alert" className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={!email.includes('@') || loading} loading={loading} className="w-full">Send verification code</Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4" noValidate>
          <Input label="6-digit code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" icon={<KeyRound size={16} />} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
          <PasswordInput label="New password" name="new-password" autoComplete="new-password" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {error && <p role="alert" className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={code.length !== 6 || newPassword.length < 6 || loading} loading={loading} className="w-full">Reset password</Button>
          <button type="button" onClick={() => { setStep(1); setError('') }} className="w-full text-sm text-ink-faint hover:text-orange transition-colors">Use a different email</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-ink-faint">
        <Link to="/login" className="inline-flex items-center gap-2 text-orange hover:text-orange-light font-medium transition-colors"><ArrowLeft size={15} /> Back to login</Link>
      </p>
    </AuthLayout>
  )
}
