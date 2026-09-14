// Bahasa dibatasi ke yang relevan untuk kurikulum (lihat
// docs/11-FEATURE-CODE-SANDBOX.md). ID diverifikasi dari
// db/languages/active.rb rilis Judge0 — bukan ditebak dari memori.
export const ALLOWED_LANGUAGES = {
  bash: { id: 46, label: 'Bash 5.0' },
  c: { id: 50, label: 'C (GCC 9.2.0)' },
  cpp: { id: 54, label: 'C++ (GCC 9.2.0)' },
  go: { id: 60, label: 'Go 1.13.5' },
  java: { id: 62, label: 'Java (OpenJDK 13)' },
  javascript: { id: 63, label: 'JavaScript (Node.js 12)' },
  php: { id: 68, label: 'PHP 7.4.1' },
  python: { id: 71, label: 'Python 3.8' },
  ruby: { id: 72, label: 'Ruby 2.7.0' },
  rust: { id: 73, label: 'Rust 1.40.0' },
  sql: { id: 82, label: 'SQL (SQLite 3.27.2)' },
  typescript: { id: 74, label: 'TypeScript 3.7.4' },
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
