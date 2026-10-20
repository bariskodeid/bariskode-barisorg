// @vitest-environment node
// Deteksi tipe file Payload (file-type) gagal di jsdom: Buffer dari realm
// Node tidak lolos cek `instanceof Uint8Array` milik jsdom.
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import type { Media, User } from '@/payload-types'

let payload: Payload
const users: number[] = []
const media: number[] = []
let categoryId: number
let courseId: number | undefined

const stamp = Date.now()

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

async function createStudent(label: string): Promise<User> {
  const user = await payload.create({
    collection: 'users',
    data: { name: `Siswa ${label}`, email: `cleanup-${label}-${stamp}@example.com`, password: 'rahasia-123', role: 'student' },
  })
  users.push(user.id)
  return user
}

async function upload(user: User, label: string): Promise<Media> {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: `avatar ${label}` },
    file: { data: PNG_1X1, mimetype: 'image/png', name: `cleanup-${label}-${stamp}.png`, size: PNG_1X1.length },
    overrideAccess: false,
    user,
  })
  media.push(doc.id)
  return doc
}

// Sama seperti PATCH /api/users/:id dari ProfileForm: student mengubah dirinya sendiri.
async function setAvatar(user: User, avatar: number) {
  return payload.update({ collection: 'users', id: user.id, data: { avatar }, overrideAccess: false, user })
}

async function exists(doc: Media): Promise<boolean> {
  const found = await payload.findByID({ collection: 'media', id: doc.id, disableErrors: true })
  return Boolean(found)
}

const fileOnDisk = (doc: Media) => fs.existsSync(path.resolve(process.cwd(), 'media', doc.filename!))

describe('pembersihan avatar lama', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = await payload.create({
      collection: 'categories',
      data: { name: `Kategori cleanup ${stamp}`, slug: `kategori-cleanup-${stamp}` },
    })
    categoryId = category.id
  })

  afterAll(async () => {
    if (courseId) await payload.delete({ collection: 'courses', id: courseId })
    await payload.delete({ collection: 'categories', id: categoryId })
    if (users.length) await payload.delete({ collection: 'users', where: { id: { in: users } } })
    if (media.length) await payload.delete({ collection: 'media', where: { id: { in: media } } })
  })

  it('mengganti avatar menghapus media & file avatar lama', async () => {
    const student = await createStudent('ganti')
    const oldAvatar = await upload(student, 'ganti-lama')
    await setAvatar(student, oldAvatar.id)
    const newAvatar = await upload(student, 'ganti-baru')

    await setAvatar(student, newAvatar.id)

    expect(await exists(oldAvatar)).toBe(false)
    expect(fileOnDisk(oldAvatar)).toBe(false)
    expect(await exists(newAvatar)).toBe(true)
    expect(fileOnDisk(newAvatar)).toBe(true)
  })

  it('update profil tanpa mengganti avatar tidak menghapus apa pun', async () => {
    const student = await createStudent('bio')
    const avatar = await upload(student, 'bio')
    await setAvatar(student, avatar.id)

    await payload.update({ collection: 'users', id: student.id, data: { bio: 'halo' }, overrideAccess: false, user: student })

    expect(await exists(avatar)).toBe(true)
  })

  it('avatar lama yang juga dipakai sebagai thumbnail course tidak dihapus', async () => {
    const student = await createStudent('thumbnail')
    const shared = await upload(student, 'thumbnail')
    await setAvatar(student, shared.id)
    const course = await payload.create({
      collection: 'courses',
      data: { title: `Course cleanup ${stamp}`, slug: `course-cleanup-${stamp}`, category: categoryId, thumbnail: shared.id },
    })
    courseId = course.id

    await setAvatar(student, (await upload(student, 'thumbnail-baru')).id)

    expect(await exists(shared)).toBe(true)
  })

  it('avatar lama yang juga dipakai user lain tidak dihapus', async () => {
    const student = await createStudent('berbagi-a')
    const other = await createStudent('berbagi-b')
    const shared = await upload(student, 'berbagi')
    await setAvatar(student, shared.id)
    await payload.update({ collection: 'users', id: other.id, data: { avatar: shared.id } })

    await setAvatar(student, (await upload(student, 'berbagi-baru')).id)

    expect(await exists(shared)).toBe(true)
  })

  it('menghapus user ikut menghapus avatarnya', async () => {
    const student = await createStudent('hapus')
    const avatar = await upload(student, 'hapus')
    await setAvatar(student, avatar.id)

    await payload.delete({ collection: 'users', id: student.id })
    users.splice(users.indexOf(student.id), 1)

    expect(await exists(avatar)).toBe(false)
    expect(fileOnDisk(avatar)).toBe(false)
  })
})
