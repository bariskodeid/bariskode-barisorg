# 20. Fitur: Multi-bahasa UI (Indonesia + English)

## Scope — Baca Ini Dulu

**HANYA string interface** (nav, tombol, label, pesan error/kosong/loading)
yang diterjemahkan. Konten dari Payload — `title`/`description`/`richText`
di course, lesson, post — **TIDAK PERNAH** diterjemahkan, tetap persis apa
adanya sesuai bahasa penulis konten (Indonesia). Ini keputusan scope
eksplisit, bukan keterbatasan — lihat catatan di `docs/01-PRD.md`.

## Kenapa Bukan next-intl / Routing Per-Locale

Karena konten tidak berubah per bahasa, routing `[locale]` (mis.
`/en/courses/...`) cuma menambah kompleksitas (duplikasi URL, middleware,
hreflang yang menyesatkan karena isinya sama) tanpa manfaat nyata. Dipilih
toggle client-side sederhana berbasis cookie.

## Arsitektur

- `src/lib/i18n/dictionaries.ts` — dictionary `{ id: {...}, en: {...} }`,
  namespaced per halaman/komponen (`nav`, `footer`, `home`, `courses`, `auth`,
  `lesson`, `quiz`, `myLearning`, dst).
- `src/lib/i18n/constants.ts` — cuma `LOCALE_COOKIE = 'locale'`, dipisah dari
  `getLocale.ts` supaya client component (`LocaleContext.tsx`) bisa pakai
  nama cookie yang sama TANPA menarik `next/headers` (server-only) ke client
  bundle — pernah gagal build kalau digabung (lihat commit terkait).
- `src/lib/i18n/getLocale.ts` — server-only (`cookies()` dari `next/headers`),
  baca cookie, default `'id'`.
- `src/lib/i18n/LocaleContext.tsx` — `LocaleProvider` (client), `useLocale()`
  hook, dan `<T>` (client island untuk halaman ISR — lihat di bawah).

## PENTING: Kenapa Root Layout TIDAK Baca `cookies()`

`app/(frontend)/layout.tsx` sengaja TIDAK memanggil `getLocale()`/`cookies()`
sama sekali. Root layout dipakai SEMUA route, termasuk yang ISR
(`courses`, `courses/[slug]`, `blog`, `blog/[slug]` — punya
`export const revalidate = 60`). Dynamic API (`cookies()`/`headers()`) di
layout memaksa SEMUA route jadi dynamic, termasuk yang harusnya ISR — persis
masalah yang sudah dihindari `Header.tsx` untuk auth state (lihat komentar
di sana), sekarang direplikasi untuk locale.

`LocaleProvider` karena itu TIDAK menerima locale awal dari server — default
`'id'` saat render pertama (server & client selalu sama, hydration-safe),
lalu dikoreksi dari cookie browser lewat `useEffect` sekali setelah mount.
Trade-off: kalau user sudah pilih EN, ada kilasan singkat UI Indonesia
sebelum `useEffect` jalan — sama seperti trade-off status login di
`Header.tsx`.

## Dua Pola Pemakaian, Tergantung Jenis Halaman

**A. Halaman yang SUDAH `dynamic = 'force-dynamic'`** (home, `/lessons/[slug]`,
`/my-learning`) — aman panggil `getLocale()` langsung di situ, tidak ada
regresi tambahan karena sudah dynamic:
```ts
const locale = await getLocale()
const t = dictionaries[locale]
```

**B. Halaman ISR** (`revalidate = 60`: courses, courses/[slug], blog,
blog/[slug]) — JANGAN panggil `getLocale()` di server component (akan
mematikan cache ISR-nya). Pakai client island `<T>` untuk string yang perlu
diterjemahkan, biarkan sisa halaman (data fetching) tetap server component
biasa:
```tsx
<h1><T>{(t) => t.courses.title}</T></h1>
```
`<T>` adalah client component kecil yang baca `useLocale()` — Server
Component boleh merender Client Component sebagai children tanpa ikut jadi
dynamic, jadi caching ISR halaman induk tetap utuh.

**C. Full client component** (login/register page, Header/Footer/
LogoutButton/MarkCompleteButton/Quiz) — langsung `useLocale()` dari context,
tidak perlu `<T>`.

## Menambah String Baru

1. Tambah key di KEDUA `id` dan `en` pada `dictionaries.ts` (TypeScript akan
   error kalau `en` tidak persis mengikuti shape `id`, lihat `typeof id` di
   deklarasi `en`).
2. Pilih pola A/B/C di atas sesuai jenis halaman/komponen yang dipakai.

## Non-Goal

Menerjemahkan konten CMS (course/lesson/post) — kalau nanti dibutuhkan, itu
perubahan data-model besar (localized fields di Payload), bukan perluasan
dari sistem dictionary UI ini. Lihat `docs/17-ROADMAP.md` bagian backlog.
