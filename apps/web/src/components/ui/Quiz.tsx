'use client'

import { Check, RotateCcw, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'
import { QUIZ_PASSING_SCORE } from '@/lib/quiz'
import { cn } from '@/lib/utils'

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

interface GradedAttempt {
  passed: boolean
  score: number | null
  correctCount?: number
  total?: number
  results: QuizResult[]
}

export function Quiz({
  lessonId,
  questions,
  initiallyCompleted,
  initialScore,
}: {
  lessonId: number
  questions: QuizQuestion[]
  initiallyCompleted: boolean
  initialScore: number | null
}) {
  const router = useRouter()
  const { t } = useLocale()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<GradedAttempt | null>(
    initiallyCompleted ? { passed: true, score: initialScore, results: [] } : null,
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
          answers: Object.entries(answers).map(([questionIndex, optionIndex]) => ({
            questionIndex: Number(questionIndex),
            optionIndex,
          })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data) {
        setError(res.status === 429 ? t.quiz.rateLimited : t.quiz.genericError)
        return
      }
      setAttempt({
        passed: Boolean(data.passed),
        score: data.score ?? null,
        correctCount: data.correctCount,
        total: data.total,
        results: data.results ?? [],
      })
      if (data.passed) router.refresh()
    } catch {
      setError(t.quiz.genericError)
    } finally {
      setLoading(false)
    }
  }

  function handleRetry() {
    setAnswers({})
    setAttempt(null)
    setError(null)
  }

  if (attempt?.passed) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
        <div className="inline-flex items-center gap-2 text-green-400 text-sm font-mono uppercase tracking-wider mb-2">
          <Check className="w-4 h-4" />
          {t.quiz.passed}
        </div>
        {attempt.score !== null && (
          <p className="text-sm text-muted-foreground">
            {t.quiz.scoreLabel} {attempt.score}%
            {attempt.total ? ` (${t.quiz.correctOf(attempt.correctCount ?? 0, attempt.total)})` : ''}
          </p>
        )}
      </div>
    )
  }

  // Setelah gagal, soal tetap tampil (terkunci) dengan tanda benar/salah per
  // soal supaya siswa tahu bagian mana yang perlu dibaca ulang sebelum
  // mengulang. Opsi mana yang benar TIDAK pernah ditampilkan (server tidak
  // mengirimkannya).
  const failed = attempt !== null && !attempt.passed
  const resultFor = (qIndex: number) => attempt?.results.find((r) => r.questionIndex === qIndex)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">{t.quiz.intro(QUIZ_PASSING_SCORE)}</p>

      {questions.map((q, qIndex) => {
        const result = resultFor(qIndex)
        return (
          <div key={qIndex}>
            <p className="font-bold mb-3 flex items-start gap-2">
              {result &&
                (result.correct ? (
                  <Check className="w-4 h-4 mt-1 shrink-0 text-green-400" aria-label={t.quiz.correct} />
                ) : (
                  <X className="w-4 h-4 mt-1 shrink-0 text-red-400" aria-label={t.quiz.incorrect} />
                ))}
              <span>
                {qIndex + 1}. {q.question}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oIndex) => (
                <label
                  key={oIndex}
                  className={cn(
                    'flex items-center gap-3 text-sm text-muted-foreground',
                    failed ? 'cursor-default' : 'hover:text-white cursor-pointer',
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    disabled={failed}
                    onChange={() => setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                    className="accent-green-500"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        )
      })}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      {failed ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-red-400 text-sm font-mono uppercase tracking-wider">
            <X className="w-4 h-4" />
            {t.quiz.failed}
          </div>
          <p className="text-sm text-muted-foreground">
            {t.quiz.scoreLabel} {attempt.score ?? 0}%
            {attempt.total ? ` (${t.quiz.correctOf(attempt.correctCount ?? 0, attempt.total)})` : ''}.{' '}
            {t.quiz.needScore(QUIZ_PASSING_SCORE)}
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg self-start"
          >
            <RotateCcw className="w-4 h-4" />
            {t.quiz.retry}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50 self-start"
        >
          {loading ? t.quiz.submitting : t.quiz.submit}
        </button>
      )}
    </div>
  )
}
