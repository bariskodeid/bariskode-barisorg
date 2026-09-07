import type { CollectionConfig } from 'payload'

// Diterbitkan otomatis oleh /api/certificates/[courseId] saat course user
// 100% selesai (lihat getCourseProgress) — tidak ada UI admin untuk membuat
// manual, dan sengaja immutable (update selalu false) supaya tanggal terbit
// tidak bisa diubah setelah terbit. Lihat docs/18-FEATURE-CERTIFICATES.md.
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: { useAsTitle: 'id' },
  access: {
    // pola sama persis dengan Progress.ts: user baca/buat milik sendiri, admin baca semua
    read: ({ req: { user } }) => (user?.role === 'admin' ? true : { user: { equals: user?.id } }),
    create: ({ req: { user }, data }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return data?.user === user.id
    },
    update: () => false,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    {
      name: 'issuedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
  indexes: [{ fields: ['user', 'course'], unique: true }],
}
