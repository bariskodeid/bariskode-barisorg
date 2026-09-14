'use client'

import { BookOpen, FileText, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'
import { cn } from '@/lib/utils'

interface SearchHit {
  id: string | number
  title: string
  slug: string
  type: 'course' | 'lesson' | 'post'
  description?: string
  excerpt?: string
  courseTitle?: string
  courseSlug?: string
  author?: string
}

const typeIcons = {
  course: BookOpen,
  lesson: FileText,
  post: FileText,
}

const typeColors = {
  course: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  lesson: 'bg-green-500/10 text-green-400 border-green-500/30',
  post: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

export function SearchButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  )
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`, {
        signal: abortRef.current.signal,
      })
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
        setSelectedIdx(0)
      }
    } catch {
      // aborted or network error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      const hit = results[selectedIdx]
      const href =
        hit.type === 'course'
          ? `/courses/${hit.slug}`
          : hit.type === 'lesson'
            ? `/lessons/${hit.slug}`
            : `/blog/${hit.slug}`
      window.location.href = href
    }
  }

  function getHref(hit: SearchHit) {
    if (hit.type === 'course') return `/courses/${hit.slug}`
    if (hit.type === 'lesson') return `/lessons/${hit.slug}`
    return `/blog/${hit.slug}`
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-xl mx-4 bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-secondary rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t.search.title}...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {t.search.noResults}
            </div>
          )}

          {results.map((hit, idx) => {
            const Icon = typeIcons[hit.type]
            const colorClass = typeColors[hit.type]
            const typeLabel =
              hit.type === 'course'
                ? t.search.course
                : hit.type === 'lesson'
                  ? t.search.lesson
                  : t.search.post

            return (
              <Link
                key={`${hit.type}-${hit.id}`}
                href={getHref(hit)}
                onClick={onClose}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 transition-colors',
                  idx === selectedIdx ? 'bg-secondary/50' : 'hover:bg-secondary/30',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 p-1.5 rounded-lg border shrink-0',
                    colorClass,
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {hit.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
                      {typeLabel}
                    </span>
                  </div>
                  {hit.courseTitle && hit.type === 'lesson' && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {hit.courseTitle}
                    </p>
                  )}
                  {hit.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {hit.description}
                    </p>
                  )}
                  {hit.excerpt && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {hit.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground font-mono flex gap-4">
          <span>
            <kbd className="px-1 py-0.5 bg-secondary rounded mr-1">↑↓</kbd>
            navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-secondary rounded mr-1">↵</kbd>
            open
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-secondary rounded mr-1">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  )
}
