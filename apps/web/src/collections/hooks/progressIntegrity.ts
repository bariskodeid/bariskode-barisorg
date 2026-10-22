import { APIError, type CollectionBeforeChangeHook } from 'payload'

import type { Progress } from '../../payload-types'
import { lessonHasQuiz } from '../../lib/quiz'

// Konteks Local API yang hanya di-set /api/quiz setelah grading lulus.
// Request REST/GraphQL selalu mulai dengan context kosong, jadi flag ini
// tidak bisa dikirim dari browser.
export const QUIZ_PASSED_CONTEXT = 'quizPassed'

const relationId = (ref: number | { id: number } | null | undefined) =>
  typeof ref === 'object' ? ref?.id : ref

// Access control Progress cuma memastikan user menulis baris miliknya
// sendiri. Hook ini menjaga ISI barisnya, berlaku untuk semua jalur tulis
// (route custom, REST /api/progress/:id, GraphQL) — lihat
// docs/09-FEATURE-PROGRESS-TRACKING.md:
// - lesson ber-quiz hanya bisa diselesaikan lewat grading /api/quiz yang
//   lulus (sebelumnya POST /api/progress atau mutation GraphQL bisa
//   melewati quiz);
// - `course` diturunkan dari lesson, bukan dipercaya dari client (course
//   palsu bisa menggelembungkan progress course lain sampai 100% dan
//   membuka sertifikat);
// - `score` hanya diisi oleh grading quiz.
// Admin (koreksi manual di admin panel) dan Local API tanpa user (script
// server) dilewati.
export const enforceProgressIntegrity: CollectionBeforeChangeHook<Progress> = async ({
  context,
  data,
  originalDoc,
  req,
}) => {
  if (!req.user || req.user.role === 'admin') return data

  const lessonId = relationId(data.lesson ?? originalDoc?.lesson)
  const lesson = lessonId
    ? await req.payload.findByID({
        collection: 'lessons',
        id: lessonId,
        depth: 1,
        overrideAccess: true,
        disableErrors: true,
        req,
      })
    : null
  const courseId = lesson && typeof lesson.module === 'object' ? relationId(lesson.module.course) : undefined
  if (!lesson || !courseId) {
    throw new APIError('Lesson tidak ditemukan.', 400, undefined, true)
  }

  const quizPassed = context[QUIZ_PASSED_CONTEXT] === true
  if (lessonHasQuiz(lesson) && !quizPassed) {
    throw new APIError('Lesson ini diselesaikan dengan lulus quiz-nya.', 403, undefined, true)
  }

  return {
    ...data,
    course: courseId,
    score: quizPassed ? data.score : null,
  }
}
