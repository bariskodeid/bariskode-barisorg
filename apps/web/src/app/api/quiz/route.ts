import { NextRequest, NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rateLimit'

interface QuizAnswer {
  questionIndex: number
  optionIndex: number
}

// Lihat docs/19-FEATURE-QUIZ.md. Pola sama seperti /api/progress: auth gate,
// rate limit, overrideAccess:false+user untuk operasi non-grading. SATU
// PENGECUALIAN SENGAJA: langkah 4 di bawah pakai overrideAccess:true supaya
// server bisa baca field `isCorrect` (yang field-access-nya sengaja dikunci
// dari role student, lihat Lessons.ts) untuk keperluan grading — field itu
// TIDAK PERNAH diteruskan balik ke response.
export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(`quiz:${user.id}`, {
    limit: 10,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const body = await req.json().catch(() => null)
  const lessonId = body?.lessonId
  const courseId = body?.courseId
  const answers = body?.answers

  if (!lessonId || !courseId) {
    return NextResponse.json({ error: 'lessonId dan courseId wajib diisi' }, { status: 400 })
  }
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: 'answers wajib berupa array' }, { status: 400 })
  }

  // Idempotent — kalau lesson ini sudah completed sebelumnya (baik lewat
  // quiz maupun mark-complete biasa), balikan record lama. Tidak ada fitur
  // retake/re-grade di MVP ini.
  const existing = await payload.find({
    collection: 'progress',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
    overrideAccess: false,
    user,
  })
  if (existing.docs.length > 0) {
    return NextResponse.json({ alreadyCompleted: true, score: existing.docs[0].score ?? null })
  }

  const lesson = await payload
    .findByID({ collection: 'lessons', id: lessonId, overrideAccess: true, depth: 0 })
    .catch(() => null)

  if (!lesson || !lesson.hasQuiz || !lesson.quizQuestions || lesson.quizQuestions.length === 0) {
    return NextResponse.json({ error: 'Lesson ini tidak punya quiz' }, { status: 400 })
  }

  const questions = lesson.quizQuestions
  const results = questions.map((q, index) => {
    const correctOptionIndex = (q.options ?? []).findIndex((o) => o.isCorrect)
    const userAnswer = (answers as QuizAnswer[]).find((a) => a.questionIndex === index)
    return { questionIndex: index, correct: userAnswer?.optionIndex === correctOptionIndex }
  })

  const correctCount = results.filter((r) => r.correct).length
  const total = questions.length
  const score = Math.round((correctCount / total) * 100)

  await payload.create({
    collection: 'progress',
    data: {
      user: user.id,
      lesson: lessonId,
      course: courseId,
      completedAt: new Date().toISOString(),
      score,
    },
    overrideAccess: false,
    user,
  })

  return NextResponse.json({ score, correctCount, total, results })
}
