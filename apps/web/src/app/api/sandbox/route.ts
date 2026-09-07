import { NextRequest, NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'
import {
  ALLOWED_LANGUAGES,
  isAllowedLanguage,
  judge0Headers,
  MAX_SOURCE_CODE_LENGTH,
  MAX_STDIN_LENGTH,
  SANDBOX_CPU_TIME_LIMIT,
  SANDBOX_MEMORY_LIMIT,
} from '@/lib/judge0'
import { checkRateLimit } from '@/lib/rateLimit'

const JUDGE0_URL = process.env.JUDGE0_API_URL

// Lihat docs/11-FEATURE-CODE-SANDBOX.md — proxy ini adalah SATU-SATUNYA jalur
// ke Judge0. Jangan pernah expose JUDGE0_API_URL langsung ke browser.
//
// Pengamanan di sini (di luar apa yang eksplisit diminta dokumen):
// - Wajib login. Sandbox butuh identitas user untuk rate limit per user, dan
//   mengurangi permukaan abuse anonim.
// - Rate limit in-memory per user (lihat src/lib/rateLimit.ts).
// - Bahasa dibatasi ke ALLOWED_LANGUAGES (bukan terima language_id mentah
//   dari client).
// - cpu_time_limit/memory_limit di-set server-side, bukan dari body request.
export async function POST(req: NextRequest) {
  if (!JUDGE0_URL) {
    return NextResponse.json({ error: 'Sandbox belum dikonfigurasi.' }, { status: 503 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(`sandbox:${user.id}`, {
    limit: 10,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak eksekusi, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const body = await req.json().catch(() => null)
  const sourceCode = body?.source_code
  const language = body?.language
  const stdin = body?.stdin

  if (typeof sourceCode !== 'string' || sourceCode.length === 0) {
    return NextResponse.json({ error: 'source_code wajib diisi' }, { status: 400 })
  }
  if (sourceCode.length > MAX_SOURCE_CODE_LENGTH) {
    return NextResponse.json({ error: 'source_code terlalu panjang' }, { status: 400 })
  }
  if (stdin !== undefined && stdin !== null) {
    if (typeof stdin !== 'string' || stdin.length > MAX_STDIN_LENGTH) {
      return NextResponse.json({ error: 'stdin tidak valid' }, { status: 400 })
    }
  }
  if (!isAllowedLanguage(language)) {
    return NextResponse.json(
      { error: `language harus salah satu dari: ${Object.keys(ALLOWED_LANGUAGES).join(', ')}` },
      { status: 400 },
    )
  }

  let res: Response
  try {
    res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: judge0Headers(),
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: ALLOWED_LANGUAGES[language].id,
        stdin: stdin || '',
        cpu_time_limit: SANDBOX_CPU_TIME_LIMIT,
        memory_limit: SANDBOX_MEMORY_LIMIT,
      }),
    })
  } catch {
    return NextResponse.json({ error: 'Sandbox sedang tidak bisa diakses.' }, { status: 502 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Gagal membuat submission' }, { status: 502 })
  }

  const data = await res.json()
  return NextResponse.json(data) // { token: "..." }
}

export async function GET(req: NextRequest) {
  if (!JUDGE0_URL) {
    return NextResponse.json({ error: 'Sandbox belum dikonfigurasi.' }, { status: 503 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'token wajib diisi' }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`, {
      headers: judge0Headers(),
    })
  } catch {
    return NextResponse.json({ error: 'Sandbox sedang tidak bisa diakses.' }, { status: 502 })
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'Gagal mengambil hasil submission' }, { status: 502 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
