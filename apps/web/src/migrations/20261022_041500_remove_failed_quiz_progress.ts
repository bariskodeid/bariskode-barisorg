import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Data migration, tanpa perubahan schema (karena itu tidak ada file .json
// snapshot). Sebelum ambang lulus quiz diterapkan (docs/19-FEATURE-QUIZ.md),
// /api/quiz membuat baris Progress untuk skor berapa pun — termasuk 0% —
// sehingga lesson tercatat selesai dan quiz-nya terkunci permanen. Aturan
// sekarang: baris Progress = lesson lulus. Baris lama dengan skor di bawah
// ambang dihapus supaya lesson itu kembali "belum selesai" dan quiz-nya bisa
// diulang. Angka 70 sengaja literal (bukan import QUIZ_PASSING_SCORE):
// migration harus tetap berarti sama walau ambangnya diubah nanti.
//
// Sekaligus menyamakan `course_id` dengan course lesson-nya: sebelumnya
// /api/progress menerima courseId dari client, dan baris dengan course palsu
// menggelembungkan progress (dan syarat sertifikat) course lain. Per
// 2026-10-22 production tidak punya baris seperti itu; ini untuk DB lain.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "progress" WHERE "score" IS NOT NULL AND "score" < 70;
   UPDATE "progress" p SET "course_id" = m."course_id"
     FROM "lessons" l JOIN "modules" m ON m."id" = l."module_id"
     WHERE l."id" = p."lesson_id" AND m."course_id" IS NOT NULL AND p."course_id" IS DISTINCT FROM m."course_id";`)
}

// Tidak bisa dikembalikan — baris yang dihapus memang tidak valid lagi.
// Kalau benar-benar perlu, restore dari dump pre-release (ci-deploy.sh).
export async function down(): Promise<void> {}
