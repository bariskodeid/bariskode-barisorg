// Bahasa yang valid untuk sandbox (`Lessons.sandboxLanguage`) dan code block
// di konten lesson. `plaintext` hanya untuk code block non-eksekusi.
export const CODE_LANGUAGES = {
  plaintext: 'Plain Text',
  bash: 'Bash',
  c: 'C',
  cpp: 'C++',
  go: 'Go',
  java: 'Java',
  javascript: 'JavaScript',
  php: 'PHP',
  python: 'Python',
  ruby: 'Ruby',
  rust: 'Rust',
  sql: 'SQL',
  typescript: 'TypeScript',
} as const satisfies Record<string, string>

export type CodeLanguage = keyof typeof CODE_LANGUAGES
