'use client'

import Giscus from '@giscus/react'

// Lihat docs/08-FEATURE-BLOG.md untuk langkah setup Giscus (aktifkan GitHub
// Discussions di repo, install app giscus, isi env var). Selama env var
// belum diisi (repo belum dibuat/dikonfigurasi), komponen ini sengaja tidak
// merender apa-apa daripada menampilkan widget Giscus yang error/kosong.
export function GiscusComments({ slug }: { slug: string }) {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!repo || !repoId || !categoryId || repoId === 'CHANGE_ME' || categoryId === 'CHANGE_ME') {
    return null
  }

  return (
    <Giscus
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping="specific"
      term={slug}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark"
      lang="id"
    />
  )
}
