import type { Access, CollectionConfig } from 'payload'

const isStaff: Access = ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    // Semua user login boleh upload (avatar di /settings). Ubah/hapus hanya
    // admin & instructor — default Payload (`Boolean(user)`) membuat student
    // mana pun bisa menimpa/menghapus thumbnail course, gambar blog, dan
    // avatar user lain.
    create: ({ req: { user } }) => Boolean(user),
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    // Relatif ke cwd proses: /app/media di container web (volume `media_data`
    // di infra/docker-compose.yml — tanpa volume, file hilang tiap redeploy).
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 450 },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
