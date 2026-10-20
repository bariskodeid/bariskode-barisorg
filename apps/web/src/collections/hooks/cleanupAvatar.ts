import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest, Where } from 'payload'

import type { Media, User } from '../../payload-types'

type MediaRef = number | Media | null | undefined

const mediaId = (ref: MediaRef): number | null => (typeof ref === 'object' ? (ref?.id ?? null) : (ref ?? null))

// Avatar lama hanya dihapus kalau tidak dipakai di field relasi lain. Semua FK
// ke media `ON DELETE set null`, jadi menghapus media yang masih dipakai (mis.
// admin memasang thumbnail course sebagai avatar) diam-diam mengosongkan
// gambar di sana. Gambar yang di-embed di rich text (upload node Lexical)
// tidak ikut dicek — tidak ada FK-nya.
async function isMediaUsed(req: PayloadRequest, id: number): Promise<boolean> {
  const { payload } = req
  const equalsId = { equals: id }
  const anyOf = (...paths: string[]): Where => ({ or: paths.map((p) => ({ [p]: equalsId })) })

  const counts = [
    () => payload.count({ collection: 'users', where: { avatar: equalsId }, req }),
    () => payload.count({ collection: 'courses', where: anyOf('thumbnail', 'meta.image'), req }),
    () => payload.countVersions({ collection: 'courses', where: anyOf('version.thumbnail', 'version.meta.image'), req }),
    () => payload.count({ collection: 'posts', where: anyOf('featuredImage', 'meta.image'), req }),
    () => payload.countVersions({ collection: 'posts', where: anyOf('version.featuredImage', 'version.meta.image'), req }),
  ]
  for (const count of counts) {
    if ((await count()).totalDocs > 0) return true
  }

  const settings = await payload.findGlobal({ slug: 'settings', depth: 0, req })
  return mediaId(settings.logo) === id || mediaId(settings.favicon) === id
}

async function deleteIfUnused(req: PayloadRequest, ref: MediaRef): Promise<void> {
  const id = mediaId(ref)
  if (!id) return
  try {
    if (await isMediaUsed(req, id)) return
    // WAJIB `req` yang sama (= transaksi yang sama): FK users.avatar_id
    // `set null` menyentuh baris user yang sedang di-update/hapus; dari
    // transaksi lain itu menunggu lock yang tidak pernah lepas (deadlock).
    // overrideAccess: student tidak punya akses delete media (lihat Media.ts).
    await req.payload.delete({ collection: 'media', id, req, overrideAccess: true })
  } catch (err) {
    // Pembersihan best-effort — simpan profil tidak boleh gagal karena ini.
    req.payload.logger.error({ err }, `[avatar] gagal menghapus media ${id}`)
  }
}

// Ganti avatar: hapus avatar lama supaya file tidak menumpuk di volume media.
export const cleanupReplacedAvatar: CollectionAfterChangeHook<User> = async ({ doc, previousDoc, operation, req }) => {
  if (operation === 'update' && mediaId(previousDoc?.avatar) !== mediaId(doc.avatar)) {
    await deleteIfUnused(req, previousDoc?.avatar)
  }
  return doc
}

// Hapus user: avatarnya ikut dihapus.
export const cleanupDeletedUserAvatar: CollectionAfterDeleteHook<User> = async ({ doc, req }) => {
  await deleteIfUnused(req, doc.avatar)
}
