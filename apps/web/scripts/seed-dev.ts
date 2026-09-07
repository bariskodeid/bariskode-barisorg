import { getPayload } from 'payload'
import config from '../src/payload.config'

// Isi database lokal dengan data contoh untuk development (Fase 1 DoD:
// "buat beberapa dummy data lewat admin panel untuk testing" — dilakukan
// lewat script supaya repeatable). Jalankan: pnpm seed

async function main() {
  const payload = await getPayload({ config })

  const admin = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@bariskode.org',
      password: 'password123',
      name: 'Admin Utama',
      role: 'admin',
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'student@bariskode.org',
      password: 'password123',
      name: 'Siswa Uji',
      role: 'student',
    },
  })

  // `slug` diisi eksplisit di sini supaya cocok dengan tipe `required: true`
  // hasil generate:types — nilainya tetap diproses ulang oleh formatSlugHook.
  const category = await payload.create({
    collection: 'categories',
    data: { name: 'Programming', slug: 'programming' },
  })

  const course = await payload.create({
    collection: 'courses',
    data: {
      title: 'Belajar JavaScript Dasar',
      slug: 'belajar-javascript-dasar',
      category: category.id,
      status: 'published',
    },
  })

  const mod = await payload.create({
    collection: 'modules',
    data: { title: 'Pengenalan JavaScript', course: course.id, order: 1 },
  })

  await payload.create({
    collection: 'lessons',
    data: {
      title: 'Variabel & Tipe Data',
      slug: 'variabel-tipe-data',
      module: mod.id,
      order: 1,
    },
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'Kenapa Belajar JavaScript di 2026',
      slug: 'kenapa-belajar-javascript-di-2026',
      content: {
        root: {
          type: 'root',
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Halo dunia' }], version: 1 },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      excerpt: 'Alasan JavaScript masih relevan dipelajari, dan bagaimana memulainya.',
      author: admin.id,
      tags: [category.id],
      relatedCourse: course.id,
      status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  console.log('Seed selesai: 2 users, 1 category, 1 course, 1 module, 1 lesson, 1 post.')
  console.log('Login admin: admin@bariskode.org / password123')
}

// `payload run` tidak menunggu promise yang tidak di-await di top level
// (lihat runBinScript di payload/dist/bin/index.js — langsung process.exit(0)
// setelah import() resolve), jadi top-level await wajib di sini.
await main()
