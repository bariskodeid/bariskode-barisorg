import type { Payload } from 'payload'

// Collection Users sengaja TIDAK bisa dibaca publik (lihat collections/Users.ts:
// email, role, dan sesi login tidak boleh bocor), jadi relasi `author` di Posts
// cuma berisi ID kalau di-query dengan overrideAccess: false tanpa user admin.
// Halaman/skrip publik yang butuh profil author (blog, index search) memakai
// helper ini: overrideAccess: true, tapi dibatasi `select` ke field yang memang
// tampil publik — jangan tambah email/role di sini.
export async function getPublicAuthor(payload: Payload, author: number | { id: number }) {
  return payload.findByID({
    collection: 'users',
    id: typeof author === 'object' ? author.id : author,
    depth: 1,
    select: { name: true, bio: true, avatar: true },
    overrideAccess: true,
    disableErrors: true,
  })
}
