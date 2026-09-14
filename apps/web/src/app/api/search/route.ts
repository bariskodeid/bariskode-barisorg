import { NextRequest, NextResponse } from 'next/server'

import { checkRateLimit } from '@/lib/rateLimit'
import { meiliSearch } from '@/lib/search/meilisearch'

interface SearchHit {
  id: string | number
  title: string
  slug: string
  type: 'course' | 'lesson' | 'post'
  description?: string
  excerpt?: string
  courseTitle?: string
  courseSlug?: string
  author?: string
  category?: string
  level?: string
  _formatted?: Record<string, string>
}

// GET /api/search?q=python&limit=20
export async function GET(req: NextRequest) {
  const { allowed, retryAfterMs } = checkRateLimit('search', {
    limit: 30,
    windowMs: 60_000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak request, coba lagi sebentar lagi.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } },
    )
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], totalHits: 0, query: q || '' })
  }

  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)

  try {
    const [coursesResult, lessonsResult, postsResult] = await Promise.all([
      meiliSearch<{ id: string | number; title: string; slug: string; description?: string; category?: string; level?: string; status?: string }>({
        q,
        index: 'courses',
        limit,
        filter: ['status = published'],
      }).catch(() => ({ hits: [], estimatedTotalHits: 0 })),
      meiliSearch<{ id: string | number; title: string; slug: string; courseTitle?: string; courseSlug?: string }>({
        q,
        index: 'lessons',
        limit,
      }).catch(() => ({ hits: [], estimatedTotalHits: 0 })),
      meiliSearch<{ id: string | number; title: string; slug: string; excerpt?: string; author?: string; status?: string }>({
        q,
        index: 'posts',
        limit,
        filter: ['status = published'],
      }).catch(() => ({ hits: [], estimatedTotalHits: 0 })),
    ])

    const results: SearchHit[] = [
      ...coursesResult.hits.map((h) => ({
        ...h,
        type: 'course' as const,
        _formatted: h as unknown as Record<string, string>,
      })),
      ...lessonsResult.hits.map((h) => ({
        ...h,
        type: 'lesson' as const,
        _formatted: h as unknown as Record<string, string>,
      })),
      ...postsResult.hits.map((h) => ({
        ...h,
        type: 'post' as const,
        _formatted: h as unknown as Record<string, string>,
      })),
    ]

    // Sort by relevance: courses first, then lessons, then posts
    // Within each type, Meilisearch already sorts by relevance
    return NextResponse.json({
      results,
      totalHits: results.length,
      query: q,
    })
  } catch (error) {
    // Meilisearch might not be running — return empty results gracefully
    return NextResponse.json({
      results: [],
      totalHits: 0,
      query: q,
      error: 'Search temporarily unavailable',
    })
  }
}
