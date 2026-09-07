import type { Payload } from 'payload'

import type { Course } from '@/payload-types'

import { sendEmail } from './email'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Dipanggil dari hook afterChange di Courses.ts saat status berubah
// draft->published. Loop sequential tanpa queue/batching — cukup untuk
// jumlah user saat ini (MVP, lihat docs/21-FEATURE-EMAIL-NOTIFICATIONS.md),
// SENGAJA tidak dioptimalkan lebih jauh sebelum ada bukti kebutuhan nyata.
export async function notifyCoursePublished(course: Course, payload: Payload): Promise<void> {
  const students = await payload.find({
    collection: 'users',
    where: { role: { equals: 'student' } },
    limit: 0,
    overrideAccess: true,
  })

  const courseURL = `${serverURL}/courses/${course.slug}`

  for (const student of students.docs) {
    await sendEmail({
      to: student.email,
      subject: `Kursus baru di bariskode.org: ${course.title}`,
      html: `
        <p>Halo ${student.name},</p>
        <p>Kursus baru baru saja terbit di bariskode.org:</p>
        <p><strong>${course.title}</strong></p>
        <p><a href="${courseURL}">Buka kursus</a></p>
      `,
    })
  }
}
