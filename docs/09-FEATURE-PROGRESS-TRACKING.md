# 09. Fitur: Progress Tracking

## Ringkasan

User yang login bisa menandai lesson sebagai selesai. Sistem menghitung persentase
completion per course dan menampilkannya di halaman `/my-learning`.

## Collection

Lihat `Progress` di `04-DATA-MODEL.md`. Field kunci: `user`, `lesson`, `course`
(denormalized untuk query cepat), `completedAt`, `score` (opsional).

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

Tombol di halaman `/lessons/[slug]` memanggil `POST /api/progress` dengan
`lessonId` & `courseId` saat user klik "Tandai selesai" (atau otomatis saat user
scroll sampai akhir konten, sesuai preferensi UX).
