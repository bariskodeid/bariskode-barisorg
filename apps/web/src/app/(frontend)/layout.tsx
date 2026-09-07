import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { GridBackground } from '@/components/ui/GridBackground'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'bariskode.org — Belajar Programming, Data, & Cybersecurity',
  description:
    'Platform pembelajaran open source untuk programming, database, data science, dan cybersecurity — dari nol sampai production.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <GridBackground />
        <div
          className="min-h-screen flex flex-col font-sans text-foreground selection:bg-white selection:text-black relative"
          style={{ zIndex: 1 }}
        >
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
