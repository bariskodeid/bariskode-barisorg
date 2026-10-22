// Rate limiter in-memory sederhana (sliding window per key). Cukup untuk
// arsitektur v1 (satu VM, satu proses Next.js — lihat docs/02-ARCHITECTURE.md).
// TIDAK akan bekerja benar kalau nanti di-scale ke banyak instance Next.js
// sekaligus (state tidak dibagi antar proses) — kalau itu terjadi, pindah ke
// rate limiter berbasis Redis.
const hits = new Map<string, number[]>()

// Key per IP (endpoint publik tanpa login) bisa tumbuh tanpa batas, jadi key
// yang sudah lama tidak dipakai dibuang berkala. Window terpanjang yang
// dipakai di aplikasi ini jauh di bawah 1 jam.
const PRUNE_EVERY_CALLS = 1_000
const STALE_AFTER_MS = 60 * 60_000
let callsSincePrune = 0

function pruneStaleKeys(now: number): void {
  for (const [key, timestamps] of hits) {
    if ((timestamps[timestamps.length - 1] ?? 0) < now - STALE_AFTER_MS) hits.delete(key)
  }
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  if (++callsSincePrune >= PRUNE_EVERY_CALLS) {
    callsSincePrune = 0
    pruneStaleKeys(now)
  }

  const windowStart = now - windowMs
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart)

  if (timestamps.length >= limit) {
    const retryAfterMs = timestamps[0] + windowMs - now
    hits.set(key, timestamps)
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) }
  }

  timestamps.push(now)
  hits.set(key, timestamps)
  return { allowed: true, retryAfterMs: 0 }
}

// IP pengunjung untuk rate limit endpoint publik (tanpa user.id). Production
// (nekosama) di belakang Cloudflare: CF-Connecting-IP berisi IP asli dan
// tidak bisa dipalsukan karena origin cuma bind ke 127.0.0.1 (masuk lewat
// cloudflared). Skenario Caddy (docs/14) mengisi X-Forwarded-For — di sana
// port 80/443 terbuka publik, jadi CF-Connecting-IP baru bisa dipercaya kalau
// origin hanya menerima trafik dari IP Cloudflare (firewall); tanpa itu
// header ini bisa dipalsukan untuk melewati rate limit per IP.
export function getClientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
