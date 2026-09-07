import type { CollectionConfig } from 'payload'

import { formatSlugHook } from './hooks/formatSlug'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      hooks: { beforeValidate: [formatSlugHook('title')] },
    },
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    {
      name: 'content',
      type: 'richText',
      // pastikan fitur code-block Lexical diaktifkan di payload.config.ts
    },
    { name: 'videoUrl', type: 'text' }, // link embed YouTube unlisted
    {
      name: 'hasSandbox',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Aktifkan editor kode interaktif (Judge0) di lesson ini' },
    },
    { name: 'sandboxLanguage', type: 'text', admin: { condition: (data) => data.hasSandbox } },
    { name: 'sandboxStarterCode', type: 'code', admin: { condition: (data) => data.hasSandbox } },
    {
      name: 'hasQuiz',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Aktifkan quiz pilihan ganda di akhir lesson ini' },
    },
    {
      name: 'quizQuestions',
      type: 'array',
      minRows: 1,
      admin: { condition: (data) => data.hasQuiz },
      // Validasi server-side: tiap soal harus punya tepat satu opsi benar —
      // lihat docs/19-FEATURE-QUIZ.md.
      validate: (value) => {
        if (!Array.isArray(value)) return true
        for (const q of value as { question?: string; options?: { isCorrect?: boolean }[] }[]) {
          const correctCount = (q?.options ?? []).filter((o) => o?.isCorrect).length
          if (correctCount !== 1) {
            return `Soal "${q?.question ?? ''}" harus punya tepat satu jawaban benar.`
          }
        }
        return true
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'options',
          type: 'array',
          minRows: 2,
          maxRows: 6,
          fields: [
            { name: 'text', type: 'text', required: true },
            {
              name: 'isCorrect',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Tandai sebagai satu-satunya jawaban benar' },
              // KEAMANAN: Lessons.access.read publik (() => true, tanpa auth) —
              // tanpa field-level access ini, kunci jawaban bocor ke siapa saja
              // yang fetch lesson (REST/GraphQL/frontend) sebelum mengerjakan
              // quiz. Pola sama seperti Users.role (field access lebih ketat
              // dari collection-level access). Grading di /api/quiz sengaja
              // pakai overrideAccess:true untuk bisa baca field ini.
              access: {
                read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
              },
            },
          ],
        },
      ],
    },
  ],
}
