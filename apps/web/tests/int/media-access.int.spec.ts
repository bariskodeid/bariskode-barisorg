// @vitest-environment node
// Deteksi tipe file Payload (file-type) gagal di jsdom: Buffer dari realm
// Node tidak lolos cek `instanceof Uint8Array` milik jsdom.
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import type { Media, User } from '@/payload-types'

let payload: Payload
let student: User
let otherStudent: User
let instructor: User
const created: number[] = []

const stamp = Date.now()

// PNG 1x1 valid — cukup untuk lolos deteksi tipe file & pemrosesan sharp.
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

async function createUser(name: string, role: User['role']): Promise<User> {
  return payload.create({
    collection: 'users',
    data: { name, email: `media-${role}-${name.replace(/\s+/g, '-')}-${stamp}@example.com`, password: 'rahasia-123', role },
  })
}

async function upload(user: User, label: string): Promise<Media> {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: `avatar ${label}` },
    file: { data: PNG_1X1, mimetype: 'image/png', name: `avatar-${label}-${stamp}.png`, size: PNG_1X1.length },
    overrideAccess: false,
    user,
  })
  created.push(doc.id)
  return doc
}

describe('akses collection Media (upload avatar)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    student = await createUser('Siswa Media A', 'student')
    otherStudent = await createUser('Siswa Media B', 'student')
    instructor = await createUser('Instruktur Media', 'instructor')
  })

  afterAll(async () => {
    if (created.length) await payload.delete({ collection: 'media', where: { id: { in: created } } })
    await payload.delete({
      collection: 'users',
      where: { id: { in: [student.id, otherStudent.id, instructor.id] } },
    })
  })

  it('user login bisa upload gambar lalu memasangnya sebagai avatar sendiri', async () => {
    const media = await upload(student, 'a')
    expect(media.url).toMatch(/^\/api\/media\/file\//)

    const updated = await payload.update({
      collection: 'users',
      id: student.id,
      data: { avatar: media.id },
      overrideAccess: false,
      user: student,
    })
    expect(typeof updated.avatar === 'object' ? updated.avatar?.id : updated.avatar).toBe(media.id)
  })

  it('pengunjung anonim tidak bisa upload', async () => {
    await expect(
      payload.create({
        collection: 'media',
        data: { alt: 'anon' },
        file: { data: PNG_1X1, mimetype: 'image/png', name: `anon-${stamp}.png`, size: PNG_1X1.length },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('student tidak bisa mengubah atau menghapus media milik siapa pun', async () => {
    const media = await upload(otherStudent, 'b')

    await expect(
      payload.update({ collection: 'media', id: media.id, data: { alt: 'diganti' }, overrideAccess: false, user: student }),
    ).rejects.toThrow()
    await expect(
      payload.delete({ collection: 'media', id: media.id, overrideAccess: false, user: student }),
    ).rejects.toThrow()

    const stillThere = await payload.findByID({ collection: 'media', id: media.id })
    expect(stillThere.alt).toBe('avatar b')
  })

  it('instructor bisa mengubah dan menghapus media (kelola thumbnail course/blog)', async () => {
    const media = await upload(student, 'c')

    const updated = await payload.update({
      collection: 'media',
      id: media.id,
      data: { alt: 'thumbnail course' },
      overrideAccess: false,
      user: instructor,
    })
    expect(updated.alt).toBe('thumbnail course')

    await payload.delete({ collection: 'media', id: media.id, overrideAccess: false, user: instructor })
    created.splice(created.indexOf(media.id), 1)
  })
})
