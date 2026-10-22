# 25. Fitur: Full-text Search (Meilisearch)

## Gambaran

Full-text search untuk courses, lessons, dan blog posts. Search bar di
navigation, bisa diakses lewat Cmd+K / Ctrl+K.

## Stack

- **Meilisearch v1.12** — self-hosted, satu container Docker.
- Akses dari Next.js lewat API route proxy (`/api/search`) yang rate-limited.
- Sync engine: hook `afterChange`/`afterDelete` di Payload collections + script
  bulk reindex (`pnpm search:sync`).

## Arsitektur

```
Browser → Header search bar → /api/search (Next.js route) → Meilisearch (HTTP)
                                                         ↕
                                              Payload Local API (sync hook)
```

Meilisearch expose port `7700` internal only (tidak publik). Akses dari
Next.js lewat `MEILISEARCH_HOST` env var.

## Setup

1. Jalankan Meilisearch: `docker compose up -d meilisearch`
2. Set env vars di `.env`:
   ```
   MEILISEARCH_HOST=http://localhost:7700
   MEILI_MASTER_KEY=your-master-key
   ```
   `MEILISEARCH_HOST` kosong = search mati: hook sync jadi no-op dan
   `/api/search` membalas `error: 'Search temporarily unavailable'`.
3. Jalankan bulk reindex sekali: `pnpm search:sync`
4. Untuk production: env vars sudah ada di `.env.docker` dan
   `infra/docker-compose.yml`. Reindex di production (wajib sekali setelah
   deploy pertama yang membawa hook sync, atau kapan pun index rusak/kosong):
   ```bash
   ./dcr --profile script run --rm -T web-script src/scripts/search-sync.ts   # nekosama
   docker compose -f infra/docker-compose.yml --profile script run --rm \
     -e NODE_ENV=production web-script src/scripts/search-sync.ts         # VM Oracle
   ```
   Script mencetak jumlah dokumen per index (Postgres vs Meilisearch) dan
   exit 1 kalau tidak cocok.

## Index Structure

Index hanya berisi konten yang tampil publik — course & post dengan
`status: published`, lesson yang course-nya published. Dokumen yang tidak
memenuhi syarat dihapus dari index (bukan diberi flag), jadi `/api/search`
tidak memakai filter status. Sebelumnya route memfilter `status = published`,
yang butuh `filterableAttributes` — index yang dibuat otomatis oleh
Meilisearch (tanpa settings) membuat query itu gagal diam-diam.

### courses
- `id`, `title`, `slug`, `description` (teks polos dari rich text Lexical,
  maks 300 karakter), `category`, `categorySlug`, `level`
- Searchable: `title`, `description`, `category`

### lessons
- `id`, `title`, `slug`, `courseTitle`, `courseSlug`
- Searchable: `title`, `courseTitle`

### posts
- `id`, `title`, `slug`, `excerpt`, `author`
- Searchable: `title`, `excerpt`, `author`

Settings index (`setupIndexes()` di `src/lib/search/sync.ts`) dipasang
sekali per proses sebelum dokumen pertama dikirim, dan di awal bulk reindex.

## Sync Engine

### Automatic (hook collection)
`src/collections/hooks/searchSync.ts`, dipasang di Courses, Lessons, Posts
(`afterChange` + `afterDelete`) dan Modules (`afterChange` kalau module
dipindah ke course lain). Course/module yang masih berisi lesson tidak bisa
dihapus (FK NOT NULL + `ON DELETE SET NULL` ditolak Postgres), jadi lesson
selalu dihapus lebih dulu dan keluar dari index lewat hook Lessons.
Index ditulis sebelum transaksi di-commit — save yang di-rollback bisa
meninggalkan index yang sudah berubah (jarang; dibetulkan `search:sync`).

- Hook **membaca ulang dokumen versi utama** (`draft: false`) lewat `req`
  yang sama (transaksi yang sama), bukan memakai `doc` dari argumen hook:
  Courses/Posts memakai `versions.drafts`, dan hook juga jalan saat editor
  cuma "Save Draft" — isi draft tidak boleh bocor ke index.
- Perubahan course (judul, slug, status) ikut meng-update semua lesson di
  course itu (dokumen lesson menyimpan `courseTitle`/`courseSlug`, dan lesson
  hilang dari index kalau course-nya di-unpublish).
- Hook di-**await** (bukan fire-and-forget) supaya request terkirim sebelum
  script `payload run` (seed) exit. Tiap request ke Meilisearch dibatasi
  timeout 5 detik.
- **Gagal sync tidak menggagalkan save** — error di-log (`[search] sync ...
  gagal`), index bisa dibetulkan dengan bulk reindex.
- Seed (`pnpm seed:courses`) otomatis mengisi index lewat hook ini.

### Manual (bulk reindex)
```bash
pnpm search:sync   # = payload run src/scripts/search-sync.ts
```
Mengosongkan lalu mengisi ulang ketiga index dari Postgres. Script ini wajib
`await main()` di top level — `payload run` mengakhiri proses begitu modul
selesai dievaluasi. Versi lama script ini memanggil `main()` tanpa await,
sehingga terpotong diam-diam (exit 0) sebelum mengindex apa pun. Ditambah
hook sync yang dulu disebut di dokumen ini tapi belum pernah dibuat, Meilisearch
production tidak punya satu index pun sampai temuan QA 2026-10-21.

## API

### GET /api/search?q=keyword&limit=20
- Rate limit: 30 req/min per IP (`getClientIp()` di `src/lib/rateLimit.ts`:
  `CF-Connecting-IP`, lalu `X-Forwarded-For`). Sebelumnya key-nya konstan
  `'search'`, jadi 30 request/menit itu jatah bersama SEMUA pengunjung.
- Response: `{ results: SearchHit[], totalHits: number, query: string }`;
  ada field `error` kalau search mati/gagal.
- Query yang gagal per index di-log ke console server (`[search] query index
  ... gagal`), tidak lagi ditelan diam-diam.
- SearchDialog membedakan error (pesan `search.unavailable`) dari hasil
  kosong (`search.noResults`).

### SearchHit
```ts
{
  id: string | number
  title: string
  slug: string
  type: 'course' | 'lesson' | 'post'
  description?: string
  courseTitle?: string
  author?: string
}
```

## Frontend

### SearchDialog
- Cmd+K / Ctrl+K untuk buka/tutup.
- Keyboard navigation (↑↓, Enter, Esc).
- Debounced input (300ms).
- Type badges dengan warna berbeda per tipe.

### SearchButton
- Icon search di Header, klik buka SearchDialog.

## i18n

Semua string UI search sudah ditambahkan ke dictionaries (lihat
`docs/20-FEATURE-I18N-UI.md`):
- `search.title`, `search.placeholder`, `search.noResults`
- `search.course`, `search.lesson`, `search.post`

## Resource Impact

- Meilisearch: ~15-50 MiB RAM (diukur 2026-10-22 dengan 264 dokumen; puncak
  reindex ~20 MiB). WAJIB set `MEILI_MAX_INDEXING_MEMORY` (compose: 128Mb) —
  tanpa itu Meilisearch mengukur buffer indexing dari RAM host, bukan
  `mem_limit` container, dan di-OOM-kill begitu indexing jalan (terjadi di
  nekosama dengan `mem_limit: 100m`). `mem_limit` sekarang 256m.
- Sync overhead: minimal — satu request HTTP lokal per dokumen yang
  disimpan (hook di-await, timeout 5 detik).
