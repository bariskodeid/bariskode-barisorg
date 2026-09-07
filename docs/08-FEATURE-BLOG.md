# 08. Fitur: Blog + Giscus

## Ringkasan

Blog dipakai untuk artikel tutorial, pengumuman, dan konten SEO yang mengarahkan
traffic ke katalog course. Menggunakan collection `Posts` (lihat `04-DATA-MODEL.md`)
dan komentar via Giscus.

## Collection

Sudah didefinisikan lengkap di `04-DATA-MODEL.md` → `Posts`. Poin penting:

- `versions.drafts = true` — penulis bisa simpan draft sebelum publish.
- `content` pakai Lexical richText dengan **code-block feature diaktifkan** —
  penting karena ini blog programming.
- `relatedCourse` — dipakai untuk CTA "Lanjut belajar" di akhir artikel, cross-link
  ke katalog course.
- `tags` reuse collection `Categories` yang sama dengan course, supaya taksonomi
  konsisten di seluruh platform.

## Setup Giscus

1. Aktifkan **GitHub Discussions** di repo `bariskode` (Settings → Features → Discussions).
2. Install Giscus app di repo lewat https://github.com/apps/giscus.
3. Buka https://giscus.app, masukkan `username/bariskode`, pilih kategori Discussion
   (buat kategori baru bernama `Comments`, tipe "Announcement" supaya user tidak bisa
   bikin discussion baru sembarangan, hanya bisa reply per-post).
4. Giscus akan generate `data-repo-id` dan `data-category-id` — isi ke
   `NEXT_PUBLIC_GISCUS_REPO_ID` dan `NEXT_PUBLIC_GISCUS_CATEGORY_ID` (lihat
   `06-ENVIRONMENT-VARIABLES.md`).
5. Mapping komentar ke post: gunakan `data-mapping="specific"` dengan term = slug
   post, supaya satu Discussion per artikel dan tidak berubah walau title diedit.

## Komponen `GiscusComments.tsx`

```tsx
// src/components/GiscusComments.tsx
'use client'
import Giscus from '@giscus/react'

export function GiscusComments({ slug }: { slug: string }) {
  return (
    <Giscus
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
      category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
      mapping="specific"
      term={slug}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="id"
    />
  )
}
```

Pasang library resmi: `pnpm add @giscus/react`.

## Routing Next.js

- `/blog` — listing published posts, urut `publishedAt` descending, filter by tag.
- `/blog/[slug]` — detail post, render `content` (Lexical → HTML), tampilkan author
  (dari `Users`, pakai field `bio` & `avatar` sebagai byline), CTA `relatedCourse`
  di akhir, lalu `<GiscusComments slug={post.slug} />`.
- Gunakan **ISR** (`export const revalidate = 3600` atau sesuai kebutuhan) supaya
  post baru muncul tanpa perlu redeploy penuh.

## SEO

Collection `Posts` sudah didaftarkan ke `seoPlugin` (lihat `04-DATA-MODEL.md`).
Di halaman `/blog/[slug]`, mapping field `meta.title`/`meta.description`/`meta.image`
dari plugin ke Next.js `generateMetadata()`.

Tambahkan juga post yang published ke `sitemap.ts` (lihat `05-REPO-STRUCTURE.md`)
supaya ter-crawl mesin pencari.

## Code Syntax Highlighting

Aktifkan fitur code-block Lexical di `payload.config.ts` saat konfigurasi editor,
lalu render code-block tersebut di frontend dengan library highlighting (mis.
`shiki` atau `prism-react-renderer`) saat converting Lexical JSON → JSX.
