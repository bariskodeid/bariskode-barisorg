import type { CollectionConfig } from 'payload'

export const Bookmarks: CollectionConfig = {
  slug: 'bookmarks',
  admin: { useAsTitle: 'id' },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' ? true : { user: { equals: user?.id } },
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],
  indexes: [{ fields: ['user', 'lesson'], unique: true }],
}
