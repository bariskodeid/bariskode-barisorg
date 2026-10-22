// Bulk reindex — jalankan via: pnpm search:sync
// (= payload run src/scripts/search-sync.ts; di production lewat service
// web-script, lihat docs/25-FEATURE-SEARCH.md). Mengosongkan lalu mengisi
// ulang index courses, lessons, dan posts dari Postgres. Aman dijalankan
// berulang kali.

import { getPayload } from '../lib/payload'
import { isSearchEnabled, meiliDocumentCount } from '../lib/search/meilisearch'
import { reindexAll } from '../lib/search/sync'

async function main() {
  if (!isSearchEnabled()) {
    throw new Error('MEILISEARCH_HOST belum di-set — tidak ada Meilisearch untuk di-index.')
  }

  const payload = await getPayload()

  console.log('🔍 Reindex Meilisearch...')
  const result = await reindexAll(payload)

  for (const index of ['courses', 'lessons', 'posts'] as const) {
    const indexed = await meiliDocumentCount(index)
    console.log(`  ${index}: ${result[index]} dokumen dari Postgres, ${indexed} di index`)
    if (indexed !== result[index]) {
      throw new Error(`Jumlah dokumen index ${index} tidak cocok (${indexed} vs ${result[index]})`)
    }
  }

  console.log('🎉 Search sync complete!')
  process.exit(0)
}

// WAJIB top-level await: `payload run` mengakhiri proses begitu modul selesai
// dievaluasi, jadi main() yang tidak di-await terpotong diam-diam (exit 0)
// sebelum sempat mengindex apa pun.
await main().catch((err) => {
  console.error('❌ Sync failed:', err)
  process.exit(1)
})
