import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { GiscusComments } from '@/components/GiscusComments'
import { T } from '@/lib/i18n/LocaleContext'
import { getPayload } from '@/lib/payload'

export const revalidate = 60

// React.cache dedup fetch antara generateMetadata & komponen halaman.
const getPost = cache(async (slug: string) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0]
})

export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: post.meta?.title || `${post.title} | bariskode.org`,
    description: post.meta?.description || post.excerpt || undefined,
  }
}

export default async function BlogDetailPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const author = typeof post.author === 'object' ? post.author : undefined
  const relatedCourse = typeof post.relatedCourse === 'object' ? post.relatedCourse : undefined
  const avatar =
    author && typeof author.avatar === 'object' ? author.avatar : undefined

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {post.publishedAt && (
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
              {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">{post.title}</h1>

          {author && (
            <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/10">
              {avatar?.url && (
                <Image
                  src={avatar.url}
                  alt={avatar.alt}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-bold">{author.name}</p>
                {author.bio && <p className="text-xs text-muted-foreground">{author.bio}</p>}
              </div>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <RichText data={post.content} />
          </div>

          {relatedCourse && (
            <Link
              href={`/courses/${relatedCourse.slug}`}
              className="group mt-12 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-6"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  <T ns="blogDetail" k="continueLearning" />
                </p>
                <p className="text-lg font-bold group-hover:text-green-400 transition-colors">
                  {relatedCourse.title}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <div className="mt-12 pt-8 border-t border-white/10">
            <GiscusComments slug={post.slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
