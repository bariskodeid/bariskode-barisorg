import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { GridBackground } from '@/components/ui/GridBackground'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'bariskode.org — Belajar Programming, Data, & Cybersecurity',
  description:
    'Platform pembelajaran open source untuk programming, database, data science, dan cybersecurity — dari nol sampai production.',
}

// SENGAJA TIDAK baca cookies()/headers() di sini (mis. untuk locale) — root
// layout ini dipakai semua route termasuk yang ISR (courses, blog, lihat
// revalidate=60 di sana). Dynamic API di layout akan memaksa SEMUA route jadi
// dynamic, sama seperti alasan Header.tsx sengaja fetch auth state client-side
// (lihat komentar di sana). Locale untuk halaman ISR ditangani via client
// island (komponen <T>), bukan di sini — lihat lib/i18n/LocaleContext.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <LocaleProvider>
          <GridBackground />
          <div
            className="min-h-screen flex flex-col font-sans text-foreground selection:bg-white selection:text-black relative"
            style={{ zIndex: 1 }}
          >
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </LocaleProvider>
      </body>
    </html>
  )
}
