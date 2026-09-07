import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 450 },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
