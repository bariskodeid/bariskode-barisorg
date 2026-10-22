import { APIError, type CollectionBeforeOperationHook } from 'payload'

import type { User } from '../../payload-types'
import { checkRateLimit, getClientIp } from '../../lib/rateLimit'

// Sama dengan aturan /api/users/change-password.
export const MIN_PASSWORD_LENGTH = 8

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

// Endpoint bawaan Payload (POST /api/users/forgot-password &
// /api/users/reset-password) dipakai langsung oleh halaman frontend, jadi
// batasannya dipasang di hook ini — berlaku juga untuk siapa pun yang
// memanggil endpoint itu tanpa lewat halaman. Lihat bagian "Reset password"
// di docs/21-FEATURE-EMAIL-NOTIFICATIONS.md.
export const guardPasswordReset: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation === 'forgotPassword') {
    // Tanpa batas, endpoint ini bisa dipakai membanjiri inbox seseorang
    // dengan email reset. Per IP dulu; kuota per alamat email hanya terpakai
    // oleh request yang lolos cek IP. Kuota per email dibagi semua IP, jadi
    // orang lain bisa menghabiskannya untuk email korban — tapi korban tetap
    // menerima email-email itu, dan link di email terbaru tetap berlaku.
    const tooMany = () =>
      new APIError('Terlalu banyak permintaan reset password. Coba lagi nanti.', 429, null, true)
    const byIp = checkRateLimit(`forgot-password:ip:${getClientIp(req.headers)}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    })
    if (!byIp.allowed) throw tooMany()

    const email = String(args.data?.email ?? '')
      .trim()
      .toLowerCase()
    if (email && !checkRateLimit(`forgot-password:email:${email}`, { limit: 5, windowMs: 60 * 60_000 }).allowed) {
      throw tooMany()
    }
  }

  if (operation === 'resetPassword') {
    const password = args.data?.password
    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      throw new APIError(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`, 400, null, true)
    }
  }

  return args
}

// Link reset menuju halaman frontend /reset-password, bukan /admin/reset
// bawaan Payload (admin panel hanya untuk role admin, lihat Users.access.admin).
export function forgotPasswordEmailHTML(args?: { token?: string; user?: User }): string {
  const url = `${serverURL}/reset-password?token=${encodeURIComponent(args?.token ?? '')}`
  const name = escapeHtml(args?.user?.name ?? '')
  return `
    <p>Halo ${name},</p>
    <p>Ada permintaan reset password untuk akun bariskode.org dengan alamat email ini.
    Buka link berikut untuk membuat password baru (berlaku 1 jam):</p>
    <p><a href="${url}">${url}</a></p>
    <p>Kalau kamu tidak meminta reset password, abaikan email ini — password kamu tidak berubah.</p>
  `
}
