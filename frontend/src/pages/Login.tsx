import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, error, clearError } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isValid = email.trim().length > 3 && email.includes('@') && password.length >= 6

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    clearError()
    try {
      await login(email, password)
      showToast(t('ui.welcomeBack'), 'success')
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
          label={t('ui.email')}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('ui.emailPlaceholder')}
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label={t('ui.password')}
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="-mt-1 flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-orange hover:text-orange-light">{t('ui.forgotPassword')}</Link>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!isValid || loading} className="w-full">{loading ? t('ui.signingIn') : t('ui.logIn')}</Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">
        {t('ui.newToGymAI')}{' '}
        <Link to="/register" className="text-orange hover:text-orange-light font-medium transition-colors">
          {t('ui.createAccount')}
        </Link>
      </p>
    </AuthLayout>
  )
}
