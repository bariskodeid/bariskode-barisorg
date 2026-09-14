# 25. Fitur: Full-text Search (Meilisearch)

## Gambaran

Full-text search untuk courses, lessons, dan blog posts. Search bar di
navigation, bisa diakses lewat Cmd+K / Ctrl+K.

## Stack

- **Meilisearch v1.12** — self-hosted, satu container Docker.
- Akses dari Next.js lewat API route proxy (`/api/search`) yang rate-limited.
- Sync engine: hook `afterChange` di Payload collections + bulk sync script.

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
3. Jalankan bulk sync: `pnpm payload run src/scripts/search-sync.ts`
4. Untuk production: tambahkan env vars di `.env.docker` dan
   `infra/docker-compose.yml` (sudah dilakukan).

## Index Structure

### courses
- `id`, `title`, `slug`, `description`, `category`, `categorySlug`, `level`, `status`
- Filterable: `category`, `categorySlug`, `level`, `status`
- Searchable: `title`, `description`

### lessons
- `id`, `title`, `slug`, `courseTitle`, `courseSlug`
- Searchable: `title`, `courseTitle`

### posts
- `id`, `title`, `slug`, `excerpt`, `author`, `status`
- Filterable: `status`
- Searchable: `title`, `excerpt`, `author`

## Sync Engine

### Automatic (afterChange hook)
Setiap perubahan di collection `Courses`, `Lessons`, atau `Posts` otomatis
trigger sync ke Meilisearch lewat hook `afterChange`.

### Manual (bulk sync)
```bash
pnpm payload run src/scripts/search-sync.ts
```

## API

### GET /api/search?q=keyword&limit=20
- Rate limit: 30 req/min per IP.
- Response: `{ results: SearchHit[], totalHits: number, query: string }`
- Filter: hanya `status: 'published'` untuk courses & posts.

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

- Meilisearch: ~30-50MB RAM idle, ~100MB with index.
- Sync overhead: minimal, hook afterChange async (non-blocking).
