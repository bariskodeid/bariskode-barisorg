import { describe, expect, it } from 'vitest'

import { allCourses } from '../../scripts/courses'
import type { CodeLanguage } from '../../src/lib/codeLanguages'
import { markdownToLexical } from '../../scripts/lib/markdown-lexical'
import type { CourseDef, LessonDef } from '../../scripts/lib/course-def'

const lessonsOf = (course: CourseDef): LessonDef[] => course.modules.flatMap((m) => m.lessons)

const allLessons = allCourses.flatMap((course) => lessonsOf(course).map((lesson) => ({ course, lesson })))

const allQuestions = allLessons.flatMap(({ course, lesson }) =>
  (lesson.quizQuestions ?? []).map((question) => ({ course, lesson, question })),
)

/** Porsi jawaban benar per index opsi (0..3) untuk satu course. */
function positionShares(course: CourseDef): number[] {
  const counts = [0, 0, 0, 0]
  let total = 0
  for (const lesson of lessonsOf(course)) {
    for (const question of lesson.quizQuestions ?? []) {
      counts[question.options.findIndex((o) => o.isCorrect)]++
      total++
    }
  }
  return counts.map((c) => c / total)
}

// Course yang porsi satu index jawabannya melebihi 0.4 karena kebetulan (teks soal & seed
// shuffle dibekukan di task ini, jadi tidak diperbaiki di sini). Key = slug course, value =
// catatan porsi maksimum. Diperbaiki saat teks soal course itu ditulis ulang.
const SKEWED_POSITION_COURSES: Record<string, string> = {
  'typescript-from-zero': 'porsi jawaban benar di index 3 = 0.42 (> 0.4), 33 soal',
}

describe('konten course "from Zero"', () => {
  it('ada 12 course, slug course unik', () => {
    expect(allCourses).toHaveLength(12)
    const slugs = allCourses.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(12)
  })

  it('setiap course punya 5 module dan 18-21 lesson', () => {
    for (const course of allCourses) {
      expect(course.modules, `${course.slug} module`).toHaveLength(5)
      const count = lessonsOf(course).length
      expect(count, `${course.slug} jumlah lesson`).toBeGreaterThanOrEqual(18)
      expect(count, `${course.slug} jumlah lesson`).toBeLessThanOrEqual(21)
    }
  })

  it('slug lesson unik di seluruh course', () => {
    const slugs = allLessons.map(({ lesson }) => lesson.slug)
    const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i)
    expect(duplicates).toEqual([])
  })

  it('setiap quiz question punya tepat satu isCorrect dan 3-4 opsi', () => {
    expect(allQuestions.length).toBeGreaterThan(0)
    for (const { course, question } of allQuestions) {
      const label = `${course.slug}: ${question.question}`
      expect(question.options.filter((o) => o.isCorrect), label).toHaveLength(1)
      expect(question.options.length, label).toBeGreaterThanOrEqual(3)
      expect(question.options.length, label).toBeLessThanOrEqual(4)
    }
  })

  describe('posisi jawaban benar tersebar', () => {
    for (const course of allCourses) {
      const skew = SKEWED_POSITION_COURSES[course.slug]
      if (skew) {
        it.todo(`${course.slug}: ${skew}`)
        continue
      }
      it(course.slug, () => {
        const shares = positionShares(course)
        expect(Math.max(...shares), `porsi per index: ${shares.map((s) => s.toFixed(2)).join(', ')}`)
          .toBeLessThanOrEqual(0.4)
      })
    }
  })

  it('setiap lesson hasSandbox punya sandboxStarterCode non-kosong', () => {
    for (const { course, lesson } of allLessons) {
      if (!lesson.hasSandbox) continue
      expect(lesson.sandboxStarterCode?.trim(), `${course.slug}/${lesson.slug}`).toBeTruthy()
    }
  })

  it('setiap lesson punya content non-kosong dan markdownToLexical(content) tidak melempar', () => {
    for (const { course, lesson } of allLessons) {
      const label = `${course.slug}/${lesson.slug}`
      const paragraphs = Array.isArray(lesson.content) ? lesson.content : [lesson.content]
      expect(paragraphs.length, label).toBeGreaterThan(0)
      for (const paragraph of paragraphs) expect(paragraph.trim(), label).not.toBe('')
      expect(() => markdownToLexical(lesson.content), label).not.toThrow()
    }
  })

  // Akan FAIL sampai semua course selesai ditulis ulang (Phase B); jadi `it` di task course terakhir.
  it.todo('description course non-kosong')
})

