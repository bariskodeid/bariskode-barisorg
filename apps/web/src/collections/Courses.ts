import type { CollectionConfig } from 'payload'

import { notifyCoursePublished } from '../lib/notifications'

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
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Kirim notifikasi email HANYA saat status benar-benar bertransisi
        // draft->published (bukan setiap kali course di-update). Fire-and-forget
        // (tidak di-await) supaya save di admin panel tidak menunggu proses
        // kirim email ke semua student — lihat docs/21-FEATURE-EMAIL-NOTIFICATIONS.md.
        if (operation === 'update' && previousDoc?.status !== 'published' && doc.status === 'published') {
          void notifyCoursePublished(doc, req.payload).catch((err) =>
            req.payload.logger.error({ err }, '[email] notifyCoursePublished gagal'),
          )
        }
        return doc
      },
    ],
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
