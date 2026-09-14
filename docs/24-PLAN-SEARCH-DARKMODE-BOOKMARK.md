# 24. Implementation Plan — Search, Dark Mode, Lesson Bookmarking

Rencana implementasi tiga fitur baru untuk bariskode.org v1.x. Ketiga fitur
independent satu sama lain — bisa dikerjakan secara paralel atau bertahap.

---

## 1. Search (Full-text)

### Goal

User bisa mencari course, lesson, dan blog post dari satu search bar di
navigation.

### Stack

- **Meilisearch** — self-hosted, satu container Docker, ringan (~30MB RAM idle),
  support full-text + typo tolerance + ranking.
- **Bukan** Typesense/Algolia — Meilisearch paling simpel setup & maintain
  di single VM.

### Architecture

```
Browser → Header search bar → /api/search (Next.js route) → Meilisearch (HTTP)
                                                         ↕
                                              Payload Local API (sync hook)
```

Meilisearch jalan sebagai container Docker tambahan di `infra/docker-compose.yml`,
expose port `7700` internal only (tidak publik). Akses dari Next.js lewat
`MEILISEARCH_HOST=http://meilisearch:7700`.

### Data Model — Tidak Ada Perubahan Schema

Search bersifat **read-only overlay**. Tidak ada collection baru, tidak ada
field tambahan. Meilisearch punya index sendiri terpisah dari Postgres.

### Implementation Steps

#### Phase A: Meilisearch Setup (infra)

1. Tambah service `meilisearch` di `infra/docker-compose.yml`:
   ```yaml
   meilisearch:
     image: getmeili/meilisearch:v1.12
     restart: unless-stopped
     environment:
       MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
       MEILI_ENV: production
     volumes:
       - meilisearch_data:/meilisearch/data
     expose:
       - '7700'
     <<: *default-logging
   ```
2. Tambah `MEILI_MASTER_KEY` ke `.env.docker` (random 32 char).
3. Tambah `MEILI_MASTER_KEY` dan `MEILISEARCH_HOST` ke `apps/web/.env` dan
   `.env.docker`.
4. Jalankan `docker compose up -d meilisearch`, verifikasi healthy.

#### Phase B: Sync Engine

Buat script `apps/web/src/lib/search/sync.ts` yang sync data dari Payload
ke Meilisearch:

1. **Index structure** — 3 index terpisah (`courses`, `lessons`, `posts`),
   tiap index punya attributes:
   - `courses`: `id`, `title`, `slug`, `description` (plaintext), `category.name`, `level`
   - `lessons`: `id`, `title`, `slug`, `course.title`, `course.slug`
   - `posts`: `id`, `title`, `slug`, `excerpt`, `author.name`
2. **Sync trigger** — hook `afterChange` di Payload collections (`Courses`,
   `Lessons`, `Posts`) panggil sync function (debounced, batched).
3. **Initial sync** — script `payload run scripts/search-sync.ts` untuk
   bulk index pertama kali (atau re-index).
4. **Searchable/taggable attributes** di Meilisearch:
   ```ts
   await index.updateSettings({
     searchableAttributes: ['title', 'description', 'excerpt'],
     filterableAttributes: ['category', 'level', 'status'],
     rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
   })
   ```

#### Phase C: API Route

`apps/web/src/app/api/search/route.ts`:

```ts
// GET /api/search?q=python&page=1&limit=20
// Response: { results: SearchHit[], totalHits: number, query: string }
```

- Rate limit: 30 req/min per IP (reuse `lib/rateLimit.ts`).
- Query Meilisearch, gabungkan results dari 3 index, rank by relevance.
- Filter: hanya `status: 'published'` untuk courses & posts.

#### Phase D: Frontend

- **SearchDialog** (`components/ui/SearchDialog.tsx`) — Cmd+K / click to open.
  - Overlay dialog dengan search input + results list.
  - Keyboard navigation (↑↓, Enter, Esc).
  - Debounced input (300ms).
- **SearchButton** di Header — icon search, klik buka SearchDialog.
- **SearchResultItem** — tampilkan title, type badge (Course/Lesson/Post),
  category, snippet.

#### Phase E: i18n

