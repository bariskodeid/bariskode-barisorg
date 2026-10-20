import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProfileForm } from '@/components/settings/ProfileForm'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import type { User } from '@/payload-types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/settings',
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

const user: User = {
  id: 7,
  name: 'Siswa Tes',
  email: 'siswa@example.com',
  role: 'student',
  bio: null,
  avatar: null,
  updatedAt: '2026-10-20T00:00:00.000Z',
  createdAt: '2026-10-20T00:00:00.000Z',
  collection: 'users',
}

const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input)
  if (url === '/api/media' && init?.method === 'POST') {
    return new Response(JSON.stringify({ doc: { id: 42, url: '/api/media/file/a.png' } }), { status: 201 })
  }
  if (url === `/api/users/${user.id}` && init?.method === 'PATCH') {
    return new Response(JSON.stringify({ doc: { ...user, avatar: 42 } }), { status: 200 })
  }
  return new Response(JSON.stringify({ errors: [{ message: 'Not Found' }] }), { status: 404 })
})

describe('ProfileForm — upload avatar', () => {
  beforeEach(() => {
    fetchMock.mockClear()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('mengirim alt lewat `_payload` (format multipart Payload 3) lalu memasang avatar', async () => {
    const { container } = render(
      <LocaleProvider>
        <ProfileForm user={user} />
      </LocaleProvider>,
    )

    const file = new File([new Uint8Array([137, 80, 78, 71])], 'avatar.png', { type: 'image/png' })
    fireEvent.change(container.querySelector('input[type=file]')!, { target: { files: [file] } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => expect(screen.getByText('Profil berhasil diperbarui.')).toBeTruthy())

    const [, uploadInit] = fetchMock.mock.calls.find(([url]) => url === '/api/media')!
    const form = uploadInit!.body as FormData
    expect(form.get('file')).toBeInstanceOf(File)
    // Payload 3 mengabaikan field multipart selain `file` & `_payload` — field
    // `alt` biasa membuat upload ditolak 400 "Alt: This field is required".
    expect(JSON.parse(form.get('_payload') as string)).toEqual({ alt: "Siswa Tes's avatar" })

    const [, patchInit] = fetchMock.mock.calls.find(([url]) => url === `/api/users/${user.id}`)!
    expect(JSON.parse(patchInit!.body as string)).toMatchObject({ avatar: 42 })
  })
})
