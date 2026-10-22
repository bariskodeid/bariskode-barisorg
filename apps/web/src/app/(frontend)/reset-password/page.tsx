import type { Metadata } from 'next'

import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Buat Password Baru | bariskode.org',
}

// Link di email reset password (lihat collections/hooks/passwordReset.ts)
// mengarah ke sini: /reset-password?token=...
export default async function ResetPasswordPage(props: PageProps<'/reset-password'>) {
  const { token } = await props.searchParams
  return <ResetPasswordForm token={typeof token === 'string' ? token : ''} />
}
