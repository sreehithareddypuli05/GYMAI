import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Language } from '@/context/LanguageContext'

const GOOGLE_LANGS: Record<Exclude<Language, 'en'>, string> = {
  te: 'te',
  hi: 'hi',
  ml: 'ml',
  kn: 'kn',
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

export function applyGoogleLanguage(language: Language) {
  const target = language === 'en' ? 'en' : GOOGLE_LANGS[language]

  // Google Translate persists its language in this cookie. Keeping it at the
  // root makes it apply to every route of the SPA, including refreshed pages.
  if (target === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  } else {
    document.cookie = `googtrans=/en/${target}; path=/`
  }

  // Ask the already-loaded widget to switch immediately when possible.
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (select && target !== 'en') {
    select.value = target
    select.dispatchEvent(new Event('change'))
    return
  }

  // Reload guarantees that all currently rendered text, including hard-coded
  // headings/paragraphs and dynamic API content, is translated on the first
  // paint of the selected language.
  window.location.reload()
}

export function GoogleTranslateBridge() {
  const location = useLocation()

  useEffect(() => {
    const saved = (localStorage.getItem('gymai_language') || 'en') as Language
    const target = saved === 'en' ? 'en' : GOOGLE_LANGS[saved as Exclude<Language, 'en'>]
    const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('googtrans='))
    if (target !== 'en' && !hasCookie) {
      document.cookie = `googtrans=/en/${target}; path=/`
      window.location.reload()
      return
    }

    const existing = document.getElementById('google-translate-script')
    if (existing) return

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'te,hi,ml,kn',
          autoDisplay: false,
          multilanguagePage: true,
        },
        'google_translate_element',
      )
    }

    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // The Google script intentionally remains loaded for SPA navigation.
    }
  }, [])

  useEffect(() => {
    const target = (localStorage.getItem('gymai_language') || 'en') as Language
    if (target === 'en') return

    // React Router navigation does not reload the document. Re-apply the
    // Google translator after each route change so newly rendered headings,
    // paragraphs and workout content are translated as well.
    const timer = window.setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
      const googleTarget = GOOGLE_LANGS[target as Exclude<Language, 'en'>]
      if (select && googleTarget) {
        select.value = googleTarget
        select.dispatchEvent(new Event('change'))
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return <div id="google_translate_element" aria-hidden="true" className="google-translate-hidden" />
}
