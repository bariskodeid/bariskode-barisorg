# 04. Data Model — Payload Collections

Dokumen ini adalah spesifikasi lengkap semua collection Payload. Kode di bawah
adalah starting point yang siap dipakai — sesuaikan field tambahan sesuai kebutuhan
saat implementasi, tapi jangan ubah relasi inti tanpa update dokumen ini juga.

Semua collection didefinisikan di `src/collections/*.ts` dan didaftarkan di
`payload.config.ts` (lihat `05-REPO-STRUCTURE.md`).

## Diagram Relasi (ringkas)

```
Users ──┬──< Progress >── Lessons ──< Modules ──< Courses >── Categories
        │                                             │          │
        ├──< Certificates >──────────────────────────┘          │
        └──< Posts >──────────────────────────────────────────────┘
                  └── (optional) relatedCourse → Courses
Media ──< (dipakai oleh Courses.thumbnail, Lessons.video, Posts.featuredImage)
```

## `Users`

```ts
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: () => true,
    create: () => true, // registrasi publik untuk role student
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'student',
      options: ['student', 'instructor', 'admin'],
      access: {
        // hanya admin yang boleh ubah role user lain
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    { name: 'bio', type: 'textarea' }, // dipakai juga sebagai author bio di blog
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
```

## `Categories`

```ts
// src/collections/Categories.ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true }, // Programming, Database, dst
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'text' }, // nama icon (lucide-react) opsional
  ],
}
```

## `Media`

```ts
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 450 },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
```

## `Courses`

```ts
// src/collections/Courses.ts
import type { CollectionConfig } from 'payload'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor' ? true : { status: { equals: 'published' } },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'level', type: 'select', options: ['pemula', 'menengah', 'lanjutan'], defaultValue: 'pemula' },
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
    { name: 'order', type: 'number', defaultValue: 0 }, // urutan tampil di katalog
  ],
  versions: { drafts: true },
}
```

## `Modules`

```ts
// src/collections/Modules.ts
import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
  ],
}
```

## `Lessons`

```ts
// src/collections/Lessons.ts
import type { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    {
      name: 'content',
      type: 'richText',
      // pastikan fitur code-block Lexical diaktifkan di payload.config.ts
    },
    { name: 'videoUrl', type: 'text' }, // link embed YouTube unlisted
    {
      name: 'hasSandbox',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Aktifkan editor kode interaktif (Judge0) di lesson ini' },
    },
    { name: 'sandboxLanguage', type: 'text', admin: { condition: (data) => data.hasSandbox } },
    { name: 'sandboxStarterCode', type: 'code', admin: { condition: (data) => data.hasSandbox } },
    {
      name: 'hasQuiz',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Aktifkan quiz pilihan ganda di akhir lesson ini' },
    },
    {
      name: 'quizQuestions',
      type: 'array',
      minRows: 1,
      admin: { condition: (data) => data.hasQuiz },
      // validate: tiap soal harus tepat satu isCorrect — lihat
      // docs/19-FEATURE-QUIZ.md & src/collections/Lessons.ts.
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'options',
          type: 'array',
          minRows: 2,
          maxRows: 6,
          fields: [
            { name: 'text', type: 'text', required: true },
            {
              name: 'isCorrect',
              type: 'checkbox',
              // KEAMANAN: field-level access dikunci ke admin/instructor —
              // Lessons.access.read publik, tanpa ini kunci jawaban bocor ke
              // client sebelum quiz dikerjakan. Lihat docs/19-FEATURE-QUIZ.md.
              access: { read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor' },
            },
          ],
        },
      ],
    },
  ],
}
```

## `Progress`

Ini collection kunci untuk fitur progress tracking (lihat `09-FEATURE-PROGRESS-TRACKING.md`).

```ts
// src/collections/Progress.ts
import type { CollectionConfig } from 'payload'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: { useAsTitle: 'id' },
  access: {
    // user hanya boleh baca/tulis progress miliknya sendiri; admin baca semua
    read: ({ req: { user } }) =>
      user?.role === 'admin' ? true : { user: { equals: user?.id } },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true }, // denormalized, mempercepat query "progress per course"
    { name: 'completedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'score', type: 'number' }, // diisi POST /api/quiz saat lesson.hasQuiz — lihat docs/19-FEATURE-QUIZ.md
  ],
  indexes: [{ fields: ['user', 'lesson'], unique: true }], // cegah duplikat record
}
```

## `Posts` (Blog)

```ts
// src/collections/Posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title' },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor' ? true : { status: { equals: 'published' } },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText', required: true }, // Lexical, dengan code-block feature
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'tags', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'relatedCourse', type: 'relationship', relationTo: 'courses' }, // CTA cross-link
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
    { name: 'publishedAt', type: 'date' },
  ],
  versions: { drafts: true },
}
```

## `Certificates`

Diterbitkan otomatis oleh `GET /api/certificates/[courseId]` saat course user
100% selesai (lihat `docs/18-FEATURE-CERTIFICATES.md`) — tidak ada UI admin
untuk membuat manual.

```ts
// src/collections/Certificates.ts
import type { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: { useAsTitle: 'id' },
  access: {
    read: ({ req: { user } }) => (user?.role === 'admin' ? true : { user: { equals: user?.id } }),
    create: ({ req: { user }, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return data?.user === user.id
    },
    update: () => false, // immutable
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'issuedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
  ],
  indexes: [{ fields: ['user', 'course'], unique: true }],
}
```

## Registrasi di `payload.config.ts`

```ts
// src/payload.config.ts (cuplikan relevan)
import { Users, Categories, Media, Courses, Modules, Lessons, Progress, Posts, Certificates } from './collections'
import { seoPlugin } from '@payloadcms/plugin-seo'

export default buildConfig({
  collections: [Users, Categories, Media, Courses, Modules, Lessons, Progress, Posts, Certificates],
  plugins: [
    seoPlugin({
      collections: ['posts', 'courses'],
      uploadsCollection: 'media',
    }),
  ],
  // ...db adapter, editor config, dsb — lihat 05-REPO-STRUCTURE.md
})
```

## Catatan Implementasi

- Field `slug` sebaiknya di-generate otomatis dari `title` lewat hook `beforeValidate`
  (pola umum di semua template Payload) — Claude Code bisa pakai helper `formatSlug`
  yang lazim dipakai di komunitas Payload, atau tulis hook sederhana sendiri.
- Aktifkan **code block dengan syntax highlighting** di konfigurasi Lexical editor
  (`lexicalEditor({ features: [...defaultFeatures, ...] })`) karena dipakai baik di
  `Lessons.content` maupun `Posts.content`.
- Index unik di `Progress` (`user` + `lesson`) penting supaya "tandai selesai" bersifat
  idempotent — panggilan berulang tinggal `update`, bukan bikin duplikat.