type Rule = { pattern: RegExp; reason: string }
type RequiredRule = Rule & { pendingUntil?: string }

/**
 * Fitur bahasa yang lebih baru dari runtime Judge0 (Bash 5.0, GCC 9.2, Go 1.13.5, OpenJDK 13,
 * Node 12, PHP 7.4.1, Python 3.8, Ruby 2.7.0, Rust 1.40.0, SQLite 3.27.2, TS 3.7.4). Dicek atas
 * `sandboxStarterCode` dan blok fence bahasa-sama di `content`. C dan C++ belum punya aturan.
 */
export const RUNTIME_BANNED: Record<CodeLanguage, Rule[]> = {
  plaintext: [],
  bash: [
    {
      // command position: kata di dalam string echo bukan perintah.
      pattern: /(^|[;&|]\s*|\$\(\s*)\s*(sudo|apt(-get)?|systemctl|ssh|curl|wget)\b/m,
      reason: 'perintah butuh root/jaringan/daemon, tidak ada di sandbox',
    },
  ],
  c: [],
  cpp: [],
  go: [
    { pattern: /\[T any\]|\bany\b/, reason: 'generics/any butuh Go 1.18+' },
    { pattern: /\bmin\(|\bmax\(/, reason: 'builtin min/max butuh Go 1.21+' },
    { pattern: /for\s+\w+\s*:=\s*range\s+\d+/, reason: 'range over int butuh Go 1.22+' },
    { pattern: /os\.ReadFile|strings\.Cut|errors\.Join/, reason: 'API butuh Go 1.16+/1.18+/1.20+' },
  ],
  java: [
    { pattern: /\brecord\s+\w+\s*\(/, reason: 'record butuh Java 16+' },
    { pattern: /"""/, reason: 'text block butuh Java 15+' },
    { pattern: /instanceof\s+\w+\s+\w+\s*[)&]/, reason: 'pattern matching instanceof butuh Java 16+' },
    { pattern: /\.formatted\(|\.toList\(\)/, reason: 'String.formatted butuh Java 15+, Stream.toList Java 16+' },
    { pattern: /case\s+[^:]+->/, reason: 'switch expression butuh Java 14+' },
  ],
  javascript: [
    { pattern: /\?\./, reason: 'optional chaining butuh Node 14+' },
    { pattern: /\?\?/, reason: 'nullish coalescing butuh Node 14+' },
    { pattern: /\.replaceAll\(/, reason: 'replaceAll butuh Node 15+' },
    { pattern: /\.at\(/, reason: 'Array.at butuh Node 16.6+' },
    { pattern: /\|\|=|&&=|\?\?=/, reason: 'logical assignment butuh Node 15+' },
  ],
  php: [
    { pattern: /\bmatch\s*\(/, reason: 'match expression butuh PHP 8.0+' },
    { pattern: /\?->/, reason: 'nullsafe operator butuh PHP 8.0+' },
    { pattern: /\bstr_(contains|starts_with|ends_with)\(/, reason: 'str_contains dkk butuh PHP 8.0+' },
    { pattern: /\benum\s+\w+/, reason: 'enum butuh PHP 8.1+' },
    { pattern: /\breadonly\b/, reason: 'readonly butuh PHP 8.1+' },
  ],
  python: [
    { pattern: /^\s*match\s+.+:\s*$/m, reason: 'match statement butuh Python 3.10+' },
    { pattern: /\bremoveprefix\(|\bremovesuffix\(/, reason: 'removeprefix/removesuffix butuh Python 3.9+' },
    { pattern: /:\s*(list|dict|tuple|set)\[/, reason: 'generik bawaan (list[int]) butuh Python 3.9+' },
  ],
  ruby: [
    { pattern: /def\s+\w+(\(.*\))?\s*=\s*[^=]/, reason: 'endless method butuh Ruby 3.0+' },
    { pattern: /\.except\(/, reason: 'Hash#except butuh Ruby 3.0+' },
  ],
  rust: [
    { pattern: /\bmatches!\(/, reason: 'matches! butuh Rust 1.42+' },
    {
      // else langsung setelah ekspresi tanpa kurung kurawal; `let x = if c { a } else { b };` sah.
      pattern: /let\s+[^=;]+=\s*[^;{}]+\s+else\s*\{/,
      reason: 'let-else butuh Rust 1.65+',
    },
    {
      pattern: /(format|println|print|eprintln|write|writeln|panic)!\([^;]*\{[a-z_][a-z0-9_]*\}"/,
      reason: 'inline format args butuh Rust 1.58+',
    },
  ],
  sql: [
    { pattern: /\bRETURNING\b/i, reason: 'RETURNING butuh SQLite 3.35+' },
    { pattern: /DROP\s+COLUMN/i, reason: 'DROP COLUMN butuh SQLite 3.35+' },
    { pattern: /GENERATED\s+ALWAYS/i, reason: 'generated column butuh SQLite 3.31+' },
    { pattern: /->>?/, reason: 'operator JSON -> / ->> butuh SQLite 3.38+' },
    {
      pattern: /AUTO_INCREMENT|\bSERIAL\b|SHOW\s+TABLES|\bILIKE\b/i,
      reason: 'sintaks MySQL/PostgreSQL, bukan SQLite',
    },
  ],
  typescript: [
    { pattern: /\bsatisfies\b/, reason: 'satisfies butuh TypeScript 4.9+' },
    {
      pattern: /`[^`]*\$\{[^}]+\}[^`]*`\s*(type|as)\b/,
      reason: 'template literal type butuh TypeScript 4.1+',
    },
  ],
}

/** Syarat yang wajib ada di `sandboxStarterCode` (bukan di fence konten). */
const RUNTIME_REQUIRED: Partial<Record<CodeLanguage, RequiredRule[]>> = {
  java: [{ pattern: /public\s+class\s+Main\b/, reason: 'public class harus bernama Main' }],
  sql: [
    { pattern: /CREATE\s+TABLE/i, reason: 'starter SQL harus self-contained (CREATE TABLE sendiri)' },
    {
      pattern: /^\.headers on\n\.mode column/,
      reason: 'baris pertama harus .headers on lalu .mode column',
      // Semua 15 starter SQL belum punya header; dibekukan sampai Task 15 (SQL). Hapus
      // `pendingUntil` di sana supaya aturan ini aktif.
      pendingUntil: 'diaktifkan di Task 15 (SQL)',
    },
  ],
}

/** Sandbox tidak punya stdin: starter tidak boleh membaca input. */
const STDIN_PATTERN =
  /\binput\(|Scanner\(|scanf|std::cin\s*>>|gets\b|\bread\s+-?|bufio\.NewReader\(os\.Stdin|fgets\(STDIN|readline/

/** Baris komentar penuh (`//`, `#`, `--`) dibuang: menyebut `std::cin` di komentar bukan membaca stdin. */
const withoutCommentLines = (code: string): string => code.replace(/^\s*(\/\/|#|--).*$/gm, '')

type CodeSample = { label: string; kind: 'starter' | 'fence'; code: string }

const contentOf = (lesson: LessonDef): string =>
  Array.isArray(lesson.content) ? lesson.content.join('\n\n') : lesson.content

/** Blok fence ```<language> di markdown, kecuali yang diberi label "tidak jalan di sandbox". */
function fencesOf(markdown: string, language: string): { code: string; line: number }[] {
  const lines = markdown.split('\n')
  const fences: { code: string; line: number }[] = []
  for (let i = 0; i < lines.length; i++) {
    const opener = /^```(\S*)\s*$/.exec(lines[i])
    if (!opener) continue
    const code: string[] = []
    let j = i + 1
    while (j < lines.length && !/^```\s*$/.test(lines[j])) code.push(lines[j++])
    let prev = i - 1
    while (prev >= 0 && lines[prev].trim() === '') prev--
    const labelled = prev >= 0 && lines[prev].includes('tidak jalan di sandbox')
    if (opener[1] === language && !labelled) fences.push({ code: code.join('\n'), line: i + 1 })
    i = j
  }
  return fences
}

function codeSamples(course: CourseDef): CodeSample[] {
  const samples: CodeSample[] = []
  for (const lesson of lessonsOf(course)) {
    const label = `${course.slug}/${lesson.slug}`
    if (lesson.hasSandbox && lesson.sandboxStarterCode) {
      samples.push({ label: `${label} (starter)`, kind: 'starter', code: lesson.sandboxStarterCode })
    }
    for (const fence of fencesOf(contentOf(lesson), course.sandboxLanguage)) {
      samples.push({ label: `${label} (fence baris ${fence.line})`, kind: 'fence', code: fence.code })
    }
  }
  return samples
}

describe('kompatibilitas runtime sandbox', () => {
  for (const course of allCourses) {
    it(`${course.slug} (${course.sandboxLanguage})`, () => {
      const banned = RUNTIME_BANNED[course.sandboxLanguage]
      const required = (RUNTIME_REQUIRED[course.sandboxLanguage] ?? []).filter((r) => !r.pendingUntil)
      const violations: string[] = []
      for (const { label, kind, code } of codeSamples(course)) {
        for (const { pattern, reason } of banned) {
          if (pattern.test(code)) violations.push(`${label}: ${reason} (${pattern})`)
        }
        if (kind !== 'starter') continue
        for (const { pattern, reason } of required) {
          if (!pattern.test(code)) violations.push(`${label}: ${reason} (${pattern})`)
        }
        if (STDIN_PATTERN.test(withoutCommentLines(code))) violations.push(`${label}: starter membaca stdin (${STDIN_PATTERN})`)
      }
      expect(violations).toEqual([])
    })
  }

  for (const [language, rules] of Object.entries(RUNTIME_REQUIRED)) {
    for (const { reason, pendingUntil } of rules) {
      if (pendingUntil) it.todo(`${language}: ${reason} (${pendingUntil})`)
    }
  }
})

// Bocoran catatan penulis (X6) dan interpolasi template literal yang tak sengaja.
const ALWAYS_BANNED: Rule[] = [
  { pattern: /\[object Object\]/, reason: 'interpolasi objek yang bocor' },
  { pattern: /sulit didemonstrasikan/, reason: 'catatan penulis (X6) tampil ke siswa' },
  { pattern: /sengaja quiz-only/, reason: 'catatan penulis (X6) tampil ke siswa' },
]
// `undefined` sah di JS/TS, di C ("undefined behavior"), dan sebagai distractor quiz; di sini
// hanya dicek di starter + content course selain JS/TS.
const UNDEFINED_LEAK = /\bundefined\b(?!\s+behaviou?r)/

// Course yang masih punya pelanggaran nyata di luar daftar perbaikan task guard ini. Key =
// slug course, value = catatan. Entri dihapus di task course masing-masing.
const PENDING_CLEAN_COURSES: Record<string, string> = {
  'php-from-zero':
    'phpfz-scope-variabel masih memuat catatan penulis "sulit didemonstrasikan" (X6), dihapus di Task 14 (PHP)',
}

describe('kebersihan konten', () => {
  for (const course of allCourses) {
    const pending = PENDING_CLEAN_COURSES[course.slug]
    if (pending) {
      it.todo(`${course.slug}: ${pending}`)
      continue
    }
    it(course.slug, () => {
      const checkUndefined = !['javascript', 'typescript'].includes(course.sandboxLanguage)
      const violations: string[] = []
      const scan = (label: string, text: string, withUndefined: boolean) => {
        for (const { pattern, reason } of ALWAYS_BANNED) {
          if (pattern.test(text)) violations.push(`${label}: ${reason} (${pattern})`)
        }
        if (withUndefined && UNDEFINED_LEAK.test(text)) violations.push(`${label}: kata "undefined" bocor`)
      }
      for (const lesson of lessonsOf(course)) {
        const label = `${course.slug}/${lesson.slug}`
        scan(`${label} (content)`, contentOf(lesson), checkUndefined)
        scan(`${label} (starter)`, lesson.sandboxStarterCode ?? '', checkUndefined)
        for (const question of lesson.quizQuestions ?? []) {
          scan(`${label} (quiz)`, [question.question, ...question.options.map((o) => o.text)].join('\n'), false)
        }
      }
      expect(violations).toEqual([])
    })
  }
})
