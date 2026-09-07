import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CodeSandbox } from '@/components/CodeSandbox'
import { MarkCompleteButton } from '@/components/ui/MarkCompleteButton'
import { isAllowedLanguage } from '@/lib/judge0'
import { getPayload } from '@/lib/payload'

// Halaman ini butuh status login (untuk tombol "Tandai Selesai" & status
// completed), jadi tidak bisa ISR murni — lihat catatan di
// components/layout/Header.tsx soal trade-off dynamic vs ISR yang sama.
export const dynamic = 'force-dynamic'

export default async function LessonDetailPage(props: PageProps<'/lessons/[slug]'>) {
  const { slug } = await props.params
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await getHeaders() })

  // overrideAccess: false wajib di setiap query dari halaman publik — lihat
  // catatan di app/(frontend)/page.tsx. depth: 3 supaya course.category ikut
  // ter-resolve jadi objek (dibutuhkan untuk cek kategori cybersecurity).
  const lessonResult = await payload.find({
    collection: 'lessons',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
    overrideAccess: false,
    user,
  })
  const lesson = lessonResult.docs[0]

  if (!lesson) {
    notFound()
  }

  const mod = typeof lesson.module === 'object' ? lesson.module : undefined
  const course = mod && typeof mod.course === 'object' ? mod.course : undefined
  const category = course && typeof course.category === 'object' ? course.category : undefined
  const isCybersecurityLesson = category?.slug === 'cybersecurity'

  const normalizedSandboxLanguage = lesson.sandboxLanguage?.toLowerCase().trim()
  const sandboxLanguage = isAllowedLanguage(normalizedSandboxLanguage)
    ? normalizedSandboxLanguage
    : undefined

  let alreadyCompleted = false
  if (user && course) {
    const existing = await payload.find({
      collection: 'progress',
      where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lesson.id } }] },
      limit: 1,
      overrideAccess: false,
      user,
    })
    alreadyCompleted = existing.docs.length > 0
  }

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
            <div className="mt-8">
              {!user ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="text-white hover:underline">
                      Masuk
                    </Link>{' '}
                    untuk mencoba sandbox kode interaktif di lesson ini.
                  </p>
                </div>
              ) : sandboxLanguage ? (
                <CodeSandbox
                  language={sandboxLanguage}
                  starterCode={lesson.sandboxStarterCode || ''}
                />
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm text-muted-foreground">
                    Bahasa sandbox lesson ini (&quot;{lesson.sandboxLanguage}&quot;) belum
                    didukung.
                  </p>
                </div>
              )}
            </div>
          )}

          {isCybersecurityLesson && (
            <a
              href={`${process.env.NEXT_PUBLIC_CTF_URL}/challenges`}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-6"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Lab Praktik
                </p>
                <p className="text-lg font-bold group-hover:text-green-400 transition-colors">
                  Buka Lab CTF
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ruang lab terpisah — perlu akun sendiri di sana (tidak terhubung dengan akun
                  bariskode.org ini).
                </p>
              </div>
              <ExternalLink className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-white transition-colors" />
            </a>
          )}

          <div className="mt-12 pt-8 border-t border-white/10">
            {user && course ? (
              <MarkCompleteButton
                lessonId={lesson.id}
                courseId={course.id}
                initiallyCompleted={alreadyCompleted}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="text-white hover:underline">
                  Masuk
                </Link>{' '}
                untuk menandai lesson ini selesai dan melacak progress belajarmu.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
