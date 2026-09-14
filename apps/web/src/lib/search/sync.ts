// Sync engine — sync Payload collections ke Meilisearch.
// Dipakai oleh afterChange hooks dan script bulk sync.

import { meiliIndex, meiliUpdateSettings } from './meilisearch'

interface SyncPayload {
  id: string | number
  title: string
  slug: string
  description?: string | null
  excerpt?: string | null
  status?: string
  category?: { name: string; slug: string } | string | null
  level?: string
  course?: { title: string; slug: string } | string | null
  author?: { name: string } | string | null
  module?: { course?: { title: string; slug: string } | string | null } | string | null
}

function stripRichText(text: unknown): string {
  if (!text || typeof text !== 'string') return ''
  // Simple strip: remove HTML tags
  return text.replace(/<[^>]+>/g, '').trim()
}

function getCourseFromLesson(lesson: SyncPayload): { title: string; slug: string } | null {
  const mod = lesson.module
  if (!mod || typeof mod !== 'object') return null
  const course = mod.course
  if (!course || typeof course !== 'object') return null
  return course
}

export async function syncCourse(course: SyncPayload) {
  const doc = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: stripRichText(course.description),
    category:
      typeof course.category === 'object' && course.category
        ? course.category.name
        : typeof course.category === 'string'
          ? course.category
          : '',
    categorySlug:
      typeof course.category === 'object' && course.category
        ? course.category.slug
        : '',
    level: course.level || '',
    status: course.status || 'published',
  }

  await meiliIndex('courses', [doc], 'id')
}

export async function syncLesson(lesson: SyncPayload) {
  const courseInfo = getCourseFromLesson(lesson)
  const doc = {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    courseTitle: courseInfo?.title || '',
    courseSlug: courseInfo?.slug || '',
  }

  await meiliIndex('lessons', [doc], 'id')
}

export async function syncPost(post: SyncPayload) {
  const doc = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    author:
      typeof post.author === 'object' && post.author
        ? post.author.name
        : typeof post.author === 'string'
          ? post.author
          : '',
    status: post.status || 'published',
  }

  await meiliIndex('posts', [doc], 'id')
}

export async function deleteFromIndex(
  index: 'courses' | 'lessons' | 'posts',
  id: string | number,
) {
  const { meiliDeleteDocuments } = await import('./meilisearch')
  await meiliDeleteDocuments(index, [id])
}

export async function setupIndexes() {
  const settings = {
    searchableAttributes: ['title', 'description', 'excerpt', 'courseTitle', 'author'],
    filterableAttributes: ['category', 'categorySlug', 'level', 'status'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  }

  await Promise.all([
    meiliUpdateSettings('courses', settings),
    meiliUpdateSettings('lessons', {
      searchableAttributes: ['title', 'courseTitle'],
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
    }),
    meiliUpdateSettings('posts', {
      searchableAttributes: ['title', 'excerpt', 'author'],
      filterableAttributes: ['status'],
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
    }),
  ])
}
