import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, error, clearError } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const isValid =
    fullName.trim().length > 1 && email.trim().length > 3 && email.includes('@') && password.length >= 6

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    clearError()
    try {
      await register(fullName, email, password)
      showToast('Account created — welcome to GymAI.', 'success')
      navigate('/dashboard')
    } catch {
      // error surfaced via context
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Free to join — your first readiness readout is one workout away."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Alex Rivera"
          icon={<User size={16} />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          hint="Use at least 6 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!isValid || loading} className="w-full">{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">
        Already have an account?{' '}
        <Link to="/login" className="text-orange hover:text-orange-light font-medium transition-colors">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
