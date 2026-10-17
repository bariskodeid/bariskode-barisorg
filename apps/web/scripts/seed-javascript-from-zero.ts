import { getPayload } from 'payload'
import config from '../src/payload.config'
import course from './courses/javascript'
import { seedCourse } from './lib/seed-course'

// Seed (upsert) satu course — data ada di scripts/courses/javascript.ts.
// Jalankan: pnpm seed:javascript

const payload = await getPayload({ config })
const result = await seedCourse(payload, course)
console.log(`Seed "${course.title}" selesai:`, result)
