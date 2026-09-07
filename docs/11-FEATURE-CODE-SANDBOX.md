# 11. Fitur: Code Sandbox (Judge0)

## Ringkasan

Lesson dengan `hasSandbox: true` (lihat collection `Lessons` di `04-DATA-MODEL.md`)
menampilkan editor kode interaktif. User menulis kode, klik "Run", kode dieksekusi
di Judge0 (self-hosted), hasil ditampilkan di browser.

## Docker Compose (ringkasan — detail penuh di `14-DEPLOYMENT-ORACLE-VM.md`)

Judge0 terdiri dari beberapa service: `server` (API), `workers` (eksekusi kode),
`redis` (queue), `db` (Postgres khusus Judge0, terpisah dari database utama
bariskode). Gunakan `docker-compose.yml` resmi dari repo Judge0 sebagai basis,
sesuaikan nama service & network supaya konsisten dengan stack utama.

> Selalu cek versi image terbaru di repo resmi Judge0 (https://github.com/judge0/judge0)
> saat implementasi — jangan hardcode tag versi lama tanpa verifikasi.

## Alur Eksekusi

1. Frontend (`CodeSandbox.tsx`) kirim kode ke `POST /api/sandbox` (API route Next.js,
   **bukan** langsung ke Judge0 dari browser — supaya API Judge0 tidak exposed publik).
2. API route Next.js proxy request ke Judge0 API internal (`JUDGE0_API_URL`).
3. Judge0 kembalikan `token` submission.
4. Frontend polling `GET /api/sandbox?token=...` sampai status `finished`.
5. Tampilkan `stdout`/`stderr`/`compile_output` ke user.

## API Route Proxy

```ts
// src/app/api/sandbox/route.ts
import { NextRequest, NextResponse } from 'next/server'

const JUDGE0_URL = process.env.JUDGE0_API_URL!

export async function POST(req: NextRequest) {
  const { source_code, language_id, stdin } = await req.json()

  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_code, language_id, stdin }),
  })
  const data = await res.json()
  return NextResponse.json(data) // { token: "..." }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`)
  const data = await res.json()
  return NextResponse.json(data)
}
```

## Keamanan & Resource Limit — WAJIB dibaca sebelum production

- **Jangan pernah expose Judge0 API langsung ke internet** — selalu lewat proxy
  Next.js di atas, supaya bisa ditambah rate limiting & validasi bahasa yang diizinkan.
- **Rate limit per user** (mis. maksimal N eksekusi/menit) untuk mencegah abuse
  sebagai crypto-miner atau vektor DoS ke VM.
- **Batasi bahasa yang diaktifkan** ke bahasa yang benar-benar dipakai di kurikulum
  (Python, JavaScript, dst) — jangan aktifkan semua ~60 bahasa bawaan Judge0 kalau
  tidak perlu, mengurangi permukaan serangan.
- Judge0 workers berjalan di **isolated container per submission** by design —
  tetap pastikan Docker daemon & host VM di-update rutin (lihat `16-SECURITY-CHECKLIST.md`).
- Set **CPU time limit & memory limit** per submission (parameter Judge0:
  `cpu_time_limit`, `memory_limit`) supaya satu user tidak bisa menghabiskan resource
  VM yang di-share dengan layanan lain.

## Komponen Frontend

`src/components/CodeSandbox.tsx` — pakai Monaco Editor atau CodeMirror untuk editor,
kirim ke `/api/sandbox`, tampilkan output dengan loading state saat polling.