Tambah keys ke `dictionaries.ts`:
```ts
search: { title: 'Pencarian', placeholder: 'Cari course, materi, artikel...', noResults: 'Tidak ditemukan', course: 'Course', lesson: 'Materi', post: 'Artikel' }
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `infra/docker-compose.yml` | Add `meilisearch` service |
| `apps/web/.env` + `.env.docker` | Add `MEILI_MASTER_KEY`, `MEILISEARCH_HOST` |
| `apps/web/src/lib/search/meilisearch.ts` | Client helper (init, search, sync) |
| `apps/web/src/lib/search/sync.ts` | Sync engine (Payload → Meilisearch) |
| `apps/web/src/collections/Courses.ts` | Add afterChange hook for sync |
| `apps/web/src/collections/Lessons.ts` | Add afterChange hook for sync |
| `apps/web/src/collections/Posts.ts` | Add afterChange hook for sync |
| `apps/web/src/app/api/search/route.ts` | Search API endpoint |
| `apps/web/src/components/ui/SearchDialog.tsx` | Search dialog component |
| `apps/web/src/components/ui/SearchButton.tsx` | Header search button |
| `apps/web/src/components/layout/Header.tsx` | Add SearchButton |
| `apps/web/src/lib/i18n/dictionaries.ts` | Add search keys |
| `apps/web/src/scripts/search-sync.ts` | Initial bulk sync script |
| `docs/25-FEATURE-SEARCH.md` | Feature documentation |

### Resource Impact

- Meilisearch: ~30-50MB RAM idle, ~100MB with index. Cocok untuk VM 4GB.
- Sync overhead: minimal, hook afterChange async (non-blocking).

---

## 2. Dark Mode Toggle

### Goal

User bisa switch antara dark mode (default, monokrom hitam seperti sekarang)
dan light mode. Preference disimpan di cookie, konsisten lintas session.

### Approach

**Class-based dark mode** dengan Tailwind CSS `dark:` variants + cookie
preference. Bukan `prefers-color-scheme` media query — user harus bisa
explicit pilih, bukan auto-detect.

### Architecture

Tidak ada server-side rendering impact. Semua client-side:
- Cookie `theme=dark|light` dibaca di client, toggle `class="dark"` di `<html>`.
- Root layout TIDAK baca cookie ini (sama seperti locale — supaya ISR tidak
  rusak). Theme diterapkan via client-side `useEffect`.

### Implementation Steps

#### Phase A: CSS Variables

`apps/web/src/app/(frontend)/globals.css` — tambah light mode variables:

```css
/* Dark mode (default) — sudah ada di :root */
:root { /* ... existing ... */ }

