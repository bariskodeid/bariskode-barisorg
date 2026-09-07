'use client'

import { useRouter } from 'next/navigation'

import { useLocale } from '@/lib/i18n/LocaleContext'

export function LogoutButton() {
  const router = useRouter()
  const { t } = useLocale()

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
    >
      {t.nav.logout}
    </button>
  )
}
