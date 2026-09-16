import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'

export function LanguageSwitcher() {
  const { t } = useTranslation()

  return (
    <label className="flex items-center gap-1.5 rounded-xl border border-surface-borderStrong px-2 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink">
      <Languages size={14} aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        aria-label={t('language')}
        value={['en', 'es', 'hi', 'te'].includes(i18n.resolvedLanguage ?? '') ? i18n.resolvedLanguage : 'en'}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="cursor-pointer bg-transparent text-xs font-medium text-inherit outline-none"
      >
        <option value="en">{t('english')}</option>
        <option value="es">{t('spanish')}</option>
        <option value="hi">{t('hindi')}</option>
        <option value="te">{t('telugu')}</option>
      </select>
    </label>
  )
}
