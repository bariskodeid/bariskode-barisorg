// Meilisearch client — hanya dipakai di server-side (API routes, sync scripts).
// Client-side search lewat /api/search proxy (rate-limited).

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || ''

// Batas waktu tiap request ke Meilisearch. Sync dipanggil dari hook
// afterChange (save di admin/seed ikut menunggu), jadi Meilisearch yang
// hang tidak boleh ikut menggantung save.
const REQUEST_TIMEOUT_MS = 5_000

// Search hanya aktif kalau MEILISEARCH_HOST di-set eksplisit. Tanpa ini hook
// sync jadi no-op — dev/test tanpa container Meilisearch tidak perlu
// menunggu koneksi ke localhost:7700 yang pasti gagal di tiap save.
export function isSearchEnabled(): boolean {
  return Boolean(process.env.MEILISEARCH_HOST)
}

function meiliFetch(path: string, init: { method: string; body?: unknown }): Promise<Response> {
  return fetch(`${MEILISEARCH_HOST}${path}`, {
    method: init.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILI_MASTER_KEY}`,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

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

  const res = await meiliFetch(`/indexes/${index}/search`, { method: 'POST', body })

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
  const path = primaryKey
    ? `/indexes/${index}/documents?primaryKey=${primaryKey}`
    : `/indexes/${index}/documents`

  const res = await meiliFetch(path, { method: 'POST', body: documents })

  if (!res.ok) {
    throw new Error(`Meilisearch index error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

export async function meiliDeleteDocuments(
  index: string,
  documentIds: (string | number)[],
): Promise<{ taskUid: number }> {
  const res = await meiliFetch(`/indexes/${index}/documents/delete-batch`, {
    method: 'POST',
    body: documentIds,
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
  const res = await meiliFetch(`/indexes/${index}/settings`, { method: 'PATCH', body: settings })

  if (!res.ok) {
    throw new Error(`Meilisearch settings error: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

// Kosongkan seluruh dokumen di satu index (dipakai bulk reindex). Index yang
// belum ada dianggap sudah kosong.
export async function meiliDeleteAllDocuments(index: string): Promise<void> {
  const res = await meiliFetch(`/indexes/${index}/documents`, { method: 'DELETE' })

  if (!res.ok && res.status !== 404) {
    throw new Error(`Meilisearch delete-all error: ${res.status} ${await res.text()}`)
  }
}

// Menunggu task async Meilisearch selesai — dipakai bulk reindex supaya
// jumlah dokumen yang dilaporkan sudah benar-benar ter-index.
export async function meiliWaitForTask(taskUid: number, timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const res = await meiliFetch(`/tasks/${taskUid}`, { method: 'GET' })
    if (!res.ok) throw new Error(`Meilisearch task error: ${res.status} ${await res.text()}`)
    const task = (await res.json()) as { status: string; error?: { message?: string } }
    if (task.status === 'succeeded') return
    if (task.status === 'failed' || task.status === 'canceled') {
      throw new Error(`Meilisearch task ${taskUid} ${task.status}: ${task.error?.message ?? ''}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Meilisearch task ${taskUid} belum selesai setelah ${timeoutMs}ms`)
}

export async function meiliDocumentCount(index: string): Promise<number> {
  const res = await meiliFetch(`/indexes/${index}/stats`, { method: 'GET' })
  if (res.status === 404) return 0
  if (!res.ok) throw new Error(`Meilisearch stats error: ${res.status} ${await res.text()}`)
  const stats = (await res.json()) as { numberOfDocuments: number }
  return stats.numberOfDocuments
}
