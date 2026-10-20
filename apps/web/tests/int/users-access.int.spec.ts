import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getPublicAuthor } from '@/lib/publicAuthor'
import config from '@/payload.config'
import type { User } from '@/payload-types'

let payload: Payload
let student: User
let otherStudent: User
let admin: User

const stamp = Date.now()

async function createUser(name: string, role: User['role']): Promise<User> {
  return payload.create({
    collection: 'users',
    data: { name, email: `${role}-${name.replace(/\s+/g, '-')}-${stamp}@example.com`, password: 'rahasia-123', role, bio: `Bio ${name}` },
  })
}

describe('akses collection Users', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    student = await createUser('Siswa A', 'student')
    otherStudent = await createUser('Siswa B', 'student')
    admin = await createUser('Admin', 'admin')
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'users',
      where: { id: { in: [student.id, otherStudent.id, admin.id] } },
    })
  })

  it('pengunjung anonim tidak bisa membaca daftar user (email/role/sesi)', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('user login hanya bisa membaca dirinya sendiri', async () => {
    const result = await payload.find({ collection: 'users', overrideAccess: false, user: student })
    expect(result.docs.map((u) => u.id)).toEqual([student.id])

    await expect(
      payload.findByID({ collection: 'users', id: otherStudent.id, overrideAccess: false, user: student }),
    ).rejects.toThrow()
  })

  it('admin bisa membaca semua user', async () => {
    const result = await payload.find({
      collection: 'users',
      where: { id: { in: [student.id, otherStudent.id, admin.id] } },
      overrideAccess: false,
      user: admin,
    })
    expect(result.totalDocs).toBe(3)
  })

  it('getPublicAuthor hanya mengembalikan field profil publik', async () => {
    const author = await getPublicAuthor(payload, otherStudent.id)

    expect(author).toMatchObject({ id: otherStudent.id, name: 'Siswa B', bio: 'Bio Siswa B' })
    expect(author).not.toHaveProperty('email')
    expect(author).not.toHaveProperty('role')
    expect(author).not.toHaveProperty('sessions')
  })
})
