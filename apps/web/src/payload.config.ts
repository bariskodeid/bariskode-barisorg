import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, CodeBlock, lexicalEditor } from '@payloadcms/richtext-lexical'
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
  Bookmarks,
} from './collections'
import { Settings } from './globals'
import { CODE_LANGUAGES } from './lib/codeLanguages'
import { emailFromAddress, getSmtpOptions } from './lib/email'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const smtpOptions = getSmtpOptions()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dashboard: {
      widgets: [
        {
          slug: 'dashboard-stats',
          Component: '@/components/admin/DashboardStats#default',
          minWidth: 'large',
          maxWidth: 'large',
        },
      ],
    },
  },
  collections: [Users, Categories, Media, Courses, Modules, Lessons, Progress, Posts, Certificates, Bookmarks],
  globals: [Settings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [CodeBlock({ defaultLanguage: 'plaintext', languages: CODE_LANGUAGES })],
      }),
    ],
  }),
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
  // Email bawaan Payload (lupa password, lihat Users.ts). Tanpa SMTP_HOST
  // tidak ada adapter: Payload hanya menulis email ke console, dan halaman
  // /forgot-password menampilkan pesan bahwa reset lewat email belum tersedia.
  email: smtpOptions
    ? nodemailerAdapter({
        defaultFromAddress: emailFromAddress(),
        defaultFromName: 'bariskode.org',
        transportOptions: smtpOptions,
      })
    : undefined,
  // Batas ukuran upload di server (form avatar juga membatasi 5MB, tapi itu
  // cuma di browser). Tanpa abortOnLimit, file yang kelewat batas dipotong
  // diam-diam, bukan ditolak.
  upload: {
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  },
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
