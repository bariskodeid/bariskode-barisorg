// Bulk sync script — jalankan via: pnpm payload run scripts/search-sync.ts
// Sync semua courses, lessons, dan posts dari Payload ke Meilisearch.

import { getPayload } from '../lib/payload'
import { syncCourse, syncLesson, syncPost, setupIndexes } from '../lib/search/sync'

async function main() {
  console.log('🔍 Setting up Meilisearch indexes...')
  await setupIndexes()

  const payload = await getPayload()

  console.log('📚 Syncing courses...')
  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  })

  for (const course of courses.docs) {
    await syncCourse(course as Parameters<typeof syncCourse>[0])
  }
  console.log(`  ✅ ${courses.docs.length} courses synced`)

  console.log('📖 Syncing lessons...')
  const lessons = await payload.find({
    collection: 'lessons',
    limit: 1000,
    depth: 2,
    overrideAccess: false,
  })

  for (const lesson of lessons.docs) {
    await syncLesson(lesson as Parameters<typeof syncLesson>[0])
  }
  console.log(`  ✅ ${lessons.docs.length} lessons synced`)

  console.log('📝 Syncing posts...')
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  })

  for (const post of posts.docs) {
    await syncPost(post as Parameters<typeof syncPost>[0])
  }
  console.log(`  ✅ ${posts.docs.length} posts synced`)

  console.log('🎉 Search sync complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Sync failed:', err)
  process.exit(1)
})
