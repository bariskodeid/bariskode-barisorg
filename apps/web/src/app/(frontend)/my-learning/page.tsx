import { headers as getHeaders } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { getCourseProgress } from '@/lib/getCourseProgress'
import { dictionaries } from '@/lib/i18n/dictionaries'
import { getLocale } from '@/lib/i18n/getLocale'
import { getPayload } from '@/lib/payload'

import { MyLearningTabs } from './MyLearningTabs'

export type CourseWithProgress = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  course: any
  progress: { completed: number; total: number; percentage: number }
}

export type Bookmark = {
  id: string | number
  createdAt: string
  lesson:
    | { id: string | number; title: string; slug: string; module?: { course?: { id: string | number; title: string } } }
    | string
    | number
}

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

  // Fetch bookmarks
  const bookmarkRecords = await payload.find({
    collection: 'bookmarks',
    where: { user: { equals: user.id } },
    limit: 1000,
    sort: '-createdAt',
    depth: 2,
    overrideAccess: false,
    user,
  })

  const bookmarks = bookmarkRecords.docs as Bookmark[]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">{t.myLearning.title}</h1>
          <p className="text-muted-foreground text-lg mb-12">{t.myLearning.subtitle}</p>

          <MyLearningTabs coursesWithProgress={coursesWithProgress} bookmarks={bookmarks} />
        </div>
      </div>
    </div>
  )
}
