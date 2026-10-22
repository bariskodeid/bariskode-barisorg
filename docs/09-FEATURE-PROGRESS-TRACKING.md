# 09. Fitur: Progress Tracking

## Ringkasan

User yang login bisa menandai lesson sebagai selesai. Sistem menghitung persentase
completion per course dan menampilkannya di halaman `/my-learning`.

## Collection

Lihat `Progress` di `04-DATA-MODEL.md`. Field kunci: `user`, `lesson`, `course`
(denormalized untuk query cepat), `completedAt`, `score` (opsional).

## Aturan Integritas (berlaku sejak 2026-10-22)

Baris Progress = bukti lesson selesai, dan dihitung untuk persentase course
serta syarat sertifikat. Access control (`Progress.ts`) hanya memastikan user
menulis baris miliknya; isi baris dijaga hook `beforeChange`
`src/collections/hooks/progressIntegrity.ts`, yang berlaku untuk SEMUA jalur
tulis (route custom, REST `/api/progress/:id`, GraphQL `createProgress`):

- Lesson ber-quiz hanya bisa diselesaikan lewat `/api/quiz` yang lulus
  (route itu mengirim `context: { quizPassed: true }`; request REST/GraphQL
  selalu mulai dengan context kosong). `POST /api/progress` menolak lesson
  ber-quiz.
- `course` selalu diturunkan dari lesson (`lesson.module.course`), bukan
  dipercaya dari body — sebelumnya `courseId` palsu bisa menggelembungkan
  progress course lain sampai 100% dan membuka sertifikatnya.
- `score` hanya diisi grading quiz; nilai dari client dibuang.
- `update` Progress hanya untuk admin (tidak ada alur aplikasi yang
  mengubah baris setelah dibuat).
- Admin dan Local API tanpa user (script server) tidak dicek hook ini.

Contoh kode di bawah adalah rancangan awal; implementasi sebenarnya ada di
`src/app/api/progress/route.ts` dan `src/lib/getCourseProgress.ts`.

## API Route: Tandai Lesson Selesai

```ts
// src/app/api/progress/route.ts
import { getPayload } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, courseId } = await req.json()

  // upsert: cegah duplikat berkat unique index (user, lesson) di collection
  const existing = await payload.find({
    collection: 'progress',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return NextResponse.json(existing.docs[0]) // sudah selesai sebelumnya, idempotent
  }

  const record = await payload.create({
    collection: 'progress',
    data: { user: user.id, lesson: lessonId, course: courseId, completedAt: new Date().toISOString() },
  })

  return NextResponse.json(record)
}
```

## Menghitung Persentase Completion per Course

```ts
// src/lib/getProgress.ts
export async function getCourseProgress(payload: Payload, userId: string, courseId: string) {
  const [totalLessons, completedLessons] = await Promise.all([
    payload.find({
      collection: 'lessons',
      where: { 'module.course': { equals: courseId } }, // sesuaikan query relasi nested
      limit: 0, // hanya butuh totalDocs
    }),
    payload.find({
      collection: 'progress',
      where: { and: [{ user: { equals: userId } }, { course: { equals: courseId } }] },
      limit: 0,
    }),
  ])

  const percentage = totalLessons.totalDocs
    ? Math.round((completedLessons.totalDocs / totalLessons.totalDocs) * 100)
    : 0

  return { total: totalLessons.totalDocs, completed: completedLessons.totalDocs, percentage }
}
```

> Catatan: query relasi nested (`'module.course'`) perlu disesuaikan dengan
> kemampuan query Payload versi yang dipakai — alternatifnya, tambahkan field
> `course` langsung di collection `Lessons` (denormalized) supaya query jadi flat
> dan lebih cepat. Pertimbangkan ini kalau performa jadi masalah.

## Halaman `/my-learning`

- Ambil semua course yang punya minimal 1 record `Progress` milik user.
- Tampilkan `ProgressBar` per course (komponen di `src/components/ProgressBar.tsx`)
  memakai hasil `getCourseProgress()`.
- Tandai lesson yang sudah selesai dengan checkmark di halaman detail course/lesson.

## UI Trigger "Tandai Selesai"

Hanya untuk lesson TANPA quiz: tombol di halaman `/lessons/[slug]` memanggil
`POST /api/progress` dengan `lessonId` saat user klik "Tandai selesai". Lesson
ber-quiz (mayoritas konten) diselesaikan dengan lulus quiz — lihat
`19-FEATURE-QUIZ.md`. Di bawah area ini ada navigasi lesson
sebelum/berikutnya (urutan module.order lalu lesson.order).
