import { NextRequest, NextResponse } from 'next/server'

import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { isSearchEnabled, meiliSearch } from '@/lib/search/meilisearch'

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

// Satu index gagal (mis. Meilisearch mati, index belum pernah dibuat) tidak
// menggagalkan hasil index lain — tapi wajib ter-log: index yang kosong atau
// rusak sebelumnya cuma terlihat sebagai "Tidak ditemukan" tanpa jejak.
function emptyOnError(index: string) {
  return (err: unknown) => {
    console.error(`[search] query index ${index} gagal:`, err)
    return { hits: [], estimatedTotalHits: 0 }
  }
}

// GET /api/search?q=python&limit=20
export async function GET(req: NextRequest) {
  // Per IP (docs/25-FEATURE-SEARCH.md) — key tunggal 'search' membuat 30
  // request/menit itu jatah bersama SEMUA pengunjung.
  const { allowed, retryAfterMs } = checkRateLimit(`search:${getClientIp(req.headers)}`, {
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

  if (!isSearchEnabled()) {
    return NextResponse.json({
      results: [],
      totalHits: 0,
      query: q,
      error: 'Search temporarily unavailable',
    })
  }

  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)

  try {
    const [coursesResult, lessonsResult, postsResult] = await Promise.all([
      // Tanpa filter status: index hanya berisi konten published (lihat
      // lib/search/sync.ts).
      meiliSearch<{ id: string | number; title: string; slug: string; description?: string; category?: string; level?: string }>({
        q,
        index: 'courses',
        limit,
      }).catch(emptyOnError('courses')),
      meiliSearch<{ id: string | number; title: string; slug: string; courseTitle?: string; courseSlug?: string }>({
        q,
        index: 'lessons',
        limit,
      }).catch(emptyOnError('lessons')),
      meiliSearch<{ id: string | number; title: string; slug: string; excerpt?: string; author?: string }>({
        q,
        index: 'posts',
        limit,
      }).catch(emptyOnError('posts')),
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
    console.error('[search] gagal:', error)
    return NextResponse.json({
      results: [],
      totalHits: 0,
      query: q,
      error: 'Search temporarily unavailable',
    })
  }
}
