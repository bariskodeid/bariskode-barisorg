import { getPayload } from 'payload'
import config from '../src/payload.config'
import course from './courses/rust'
import { seedCourse } from './lib/seed-course'

// Seed (upsert) satu course — data ada di scripts/courses/rust.ts.
// Jalankan: pnpm seed:rust

const payload = await getPayload({ config })
const result = await seedCourse(payload, course)
console.log(`Seed "${course.title}" selesai:`, result)
