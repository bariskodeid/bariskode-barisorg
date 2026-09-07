// Bahasa sengaja dibatasi ke yang benar-benar dipakai di kurikulum (lihat
// docs/11-FEATURE-CODE-SANDBOX.md — "jangan aktifkan semua ~60 bahasa bawaan
// Judge0 kalau tidak perlu, mengurangi permukaan serangan"). ID diverifikasi
// dari db/languages/active.rb rilis Judge0 CE v1.13.1 (image yang dipakai di
// infra/docker-compose.yml), bukan ditebak dari memori.
export const ALLOWED_LANGUAGES = {
  python: { id: 71, label: 'Python 3.8' },
  javascript: { id: 63, label: 'JavaScript (Node.js 12)' },
} as const

export type AllowedLanguageKey = keyof typeof ALLOWED_LANGUAGES

export function isAllowedLanguage(value: unknown): value is AllowedLanguageKey {
  return typeof value === 'string' && value in ALLOWED_LANGUAGES
}

// Resource limit di-set server-side, TIDAK BOLEH dikontrol client — lihat
// docs/11-FEATURE-CODE-SANDBOX.md bagian keamanan. Nilai default Judge0
// sendiri juga dibatasi lebih ketat lewat infra/judge0/judge0.conf
// (MAX_CPU_TIME_LIMIT, MAX_MEMORY_LIMIT dst) sebagai lapisan kedua.
export const SANDBOX_CPU_TIME_LIMIT = 5 // detik
export const SANDBOX_MEMORY_LIMIT = 128000 // KB
export const MAX_SOURCE_CODE_LENGTH = 20000 // karakter
export const MAX_STDIN_LENGTH = 5000 // karakter

export function judge0Headers(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const apiKey = process.env.JUDGE0_API_KEY
  if (apiKey) {
    headers['X-Judge0-Token'] = apiKey
  }
  return headers
}
