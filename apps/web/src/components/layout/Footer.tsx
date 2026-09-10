'use client'

import Link from 'next/link'

import { useLocale } from '@/lib/i18n/LocaleContext'
import { useSettings } from '@/lib/useSettings'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLocale()
  const { settings } = useSettings()

  const socialLinks = [
    { url: settings?.github || undefined, label: 'GitHub' },
    { url: settings?.twitter || undefined, label: 'Twitter' },
    { url: settings?.discord || undefined, label: 'Discord' },
    { url: settings?.youtube || undefined, label: 'YouTube' },
  ].filter((link) => link.url)

  return (
    <footer className="border-t border-white/10 bg-background py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-mono font-bold uppercase mb-4">
              {settings?.siteName || 'bariskode.org'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {settings?.footerTagline || t.footer.tagline}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-mono font-bold uppercase mb-4">{t.footer.explore}</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-white transition-colors">
                {t.nav.home}
              </Link>
              <Link href="/courses" className="hover:text-white transition-colors">
                {t.nav.courses}
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                {t.nav.blog}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            {settings?.copyrightText || t.footer.license(currentYear)}
          </p>
          <p className="text-xs text-muted-foreground font-mono">{t.footer.openSource}</p>
        </div>
      </div>
    </footer>
  )
}
