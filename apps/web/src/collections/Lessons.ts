import type { CollectionConfig } from 'payload'

import { formatSlugHook } from './hooks/formatSlug'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      hooks: { beforeValidate: [formatSlugHook('title')] },
    },
    { name: 'module', type: 'relationship', relationTo: 'modules', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    {
      name: 'content',
      type: 'richText',
      // pastikan fitur code-block Lexical diaktifkan di payload.config.ts
    },
    { name: 'videoUrl', type: 'text' }, // link embed YouTube unlisted
    {
      name: 'hasSandbox',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Aktifkan editor kode interaktif (Judge0) di lesson ini' },
    },
    { name: 'sandboxLanguage', type: 'text', admin: { condition: (data) => data.hasSandbox } },
    { name: 'sandboxStarterCode', type: 'code', admin: { condition: (data) => data.hasSandbox } },
  ],
}
