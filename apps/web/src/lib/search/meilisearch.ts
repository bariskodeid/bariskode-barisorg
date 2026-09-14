// Meilisearch client — hanya dipakai di server-side (API routes, sync scripts).
// Client-side search lewat /api/search proxy (rate-limited).

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || ''

interface MeiliSearchParams {
  q: string
  index: string
  limit?: number
  offset?: number
  filter?: string[]
}

interface MeiliSearchResult<T> {
  hits: T[]
  estimatedTotalHits: number
  processingTimeMs: number
  query: string
}

export async function meiliSearch<T = Record<string, unknown>>(
  params: MeiliSearchParams,
): Promise<MeiliSearchResult<T>> {
  const { q, index, limit = 20, offset = 0, filter } = params

  const body: Record<string, unknown> = {
    q,
    limit,
    offset,
    attributesToHighlight: ['title', 'description', 'excerpt'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
  }
  if (filter && filter.length > 0) {
    body.filter = filter
  }

  const res = await fetch(`${MEILISEARCH_HOST}/indexes/${index}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILI_MASTER_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Meilisearch error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

export async function meiliIndex<T = Record<string, unknown>>(
  index: string,
  documents: T[],
  primaryKey?: string,
): Promise<{ taskUid: number }> {
  const url = primaryKey
    ? `${MEILISEARCH_HOST}/indexes/${index}/documents?primaryKey=${primaryKey}`
    : `${MEILISEARCH_HOST}/indexes/${index}/documents`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILI_MASTER_KEY}`,
    },
    body: JSON.stringify(documents),
  })

  if (!res.ok) {
    throw new Error(`Meilisearch index error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

export async function meiliDeleteDocuments(
  index: string,
  documentIds: (string | number)[],
): Promise<{ taskUid: number }> {
  const res = await fetch(`${MEILISEARCH_HOST}/indexes/${index}/documents/delete-batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILI_MASTER_KEY}`,
    },
    body: JSON.stringify(documentIds),
  })

  if (!res.ok) {
    throw new Error(`Meilisearch delete error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

export async function meiliUpdateSettings(
  index: string,
  settings: Record<string, unknown>,
): Promise<{ taskUid: number }> {
  const res = await fetch(`${MEILISEARCH_HOST}/indexes/${index}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILI_MASTER_KEY}`,
    },
    body: JSON.stringify(settings),
  })

  if (!res.ok) {
    throw new Error(`Meilisearch settings error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}
