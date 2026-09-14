'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  lessonId: string | number
  initialBookmarked: boolean
}

export function BookmarkButton({ lessonId, initialBookmarked }: BookmarkButtonProps) {
  const { t } = useLocale()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarked(initialBookmarked)
  }, [initialBookmarked])

  async function toggle() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lessonId }),
      })
      if (res.ok) {
        const data = await res.json()
        setBookmarked(data.bookmarked)
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors',
        'border border-border bg-secondary/50 hover:bg-secondary',
        bookmarked && 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20',
      )}
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          {t.bookmark.remove}
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          {t.bookmark.add}
        </>
      )}
    </button>
  )
}
