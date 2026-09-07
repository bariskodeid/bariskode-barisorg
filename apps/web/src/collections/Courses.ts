import type { CollectionConfig } from 'payload'

import { formatSlugHook } from './hooks/formatSlug'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  access: {
    read: ({ req: { user } }) =>
      user?.role === 'admin' || user?.role === 'instructor'
        ? true
        : { status: { equals: 'published' } },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'instructor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlugHook('title')] },
    },
    { name: 'description', type: 'richText' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    {
      name: 'level',
      type: 'select',
      options: ['pemula', 'menengah', 'lanjutan'],
      defaultValue: 'pemula',
    },
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
    { name: 'order', type: 'number', defaultValue: 0 }, // urutan tampil di katalog
  ],
  versions: { drafts: true },
}
