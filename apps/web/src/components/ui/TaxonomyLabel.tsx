'use client'

import { useLocale } from '@/lib/i18n/LocaleContext'

// Client island untuk label taksonomi di halaman ISR (courses, blog) — pola
// sama seperti <T> di lib/i18n/LocaleContext.tsx. Nama kategori dari CMS
// dipakai apa adanya, kecuali dictionary locale aktif punya terjemahan untuk
// slug-nya (lihat `categoryNames` di dictionaries.ts).
export function CategoryName({ slug, name }: { slug: string; name: string }) {
  const { t } = useLocale()
  return <>{t.categoryNames[slug] ?? name}</>
}

export function LevelLabel({ level }: { level: string }) {
  const { t } = useLocale()
  return <>{t.levels[level] ?? level}</>
}
