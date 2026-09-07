import { Newspaper } from 'lucide-react'
import Link from 'next/link'

import { getPayload } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function BlogPage(props: PageProps<'/blog'>) {
  const searchParams = await props.searchParams
  const activeTag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined

  const payload = await getPayload()

  const [tags, posts] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100, sort: 'name', overrideAccess: false }),
    payload.find({
      collection: 'posts',
      where: {
        and: [
          { status: { equals: 'published' } },
          ...(activeTag ? [{ 'tags.slug': { equals: activeTag } }] : []),
        ],
      },
      sort: '-publishedAt',
      depth: 1,
      limit: 100,
      overrideAccess: false,
    }),
  ])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Artikel tutorial, pengumuman, dan tulisan seputar programming, data, dan security.
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/blog"
              className={cn(
                'text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors',
                !activeTag
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:text-white',
              )}
            >
              Semua
            </Link>
            {tags.docs.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className={cn(
                  'text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors',
                  activeTag === tag.slug
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:text-white',
                )}
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {posts.docs.length === 0 ? (
            <p className="text-muted-foreground">Belum ada artikel published.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.docs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors h-full flex flex-col"
                >
                  <div className="p-2 rounded-lg bg-white/5 text-white w-fit mb-4">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm flex-grow">{post.excerpt}</p>
                  )}
                  {post.publishedAt && (
                    <p className="text-xs font-mono text-muted-foreground mt-4">
                      {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
