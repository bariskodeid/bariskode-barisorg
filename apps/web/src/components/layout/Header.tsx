'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { LogoutButton } from './LogoutButton'

// Nav item ditambah bertahap seiring fase roadmap selesai (lihat
// docs/17-ROADMAP.md) — jangan link ke rute yang belum dibangun.
const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/courses', label: 'Kursus' },
]

export function Header() {
  const pathname = usePathname()
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-sm font-mono font-bold tracking-tighter uppercase">
          bariskode.org
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-xs font-mono uppercase tracking-widest transition-colors hover:text-white',
                pathname === item.href ? 'text-white' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              href="/my-learning"
              className={cn(
                'text-xs font-mono uppercase tracking-widest transition-colors hover:text-white',
                pathname === '/my-learning' ? 'text-white' : 'text-muted-foreground',
              )}
            >
              Belajar Saya
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
