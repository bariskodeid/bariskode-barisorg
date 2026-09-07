import { NextRequest, NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

// Lihat docs/09-FEATURE-PROGRESS-TRACKING.md. overrideAccess: false dipakai
// eksplisit di sini (bukan andalkan default Local API yang overrideAccess:
// true) supaya access control collection Progress (lihat
// src/collections/Progress.ts) tetap jadi satu-satunya sumber kebenaran.
export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
