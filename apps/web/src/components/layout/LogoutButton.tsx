'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/lib/auth/AuthContext'
import { useLocale } from '@/lib/i18n/LocaleContext'

export function LogoutButton() {
  const router = useRouter()
  const { t } = useLocale()
  const { refreshUser } = useAuth()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' }).catch(() => null)
    // Status akhir diambil ulang dari server, bukan langsung di-set logout:
    // kalau sesi sudah habis duluan, endpoint logout membalas 400 "No User"
    // padahal hasilnya sama-sama sudah logout. Kalau logout benar-benar gagal,
    // Header tetap menampilkan user yang masih login.
    await refreshUser()
    setPending(false)
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
    >
      {t.nav.logout}
    </button>
  )
}
