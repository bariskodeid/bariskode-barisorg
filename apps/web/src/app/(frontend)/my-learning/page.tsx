import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCourseProgress } from '@/lib/getCourseProgress'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { getLocale } from '@/lib/i18n/getLocale'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function MyLearningPage() {
  const payload = await getPayload()
  const locale = await getLocale()
  const t = dictionaries[locale]
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    redirect('/login')
  }

  const progressRecords = await payload.find({
    collection: 'progress',
    where: { user: { equals: user.id } },
    limit: 1000,
    depth: 0,
    overrideAccess: false,
    user,
  })

  const courseIds = Array.from(
    new Set(
      progressRecords.docs.map((record) =>
        typeof record.course === 'object' ? record.course.id : record.course,
      ),
    ),
  )

  const courses =
    courseIds.length > 0
      ? await payload.find({
          collection: 'courses',
          where: { id: { in: courseIds } },
          overrideAccess: false,
          user,
        })
      : { docs: [] }

  const coursesWithProgress = await Promise.all(
    courses.docs.map(async (course) => ({
      course,
      progress: await getCourseProgress(payload, user, course.id),
    })),
  )

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">{t.myLearning.title}</h1>
          <p className="text-muted-foreground text-lg mb-12">{t.myLearning.subtitle}</p>

          {coursesWithProgress.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-muted-foreground mb-4">{t.myLearning.emptyDesc}</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg"
              >
                {t.myLearning.explore}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {coursesWithProgress.map(({ course, progress }) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-6"
                >
                  <Link href={`/courses/${course.slug}`} className="block">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <span className="text-sm font-mono text-muted-foreground">
                        {progress.percentage}%
                      </span>
                    </div>
                    <ProgressBar percentage={progress.percentage} />
                    <p className="text-xs text-muted-foreground mt-2">
                      {t.myLearning.lessonsCompleted(progress.completed, progress.total)}
                    </p>
                  </Link>
                  {progress.percentage === 100 && (
                    <a
                      href={`/api/certificates/${course.id}`}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono uppercase tracking-wider hover:bg-green-500/20 transition-colors"
                    >
                      {t.myLearning.downloadCertificate}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
