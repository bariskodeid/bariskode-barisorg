'use client'

import { useLocale } from '@/lib/i18n/LocaleContext'
import { cn } from '@/lib/utils'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest">
      {(['id', 'en'] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={cn(
            'px-1.5 transition-colors',
            locale === code ? 'text-white' : 'text-muted-foreground hover:text-white',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
