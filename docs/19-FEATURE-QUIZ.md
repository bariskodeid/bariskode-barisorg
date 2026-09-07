# 19. Fitur: Quiz Builder

## Ringkasan

Pilihan ganda saja (satu jawaban benar per soal) — bukan quiz builder
serba-tipe. Ditempel di lesson lewat field `hasQuiz`/`quizQuestions`,
menggantikan tombol "Tandai Selesai" manual: submit quiz = lesson selesai +
skor tersimpan.

## Field di `Lessons`

Lihat `04-DATA-MODEL.md`. Pola sama seperti `hasSandbox` yang sudah ada
(checkbox gate + `admin.condition`). `quizQuestions` adalah array bersarang
(soal → opsi), digenerate via `pnpm payload migrate:create` (jangan tulis
tangan DDL tabel array Payload).

Validasi server-side di field `quizQuestions` (`validate`): tiap soal harus
punya **tepat satu** opsi `isCorrect`.

## KEAMANAN: Kunci Jawaban Jangan Bocor

`Lessons.access.read` publik (`() => true`, tanpa auth) — itu keputusan lama
supaya siapa saja bisa baca lesson. Tanpa penanganan khusus, field
`isCorrect` bakal ikut ke response fetch lesson dan bocor ke siapa saja
sebelum mengerjakan quiz.

Fix: field-level `access.read` pada `isCorrect` dikunci ke
admin/instructor saja (pola sama seperti `Users.role`, field access lebih
ketat dari collection-level access). Konsekuensi: fetch lesson biasa
(`overrideAccess: false, user`, dipakai di halaman lesson) otomatis TIDAK
menyertakan `isCorrect` untuk role student — props ke client component
`Quiz.tsx` sudah aman tanpa perlu strip manual (meski di
`lessons/[slug]/page.tsx` tetap ada sanitasi eksplisit sebagai lapis kedua).

## API Route

`POST /api/quiz` (`src/app/api/quiz/route.ts`):

1. Auth gate, rate limit `quiz:${user.id}` (10/60s).
2. Idempotent: kalau lesson ini sudah completed (baris `progress` ada),
   balikan record lama — tidak ada fitur retake/re-grade di v1 ini.
3. Grading: `payload.findByID({..., overrideAccess: true})` — **SATU-SATUNYA**
   tempat di route ini yang pakai `overrideAccess: true`, supaya server bisa
   baca `isCorrect` untuk grading. Field itu TIDAK PERNAH diteruskan balik ke
   response (response cuma `{score, correctCount, total, results}`, `results`
   cuma boolean benar/salah per soal, bukan opsi mana yang benar).
4. `payload.create` ke collection `progress` yang sudah ada (reuse, TIDAK
   bikin collection `QuizAttempts` baru) — field `score` (sudah ada sejak
   awal sebagai placeholder, lihat `04-DATA-MODEL.md`) diisi di sini.

## Frontend

`src/components/ui/Quiz.tsx` (client component, pola fetch+loading-state
sama seperti `MarkCompleteButton.tsx`). Di `lessons/[slug]/page.tsx`, blok
"Tandai Selesai" jadi kondisional: `lesson.hasQuiz` → render `<Quiz>`,
selain itu tetap `<MarkCompleteButton>` seperti sebelumnya.
