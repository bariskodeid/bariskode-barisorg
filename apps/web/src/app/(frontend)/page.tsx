import { ArrowRight, Code2, Database, LineChart, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { dictionaries } from '@/lib/i18n/dictionaries'
import { getLocale } from '@/lib/i18n/getLocale'
import { getPayload } from '@/lib/payload'

const categoryIcons: Record<string, typeof Code2> = {
  programming: Code2,
  database: Database,
  'data-science': LineChart,
  cybersecurity: ShieldCheck,
}

// Bukan ISR (revalidate) — sengaja dynamic. Kalau halaman ini di-static-
// generate saat build, `next build`/Docker image build butuh koneksi
// database yang reachable saat itu juga (diverifikasi: gagal ECONNREFUSED
// kalau tidak). Build image Docker production tidak boleh bergantung pada
// DB yang reachable saat build time — itu anti-pattern (build & runtime
// jadi tercampur, secret DB production juga jadi harus di-passing sebagai
// build-arg yang bocor ke image layer history kalau dipaksakan).
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload()
  const locale = await getLocale()
  const t = dictionaries[locale]

  // overrideAccess: false wajib di setiap query dari halaman publik — Local
  // API Payload defaultnya overrideAccess: true, yang membypass access
  // control collection (lihat CLAUDE.md: access control adalah satu-satunya
  // sumber kebenaran, bukan filter manual di halaman).
  const [categories, highlightCourses] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 4,
      sort: 'name',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      limit: 3,
      sort: 'order',
      depth: 1,
      overrideAccess: false,
    }),
  ])

  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 md:mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {t.home.badge}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]">
            {t.home.heroTitle1}
            <br />
            <span className="text-muted-foreground">{t.home.heroTitle2}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            {t.home.heroDesc}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg"
            >
              {t.home.startLearning}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#kategori"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 backdrop-blur-sm text-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-lg"
            >
              {t.home.viewCategories}
            </a>
          </div>
        </div>

        {/* Kategori */}
        {categories.docs.length > 0 && (
          <div id="kategori" className="scroll-mt-24 mb-16 md:mb-24">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center">
              {t.home.categories}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {categories.docs.map((category) => {
                const Icon = categoryIcons[category.slug] ?? Code2
                return (
                  <Link
                    key={category.id}
                    href={`/courses?category=${category.slug}`}
                    className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors text-center lg:text-left"
                  >
                    <div className="mb-4 p-3 inline-block rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Kursus pilihan */}
        {highlightCourses.docs.length > 0 && (
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center">
              {t.home.featuredCourses}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {highlightCourses.docs.map((course) => {
                const category =
                  typeof course.category === 'object' ? course.category : undefined
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors h-full flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {category && (
                        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground">
                          {category.name}
                        </span>
                      )}
                      <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-muted-foreground capitalize">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white transition-colors">
                      {t.home.viewCourse}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
