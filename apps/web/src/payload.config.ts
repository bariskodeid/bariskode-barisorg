import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Users,
  Categories,
  Media,
  Courses,
  Modules,
  Lessons,
  Progress,
  Posts,
  Certificates,
} from './collections'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Categories, Media, Courses, Modules, Lessons, Progress, Posts, Certificates],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['posts', 'courses'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${(doc as { title?: string }).title ?? ''} | bariskode.org`,
      generateURL: ({ doc, collectionConfig }) => {
        const slug = (doc as { slug?: string }).slug ?? ''
        const base = collectionConfig?.slug === 'posts' ? 'blog' : 'courses'
        return `${serverURL}/${base}/${slug}`
      },
    }),
  ],
})
