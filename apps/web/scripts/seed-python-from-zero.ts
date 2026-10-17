import { getPayload } from 'payload'
import config from '../src/payload.config'
import course from './courses/python'
import { seedCourse } from './lib/seed-course'

// Seed (upsert) satu course — data ada di scripts/courses/python.ts.
// Jalankan: pnpm seed:python

const payload = await getPayload({ config })
const result = await seedCourse(payload, course)
console.log(`Seed "${course.title}" selesai:`, result)
