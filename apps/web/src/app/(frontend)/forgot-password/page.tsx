import type { Metadata } from 'next'

import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Lupa Password | bariskode.org',
}

// Wajib dynamic: SMTP_HOST dibaca saat request. Kalau di-prerender saat build
// (env SMTP belum ada di build Docker), halaman ini selamanya menganggap
// email belum dikonfigurasi.
export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm emailEnabled={Boolean(process.env.SMTP_HOST)} />
}
