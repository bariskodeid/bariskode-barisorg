import { APIError, type Access, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'

const isStaff: Access = ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor'

// Format avatar yang dijanjikan form /settings. `image/*` di bawah tetap
// berlaku untuk admin/instructor (logo SVG, favicon ICO, dst — SVG
// disanitasi Payload sejak 3.90), tapi student cuma butuh foto profil: SVG
// dari student menambah permukaan XSS tanpa manfaat.
const STUDENT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// `data.mimeType` di sini hasil deteksi Payload dari isi file (untuk gambar
// raster yang diproses sharp), bukan sekadar klaim browser.
const restrictStudentUploads: CollectionBeforeChangeHook = ({ data, operation, req: { user } }) => {
  const staff = user?.role === 'admin' || user?.role === 'instructor'
  if (operation === 'create' && user && !staff && !STUDENT_MIME_TYPES.includes(data.mimeType)) {
    throw new APIError('Avatar harus berupa gambar JPG, PNG, atau WebP.', 400, null, true)
  }
  return data
}

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
  hooks: { beforeChange: [restrictStudentUploads] },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
