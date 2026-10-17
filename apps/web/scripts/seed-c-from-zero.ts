import { getPayload } from 'payload'
import config from '../src/payload.config'
import course from './courses/c'
import { seedCourse } from './lib/seed-course'

// Seed (upsert) satu course — data ada di scripts/courses/c.ts.
// Jalankan: pnpm seed:c

const payload = await getPayload({ config })
const result = await seedCourse(payload, course)
console.log(`Seed "${course.title}" selesai:`, result)
