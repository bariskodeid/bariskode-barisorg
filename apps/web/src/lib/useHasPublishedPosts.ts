'use client'

import { useEffect, useState } from 'react'

// Menu Blog di Header/Footer disembunyikan selama belum ada artikel
// published (temuan QA: menu utama mengarah ke halaman kosong), dan muncul
// sendiri begitu artikel pertama terbit — tanpa deploy ulang. Hasilnya
// di-cache per page load supaya Header & Footer cuma memicu satu request.
// Posts.access.read untuk pengunjung anonim sudah dibatasi ke published;
// filter status di query ini supaya admin yang login juga melihat hal yang
// sama dengan pengunjung.
let cached: boolean | null = null
let pending: Promise<boolean> | null = null

function fetchHasPublishedPosts(): Promise<boolean> {
  pending ??= fetch('/api/posts/count?where[status][equals]=published', { credentials: 'include' })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { totalDocs?: number } | null) => {
      // Gagal fetch: tampilkan menu (perilaku lama) daripada menyembunyikan
      // blog yang mungkin berisi artikel.
      cached = data ? (data.totalDocs ?? 0) > 0 : true
      return cached
    })
    .catch(() => {
      cached = true
      return cached
    })
  return pending
}

// null = belum diketahui (menu Blog belum dirender, supaya tidak muncul lalu
// hilang lagi saat memang belum ada artikel).
export function useHasPublishedPosts(): boolean | null {
  const [hasPosts, setHasPosts] = useState<boolean | null>(cached)

  useEffect(() => {
    let cancelled = false
    void fetchHasPublishedPosts().then((value) => {
      if (!cancelled) setHasPosts(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return hasPosts
}
