import { NextRequest, NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rateLimit'

// Lihat docs/09-FEATURE-PROGRESS-TRACKING.md. overrideAccess: false dipakai
// eksplisit di sini (bukan andalkan default Local API yang overrideAccess:
// true) supaya access control collection Progress (lihat
// src/collections/Progress.ts) tetap jadi satu-satunya sumber kebenaran.
//
// Rate limit ditambah di Fase 9 (docs/16-SECURITY-CHECKLIST.md eksplisit
// menyebut /api/progress & /api/sandbox) — endpoint ini sudah idempotent
// tapi tetap bisa disalahgunakan untuk membebani DB lewat request bertubi.
export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(`progress:${user.id}`, {
    limit: 30,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const { lessonId, courseId } = await req.json()
  if (!lessonId || !courseId) {
    return NextResponse.json({ error: 'lessonId dan courseId wajib diisi' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'progress',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
    overrideAccess: false,
    user,
  })

  if (existing.docs.length > 0) {
    return NextResponse.json(existing.docs[0]) // sudah selesai sebelumnya, idempotent
  }

  const record = await payload.create({
    collection: 'progress',
    data: {
      user: user.id,
      lesson: lessonId,
      course: courseId,
      completedAt: new Date().toISOString(),
    },
    overrideAccess: false,
    user,
  })

  return NextResponse.json(record)
}
