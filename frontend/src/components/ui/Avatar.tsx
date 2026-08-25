import { initials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-28 w-28 text-3xl',
}

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${name}'s profile`}
        className={cn(
          'shrink-0 rounded-full border border-surface-borderStrong object-cover bg-surface',
          sizes[size],
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        'border border-emerald/25 bg-emerald/10',
        'font-display font-semibold text-emerald-light',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </div>
  )
}