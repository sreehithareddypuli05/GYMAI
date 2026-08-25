import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { EvasiveButton } from '@/components/auth/EvasiveButton'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, error, clearError } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const isValid = email.trim().length > 3 && email.includes('@') && password.length >= 6

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    clearError()
    try {
      await login(email, password)
      showToast('Welcome back.', 'success')
      navigate('/dashboard')
    } catch {
      // error surfaced via context
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to GymAI"
      subtitle="Pick up your training exactly where you left off."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </p>
        )}

        <EvasiveButton isValid={isValid} loading={loading} label="Log in" loadingLabel="Signing in…" />
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">
        New to GymAI?{' '}
        <Link to="/register" className="text-emerald hover:text-emerald-light font-medium transition-colors">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
