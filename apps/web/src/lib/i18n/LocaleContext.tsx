'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

import { LOCALE_COOKIE } from './constants'
import { type Dictionary, type Locale, dictionaries } from './dictionaries'

interface LocaleContextValue {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'id'
  const match = document.cookie.match(/(?:^|; )locale=(id|en)/)
  return match ? (match[1] as Locale) : 'id'
}

// SENGAJA tidak menerima locale dari server (lihat komentar di
// app/(frontend)/layout.tsx — root layout tidak boleh baca cookies() supaya
// halaman ISR seperti courses/blog tidak ikut jadi fully dynamic). Default
// 'id' saat render awal (server & first paint client selalu sama, hydration-
// safe), lalu disesuaikan dari cookie browser lewat useEffect — konsekuensi:
// user yang pernah pilih EN sempat melihat kilasan UI Indonesia sebelum
// useEffect jalan, sama seperti trade-off status login di Header.tsx.
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    // Sinkronisasi sekali dari cookie browser setelah mount (hydration-safe:
    // server & first client render selalu 'id', baru dikoreksi di sini kalau
    // cookie bilang lain) — pola yang sama dipakai library seperti
    // next-themes untuk masalah SSR-mismatch yang serupa.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(readLocaleCookie())
  }, [])

  function setLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`
    setLocaleState(next)
    router.refresh()
  }

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale harus dipakai di dalam LocaleProvider')
  return ctx
}

type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T]

// Client island untuk teks UI di halaman server component ISR (courses,
// blog, dst) yang SENGAJA tidak boleh panggil getLocale()/cookies() di
// server supaya cache revalidate=60 tetap jalan. Props `ns`/`k` dipakai
// (bukan children berupa function) karena function TIDAK BISA dilewatkan
// sebagai prop dari Server Component ke Client Component — React RSC cuma
// bisa serialize data biasa lewat boundary itu. Contoh pakai:
// <T ns="courses" k="title" />
export function T<N extends keyof Dictionary>({ ns, k }: { ns: N; k: StringKeys<Dictionary[N]> }) {
  const { t } = useLocale()
  return <>{t[ns][k] as string}</>
}
