'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

// Nav item ditambah bertahap seiring fase roadmap selesai (lihat
// docs/17-ROADMAP.md) — jangan link ke rute yang belum dibangun.
const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/courses', label: 'Kursus' },
]

export function Header() {
  const pathname = usePathname()

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
        </nav>
      </div>
    </header>
  )
}
