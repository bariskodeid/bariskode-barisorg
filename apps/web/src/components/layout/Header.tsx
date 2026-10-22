'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { SearchButton } from '@/components/ui/SearchDialog'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/auth/AuthContext'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { useHasPublishedPosts } from '@/lib/useHasPublishedPosts'
import { useSettings } from '@/lib/useSettings'
import { cn } from '@/lib/utils'

import { LogoutButton } from './LogoutButton'

export function Header() {
  const pathname = usePathname()
  const { t } = useLocale()
  const { settings } = useSettings()
  const hasPosts = useHasPublishedPosts()
  // Status login dari AuthProvider (lihat komentar di lib/auth/AuthContext.tsx
  // soal kenapa tidak di-fetch di sini).
  const { user, loading: authLoading } = useAuth()
  const isLoggedIn = Boolean(user)

  // Menu mobile tercatat terbuka untuk pathname tempat ia dibuka, jadi
  // otomatis tertutup begitu user pindah halaman (tanpa effect).
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const menuOpen = menuOpenedAt === pathname

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpenedAt(null)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  // Nav item ditambah bertahap seiring fase roadmap selesai (lihat
  // docs/17-ROADMAP.md) — jangan link ke rute yang belum dibangun. Blog baru
  // tampil kalau sudah ada artikel published (lib/useHasPublishedPosts.ts).
  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/courses', label: t.nav.courses },
    ...(hasPosts ? [{ href: '/blog', label: t.nav.blog }] : []),
    ...(isLoggedIn
      ? [
          { href: '/my-learning', label: t.nav.myLearning },
          { href: '/settings', label: t.nav.settings },
        ]
      : []),
  ]
  const navLinkClass = (href: string) =>
    cn(
      'text-xs font-mono uppercase tracking-widest transition-colors hover:text-foreground',
      pathname === href ? 'text-foreground' : 'text-muted-foreground',
    )

  const authActions = authLoading ? null : isLoggedIn ? (
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
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-sm font-mono font-bold tracking-tighter uppercase">
          {settings?.siteName || 'bariskode.org'}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <SearchButton />
          <ThemeToggle />
          <LocaleSwitcher />
          <div className="hidden md:flex items-center gap-4">
            {/* Placeholder selebar tombol Masuk/Daftar: status login belum
                diketahui, jangan tampilkan salah satunya dulu (flicker). */}
            {authActions ?? <span aria-hidden="true" className="block h-7 w-28" />}
          </div>
          {/* Di layar kecil nav & tombol akun pindah ke panel ini — tanpa
              panel, nav tidak ada sama sekali dan tombol Daftar terpotong. */}
          <button
            type="button"
            onClick={() => setMenuOpenedAt(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto px-6 py-4 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpenedAt(null)}
                className={cn(navLinkClass(item.href), 'py-3 border-b border-white/5')}
              >
                {item.label}
              </Link>
            ))}
            {authActions && <div className="flex items-center gap-4 pt-4">{authActions}</div>}
          </nav>
        </div>
      )}
    </header>
  )
}
