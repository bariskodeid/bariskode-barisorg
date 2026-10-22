# 19. Fitur: Quiz Builder

## Ringkasan

Pilihan ganda saja (satu jawaban benar per soal) — bukan quiz builder
serba-tipe. Ditempel di lesson lewat field `hasQuiz`/`quizQuestions`,
menggantikan tombol "Tandai Selesai" manual: **lulus quiz** (skor minimal
`QUIZ_PASSING_SCORE` = 70%, `src/lib/quiz.ts`) = lesson selesai + skor
tersimpan. Skor di bawah ambang tidak mencatat apa pun dan quiz boleh diulang.

Sebelum 2026-10-22, submit dengan skor berapa pun (termasuk 0%) langsung
menyelesaikan lesson dan mengunci quiz permanen tanpa opsi ulang (temuan QA
P1). Migration `20261022_041500_remove_failed_quiz_progress` menghapus baris
Progress lama yang skornya di bawah 70, sehingga lesson itu kembali "belum
selesai" dan quiz-nya bisa dikerjakan ulang.

## Field di `Lessons`

Lihat `04-DATA-MODEL.md`. Pola sama seperti `hasSandbox` yang sudah ada
(checkbox gate + `admin.condition`). `quizQuestions` adalah array bersarang
(soal → opsi), digenerate via `pnpm payload migrate:create` (jangan tulis
tangan DDL tabel array Payload).

Validasi server-side di field `quizQuestions` (`validate`): tiap soal harus
punya **tepat satu** opsi `isCorrect`, dan `hasQuiz: true` wajib punya
minimal satu soal (validate custom menggantikan validator bawaan array, jadi
`minRows` tidak ditegakkan sendiri). "Lesson ber-quiz" di kode selalu dicek
lewat `lessonHasQuiz()` (`src/lib/quiz.ts`) = `hasQuiz` DAN ada soal.

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

1. Auth gate, rate limit `quiz:${user.id}` (10/60s) — juga membatasi laju
   percobaan ulang.
2. Idempotent: baris `progress` hanya ada untuk lesson yang sudah lulus, jadi
   kalau ada, balikan `{alreadyCompleted: true, passed: true, score}`. Lulus
   tidak bisa di-re-grade (skor tidak bisa dinaikkan/diturunkan lagi).
3. Grading: `payload.findByID({..., overrideAccess: true})` — **SATU-SATUNYA**
   tempat di route ini yang pakai `overrideAccess: true`, supaya server bisa
   baca `isCorrect` untuk grading. Field itu TIDAK PERNAH diteruskan balik ke
   response (response cuma `{passed, score, correctCount, total, results,
   passingScore}`, `results` cuma boolean benar/salah per soal, bukan opsi
   mana yang benar).
4. Skor < 70: response `passed: false`, TIDAK ada baris yang dibuat (tidak
   ada riwayat percobaan gagal — sengaja, tanpa collection `QuizAttempts`).
   Trade-off yang disadari: hasil benar/salah per soal + ulang tanpa batas
   (selain rate limit) + urutan opsi tetap membuat siswa bisa mencapai 100%
   dengan coba-coba dalam beberapa percobaan. Dipilih demi nilai belajar
   (siswa tahu bagian mana yang perlu dibaca ulang). Kalau integritas
   sertifikat jadi prioritas, opsinya: sembunyikan hasil per soal saat gagal,
   cooldown antar percobaan, atau acak opsi per percobaan (butuh mapping
   index di server).
5. Skor >= 70: `payload.create` ke collection `progress` dengan
   `context: { quizPassed: true }` — satu-satunya cara membuat baris Progress
   untuk lesson ber-quiz (lihat hook `progressIntegrity.ts` di
   `09-FEATURE-PROGRESS-TRACKING.md`). `course` diambil dari lesson, bukan
   dari body request. Submit ganda yang balapan ditangani unique index
   (user, lesson).

## Urutan Opsi: Diacak Saat Seed, Grading Tetap Berbasis Index

Course "from Zero" (lihat bagian "Konten" di `CLAUDE.md`) di-seed dengan
urutan opsi yang **diacak saat seed**, lewat helper `q()` /
`shuffleOptions()` di `apps/web/scripts/lib/course-def.ts`. Tujuannya menutup
temuan audit konten: sebelumnya 424 dari 427 soal punya jawaban benar di opsi
pertama, jadi siswa bisa dapat ~100% dengan selalu memilih A.

- **Deterministik**: seed pengacaknya adalah teks soal (di-hash FNV-1a jadi
  seed PRNG, lalu Fisher-Yates), jadi soal yang sama selalu menghasilkan
  urutan opsi yang sama di tiap run seed. Re-seed tidak mengubah urutan opsi
  soal yang teksnya tidak berubah.
- **Hanya terjadi di seed**, bukan per user dan bukan di frontend. Urutan
  opsi yang tersimpan di DB adalah urutan yang sama yang dilihat semua siswa.
- **Grading tidak berubah**: `POST /api/quiz` tetap membandingkan
  `optionIndex` jawaban dengan index opsi `isCorrect` di DB (lihat "API
  Route" di atas). Karena yang diacak adalah urutan tersimpan, index di DB,
  index yang dirender `Quiz.tsx`, dan index yang dikirim client selalu
  konsisten. Jangan ubah urutan opsi di frontend tanpa mapping di server,
  atau grading jadi salah.
- Mengacak per user (supaya tiap siswa lihat urutan berbeda) butuh mapping
  index sisi server dan sengaja belum dikerjakan.
- Kalau konten quiz diubah lewat admin panel Payload, urutan opsi yang
  diketik editor dipakai apa adanya (tidak ada pengacakan otomatis di luar
  seed); seed ulang akan menimpa soal dengan versi dari definisi.

## Frontend

`src/components/ui/Quiz.tsx` (client component, pola fetch+loading-state
sama seperti `MarkCompleteButton.tsx`). Di `lessons/[slug]/page.tsx`, blok
"Tandai Selesai" jadi kondisional: `lesson.hasQuiz` → render `<Quiz>`,
selain itu tetap `<MarkCompleteButton>` seperti sebelumnya.

- Teks pengantar di atas soal menjelaskan ambang lulus dan bahwa quiz bisa
  diulang; pengunjung yang belum login melihat ajakan masuk yang menyebut
  quiz (bukan tombol "tandai selesai" yang memang tidak ada).
- Lulus: kotak hijau "Lulus — lesson selesai" + skor.
- Belum lulus: soal tetap tampil (terkunci) dengan tanda benar/salah per
  soal, kotak merah "Belum lulus" + skor + ambang, dan tombol "Ulangi Quiz"
  yang mengosongkan jawaban.
