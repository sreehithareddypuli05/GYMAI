import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <Lock size={16} />
          </span>
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl border bg-surface pl-10 pr-11 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-200',
              'border-surface-borderStrong focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/40',
              error && 'border-danger/60 focus:border-danger focus:ring-danger/30',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'
