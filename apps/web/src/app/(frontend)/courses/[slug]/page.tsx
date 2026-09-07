import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronRight, PlayCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { getPayload } from '@/lib/payload'
import type { Lesson, Module } from '@/payload-types'

export const revalidate = 60

// overrideAccess: false wajib di setiap query dari halaman publik — lihat
// catatan di app/(frontend)/page.tsx. `status: published` juga dicek
// eksplisit di sini (bukan cuma di listing) supaya draft course tidak bisa
// diakses langsung lewat URL slug-nya oleh pengunjung anonim.
// React.cache dedup fetch antara generateMetadata & komponen halaman supaya
// tidak query dua kali per request.
const getCourse = cache(async (slug: string) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'courses',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 1,
    limit: 1,
    overrideAccess: false,
  })
  return result.docs[0]
})

export async function generateMetadata(
  props: PageProps<'/courses/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const course = await getCourse(slug)
  if (!course) return {}

  return {
    title: course.meta?.title || `${course.title} | bariskode.org`,
    description: course.meta?.description || undefined,
  }
}

export default async function CourseDetailPage(props: PageProps<'/courses/[slug]'>) {
  const { slug } = await props.params
  const payload = await getPayload()
  const course = await getCourse(slug)

  if (!course) {
    notFound()
  }

  const category = typeof course.category === 'object' ? course.category : undefined

  const modulesResult = await payload.find({
    collection: 'modules',
    where: { course: { equals: course.id } },
    sort: 'order',
    limit: 100,
    overrideAccess: false,
  })

  const lessonsByModule = new Map<number, Lesson[]>()
  if (modulesResult.docs.length > 0) {
    const lessonsResult = await payload.find({
      collection: 'lessons',
      where: { module: { in: modulesResult.docs.map((mod: Module) => mod.id) } },
      sort: 'order',
      limit: 500,
      overrideAccess: false,
    })
    for (const lesson of lessonsResult.docs) {
      const moduleId = typeof lesson.module === 'object' ? lesson.module.id : lesson.module
      const list = lessonsByModule.get(moduleId) ?? []
      list.push(lesson)
      lessonsByModule.set(moduleId, list)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground">
                {category.name}
              </span>
            )}
            <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground capitalize">
              {course.level}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">{course.title}</h1>

          {course.description && (
            <div className="prose prose-invert max-w-none text-muted-foreground mb-12">
              <RichText data={course.description} />
            </div>
          )}

          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Materi
          </h2>

          {modulesResult.docs.length === 0 ? (
            <p className="text-muted-foreground">Belum ada materi untuk kursus ini.</p>
          ) : (
            <div className="space-y-6">
              {modulesResult.docs.map((mod: Module) => (
                <div
                  key={mod.id}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="font-bold">{mod.title}</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {(lessonsByModule.get(mod.id) ?? []).map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.slug}`}
                        className="flex items-center justify-between gap-4 px-6 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <PlayCircle className="w-4 h-4 shrink-0" />
                          {lesson.title}
                        </span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
