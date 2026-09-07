import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: () => true,
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
