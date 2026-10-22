// Ambang lulus quiz lesson, dalam persen (lihat docs/19-FEATURE-QUIZ.md).
// Skor di bawah ini: lesson TIDAK dianggap selesai (tidak ada baris
// Progress) dan quiz boleh diulang. Dipakai server (grading di /api/quiz)
// dan client (teks di Quiz.tsx), jadi file ini tidak boleh import apa pun
// yang server-only.
export const QUIZ_PASSING_SCORE = 70

// Lesson dianggap ber-quiz hanya kalau quiz-nya aktif DAN punya soal. Semua
// tempat yang memutuskan "selesai lewat quiz atau lewat tombol Tandai
// Selesai" (halaman lesson, /api/quiz, /api/progress, hook Progress) wajib
// memakai fungsi ini — kalau tidak, lesson `hasQuiz: true` tanpa soal
// menampilkan tombol Tandai Selesai yang lalu ditolak server, dan tidak
// pernah bisa diselesaikan.
export function lessonHasQuiz(lesson: {
  hasQuiz?: boolean | null
  quizQuestions?: unknown[] | null
}): boolean {
  return Boolean(lesson.hasQuiz && lesson.quizQuestions && lesson.quizQuestions.length > 0)
}
