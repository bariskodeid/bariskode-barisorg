import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    // Hanya admin yang bisa akses admin panel
    admin: ({ req: { user } }) => user?.role === 'admin',
    // Email, role, dan sesi login tidak boleh terbaca publik: admin baca
    // semua, user login hanya dirinya sendiri (cukup untuk /api/users/me,
    // relasi Progress/Bookmarks/Certificates miliknya). Profil author untuk
    // blog & search diambil lewat lib/publicAuthor.ts (field publik saja).
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return user ? { id: { equals: user.id } } : false
    },
    create: () => true, // registrasi publik untuk role student
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'student',
      options: ['student', 'instructor', 'admin'],
      access: {
        // hanya admin yang boleh set/ubah role — mencegah user publik
        // registrasi langsung sebagai admin/instructor lewat `create: () => true`
        // di atas (privilege escalation).
        create: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    { name: 'bio', type: 'textarea' }, // dipakai juga sebagai author bio di blog
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
