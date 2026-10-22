import type { CollectionConfig } from 'payload'

import { enforceProgressIntegrity } from './hooks/progressIntegrity'

export const Progress: CollectionConfig = {
  slug: 'progress',
  admin: { useAsTitle: 'id' },
  access: {
    // user hanya boleh baca/tulis progress miliknya sendiri; admin baca semua
    read: ({ req: { user } }) => (user?.role === 'admin' ? true : { user: { equals: user?.id } }),
    // `data.user` divalidasi terhadap req.user supaya user tidak bisa membuat
    // record progress atas nama user lain (docs/04-DATA-MODEL.md hanya cek
    // `!!user`, tapi itu membuka celah forge progress user lain lewat REST API
    // Payload langsung — bukan hanya lewat /api/progress custom route).
    create: ({ req: { user }, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return data?.user === user.id
    },
    // Baris progress = bukti lesson selesai; tidak ada alur aplikasi yang
    // mengubahnya setelah dibuat. Update terbuka untuk pemilik sebelumnya
    // membuat student bisa mengganti `score`/`lesson` sendiri lewat REST
    // PATCH /api/progress/:id atau GraphQL.
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [enforceProgressIntegrity],
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true }, // denormalized, mempercepat query "progress per course"
    {
      name: 'completedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    { name: 'score', type: 'number' }, // skor quiz yang lulus (>= QUIZ_PASSING_SCORE), kosong untuk lesson tanpa quiz
  ],
  indexes: [{ fields: ['user', 'lesson'], unique: true }], // cegah duplikat record
}
