import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/context/ToastContext'
import { requestPasswordReset, verifyPasswordResetCode } from '@/services/authService'

export default function ForgotPassword() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const sendCode = async (event: FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || loading) return
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      showToast('Verification code sent to your registered email.', 'success')
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Could not send the verification code.', 'error')
    } finally { setLoading(false) }
  }

  const verify = async (event: FormEvent) => {
    event.preventDefault()
    if (code.length !== 6 || loading) return
    setLoading(true)
    try {
      await verifyPasswordResetCode(email.trim(), code)
      sessionStorage.setItem('gymai_reset_email', email.trim())
      sessionStorage.setItem('gymai_reset_code', code)
      navigate('/reset-password')
    } catch (error: any) {
      showToast(error?.response?.data?.detail || 'Incorrect verification code.', 'error')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Verify your identity first. You will choose a new password on the next step."
    >
      <form onSubmit={email ? verify : sendCode} className="space-y-4" noValidate>
        {!code && (
          <Input label="Registered email" type="email" autoComplete="email" placeholder="you@example.com" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} />
        )}

        {email && !code && (
          <Button type="button" disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || loading} onClick={sendCode} className="w-full">
            {loading ? 'Sending code…' : 'Send verification code'}
          </Button>
        )}

        {email && (
          <>
            <div className="rounded-xl border border-orange/20 bg-orange/5 px-4 py-3 text-sm text-ink-muted">
              <div className="flex items-center gap-2 font-medium text-ink"><ShieldCheck size={16} className="text-orange" /> Verification required</div>
              <p className="mt-1 text-xs">A 6-digit code was sent to <span className="text-ink">{email}</span>. It expires in 10 minutes.</p>
            </div>
            <Input label="Verification code" inputMode="numeric" maxLength={6} placeholder="000000" icon={<KeyRound size={16} />} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
            {code && (
              <Button type="submit" disabled={code.length !== 6 || loading} className="w-full">
                {loading ? 'Verifying code…' : 'Verify code'}
              </Button>
            )}
            <button type="button" onClick={() => { setEmail(''); setCode('') }} className="w-full text-center text-xs text-ink-faint hover:text-orange">Use a different email</button>
          </>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">Remember your password? <Link to="/login" className="font-medium text-orange hover:text-orange-light">Log in</Link></p>
      <Link to="/login" className="mt-5 inline-flex w-full items-center justify-center gap-2 text-xs text-ink-faint hover:text-ink"><ArrowLeft size={14} /> Back to login</Link>
    </AuthLayout>
  )
}
