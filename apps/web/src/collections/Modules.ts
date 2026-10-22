import type { CollectionConfig } from 'payload'

import { syncModuleLessonsToSearch } from './hooks/searchSync'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  hooks: { afterChange: [syncModuleLessonsToSearch] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
  ],
}
