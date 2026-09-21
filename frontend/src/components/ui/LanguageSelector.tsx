import { Languages } from 'lucide-react'
import { useLanguage, type Language } from '@/context/LanguageContext'
import { applyGoogleLanguage } from './GoogleTranslateBridge'

const options: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
]

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  return (
    <label className="language-selector inline-flex items-center gap-1.5 rounded-xl border border-surface-borderStrong bg-surface px-2.5 py-1.5 text-xs text-ink">
      <Languages size={14} className="text-orange" />
      {!compact && <span className="sr-only sm:not-sr-only">{t('Language')}</span>}
      <select value={language} onChange={(e) => { const next = e.target.value as Language; setLanguage(next); applyGoogleLanguage(next) }} aria-label={t('Language')} className="bg-transparent text-xs font-medium text-ink outline-none">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
