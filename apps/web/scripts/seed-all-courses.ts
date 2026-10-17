import { getPayload } from 'payload'
import config from '../src/payload.config'
import { allCourses } from './courses'
import { seedCourse } from './lib/seed-course'

// Seed (upsert) ke-12 course "from Zero" sekaligus. Idempoten — aman dijalankan ulang.
// Jalankan: pnpm seed:courses

const payload = await getPayload({ config })

for (const course of allCourses) {
  const result = await seedCourse(payload, course)
  console.log(`Seed "${course.title}" selesai:`, result)
}
