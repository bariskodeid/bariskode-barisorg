// Rate limiter in-memory sederhana (sliding window per key). Cukup untuk
// arsitektur v1 (satu VM, satu proses Next.js — lihat docs/02-ARCHITECTURE.md).
// TIDAK akan bekerja benar kalau nanti di-scale ke banyak instance Next.js
// sekaligus (state tidak dibagi antar proses) — kalau itu terjadi, pindah ke
// rate limiter berbasis Redis.
const hits = new Map<string, number[]>()

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
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
