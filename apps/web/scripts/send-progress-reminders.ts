import { getPayload } from 'payload'

import config from '../src/payload.config'
import { getCourseProgress } from '../src/lib/getCourseProgress'
import { sendEmail } from '../src/lib/email'

// Reminder email untuk user yang mulai course tapi progress-nya mandek.
// Dijalankan via cron harian (lihat docs/14-DEPLOYMENT-ORACLE-VM.md &
// docs/21-FEATURE-EMAIL-NOTIFICATIONS.md): `payload run
// scripts/send-progress-reminders.ts` (pola sama seperti `pnpm seed`, lihat
// scripts/seed-dev.ts).
//
// Dedup TANPA collection tracking baru (sengaja, MVP — lihat
// docs/21-FEATURE-EMAIL-NOTIFICATIONS.md): reminder hanya dikirim kalau
// aktivitas terakhir user di course itu PERSIS 7-8 hari lalu. Cron harian
// otomatis hanya kena window ini sekali per course per user. Trade-off yang
// diketahui: kalau cron sempat skip jalan sehari pas user tepat di window
// itu, reminder untuk course itu tidak akan pernah terkirim (bukan retry).
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const MIN_DAYS_STALE = 7
const MAX_DAYS_STALE = 8

function daysSince(dateISO: string): number {
  return (Date.now() - new Date(dateISO).getTime()) / (1000 * 60 * 60 * 24)
}

async function main() {
  const payload = await getPayload({ config })

  const students = await payload.find({
    collection: 'users',
    where: { role: { equals: 'student' } },
    limit: 0,
    overrideAccess: true,
  })

  let remindersSent = 0

  for (const student of students.docs) {
    const progressRecords = await payload.find({
      collection: 'progress',
      where: { user: { equals: student.id } },
      limit: 0,
      depth: 0,
      overrideAccess: true,
    })

    const lastActivityByCourse = new Map<number, string>()
    for (const record of progressRecords.docs) {
      const courseId = typeof record.course === 'object' ? record.course.id : record.course
      const current = lastActivityByCourse.get(courseId)
      if (!current || record.completedAt > current) {
        lastActivityByCourse.set(courseId, record.completedAt)
      }
    }

    for (const [courseId, lastActivity] of lastActivityByCourse) {
      const days = daysSince(lastActivity)
      if (days < MIN_DAYS_STALE || days >= MAX_DAYS_STALE) continue

      const progress = await getCourseProgress(payload, student, courseId)
      if (progress.percentage >= 100) continue

      const course = await payload
        .findByID({ collection: 'courses', id: courseId, overrideAccess: true })
        .catch(() => null)
      if (!course) continue

      await sendEmail({
        to: student.email,
        subject: `Lanjutkan belajar: ${course.title}`,
        html: `
          <p>Halo ${student.name},</p>
          <p>Kamu sudah menyelesaikan ${progress.completed}/${progress.total} lesson di kursus <strong>${course.title}</strong>, tapi belum ada aktivitas baru sejak ${MIN_DAYS_STALE} hari terakhir.</p>
          <p><a href="${serverURL}/courses/${course.slug}">Lanjutkan belajar</a></p>
        `,
      })
      remindersSent += 1
    }
  }

  console.log(`Reminder selesai: ${remindersSent} email terkirim.`)
}

// `payload run` tidak menunggu promise yang tidak di-await di top level
// (lihat komentar sama di scripts/seed-dev.ts) — top-level await wajib.
await main()
