'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import type { User } from '@/payload-types'

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Status login dicek client-side (bukan lewat props dari server layout)
// supaya halaman ISR seperti landing page tidak ikut jadi fully dynamic
// gara-gara root layout membaca cookies/headers (lihat app/(frontend)/layout.tsx).
// Trade-off: nav auth state sempat "logged out" sesaat sebelum fetch pertama
// selesai.
//
// State-nya SENGAJA di context, bukan di Header: Header hidup di root layout
// dan tidak di-remount saat soft navigation (router.push/router.refresh), jadi
// fetch sekali saat mount tidak pernah melihat login/logout yang terjadi
// sesudahnya. Login, register, dan logout wajib memanggil setUser/refreshUser.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  // Penanda request terbaru — respons /api/users/me yang lebih lama (mis. fetch
  // awal yang lambat) tidak boleh menimpa hasil login/logout yang lebih baru.
  const latestRequest = useRef(0)

  const setUser = useCallback((next: User | null) => {
    latestRequest.current++
    setUserState(next)
  }, [])

  const refreshUser = useCallback(async () => {
    const requestId = ++latestRequest.current
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' })
      const data = await res.json()
      if (requestId === latestRequest.current) setUserState(data?.user ?? null)
    } catch {
      // Gagal jaringan: biarkan state terakhir yang diketahui.
    }
  }, [])

  useEffect(() => {
    // setState di refreshUser baru jalan setelah fetch selesai (async), bukan
    // sinkron di dalam effect — rule ini tidak bisa melihat itu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser()
  }, [refreshUser])

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
