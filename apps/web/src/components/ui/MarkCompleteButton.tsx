'use client'

import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function MarkCompleteButton({
  lessonId,
  courseId,
  initiallyCompleted,
}: {
  lessonId: number
  courseId: number
  initiallyCompleted: boolean
}) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initiallyCompleted)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lessonId, courseId }),
      })
      if (res.ok) {
        setCompleted(true)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-mono uppercase tracking-wider">
        <Check className="w-4 h-4" />
        Selesai
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50"
    >
      {loading ? 'Menyimpan...' : 'Tandai Selesai'}
    </button>
  )
}
