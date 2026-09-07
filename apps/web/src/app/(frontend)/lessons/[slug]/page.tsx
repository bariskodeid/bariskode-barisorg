import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayload } from '@/lib/payload'

export const revalidate = 60

export default async function LessonDetailPage(props: PageProps<'/lessons/[slug]'>) {
  const { slug } = await props.params
  const payload = await getPayload()

  // overrideAccess: false wajib di setiap query dari halaman publik — lihat
  // catatan di app/(frontend)/page.tsx.
  const lessonResult = await payload.find({
    collection: 'lessons',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })
  const lesson = lessonResult.docs[0]

  if (!lesson) {
    notFound()
  }

  const mod = typeof lesson.module === 'object' ? lesson.module : undefined
  const course = mod && typeof mod.course === 'object' ? mod.course : undefined

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {course && (
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-white transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              {course.title}
            </Link>
          )}

          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8">{lesson.title}</h1>

          {lesson.videoUrl && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {lesson.content && (
            <div className="prose prose-invert max-w-none">
              <RichText data={lesson.content} />
            </div>
          )}

          {lesson.hasSandbox && (
            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Sandbox kode ({lesson.sandboxLanguage || 'interaktif'})
              </p>
              {lesson.sandboxStarterCode && (
                <pre className="text-sm font-mono overflow-x-auto text-muted-foreground">
                  <code>{lesson.sandboxStarterCode}</code>
                </pre>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Editor interaktif untuk menjalankan kode ini masih dalam pengembangan (Fase 5).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
