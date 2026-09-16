import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && <p className="label-eyebrow mb-2">{t(`pageText.${eyebrow}`, { defaultValue: eyebrow })}</p>}
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{t(`pageText.${title}`, { defaultValue: title })}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-muted max-w-xl">{t(`pageText.${description}`, { defaultValue: description })}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
