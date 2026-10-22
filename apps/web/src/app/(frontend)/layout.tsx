import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { GridBackground } from '@/components/ui/GridBackground'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { ThemeProvider } from '@/lib/theme/ThemeContext'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Open Graph & Twitter Card: og:title/og:description per halaman otomatis
// diambil Next.js dari `title`/`description` halaman itu, dan gambarnya dari
// opengraph-image.tsx di folder ini. Halaman lain JANGAN set `openGraph`
// sendiri — metadata di-merge dangkal, jadi objek `openGraph` di halaman
// menimpa seluruh objek ini (siteName, locale, dan gambar ikut hilang).
// metadataBase dibaca saat build untuk halaman statis — lihat ARG
// NEXT_PUBLIC_SERVER_URL di Dockerfile.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: 'bariskode.org — Belajar Programming, Data, & Cybersecurity',
  description:
    'Platform pembelajaran open source untuk programming, database, data science, dan cybersecurity — dari nol sampai production.',
  openGraph: {
    type: 'website',
    siteName: 'bariskode.org',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

// SENGAJA TIDAK baca cookies()/headers() di sini (mis. untuk locale) — root
// layout ini dipakai semua route termasuk yang ISR (courses, blog, lihat
// revalidate=60 di sana). Dynamic API di layout akan memaksa SEMUA route jadi
// dynamic, sama seperti alasan auth state sengaja di-fetch client-side (lihat
// lib/auth/AuthContext.tsx). Locale untuk halaman ISR ditangani via client
// island (komponen <T>), bukan di sini — lihat lib/i18n/LocaleContext.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=document.cookie.match(/theme=(dark|light)/);if(t&&t[1]==='light')document.documentElement.classList.add('light')})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <GridBackground />
              <div
                className="min-h-screen flex flex-col font-sans text-foreground selection:bg-white selection:text-black relative"
                style={{ zIndex: 1 }}
              >
                <Header />
                <main className="flex-1 pt-16">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
