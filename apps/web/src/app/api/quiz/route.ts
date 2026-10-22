import { NextRequest, NextResponse } from 'next/server'

import { QUIZ_PASSED_CONTEXT } from '@/collections/hooks/progressIntegrity'
import { getPayload } from '@/lib/payload'
import { QUIZ_PASSING_SCORE, lessonHasQuiz } from '@/lib/quiz'
import { checkRateLimit } from '@/lib/rateLimit'

interface QuizAnswer {
  questionIndex: number
  optionIndex: number
}

// Lihat docs/19-FEATURE-QUIZ.md. Pola sama seperti /api/progress: auth gate,
// rate limit, overrideAccess:false+user untuk operasi non-grading. SATU
// PENGECUALIAN SENGAJA: grading di bawah pakai overrideAccess:true supaya
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
  const answers = body?.answers

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId wajib diisi' }, { status: 400 })
  }
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: 'answers wajib berupa array' }, { status: 400 })
  }

  // Baris progress hanya ada untuk lesson yang sudah lulus, jadi kalau ada,
  // quiz ini sudah selesai — balikan record lama (idempotent). Quiz yang
  // belum lulus tidak meninggalkan baris apa pun dan boleh diulang.
  const existing = await payload.find({
    collection: 'progress',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
    overrideAccess: false,
    user,
  })
  if (existing.docs.length > 0) {
    return NextResponse.json({
      alreadyCompleted: true,
      passed: true,
      score: existing.docs[0].score ?? null,
    })
  }

  const lesson = await payload
    .findByID({ collection: 'lessons', id: lessonId, overrideAccess: true, depth: 1 })
    .catch(() => null)

  if (!lesson || !lessonHasQuiz(lesson) || !lesson.quizQuestions) {
    return NextResponse.json({ error: 'Lesson ini tidak punya quiz' }, { status: 400 })
  }

  // Course diambil dari lesson, bukan dari body request (hook Progress juga
  // memaksakan ini, lihat collections/hooks/progressIntegrity.ts).
  const mod = typeof lesson.module === 'object' ? lesson.module : null
  const courseId = mod && (typeof mod.course === 'object' ? mod.course.id : mod.course)
  if (!courseId) {
    return NextResponse.json({ error: 'Lesson ini tidak terhubung ke course' }, { status: 400 })
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
  const passed = score >= QUIZ_PASSING_SCORE
  const graded = { passed, score, correctCount, total, results, passingScore: QUIZ_PASSING_SCORE }

  if (!passed) {
    return NextResponse.json(graded)
  }

  try {
    await payload.create({
      collection: 'progress',
      data: {
        user: user.id,
        lesson: lesson.id,
        course: courseId,
        completedAt: new Date().toISOString(),
        score,
      },
      context: { [QUIZ_PASSED_CONTEXT]: true },
      overrideAccess: false,
      user,
    })
  } catch (err) {
    // Submit ganda yang balapan: unique index (user, lesson) menolak baris
    // kedua. Lesson tetap tercatat selesai oleh request yang pertama.
    const raced = await payload.count({
      collection: 'progress',
      where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lesson.id } }] },
      overrideAccess: false,
      user,
    })
    if (raced.totalDocs === 0) throw err
  }

  return NextResponse.json(graded)
}
