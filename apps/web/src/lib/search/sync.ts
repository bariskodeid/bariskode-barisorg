// Sync engine — sync Payload collections ke Meilisearch. Dipakai oleh hook
// collection (collections/hooks/searchSync.ts) dan script bulk reindex
// (scripts/search-sync.ts). Lihat docs/25-FEATURE-SEARCH.md.
//
// Index hanya berisi konten yang memang tampil publik: course & post dengan
// `status: published`, dan lesson yang course-nya published. Dokumen yang
// tidak (lagi) memenuhi syarat DIHAPUS dari index, bukan diberi flag — jadi
// /api/search tidak perlu filter status (filter butuh filterableAttributes,
// yang belum ada di index yang baru dibuat otomatis oleh Meilisearch).

import type { Payload, PayloadRequest } from 'payload'

import type { Course, Lesson, Post } from '@/payload-types'

import { lexicalToPlainText } from '../lexicalText'
import { getPublicAuthor } from '../publicAuthor'

import {
  meiliDeleteAllDocuments,
  meiliDeleteDocuments,
  meiliIndex,
  meiliUpdateSettings,
  meiliWaitForTask,
} from './meilisearch'

export type SearchIndexName = 'courses' | 'lessons' | 'posts'

const SEARCH_INDEXES: SearchIndexName[] = ['courses', 'lessons', 'posts']

const DESCRIPTION_MAX_LENGTH = 300

// `req` diteruskan dari hook supaya query membaca data di transaksi yang sama
// (perubahan yang sedang disimpan belum di-commit saat afterChange jalan).
interface SyncContext {
  payload: Payload
  req?: PayloadRequest
}

// Butuh lesson yang di-fetch dengan depth >= 2 (module -> course).
function courseOf(lesson: Lesson): Course | null {
  const mod = typeof lesson.module === 'object' ? lesson.module : null
  return mod && typeof mod.course === 'object' ? mod.course : null
}

function courseToDoc(course: Course) {
  const category = typeof course.category === 'object' ? course.category : null
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: lexicalToPlainText(course.description, DESCRIPTION_MAX_LENGTH),
    category: category?.name ?? '',
    categorySlug: category?.slug ?? '',
    level: course.level ?? '',
  }
}

function lessonToDoc(lesson: Lesson, course: Course) {
  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    courseTitle: course.title,
    courseSlug: course.slug,
  }
}

function postToDoc(post: Post, authorName: string) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    author: authorName,
  }
}

async function upsert(index: SearchIndexName, docs: { id: number }[]): Promise<number | null> {
  if (docs.length === 0) return null
  await ensureIndexSettings()
  const { taskUid } = await meiliIndex(index, docs, 'id')
  return taskUid
}

async function remove(index: SearchIndexName, ids: number[]): Promise<void> {
  if (ids.length === 0) return
  await meiliDeleteDocuments(index, ids)
}

// draft: false = versi utama (yang dibaca frontend), bukan draft terbaru.
// Penting untuk Courses/Posts (versions.drafts aktif): hook afterChange juga
// jalan saat editor cuma "Save Draft", dan `doc` di hook itu berisi data
// draft yang belum tampil di situs — jangan sampai masuk index.
async function findCourse({ payload, req }: SyncContext, id: number) {
  return payload.findByID({
    collection: 'courses',
    id,
    depth: 1,
    draft: false,
    overrideAccess: true,
    disableErrors: true,
    req,
  })
}

export async function syncLessonsOfCourse(ctx: SyncContext, courseId: number): Promise<void> {
  const [course, lessons] = await Promise.all([
    findCourse(ctx, courseId),
    ctx.payload.find({
      collection: 'lessons',
      where: { 'module.course': { equals: courseId } },
      depth: 0,
      pagination: false,
      overrideAccess: true,
      req: ctx.req,
    }),
  ])

  if (course?.status === 'published') {
    await upsert(
      'lessons',
      lessons.docs.map((lesson) => lessonToDoc(lesson, course)),
    )
  } else {
    await remove(
      'lessons',
      lessons.docs.map((lesson) => lesson.id),
    )
  }
}

// Lesson menyimpan judul & slug course-nya, jadi perubahan course (judul,
// slug, status) ikut di-sync ke semua lesson di dalamnya.
export async function syncCourse(ctx: SyncContext, courseId: number): Promise<void> {
  const course = await findCourse(ctx, courseId)
  if (course?.status === 'published') {
    await upsert('courses', [courseToDoc(course)])
  } else {
    await remove('courses', [courseId])
  }
  await syncLessonsOfCourse(ctx, courseId)
}

