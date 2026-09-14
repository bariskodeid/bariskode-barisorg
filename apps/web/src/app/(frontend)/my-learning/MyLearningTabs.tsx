'use client'

import Link from 'next/link'
import { useState } from 'react'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { useLocale } from '@/lib/i18n/LocaleContext'
import type { Bookmark, CourseWithProgress } from './page'

interface MyLearningTabsProps {
  coursesWithProgress: CourseWithProgress[]
  bookmarks: Bookmark[]
}

export function MyLearningTabs({ coursesWithProgress, bookmarks }: MyLearningTabsProps) {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState<'courses' | 'bookmarks'>('courses')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'courses'
              ? 'text-foreground border-foreground'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          {t.nav.myLearning}
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-sm font-mono uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === 'bookmarks'
              ? 'text-foreground border-foreground'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          {t.bookmark.tab}
          {bookmarks.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-secondary">
              {bookmarks.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'courses' && (
        <div>
          {coursesWithProgress.length === 0 ? (
            <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
              <p className="text-muted-foreground mb-4">{t.myLearning.emptyDesc}</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-mono text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity rounded-lg"
              >
                {t.myLearning.explore}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {coursesWithProgress.map(({ course, progress }) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-secondary/50 transition-colors p-6"
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
      )}

      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
              <p className="text-muted-foreground">{t.bookmark.empty}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookmarks.map((bookmark) => {
                const lesson =
                  typeof bookmark.lesson === 'object' ? bookmark.lesson : null
                if (!lesson) return null
                const mod =
                  typeof lesson.module === 'object' ? lesson.module : null
                const course =
                  mod && typeof mod.course === 'object' ? mod.course : null
                return (
                  <Link
                    key={bookmark.id}
                    href={`/lessons/${lesson.slug}`}
                    className="rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-secondary/50 transition-colors p-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{lesson.title}</h3>
                      {course && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {course.title}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(bookmark.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
