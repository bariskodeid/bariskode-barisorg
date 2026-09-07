# 18. Fitur: Sertifikat Penyelesaian Course

## Ringkasan

User yang menyelesaikan 100% lesson di sebuah course bisa download sertifikat
PDF dari halaman `/my-learning`. Tidak ada halaman verifikasi publik — di luar
scope, lihat `docs/17-ROADMAP.md` Fase 10.

## Collection

Lihat `Certificates` di `04-DATA-MODEL.md`. Tidak ada UI admin untuk membuat
manual — hanya diterbitkan otomatis lewat API route di bawah, dan immutable
(`update: () => false`) setelah terbit.

## Kenapa `@react-pdf/renderer`, Bukan Puppeteer

VM production hanya 4GB RAM (lihat `infra/docker-compose.yml` `mem_limit`
per service, dituning untuk itu di Fase 10). Puppeteer butuh headless Chrome
penuh — terlalu berat. `@react-pdf/renderer` pure-JS, tanpa browser, jauh
lebih ringan.

## API Route

`GET /api/certificates/[courseId]` (`src/app/api/certificates/[courseId]/route.ts`):

1. Auth gate (401) + rate limit `certificate:${user.id}` (10/60s, pola sama
   `src/lib/rateLimit.ts` seperti `/api/sandbox`).
2. Ambil course, cek `getCourseProgress()` (reuse dari
   `docs/09-FEATURE-PROGRESS-TRACKING.md`) — kalau `percentage < 100` → 403.
3. Find-or-create baris `certificates` (idempotent, pola sama `/api/progress`).
4. `renderToBuffer()` template `src/lib/certificate/CertificateDocument.tsx`,
   balikan sebagai `application/pdf` dengan `Content-Disposition: attachment`.

Kalau render gagal (try/catch), baris DB certificate TETAP ada — retry GET
berikutnya cukup re-render, tidak re-create (constraint unique `user+course`
mencegah duplikat).

## Desain PDF

Sengaja terang (bukan tema gelap situs) — lebih ramah cetak/print. Landscape
A4, border hijau tipis, wordmark bariskode.org, nama siswa, judul course,
tanggal terbit.

## Frontend

`/my-learning`: course card dengan `progress.percentage === 100` dapat
tombol "Download Sertifikat" (`<a href="/api/certificates/{courseId}">`).
Card direstrukturisasi supaya link sertifikat TIDAK nested di dalam `<Link>`
navigasi course (invalid HTML) — area judul/progress tetap `<Link>`, tombol
sertifikat jadi sibling di luar.