export async function syncLesson(ctx: SyncContext, lessonId: number): Promise<void> {
  const lesson = await ctx.payload.findByID({
    collection: 'lessons',
    id: lessonId,
    depth: 2,
    overrideAccess: true,
    disableErrors: true,
    req: ctx.req,
  })
  const course = lesson ? courseOf(lesson) : null
  if (lesson && course?.status === 'published') {
    await upsert('lessons', [lessonToDoc(lesson, course)])
  } else {
    await remove('lessons', [lessonId])
  }
}

export async function syncModuleLessons(ctx: SyncContext, moduleId: number): Promise<void> {
  const lessons = await ctx.payload.find({
    collection: 'lessons',
    where: { module: { equals: moduleId } },
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req: ctx.req,
  })
  for (const lesson of lessons.docs) {
    await syncLesson(ctx, lesson.id)
  }
}

export async function syncPost(ctx: SyncContext, postId: number): Promise<void> {
  const post = await ctx.payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 0,
    draft: false,
    overrideAccess: true,
    disableErrors: true,
    req: ctx.req,
  })
  if (post?.status === 'published') {
    // Relasi author cuma berisi ID (Users tidak bisa dibaca publik) — nama
    // diambil lewat field publik saja.
    const author = await getPublicAuthor(ctx.payload, post.author)
    await upsert('posts', [postToDoc(post, author?.name ?? '')])
  } else {
    await remove('posts', [postId])
  }
}

export async function deleteFromIndex(index: SearchIndexName, id: number): Promise<void> {
  await remove(index, [id])
}

const INDEX_SETTINGS: Record<SearchIndexName, Record<string, unknown>> = {
  courses: {
    searchableAttributes: ['title', 'description', 'category'],
  },
  lessons: {
    searchableAttributes: ['title', 'courseTitle'],
  },
  posts: {
    searchableAttributes: ['title', 'excerpt', 'author'],
  },
}

export async function setupIndexes(): Promise<void> {
  await Promise.all(
    SEARCH_INDEXES.map((index) => meiliUpdateSettings(index, INDEX_SETTINGS[index])),
  )
}

// Settings index dipasang sekali per proses sebelum dokumen pertama dikirim,
// supaya Meilisearch yang masih kosong (index dibuat otomatis saat dokumen
// pertama masuk) tidak jalan dengan settings default. Gagal = dicoba lagi di
// sync berikutnya.
let settingsReady: Promise<void> | null = null

function ensureIndexSettings(): Promise<void> {
  settingsReady ??= setupIndexes().catch((err) => {
    settingsReady = null
    throw err
  })
  return settingsReady
}

export interface ReindexResult {
  courses: number
  lessons: number
  posts: number
}

// Bulk reindex: kosongkan ketiga index lalu isi ulang dari Postgres. Dipakai
// untuk index pertama kali dan untuk memperbaiki index yang sudah tidak
// sinkron (mis. Meilisearch sempat mati saat konten disimpan).
export async function reindexAll(payload: Payload): Promise<ReindexResult> {
  await setupIndexes()

  const [courses, lessons, posts] = await Promise.all([
    payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      depth: 1,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'lessons',
      depth: 2,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    }),
  ])

  const courseDocs = courses.docs.map(courseToDoc)
  const lessonDocs = lessons.docs.flatMap((lesson) => {
    const course = courseOf(lesson)
    return course?.status === 'published' ? [lessonToDoc(lesson, course)] : []
  })
  const postDocs = await Promise.all(
    posts.docs.map(async (post) => {
      const author = await getPublicAuthor(payload, post.author)
      return postToDoc(post, author?.name ?? '')
    }),
  )

  const batches: [SearchIndexName, { id: number }[]][] = [
    ['courses', courseDocs],
    ['lessons', lessonDocs],
    ['posts', postDocs],
  ]
  for (const [index, docs] of batches) {
    await meiliDeleteAllDocuments(index)
    const taskUid = await upsert(index, docs)
    if (taskUid !== null) await meiliWaitForTask(taskUid)
  }

  return { courses: courseDocs.length, lessons: lessonDocs.length, posts: postDocs.length }
}
