import { NextResponse, type NextRequest } from 'next/server'

import { getPayload } from '@/lib/payload'

export async function POST(request: NextRequest) {
  let payload
  try {
    payload = await getPayload()
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Verify current password by attempting login (server-side, no cookie side effects)
    const loginResult = await payload.login({
      collection: 'users',
      data: { email: user.email, password: currentPassword },
    })

    if (!loginResult || !loginResult.token) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Update password
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { password: newPassword },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (payload) {
      payload.logger.error(error)
    }
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
