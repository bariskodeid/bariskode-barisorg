// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { QUIZ_PASSED_CONTEXT } from '@/collections/hooks/progressIntegrity'
import config from '@/payload.config'
import type { User } from '@/payload-types'

// Hook Progress (collections/hooks/progressIntegrity.ts) berlaku untuk semua
// jalur tulis — route custom, REST, GraphQL — jadi diuji langsung lewat Local
// API sebagai student (overrideAccess: false + user), sama seperti request
// dari luar.
let payload: Payload
let student: User
let categoryId: number
const courseIds: number[] = []
let moduleId: number
let quizLessonId: number
let plainLessonId: number
const progressIds: number[] = []

const stamp = Date.now()

const progressData = (lesson: number, course: number, score?: number) => ({
  user: student.id,
  lesson,
  course,
  completedAt: new Date().toISOString(),
  score,
})

describe('integritas Progress', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = await payload.create({
      collection: 'categories',
      data: { name: `Kategori progress ${stamp}`, slug: `kategori-progress-${stamp}` },
    })
    categoryId = category.id
    for (const label of ['a', 'b']) {
      const course = await payload.create({
        collection: 'courses',
        data: { title: `Course progress ${label} ${stamp}`, slug: `course-progress-${label}-${stamp}`, category: categoryId },
      })
      courseIds.push(course.id)
    }
    const mod = await payload.create({
      collection: 'modules',
      data: { title: 'Module progress', course: courseIds[0], order: 1 },
    })
    moduleId = mod.id
    const quizLesson = await payload.create({
      collection: 'lessons',
      data: {
        title: 'Lesson ber-quiz',
        slug: `lesson-quiz-${stamp}`,
        module: moduleId,
        order: 1,
        hasQuiz: true,
        quizQuestions: [{ question: 'Soal?', options: [{ text: 'Benar', isCorrect: true }, { text: 'Salah' }] }],
      },
    })
    quizLessonId = quizLesson.id
    const plainLesson = await payload.create({
      collection: 'lessons',
      data: { title: 'Lesson tanpa quiz', slug: `lesson-plain-${stamp}`, module: moduleId, order: 2 },
    })
    plainLessonId = plainLesson.id
    student = await payload.create({
      collection: 'users',
      data: { name: 'Siswa progress', email: `progress-${stamp}@example.com`, password: 'rahasia-123', role: 'student' },
    })
  })

  afterAll(async () => {
    if (progressIds.length) await payload.delete({ collection: 'progress', where: { id: { in: progressIds } } })
    await payload.delete({ collection: 'lessons', where: { id: { in: [quizLessonId, plainLessonId] } } })
    await payload.delete({ collection: 'modules', id: moduleId })
    await payload.delete({ collection: 'courses', where: { id: { in: courseIds } } })
    await payload.delete({ collection: 'categories', id: categoryId })
    await payload.delete({ collection: 'users', id: student.id })
  })

  it('lesson ber-quiz tidak bisa diselesaikan tanpa lulus grading quiz', async () => {
    await expect(
      payload.create({
        collection: 'progress',
        data: progressData(quizLessonId, courseIds[0], 100),
        overrideAccess: false,
        user: student,
      }),
    ).rejects.toThrow('Lesson ini diselesaikan dengan lulus quiz-nya.')
  })

  it('grading yang lulus menyimpan skor, dengan course diambil dari lesson', async () => {
    const record = await payload.create({
      collection: 'progress',
      data: progressData(quizLessonId, courseIds[1], 80),
      context: { [QUIZ_PASSED_CONTEXT]: true },
      overrideAccess: false,
      user: student,
      depth: 0,
    })
    progressIds.push(record.id)

    expect(record.course).toBe(courseIds[0])
    expect(record.score).toBe(80)
  })

  it('lesson tanpa quiz: course palsu & skor dari client diabaikan', async () => {
    const record = await payload.create({
      collection: 'progress',
      data: progressData(plainLessonId, courseIds[1], 100),
      overrideAccess: false,
      user: student,
      depth: 0,
    })
    progressIds.push(record.id)

    expect(record.course).toBe(courseIds[0])
    expect(record.score ?? null).toBeNull()
  })

  it('student tidak bisa mengubah baris progress miliknya', async () => {
    await expect(
      payload.update({
        collection: 'progress',
        id: progressIds[0],
        data: { score: 100 },
        overrideAccess: false,
        user: student,
      }),
    ).rejects.toThrow()
  })
})
