import type { CollectionConfig } from 'payload'

import { formatSlugHook } from './hooks/formatSlug'

export const Posts: CollectionConfig = {
  slug: 'posts',
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
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText', required: true }, // Lexical, dengan code-block feature
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'tags', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'relatedCourse', type: 'relationship', relationTo: 'courses' }, // CTA cross-link
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
    { name: 'publishedAt', type: 'date' },
  ],
  versions: { drafts: true },
}
