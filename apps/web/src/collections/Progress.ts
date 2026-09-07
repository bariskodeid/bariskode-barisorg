import type { CollectionConfig } from 'payload'

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
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { user: { equals: user.id } }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
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
    { name: 'score', type: 'number' }, // opsional, untuk lesson dengan quiz
  ],
  indexes: [{ fields: ['user', 'lesson'], unique: true }], // cegah duplikat record
}
