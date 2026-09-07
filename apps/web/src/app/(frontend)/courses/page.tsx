import { BookOpen } from 'lucide-react'
import Link from 'next/link'

import { T } from '@/lib/i18n/LocaleContext'
import { getPayload } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function CoursesPage(props: PageProps<'/courses'>) {
  const searchParams = await props.searchParams
  const activeCategory =
    typeof searchParams.category === 'string' ? searchParams.category : undefined

  const payload = await getPayload()

  // overrideAccess: false wajib di setiap query dari halaman publik — lihat
  // catatan di app/(frontend)/page.tsx.
  const [categories, courses] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'courses',
      where: {
        and: [
          { status: { equals: 'published' } },
          ...(activeCategory ? [{ 'category.slug': { equals: activeCategory } }] : []),
        ],
      },
      sort: 'order',
      depth: 1,
      limit: 100,
      overrideAccess: false,
    }),
  ])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            <T ns="courses" k="title" />
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            <T ns="courses" k="desc" />
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/courses"
              className={cn(
                'text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors',
                !activeCategory
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:text-white',
              )}
            >
              <T ns="courses" k="all" />
            </Link>
            {categories.docs.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug}`}
                className={cn(
                  'text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors',
                  activeCategory === category.slug
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:text-white',
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {courses.docs.length === 0 ? (
            <p className="text-muted-foreground">
              <T ns="courses" k="empty" />
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.docs.map((course) => {
                const category =
                  typeof course.category === 'object' ? course.category : undefined
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-white/5 text-white">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground capitalize">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                      {course.title}
                    </h3>

                    <div className="mt-auto pt-4 flex flex-wrap gap-2">
                      {category && (
                        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground">
                          {category.name}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