/* Light mode */
:root.light {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 98%;
  --card-foreground: 0 0% 9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
}
```

Update `body` styles — hapus `background-color: black; color: white;` hardcode,
biarkan CSS variable handles.

#### Phase B: Theme Context

`apps/web/src/lib/theme/ThemeContext.tsx` (client component):

```ts
// Cookie name: 'theme' (sama pattern dengan locale)
// Default: 'dark'
// Values: 'dark' | 'light'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark') // default dark

  useEffect(() => {
    // Baca cookie
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('theme='))
    const saved = cookie?.split('=')[1] as 'dark' | 'light' | undefined
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    // Apply ke <html>
    document.documentElement.classList.toggle('light', theme === 'light')
    // Simpan cookie (1 year expiry)
    document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
```

#### Phase C: Toggle Button

`apps/web/src/components/ui/ThemeToggle.tsx` — button di Header:

```tsx
// Icon: Sun (light mode) / Moon (dark mode)
// Klik toggle theme
// Beside LocaleSwitcher di Header
```

#### Phase D: Layout Integration

- Wrap children di `layout.tsx` dengan `<ThemeProvider>` (di dalam
  `LocaleProvider`,不影响 ISR karena ThemeProvider tidak baca headers).
- **PENTING**: `<html>` perlu `suppressHydrationWarning` karena class `dark`
  mungkin ditambahkan client-side setelah render server.
- Script inline di `<head>` untuk apply theme awal (cegah flash FOUC):
  ```html
  <script dangerouslySetInnerHTML={{ __html: `
    (function() {
      var t = document.cookie.match(/theme=(dark|light)/);
      if (t && t[1] === 'light') document.documentElement.classList.add('light');
    })()
  `}} />
  ```

#### Phase E: Component Audit

Semua komponen yang pakai hardcode colors perlu di-audit:

| Komponen | Issue | Fix |
|----------|-------|-----|
| `Header.tsx` | `border-white/10`, `bg-background/80` | Sudah pakai CSS var → OK |
| `GridBackground.tsx` | `#262626` hardcode | Ubah ke CSS var atau `border-border` |
| `globals.css` | `background-color: black` di body | Hapus, biarkan CSS var |
| `Footer.tsx` | Cek hardcode colors | Audit |
| `CodeSandbox.tsx` | Editor theme | Pakai CodeMirror light theme saat light mode |
| `page.tsx` (home) | Gradient black→transparent | Tambah light variant |

**Strategy**: Gunakan `dark:` prefix untuk dark-specific styles. Komponen baru
pakai CSS variables (sudah di-theme lewat `@theme` block). Komponen lama
yang hardcode `white`/`black` perlu diupdate bertahap.

#### Phase F: i18n

```ts
theme: { toggle: 'Ganti tema', dark: 'Gelap', light: 'Terang' }
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `apps/web/src/app/(frontend)/globals.css` | Add light mode CSS vars, fix body hardcode |
| `apps/web/src/lib/theme/ThemeContext.tsx` | Create ThemeProvider + useTheme hook |
| `apps/web/src/lib/theme/constants.ts` | `THEME_COOKIE = 'theme'` |
| `apps/web/src/components/ui/ThemeToggle.tsx` | Create toggle button |
| `apps/web/src/components/layout/Header.tsx` | Add ThemeToggle |
| `apps/web/src/app/(frontend)/layout.tsx` | Add ThemeProvider + FOUC script |
| `apps/web/src/components/ui/GridBackground.tsx` | Fix hardcode colors |
| `apps/web/src/app/(frontend)/page.tsx` | Add light mode styles |
| `apps/web/src/components/CodeSandbox.tsx` | Dynamic CodeMirror theme |
| `apps/web/src/lib/i18n/dictionaries.ts` | Add theme keys |

### Resource Impact

Nol. Semua client-side, tidak ada container baru, tidak ada DB changes.

---

## 3. Lesson Bookmarking

### Goal

Logged-in user bisa bookmark lesson untuk dibaca nanti. Bookmark ditampilkan
di halaman `/my-learning` sebagai tab terpisah.

### Data Model

Collection baru `Bookmarks`:

```ts
// src/collections/Bookmarks.ts
import type { CollectionConfig } from 'payload'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  admin: { useAsTitle: 'id' },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' ? true : { user: { equals: user?.id } },
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true },
    { name: 'createdAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
  ],
  indexes: [{ fields: ['user', 'lesson'], unique: true }], // cegah duplikat
}
```

### Implementation Steps

#### Phase A: Collection & Migration

1. Buat `apps/web/src/collections/Bookmarks.ts`.
2. Daftarkan di `payload.config.ts`.
3. Jalankan `pnpm payload migrate:create`.

#### Phase B: API Routes

**Toggle bookmark** — `POST /api/bookmarks`:
```ts
// Body: { lessonId: string }
// Logic: kalau sudah ada → hapus (unbookmark). Kalau belum → buat.
// Response: { bookmarked: boolean, totalBookmarks: number }
```

**Check bookmark status** — `GET /api/bookmarks?lessonId=xxx`:
```ts
// Response: { bookmarked: boolean }
// Dipakai lesson page untuk tampilkan icon bookmark filled/outline.
```

**List user bookmarks** — `GET /api/bookmarks` (authenticated):
```ts
// Response: { bookmarks: BookmarkWithLesson[] }
// Dipakai di /my-learning untuk tab Bookmarks.
```

#### Phase C: Frontend Components

1. **BookmarkButton** (`components/ui/BookmarkButton.tsx`):
   - Icon bookmark (outline saat belum, filled saat sudah).
   - Klik toggle via `POST /api/bookmarks`.
   - Hanya tampil untuk logged-in user.
   - Posisi: di atas/bawah lesson content, sebelah title.

2. **BookmarksTab** di `/my-learning`:
   - Tab "Bookmarks" di samping "My Courses" yang sudah ada.
   - List lesson yang di-bookmark dengan link ke lesson page.
   - Sort by `createdAt` DESC (terbaru dulu).

3. **Lesson page** (`lessons/[slug]/page.tsx`):
   - Render `<BookmarkButton>` jika user logged in.

#### Phase D: My Learning Page Update

`apps/web/src/app/(frontend)/my-learning/page.tsx`:
- Tambah tab "Bookmarks" (client-side tab, bukan route baru).
- Fetch bookmarks dari `GET /api/bookmarks`.
- Reuse `LessonCard` component untuk render bookmark items.

#### Phase E: i18n

```ts
bookmark: { add: 'Bookmark', remove: 'Hapus Bookmark', title: 'Bookmark Saya', empty: 'Belum ada bookmark', added: 'Ditambahkan ke bookmark', removed: 'Dihapus dari bookmark' }
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `apps/web/src/collections/Bookmarks.ts` | Create collection |
| `src/payload.config.ts` | Register Bookmarks collection |
| `apps/web/src/app/api/bookmarks/route.ts` | Toggle + list API |
| `apps/web/src/components/ui/BookmarkButton.tsx` | Bookmark toggle button |
| `apps/web/src/app/(frontend)/lessons/[slug]/page.tsx` | Add BookmarkButton |
| `apps/web/src/app/(frontend)/my-learning/page.tsx` | Add Bookmarks tab |
| `apps/web/src/lib/i18n/dictionaries.ts` | Add bookmark keys |

### Resource Impact

- 1 new collection di Postgres. Index `user+lesson` unique.
- Query simpel, O(1) per user.

---

## Execution Order

Ketiga fitur independent. Rekomendasi urutan berdasarkan effort & impact:

1. **Dark Mode** (Phase A-C) — paling cepat, zero infra, langsung terasa.
2. **Bookmarking** (Phase A-B) — collection baru + 1 API route, cukup straightforward.
3. **Search** (Phase A-B) — butuh container baru + sync engine, paling kompleks.

Parallel bisa dilakukan: Dark Mode + Bookmarking bisa jalan bareng. Search
menunggu infra Meilisearch ready.

## Definition of Done

Setiap fitur selesai kalau:

- [ ] `pnpm lint && pnpm typecheck && pnpm build` lolos.
- [ ] Migration jalan tanpa error di PostgreSQL lokal.
- [ ] Fitur berfungsi end-to-end via `pnpm dev`.
- [ ] Tidak ada hardcode string UI — semua lewat i18n dictionary.
- [ ] Code review + security review lolos.
- [ ] Dokumentasi fitur ditulis di `docs/`.
