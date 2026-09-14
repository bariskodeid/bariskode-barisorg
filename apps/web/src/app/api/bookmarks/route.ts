import { NextRequest, NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rateLimit'

// POST /api/bookmarks — toggle bookmark (add/remove)
export async function POST(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { allowed, retryAfterMs } = checkRateLimit(`bookmarks:${user.id}`, {
    limit: 30,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const { lessonId } = await req.json()
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId wajib diisi' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'bookmarks',
    where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    limit: 1,
    overrideAccess: false,
    user,
  })

  if (existing.docs.length > 0) {
    // Unbookmark
    await payload.delete({
      collection: 'bookmarks',
      id: existing.docs[0].id,
      overrideAccess: false,
      user,
    })
    return NextResponse.json({ bookmarked: false })
  }

  // Add bookmark
  await payload.create({
    collection: 'bookmarks',
    data: {
      user: user.id,
      lesson: lessonId,
      createdAt: new Date().toISOString(),
    },
    overrideAccess: false,
    user,
  })
  return NextResponse.json({ bookmarked: true })
}

// GET /api/bookmarks?lessonId=xxx — check bookmark status, or list all if no lessonId
export async function GET(req: NextRequest) {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get('lessonId')

  if (lessonId) {
    // Check single bookmark status
    const existing = await payload.find({
      collection: 'bookmarks',
      where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lessonId } }] },
      limit: 1,
      overrideAccess: false,
      user,
    })
    return NextResponse.json({ bookmarked: existing.docs.length > 0 })
  }

  // List all bookmarks for user
  const bookmarks = await payload.find({
    collection: 'bookmarks',
    where: { user: { equals: user.id } },
    limit: 1000,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
    user,
  })
  return NextResponse.json({ bookmarks: bookmarks.docs })
}
