import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCourseProgress } from '@/lib/getCourseProgress'
import { getPayload } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function MyLearningPage() {
  const payload = await getPayload()
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
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Belajar Saya</h1>
          <p className="text-muted-foreground text-lg mb-12">
            Progress kursus yang sedang atau sudah kamu jalani.
          </p>

          {coursesWithProgress.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Belum ada progress. Mulai kursus dan tandai lesson selesai untuk melihatnya di
                sini.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg"
              >
                Jelajahi Kursus
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {coursesWithProgress.map(({ course, progress }) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <span className="text-sm font-mono text-muted-foreground">
                      {progress.percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={progress.percentage} />
                  <p className="text-xs text-muted-foreground mt-2">
                    {progress.completed} / {progress.total} lesson selesai
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
