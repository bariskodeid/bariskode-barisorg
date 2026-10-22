import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import type { Course, Lesson, Module, Post } from '../../payload-types'
import { isSearchEnabled } from '../../lib/search/meilisearch'
import {
  deleteFromIndex,
  syncCourse,
  syncLesson,
  syncModuleLessons,
  syncPost,
} from '../../lib/search/sync'

// Hook sinkronisasi index Meilisearch (docs/25-FEATURE-SEARCH.md). Sengaja
// di-await (bukan fire-and-forget): sync perlu membaca data lewat transaksi
// `req` yang sama sebelum di-commit, dan script `payload run` (seed) langsung
// process.exit setelah selesai — request yang belum terkirim akan hilang.
//
// Gagal sync TIDAK BOLEH menggagalkan save konten: error cuma di-log, index
// bisa dibetulkan kapan saja lewat `pnpm search:sync`. Konsekuensi lain yang
// diterima: index ditulis sebelum transaksi di-commit, jadi save yang
// akhirnya di-rollback bisa meninggalkan index yang sudah berubah — juga
// dibetulkan oleh `pnpm search:sync`.
async function runSync(req: PayloadRequest, label: string, fn: () => Promise<void>): Promise<void> {
  if (!isSearchEnabled()) return
  try {
    await fn()
  } catch (err) {
    req.payload.logger.error({ err }, `[search] sync ${label} gagal`)
  }
}

export const syncCourseToSearch: CollectionAfterChangeHook<Course> = async ({ doc, req }) => {
  await runSync(req, `course ${doc.id}`, () => syncCourse({ payload: req.payload, req }, doc.id))
  return doc
}

// Course/module yang masih berisi lesson tidak bisa dihapus (FK
// modules.course_id & lessons.module_id NOT NULL + ON DELETE SET NULL, jadi
// Postgres menolak delete-nya). Lesson selalu dihapus lebih dulu, dan tiap
// lesson keluar dari index lewat removeLessonFromSearch.
export const removeCourseFromSearch: CollectionAfterDeleteHook<Course> = async ({ doc, req }) => {
  await runSync(req, `hapus course ${doc.id}`, () => deleteFromIndex('courses', doc.id))
}

export const syncLessonToSearch: CollectionAfterChangeHook<Lesson> = async ({ doc, req }) => {
  await runSync(req, `lesson ${doc.id}`, () => syncLesson({ payload: req.payload, req }, doc.id))
  return doc
}

export const removeLessonFromSearch: CollectionAfterDeleteHook<Lesson> = async ({ doc, req }) => {
  await runSync(req, `hapus lesson ${doc.id}`, () => deleteFromIndex('lessons', doc.id))
}

// Module tidak punya index sendiri, tapi menentukan course mana yang
// tercantum di dokumen lesson — sync ulang lesson-nya kalau module
// dipindah ke course lain.
export const syncModuleLessonsToSearch: CollectionAfterChangeHook<Module> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const courseId = (course: Module['course'] | undefined) =>
    typeof course === 'object' ? course?.id : course
  if (operation === 'update' && courseId(previousDoc?.course) !== courseId(doc.course)) {
    await runSync(req, `lesson module ${doc.id}`, () =>
      syncModuleLessons({ payload: req.payload, req }, doc.id),
    )
  }
  return doc
}

export const syncPostToSearch: CollectionAfterChangeHook<Post> = async ({ doc, req }) => {
  await runSync(req, `post ${doc.id}`, () => syncPost({ payload: req.payload, req }, doc.id))
  return doc
}

export const removePostFromSearch: CollectionAfterDeleteHook<Post> = async ({ doc, req }) => {
  await runSync(req, `hapus post ${doc.id}`, () => deleteFromIndex('posts', doc.id))
}
