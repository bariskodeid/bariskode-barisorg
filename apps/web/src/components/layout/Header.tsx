'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { SearchButton } from '@/components/ui/SearchDialog'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { useSettings } from '@/lib/useSettings'
import { cn } from '@/lib/utils'

import { LogoutButton } from './LogoutButton'

export function Header() {
  const pathname = usePathname()
  const { t } = useLocale()
  const { settings } = useSettings()

  // Nav item ditambah bertahap seiring fase roadmap selesai (lihat
  // docs/17-ROADMAP.md) — jangan link ke rute yang belum dibangun.
  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/courses', label: t.nav.courses },
    { href: '/blog', label: t.nav.blog },
  ]
  // Status login dicek client-side (bukan lewat props dari server layout)
  // supaya halaman ISR seperti landing page tidak ikut jadi fully dynamic
  // gara-gara root layout membaca cookies/headers. Trade-off: nav auth state
  // sempat "logged out" sesaat sebelum fetch selesai.
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setIsLoggedIn(Boolean(data?.user))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-sm font-mono font-bold tracking-tighter uppercase">
          {settings?.siteName || 'bariskode.org'}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-xs font-mono uppercase tracking-widest transition-colors hover:text-foreground',
                pathname === item.href ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link
                href="/my-learning"
                className={cn(
                  'text-xs font-mono uppercase tracking-widest transition-colors hover:text-foreground',
                  pathname === '/my-learning' ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {t.nav.myLearning}
              </Link>
              <Link
                href="/settings"
                className={cn(
                  'text-xs font-mono uppercase tracking-widest transition-colors hover:text-foreground',
                  pathname === '/settings' ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {t.nav.settings}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <SearchButton />
          <ThemeToggle />
          <LocaleSwitcher />
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
