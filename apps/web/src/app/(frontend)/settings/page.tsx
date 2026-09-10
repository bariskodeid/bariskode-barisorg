import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayload } from '@/lib/payload'

import { SettingsClient } from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    redirect('/login')
  }

  // Fetch full user data with avatar relation
  const fullUser = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 1,
  })

  return <SettingsClient user={JSON.parse(JSON.stringify(fullUser))} />
}
