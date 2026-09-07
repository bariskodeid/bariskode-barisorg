import type { Payload } from 'payload'

import type { User } from '@/payload-types'

export interface CourseProgress {
  total: number
  completed: number
  percentage: number
}

// Lihat docs/09-FEATURE-PROGRESS-TRACKING.md. Query relasi nested
// ('module.course') sudah diverifikasi jalan dengan adapter Postgres yang
// dipakai (Payload 3.88) — kalau nanti pindah/upgrade adapter dan performanya
// jadi masalah, pertimbangkan denormalisasi field `course` langsung di
// collection Lessons sesuai catatan di dokumen tersebut.
export async function getCourseProgress(
  payload: Payload,
  user: User,
  courseId: number,
): Promise<CourseProgress> {
  const [totalLessons, completedLessons] = await Promise.all([
    payload.find({
      collection: 'lessons',
      where: { 'module.course': { equals: courseId } },
      limit: 0,
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: 'progress',
      where: { and: [{ user: { equals: user.id } }, { course: { equals: courseId } }] },
      limit: 0,
      overrideAccess: false,
      user,
    }),
  ])

  const percentage = totalLessons.totalDocs
    ? Math.round((completedLessons.totalDocs / totalLessons.totalDocs) * 100)
    : 0

  return { total: totalLessons.totalDocs, completed: completedLessons.totalDocs, percentage }
}
