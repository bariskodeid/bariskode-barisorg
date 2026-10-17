import type { CodeLanguage } from '../../src/lib/codeLanguages'

export type QuizQuestion = {
  question: string
  options: { text: string; isCorrect: boolean }[]
}

export type LessonDef = {
  title: string
  slug: string
  content: string | string[]
  hasSandbox?: boolean
  sandboxStarterCode?: string
  hasQuiz?: boolean
  quizQuestions?: QuizQuestion[]
}

export type ModuleDef = { title: string; lessons: LessonDef[] }

export type CourseDef = {
  title: string
  slug: string
  category: { name: string; slug: string }
  level: 'pemula' | 'menengah' | 'lanjutan'
  description: string
  sandboxLanguage: Exclude<CodeLanguage, 'plaintext'>
  modules: ModuleDef[]
}

export function fnv1a(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates dengan seed dari teks; murni, input tidak dimutasi. */
export function shuffleOptions<T>(items: T[], seedText: string): T[] {
  const result = [...items]
  const rand = mulberry32(fnv1a(seedText))
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Soal quiz dengan urutan opsi diacak deterministik (seed = teks soal). */
export function q(question: string, options: [string, boolean][]): QuizQuestion {
  return {
    question,
    options: shuffleOptions(options, question).map(([text, isCorrect]) => ({ text, isCorrect })),
  }
}
