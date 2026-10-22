import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { CodeSandbox } from '@/components/CodeSandbox'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { LessonRichText } from '@/components/ui/LessonRichText'
import { MarkCompleteButton } from '@/components/ui/MarkCompleteButton'
import { Quiz } from '@/components/ui/Quiz'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { getLocale } from '@/lib/i18n/getLocale'
import { isAllowedLanguage } from '@/lib/judge0'
import { lexicalToPlainText } from '@/lib/lexicalText'
import { getPayload } from '@/lib/payload'
import { QUIZ_PASSING_SCORE, lessonHasQuiz } from '@/lib/quiz'

// Halaman ini butuh status login (untuk quiz/tombol "Tandai Selesai" & status
// completed), jadi tidak bisa ISR murni — lihat catatan di
// lib/auth/AuthContext.tsx soal trade-off dynamic vs ISR yang sama.
export const dynamic = 'force-dynamic'

// Metadata tidak butuh status login (Lessons.access.read publik), jadi query
// anonim terpisah dari query halaman — React.cache cuma dedup dalam satu
// request render.
const getLessonMeta = cache(async (slug: string) => {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'lessons',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    select: { title: true, content: true, module: true },
    overrideAccess: false,
  })
  return result.docs[0]
})

export async function generateMetadata(props: PageProps<'/lessons/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const lesson = await getLessonMeta(slug)
  if (!lesson) return {}

  const mod = typeof lesson.module === 'object' ? lesson.module : undefined
  const course = mod && typeof mod.course === 'object' ? mod.course : undefined
  return {
    title: course
      ? `${lesson.title} — ${course.title} | bariskode.org`
      : `${lesson.title} | bariskode.org`,
    description: lexicalToPlainText(lesson.content, 160) || undefined,
  }
}

