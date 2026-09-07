import type { MetadataRoute } from 'next'

import { getPayload } from '@/lib/payload'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  const [courses, posts] = await Promise.all([
    payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      limit: 1000,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      overrideAccess: false,
    }),
  ])

  return [
    { url: serverURL, changeFrequency: 'weekly', priority: 1 },
    { url: `${serverURL}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${serverURL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    ...courses.docs.map((course) => ({
      url: `${serverURL}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.docs.map((post) => ({
      url: `${serverURL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
