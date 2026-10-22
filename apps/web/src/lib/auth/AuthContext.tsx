'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import type { User } from '@/payload-types'

interface AuthContextValue {
  user: User | null
  // true sampai status login pertama kali diketahui (fetch /api/users/me
  // awal selesai, atau login/logout sudah memanggil setUser).
  loading: boolean
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Status login dicek client-side (bukan lewat props dari server layout)
// supaya halaman ISR seperti landing page tidak ikut jadi fully dynamic
// gara-gara root layout membaca cookies/headers (lihat app/(frontend)/layout.tsx).
// Trade-off: status login belum diketahui sampai fetch pertama selesai —
// selama itu `loading` true dan Header menampilkan placeholder netral (bukan
// tombol Masuk/Daftar yang lalu berganti jadi menu user).
//
// State-nya SENGAJA di context, bukan di Header: Header hidup di root layout
// dan tidak di-remount saat soft navigation (router.push/router.refresh), jadi
// fetch sekali saat mount tidak pernah melihat login/logout yang terjadi
// sesudahnya. Login, register, dan logout wajib memanggil setUser/refreshUser.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // Penanda request terbaru — respons /api/users/me yang lebih lama (mis. fetch
  // awal yang lambat) tidak boleh menimpa hasil login/logout yang lebih baru.
  const latestRequest = useRef(0)

  const setUser = useCallback((next: User | null) => {
    latestRequest.current++
    setUserState(next)
    setLoading(false)
  }, [])

  const refreshUser = useCallback(async () => {
    const requestId = ++latestRequest.current
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' })
      const data = await res.json()
      if (requestId === latestRequest.current) setUserState(data?.user ?? null)
    } catch {
      // Gagal jaringan: biarkan state terakhir yang diketahui.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // setState di refreshUser baru jalan setelah fetch selesai (async), bukan
    // sinkron di dalam effect — rule ini tidak bisa melihat itu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser()
  }, [refreshUser])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
