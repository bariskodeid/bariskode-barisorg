import type { CollectionConfig } from 'payload'

import { formatSlugHook } from './hooks/formatSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true }, // Programming, Database, dst
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [formatSlugHook('name')] },
    },
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'text' }, // nama icon (lucide-react) opsional
  ],
}
