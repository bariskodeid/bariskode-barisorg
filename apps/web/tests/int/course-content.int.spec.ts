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
      // command position (awal baris, setelah ; & | ` $( atau kata kunci if/then/do/else...):
      // kata di dalam string echo bukan perintah.
      pattern:
        /(?:^|[;&|`]\s*|\$\(\s*)\s*(?:(?:if|elif|while|until|then|do|else)\s+)?(?:sudo|apt(?:-get)?|systemctl|ssh|curl|wget)\b/m,
      reason: 'perintah butuh root/jaringan/daemon, tidak ada di sandbox',
    },
  ],
  c: [],
  cpp: [
    // GCC 9.2 default gnu++14: fitur C++17 ke atas tidak tersedia.
    { pattern: /\b(?:std::)?string_view\b/, reason: 'string_view butuh C++17' },
    {
      pattern: /\bstd::(?:optional|variant)\b|\b(?:optional|variant)\s*</,
      reason: 'optional/variant butuh C++17',
    },
    { pattern: /\bif\s+constexpr\b/, reason: 'if constexpr butuh C++17' },
    { pattern: /#\s*include\s*<filesystem>|\bstd::filesystem\b/, reason: '<filesystem> butuh C++17' },
    {
      pattern: /\bauto\s*(?:&&?)?\s*\[\s*\w+(?:\s*,\s*\w+)*\s*\]\s*[=:{(]/,
      reason: 'structured bindings butuh C++17',
    },
  ],
  go: [
    { pattern: /\[T any\]|\bany\b/, reason: 'generics/any butuh Go 1.18+' },
    { pattern: /\bmin\(|\bmax\(/, reason: 'builtin min/max butuh Go 1.21+' },
    { pattern: /for\s+\w+\s*:=\s*range\s+\d+/, reason: 'range over int butuh Go 1.22+' },
    { pattern: /os\.ReadFile|strings\.Cut|errors\.Join/, reason: 'API butuh Go 1.16+/1.18+/1.20+' },
  ],
  java: [
    { pattern: /\brecord\s+\w+\s*(?:<.*?>)?\s*\(/, reason: 'record butuh Java 16+' },
    { pattern: /"""/, reason: 'text block butuh Java 15+' },
    {
      pattern: /instanceof\s+\w+(?:<.*?>)?\s+\w+\s*[)&]/,
      reason: 'pattern matching instanceof butuh Java 16+',
    },
    {
      // `Collectors.toList()` sah (Java 8); hanya `stream.toList()` yang Java 16+.
      pattern: /\.formatted\(|(?<!Collectors)\.toList\(\)/,
      reason: 'String.formatted butuh Java 15+, Stream.toList Java 16+',
    },
    { pattern: /case\s+[^:]+->|\bdefault\s*->/, reason: 'switch expression butuh Java 14+' },
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
    {
      // anotasi (`x: list[int]`), return (`-> list[int]`), dan alias (`A = list[int]`); `List[int]` typing sah.
      pattern: /(?::|->|(?<![=!<>])=)\s*(?:list|dict|tuple|set|frozenset)\[/,
      reason: 'generik bawaan (list[int]) butuh Python 3.9+',
    },
  ],
  ruby: [
    {
      // butuh spasi sebelum `=` (atau `)` lalu `=`); `def nama=(v)` / `def ==(o)` adalah setter/operator.
      pattern: /def\s+\w+[?!]?(?:\(.*\)[ \t]*|[ \t]+)=[ \t]*[^=\s]/,
      reason: 'endless method butuh Ruby 3.0+',
    },
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
      // `{x}` / `{x:?}` di string macro format; bukan `{{x}}` dan bukan yang dioper eksplisit (`x = ...`).
      pattern:
        /(?:format|print|println|eprint|eprintln|write|writeln|panic)!\([^;"]*"[^"]*?(?<!\{)\{([a-z_][a-z0-9_]*)(?::[^}]*)?\}(?![^;]*\b\1\s*=[^=])/,
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
      // dijangkar di deklarasi `type X = ...` atau key remapping `as \`...${}\``, bukan sembarang template string.
      pattern: /\btype\s+\w+(?:<.*?>)?\s*=[^;\n]*`[^`\n]*\$\{|\bas\s+`[^`\n]*\$\{/,
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
const STDIN_PATTERNS: RegExp[] = [
  /\b(?:stdin|STDIN)\b|\bos\.Stdin\b|\bSystem\.in\b/, // Rust, C, Python, Node, Ruby, PHP, Bash; Go; Java
  /\binput\s*\(/, // Python
  /\bfmt\.Scan(?:ln|f)?\s*\(/, // Go (fmt.Sscan membaca string, bukan stdin)
  /\bscanf\b|\bgetchar\s*\(|\bgets\b/, // C, Ruby (sscanf/fgets tidak kena \b)
  /\.readLine\s*\(/, // Java BufferedReader
  /\bcin\s*>>|\bgetline\s*\(\s*(?:std::)?cin\b/, // C++ (getline pada istringstream sah)
  /['"](?:node:)?readline['"]/, // Node require/import
  /\breadFileSync\s*\(\s*0\b/, // Node
  /(?<![.\w$>])readline\s*\(/, // PHP (f.readline() milik file Python/Ruby: didahului titik)
  /(?:^|[;&|`]\s*|\$\(\s*)\s*(?:(?:if|elif|while|until|then|do|else)\s+)?read(?:\s|$)/m, // Bash builtin read
]

/** Baris komentar penuh (`//`, `#`, `--`) dibuang: menyebut `std::cin` di komentar bukan membaca stdin. */
const withoutCommentLines = (code: string): string => code.replace(/^\s*(\/\/|#|--).*$/gm, '')

const readsStdin = (code: string): boolean => {
  const source = withoutCommentLines(code)
  return STDIN_PATTERNS.some((pattern) => pattern.test(source))
}

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
        if (readsStdin(code)) violations.push(`${label}: starter membaca stdin`)
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
  { pattern: /sulit didemonstrasikan/, reason: 'catatan penulis (X6) tampil ke siswa' },
  { pattern: /sengaja quiz-only/, reason: 'catatan penulis (X6) tampil ke siswa' },
]
/**
 * `[object Object]` sah sebagai output di lesson JS/TS, tapi hanya di dalam inline code, di dalam
 * code fence, atau setelah `//` pada baris yang sama; di tempat lain berarti interpolasi bocor.
 */
function hasObjectLeak(text: string): boolean {
  let inFence = false
  for (const line of text.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const visible = line.replace(/`[^`]*`/g, '').split('//')[0]
    if (visible.includes('[object Object]')) return true
  }
  return false
}

// `undefined` sah di JS/TS, di C ("undefined behavior"), dan sebagai distractor quiz; di sini
// hanya dicek di starter + content course selain JS/TS.
const UNDEFINED_LEAK = /\bundefined\b(?!\s+behaviou?r)/

// Course yang masih punya pelanggaran nyata di luar daftar perbaikan task guard ini. Key =
// slug course, value = catatan. Entri dihapus di task course masing-masing.
const PENDING_CLEAN_COURSES: Record<string, string> = {
  'php-from-zero':
    'phpfz-scope-variabel masih memuat catatan penulis "sulit didemonstrasikan" (X6), dihapus di Task 14 (PHP)',
}

/** Pelanggaran kebersihan satu course: konten, starter, dan string quiz. */
function cleanlinessViolations(course: CourseDef): string[] {
  const checkUndefined = !['javascript', 'typescript'].includes(course.sandboxLanguage)
  const violations: string[] = []
  const scan = (label: string, text: string, withUndefined: boolean) => {
    for (const { pattern, reason } of ALWAYS_BANNED) {
      if (pattern.test(text)) violations.push(`${label}: ${reason} (${pattern})`)
    }
    if (hasObjectLeak(text)) violations.push(`${label}: [object Object] bocor di luar inline code/fence/komentar`)
    if (withUndefined && UNDEFINED_LEAK.test(text)) violations.push(`${label}: kata "undefined" bocor`)
  }
  // description dan semua judul ikut tampil ke siswa.
  scan(`${course.slug} (judul course)`, course.title, checkUndefined)
  scan(`${course.slug} (description)`, course.description, checkUndefined)
  for (const mod of course.modules) {
    scan(`${course.slug}/${mod.title} (judul module)`, mod.title, checkUndefined)
  }
  for (const lesson of lessonsOf(course)) {
    const label = `${course.slug}/${lesson.slug}`
    scan(`${label} (judul lesson)`, lesson.title, checkUndefined)
    scan(`${label} (content)`, contentOf(lesson), checkUndefined)
    scan(`${label} (starter)`, lesson.sandboxStarterCode ?? '', checkUndefined)
    for (const question of lesson.quizQuestions ?? []) {
      scan(`${label} (quiz)`, [question.question, ...question.options.map((o) => o.text)].join('\n'), false)
    }
  }
  return violations
}

describe('kebersihan konten', () => {
  for (const course of allCourses) {
    const pending = PENDING_CLEAN_COURSES[course.slug]
    if (pending) {
      it.todo(`${course.slug}: ${pending}`)
      continue
    }
    it(course.slug, () => {
      expect(cleanlinessViolations(course)).toEqual([])
    })
  }
})

/** Potongan kode yang HARUS kena guard (`match`) dan yang TIDAK boleh kena (`clean`). */
type Samples = { match: string[]; clean: string[] }

const bannedHit = (language: CodeLanguage, code: string): boolean =>
  RUNTIME_BANNED[language].some(({ pattern }) => pattern.test(code))

const BANNED_SAMPLES: Partial<Record<CodeLanguage, Samples>> = {
  bash: {
    match: [
      'sudo apt update',
      'if x; then sudo y; fi',
      'for i in 1; do curl z; done',
      'if x; then\n  sudo y\nfi',
      'a && wget b',
      'a || ssh h',
      'echo hi; systemctl status',
      'x=$(curl -s url)',
      'x=`apt-get update`',
      'if curl -s url; then echo ok; fi',
    ],
    clean: ['echo "sudo apt"', 'echo "jalankan curl dulu"', 'echo "then sudo y"', 'echo "do curl z"', 'ls -l | sort'],
  },
  cpp: {
    match: [
      'std::string_view sv = "x";',
      'string_view sv = "x";',
      'std::optional<int> o;',
      'optional<int> o;',
      'if constexpr (N > 0) {}',
      '#include <filesystem>',
      'namespace fs = std::filesystem;',
      'auto [a, b] = p;',
      'for (auto& [k, v] : m) {}',
      'std::variant<int, double> v;',
    ],
    clean: ['int a[3] = {1, 2, 3};', 'auto x = v[0];', 'int optional_count = 0;', 'std::vector<int> v;'],
  },
  go: {
    match: [
      'func Map[T any](x T) T { return x }',
      'var x any',
      'm := min(1, 2)',
      'for i := range 10 {',
      'b, _ := os.ReadFile("a")',
    ],
    clean: ['for i := 0; i < 10; i++ {', 'var x interface{}'],
  },
  java: {
    match: [
      'record Point(int x, int y) {}',
      'record Pair<A, B>(A a, B b) {}',
      'String s = """\nhalo\n""";',
      'if (o instanceof String s) {}',
      'if (o instanceof List<String> l && l.isEmpty()) {}',
      '"%d".formatted(1)',
      'var xs = stream.toList();',
      'case 1 -> "satu";',
      'default -> "lain";',
    ],
    clean: [
      'list.stream().collect(Collectors.toList())',
      'var xs = Collectors.toList();',
      'if (o instanceof String) {}',
      'switch (x) { case 1: break; default: break; }',
      'String.format("%d", 1)',
      'Predicate<Integer> p = x -> x > 0;',
    ],
  },
  javascript: {
    match: ['a?.b', 'a ?? b', 's.replaceAll("a", "b")', 'arr.at(-1)', 'x ||= 1', 'x &&= 1', 'x ??= 1'],
    clean: ['const x = a ? b : c;', 's.replace("a", "b")', 'arr[arr.length - 1]'],
  },
  php: {
    match: [
      'match ($x) {}',
      '$a?->b',
      'str_contains($a, "b")',
      'str_starts_with($a, "b")',
      'str_ends_with($a, "b")',
      'enum Status {}',
      'public readonly int $x;',
    ],
    clean: ["preg_match('/a/', $s);", 'strpos($a, "b") !== false'],
  },
  python: {
    match: [
      'match x:\n    case 1:\n        pass',
      's.removeprefix("a")',
      's.removesuffix("a")',
      'x: dict[str, int] = {}',
      'def f() -> list[int]:',
      'Angka = list[int]',
      'def f(a: tuple[int, int]):',
      's: set[int]',
    ],
    clean: [
      'data[0]',
      'd["k"]',
      'x: List[int] = []',
      'from typing import List',
      'result = re.match("a", s)',
      'match_count = 3',
    ],
  },
  ruby: {
    match: ['def kuadrat(x) = x * x', 'def nama = "x"', 'h.except(:a)'],
    clean: [
      'def nama=(v)\n  @nama = v\nend',
      'def nama=(nilai)\n  @nama = nilai\nend',
      'def ==(other)\n  true\nend',
      'def kuadrat(x)\n  x * x\nend',
      'def sapa(nama: "Tamu")\n  puts nama\nend',
      'h.reject { |k, _| k == :a }',
    ],
  },
  rust: {
    match: [
      'matches!(x, A)',
      'let Some(x) = opt else { return };',
      'let Ok(n) = s.parse::<i32>() else {\n    return;\n};',
      'println!("{nama} adalah teman");',
      'println!("{x:?}");',
      'println!("{x:>5}");',
      'format!("{a}-{b}")',
      'panic!("{e}")',
      'write!(f, "{v}")',
    ],
    clean: [
      'let status = if n >= 60 { "lulus" } else { "gagal" };',
      'let x = if a { 1 } else if b { 2 } else { 3 };',
      'println!("{}", x);',
      'println!("{:?}", x);',
      'println!("{0}", x);',
      'println!("{:>5}", x);',
      'println!("{name}", name = x);',
      'println!("{a} {b}", a = 1, b = 2);',
      'println!("{{literal}}");',
      'let s = "{nama}";',
    ],
  },
  sql: {
    match: [
      'INSERT INTO t VALUES (1) RETURNING id;',
      'ALTER TABLE t DROP COLUMN c;',
      'x INTEGER GENERATED ALWAYS AS (a + b)',
      "SELECT data->'k' FROM t;",
      "SELECT data->>'k' FROM t;",
      'id INT AUTO_INCREMENT',
      'id SERIAL PRIMARY KEY',
      'SHOW TABLES;',
      "WHERE nama ILIKE 'a%'",
    ],
    clean: ['SELECT * FROM t WHERE a > 1;', 'id INTEGER PRIMARY KEY AUTOINCREMENT'],
  },
  typescript: {
    match: [
      'const v = x satisfies T;',
      'type Event = `on${Capitalize<Name>}`;',
      'type X = `${A}-${B}` | `z`;',
      'type Getters<T> = { [K in keyof T as `get${string & K}`]: T[K] };',
    ],
    clean: [
      'const s = `Halo ${nama}`\ntype A = string',
      'const msg = `Halo ${nama}`;',
      'const s = `a${b}` as string',
      'type A = string;',
    ],
  },
}

const STDIN_SAMPLES: Samples = {
  match: [
    // Rust
    'std::io::stdin().read_line(&mut s).unwrap();',
    // Go
    'fmt.Scan(&n)',
    'fmt.Scanln(&n)',
    'fmt.Scanf("%d", &n)',
    'reader := bufio.NewReader(os.Stdin)',
    'sc := bufio.NewScanner(os.Stdin)',
    // Java
    'BufferedReader br = new BufferedReader(new InputStreamReader(System.in));',
    'String s = br.readLine();',
    'Scanner sc = new Scanner(System.in);',
    // C++
    'cin >> x;',
    'std::cin >> x;',
    'std::getline(std::cin, s);',
    'getline(cin, s);',
    // C
    'scanf("%d", &n);',
    'fgets(buf, sizeof buf, stdin);',
    'int c = getchar();',
    'gets(buf);',
    // Python
    'n = input("n: ")',
    'data = sys.stdin.read()',
    'for line in sys.stdin:',
    // Node
    'process.stdin.on("data", cb);',
    "const rl = require('readline');",
    'import readline from "readline";',
    'const t = fs.readFileSync(0, "utf8");',
    // Ruby
    'nama = gets.chomp',
    'data = STDIN.read',
    'data = $stdin.read',
    // PHP
    '$x = fgets(STDIN);',
    '$x = readline("n: ");',
    // Bash
    'read x',
    'read -r x',
    'while read line; do echo "$line"; done',
    'echo hi; read -p "x" y',
  ],
  clean: [
    'data = f.readline()',
    'lines = f.readlines()',
    'text = open("a.txt").read()',
    'sc := bufio.NewScanner(strings.NewReader(s))',
    'echo "already spread the thread"',
    'x = "already read"',
    'fs.readFile("a.txt", cb);',
    'fs.readFileSync("a.txt", "utf8");',
    "std::getline(ss, kata, ',');",
    '// std::cin >> x;',
    '# read -r x',
    'echo "read the docs"',
    'sscanf(s, "%d", &n);',
    'fmt.Sscan(s, &n)',
    'Scanner sc = new Scanner("1 2 3");',
  ],
}

const OBJECT_LEAK_SAMPLES: Samples = {
  match: [
    'Hasilnya [object Object] di layar.',
    'console.log("[object Object]")',
    '`a` lalu [object Object]',
    '```js\nconsole.log(String({}))\n```\n[object Object]',
    '`kode // di span` lalu [object Object]',
  ],
  clean: [
    'Output: `[object Object]`',
    '```js\nconsole.log(String({}))\n[object Object]\n```',
    'console.log(String({})); // [object Object]',
    '// [object Object]',
  ],
}

const UNDEFINED_SAMPLES: Samples = {
  match: ['x is undefined', 'Nilai: undefined', 'undefined\nlalu behavior'],
  clean: ['undefined behavior', 'Undefined behaviour', 'undefined\nbehavior', 'undefined   behaviour'],
}

const syntheticCourse = (
  sandboxLanguage: CourseDef['sandboxLanguage'],
  patch: { description?: string; moduleTitle?: string; lessonTitle?: string; courseTitle?: string } = {},
): CourseDef => ({
  title: patch.courseTitle ?? 'Judul',
  slug: 'sintetis',
  category: { name: 'Programming', slug: 'programming' },
  level: 'pemula',
  description: patch.description ?? 'Deskripsi bersih.',
  sandboxLanguage,
  modules: [
    {
      title: patch.moduleTitle ?? 'Modul',
      lessons: [{ title: patch.lessonTitle ?? 'Lesson', slug: 'sintetis-lesson', content: ['Isi bersih.'] }],
    },
  ],
})

describe('guard patterns', () => {
  for (const [language, samples] of Object.entries(BANNED_SAMPLES) as [CodeLanguage, Samples][]) {
    it(`RUNTIME_BANNED.${language}: kena / tidak kena`, () => {
      for (const code of samples.match) expect(bannedHit(language, code), `harus kena: ${code}`).toBe(true)
      for (const code of samples.clean) expect(bannedHit(language, code), `tidak boleh kena: ${code}`).toBe(false)
    })
  }

  it('semua bahasa dengan aturan punya self-test', () => {
    const withRules = (Object.keys(RUNTIME_BANNED) as CodeLanguage[]).filter((l) => RUNTIME_BANNED[l].length > 0)
    expect(withRules.filter((l) => !BANNED_SAMPLES[l])).toEqual([])
  })

  it('STDIN: kena / tidak kena', () => {
    for (const code of STDIN_SAMPLES.match) expect(readsStdin(code), `harus kena: ${code}`).toBe(true)
    for (const code of STDIN_SAMPLES.clean) expect(readsStdin(code), `tidak boleh kena: ${code}`).toBe(false)
  })

  it('[object Object]: hanya sah di inline code, fence, atau setelah //', () => {
    for (const text of OBJECT_LEAK_SAMPLES.match) expect(hasObjectLeak(text), `harus kena: ${text}`).toBe(true)
    for (const text of OBJECT_LEAK_SAMPLES.clean) expect(hasObjectLeak(text), `tidak boleh kena: ${text}`).toBe(false)
  })

  it('undefined: kena kecuali "undefined behavior"', () => {
    for (const text of UNDEFINED_SAMPLES.match) expect(UNDEFINED_LEAK.test(text), `harus kena: ${text}`).toBe(true)
    for (const text of UNDEFINED_SAMPLES.clean) expect(UNDEFINED_LEAK.test(text), `tidak boleh kena: ${text}`).toBe(false)
  })

  it('kebersihan: description, judul course/module/lesson ikut dipindai', () => {
    expect(cleanlinessViolations(syntheticCourse('python'))).toEqual([])
    const flagged = (violations: string[], part: string) => violations.some((v) => v.includes(`(${part})`))
    expect(flagged(cleanlinessViolations(syntheticCourse('python', { description: 'sulit didemonstrasikan' })), 'description')).toBe(true)
    expect(flagged(cleanlinessViolations(syntheticCourse('python', { moduleTitle: 'Modul [object Object]' })), 'judul module')).toBe(true)
    expect(flagged(cleanlinessViolations(syntheticCourse('python', { lessonTitle: 'sengaja quiz-only' })), 'judul lesson')).toBe(true)
    expect(flagged(cleanlinessViolations(syntheticCourse('python', { courseTitle: 'Judul [object Object]' })), 'judul course')).toBe(true)
    // `undefined` di judul/description hanya dicek untuk course selain JS/TS
    expect(flagged(cleanlinessViolations(syntheticCourse('python', { description: 'nilai undefined' })), 'description')).toBe(true)
    expect(cleanlinessViolations(syntheticCourse('javascript', { description: 'nilai undefined' }))).toEqual([])
  })

  it('fencesOf: hanya bahasa yang sama, kecuali berlabel "tidak jalan di sandbox"', () => {
    const md = [
      'Teks.',
      '```python\nprint(1)\n```',
      '```bash\nls\n```',
      'Ini tidak jalan di sandbox (butuh Python 3.10+):',
      '```python\nmatch x:\n```',
    ].join('\n\n')
    expect(fencesOf(md, 'python').map((f) => f.code)).toEqual(['print(1)'])
    expect(fencesOf(md, 'bash').map((f) => f.code)).toEqual(['ls'])
    expect(fencesOf(md, 'go')).toEqual([])
  })
})
