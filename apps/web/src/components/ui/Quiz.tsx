'use client'

import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

interface QuizOption {
  text: string
}

interface QuizQuestion {
  question: string
  options: QuizOption[]
}

interface QuizResult {
  questionIndex: number
  correct: boolean
}

export function Quiz({
  lessonId,
  courseId,
  questions,
  initiallyCompleted,
  initialScore,
}: {
  lessonId: number
  courseId: number
  questions: QuizQuestion[]
  initiallyCompleted: boolean
  initialScore: number | null
}) {
  const router = useRouter()
  const { t } = useLocale()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ score: number; results: QuizResult[] } | null>(
    initiallyCompleted ? { score: initialScore ?? 0, results: [] } : null,
  )

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      setError(t.quiz.answerAll)
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lessonId,
          courseId,
          answers: Object.entries(answers).map(([questionIndex, optionIndex]) => ({
            questionIndex: Number(questionIndex),
            optionIndex,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t.quiz.genericError)
        return
      }
      setResult({ score: data.score ?? 0, results: data.results ?? [] })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
        <div className="inline-flex items-center gap-2 text-green-400 text-sm font-mono uppercase tracking-wider mb-2">
          <Check className="w-4 h-4" />
          {t.quiz.done}
        </div>
        <p className="text-sm text-muted-foreground">
          {t.quiz.scoreLabel} {result.score}%
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex}>
          <p className="font-bold mb-3">
            {qIndex + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, oIndex) => (
              <label
                key={oIndex}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-white cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                  className="accent-green-500"
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50 self-start"
      >
        {loading ? t.quiz.submitting : t.quiz.submit}
      </button>
    </div>
  )
}
