import { useState } from 'react'
import { ExternalLink, ShoppingBag, Dumbbell } from 'lucide-react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { useLanguage } from '@/context/LanguageContext'
import { equipmentByLevel, shoppingUrl, type EquipmentLevel } from '@/data/equipment'

export default function Equipment() {
  const { t } = useLanguage()
  const [level, setLevel] = useState<EquipmentLevel>('Beginner')
  const levels: EquipmentLevel[] = ['Beginner', 'Intermediate', 'Advanced']
  return (
    <AppShell>
      <PageHeader eyebrow={t('Equipment')} title={t('Equipment')} description="Choose equipment by training level and browse current shopping options." />
      <div className="equipment-page-shell">
        <div className="equipment-levels" role="tablist" aria-label={t('Equipment')}>
          {levels.map((item) => <button key={item} role="tab" aria-selected={level === item} onClick={() => setLevel(item)} className={`equipment-level-tab ${level === item ? 'active' : ''}`}><Dumbbell size={15} />{t(item)}</button>)}
        </div>
        <motion.div key={level} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentByLevel[level].map((item) => (
            <article key={item.id} className="equipment-card">
              <div className="equipment-card-image"><img src={item.image} alt={item.name} loading="lazy" /><span>{t(level)}</span></div>
              <div className="p-5"><h2 className="text-lg font-semibold text-ink">{item.name}</h2><p className="mt-2 min-h-14 text-sm leading-6 text-ink-muted">{item.description}</p><div className="mt-5 grid grid-cols-2 gap-2"><a href={shoppingUrl('amazon', item.amazonQuery)} target="_blank" rel="noreferrer" className="equipment-buy equipment-buy-amazon"><ShoppingBag size={14} />{t('Amazon')}</a><a href={shoppingUrl('flipkart', item.flipkartQuery)} target="_blank" rel="noreferrer" className="equipment-buy equipment-buy-flipkart"><ExternalLink size={14} />{t('Flipkart')}</a></div></div>
            </article>
          ))}
        </motion.div>
      </div>
    </AppShell>
  )
}