export default async function LessonDetailPage(props: PageProps<'/lessons/[slug]'>) {
  const { slug } = await props.params
  const payload = await getPayload()
  const locale = await getLocale()
  const t = dictionaries[locale]
  const { user } = await payload.auth({ headers: await getHeaders() })

  // Fetch settings untuk toggle feature & integrasi URL
  const settings = await payload.findGlobal({ slug: 'settings' })
  const enableSandbox = settings?.enableSandbox !== false // default true
  const ctfdEnabled = settings?.ctfdEnabled !== false // default true
  const ctfdUrl = settings?.ctfdUrl || process.env.NEXT_PUBLIC_CTF_URL || ''

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

  // Sanitasi eksplisit: hanya teruskan `question`/`text` ke client component,
  // TIDAK PERNAH `isCorrect` (harusnya sudah dikecualikan oleh field access di
  // Lessons.ts untuk role student, ini lapis kedua yang eksplisit di kode).
  const quizQuestions = (lesson.quizQuestions ?? []).map((q) => ({
    question: q.question,
    options: (q.options ?? []).map((o) => ({ text: o.text })),
  }))

  const normalizedSandboxLanguage = lesson.sandboxLanguage?.toLowerCase().trim()
  const sandboxLanguage = isAllowedLanguage(normalizedSandboxLanguage)
    ? normalizedSandboxLanguage
    : undefined

  // Lesson sebelum/sesudah dalam urutan kurikulum course (module.order lalu
  // lesson.order, sama seperti daftar di /courses/[slug]).
  let prevLesson: { title: string; slug: string } | undefined
  let nextLesson: { title: string; slug: string } | undefined
  if (course) {
    const modules = await payload.find({
      collection: 'modules',
      where: { course: { equals: course.id } },
      sort: 'order',
      depth: 0,
      pagination: false,
      overrideAccess: false,
      user,
    })
    const moduleIndex = new Map(modules.docs.map((m, index) => [m.id, index]))
    const siblings = await payload.find({
      collection: 'lessons',
      where: { module: { in: modules.docs.map((m) => m.id) } },
      select: { title: true, slug: true, module: true, order: true },
      depth: 0,
      pagination: false,
      overrideAccess: false,
      user,
    })
    const moduleOf = (l: (typeof siblings.docs)[number]) =>
      moduleIndex.get(typeof l.module === 'object' ? l.module.id : l.module) ?? 0
    const ordered = [...siblings.docs].sort(
      (a, b) => moduleOf(a) - moduleOf(b) || a.order - b.order || a.id - b.id,
    )
    const position = ordered.findIndex((l) => l.id === lesson.id)
    if (position > 0) prevLesson = ordered[position - 1]
    if (position >= 0 && position < ordered.length - 1) nextLesson = ordered[position + 1]
  }

  let alreadyCompleted = false
  let existingScore: number | null = null
  let isBookmarked = false
  if (user && course) {
    const [existingProgress, existingBookmark] = await Promise.all([
      payload.find({
        collection: 'progress',
        where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lesson.id } }] },
        limit: 1,
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: 'bookmarks',
        where: { and: [{ user: { equals: user.id } }, { lesson: { equals: lesson.id } }] },
        limit: 1,
        overrideAccess: false,
        user,
      }),
    ])
    alreadyCompleted = existingProgress.docs.length > 0
    existingScore = existingProgress.docs[0]?.score ?? null
    isBookmarked = existingBookmark.docs.length > 0
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

          {user && (
            <div className="mb-8">
              <BookmarkButton lessonId={lesson.id} initialBookmarked={isBookmarked} />
            </div>
          )}

          {lesson.videoUrl && (
            <div className="aspect-video mb-8 rounded-xl overflow-hidden border border-border">
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
            <div className="prose prose-invert prose-code:before:content-none prose-code:after:content-none max-w-none">
              <LessonRichText data={lesson.content} />
            </div>
          )}

          {lesson.hasSandbox && enableSandbox && (
            <div className="mt-8">
              {!user ? (
                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="text-foreground hover:underline">
                      {t.nav.login}
                    </Link>{' '}
                    {t.lesson.loginToSandbox}
                  </p>
                </div>
              ) : sandboxLanguage ? (
                <CodeSandbox
                  language={sandboxLanguage}
                  starterCode={lesson.sandboxStarterCode || ''}
                />
              ) : (
                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <p className="text-sm text-muted-foreground">
                    {t.lesson.sandboxUnsupported(lesson.sandboxLanguage ?? '')}
                  </p>
                </div>
              )}
            </div>
          )}

          {isCybersecurityLesson && ctfdEnabled && (
            <a
              href={`${ctfdUrl}/challenges`}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-secondary/50 transition-colors p-6"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  {t.lesson.labTitle}
                </p>
                <p className="text-lg font-bold group-hover:text-green-400 transition-colors">
                  {t.lesson.openLab}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.lesson.labDesc}</p>
              </div>
              <ExternalLink className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            {user && course ? (
              lessonHasQuiz(lesson) ? (
                <Quiz
                  lessonId={lesson.id}
                  questions={quizQuestions}
                  initiallyCompleted={alreadyCompleted}
                  initialScore={existingScore}
                />
              ) : (
                <MarkCompleteButton lessonId={lesson.id} initiallyCompleted={alreadyCompleted} />
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="text-foreground hover:underline">
                  {t.nav.login}
                </Link>{' '}
                {lessonHasQuiz(lesson)
                  ? t.lesson.loginToQuiz(QUIZ_PASSING_SCORE)
                  : t.lesson.loginToComplete}
              </p>
            )}
          </div>

          {(prevLesson || nextLesson) && (
            <nav aria-label={course?.title} className="mt-12 grid gap-4 sm:grid-cols-2">
              {prevLesson && (
                <Link
                  href={`/lessons/${prevLesson.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-4"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <ChevronLeft className="w-4 h-4" />
                    {t.lesson.previous}
                  </span>
                  <span className="block mt-1 font-bold group-hover:text-green-400 transition-colors">
                    {prevLesson.title}
                  </span>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-4 sm:col-start-2 sm:text-right"
                >
                  <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {t.lesson.next}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                  <span className="block mt-1 font-bold group-hover:text-green-400 transition-colors">
                    {nextLesson.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
