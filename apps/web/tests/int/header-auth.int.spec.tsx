import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import LoginPage from '@/app/(frontend)/login/page'
import { Header } from '@/components/layout/Header'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { ThemeProvider } from '@/lib/theme/ThemeContext'

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }))

vi.mock('next/navigation', () => ({
  usePathname: () => '/login',
  useRouter: () => router,
}))

const testUser = { id: 1, name: 'Siswa Tes', email: 'siswa@example.com', role: 'student' }

// Sesi "server" palsu: cookie payload-token di browser diwakili variabel ini.
let session: typeof testUser | null = null

function json(body: unknown, status = 200): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
}

function fakeApi(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = String(input)
  const method = init?.method ?? 'GET'

  if (url === '/api/users/me') return json({ user: session })
  if (url === '/api/users/login' && method === 'POST') {
    session = testUser
    return json({ message: 'Auth Passed', user: testUser })
  }
  if (url === '/api/users/logout' && method === 'POST') {
    // Perilaku Payload asli: tanpa sesi, logout melempar APIError('No User', 400).
    if (!session) return json({ errors: [{ message: 'No User' }] }, 400)
    session = null
    return json({ message: 'Logout successful.' })
  }
  if (url === '/api/globals/settings') return json({})
  return json({ errors: [{ message: 'Not Found' }] }, 404)
}

// Header & halaman login dirender di pohon provider yang sama dengan
// app/(frontend)/layout.tsx, lalu navigasi router di-mock — persis kondisi
// soft navigation: Header TIDAK di-remount antara login/logout.
function renderFrontend() {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <Header />
          <LoginPage />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>,
  )
}

const header = () => within(screen.getByRole('banner'))

describe('status login di Header', () => {
  beforeEach(() => {
    session = null
    router.push.mockClear()
    router.refresh.mockClear()
    vi.stubGlobal('fetch', vi.fn(fakeApi))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('tidak menampilkan Masuk/Daftar maupun menu user sebelum status login diketahui', async () => {
    // /api/users/me yang belum selesai: Header harus netral, bukan sempat
    // menampilkan Masuk/Daftar lalu berganti jadi menu user (flicker).
    let resolveMe: (res: Response) => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
        String(input) === '/api/users/me'
          ? new Promise<Response>((resolve) => (resolveMe = resolve))
          : fakeApi(input, init),
      ),
    )
    session = testUser
    renderFrontend()
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/users/me', expect.anything()))

    expect(header().queryByRole('link', { name: 'Masuk' })).toBeNull()
    expect(header().queryByRole('link', { name: 'Daftar' })).toBeNull()
    expect(header().queryByRole('button', { name: 'Keluar' })).toBeNull()

    resolveMe(
      new Response(JSON.stringify({ user: testUser }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await waitFor(() => expect(header().getByRole('button', { name: 'Keluar' })).toBeTruthy())
    expect(header().queryByRole('link', { name: 'Masuk' })).toBeNull()
  })

  it('pindah ke menu user setelah login, tanpa full reload', async () => {
    const { container } = renderFrontend()
    await waitFor(() => expect(header().getByRole('link', { name: 'Masuk' })).toBeTruthy())

    fireEvent.change(container.querySelector('#email')!, { target: { value: testUser.email } })
    fireEvent.change(container.querySelector('#password')!, { target: { value: 'rahasia-123' } })
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/my-learning'))
    await waitFor(() => expect(header().getByRole('button', { name: 'Keluar' })).toBeTruthy())
    expect(header().getByRole('link', { name: 'Belajar Saya' })).toBeTruthy()
    expect(header().getByRole('link', { name: 'Pengaturan' })).toBeTruthy()
    expect(header().queryByRole('link', { name: 'Masuk' })).toBeNull()
    expect(header().queryByRole('link', { name: 'Daftar' })).toBeNull()
  })

  it('kembali ke tombol Masuk/Daftar setelah logout, tanpa full reload', async () => {
    session = testUser
    renderFrontend()
    const logout = await waitFor(() => header().getByRole('button', { name: 'Keluar' }))

    fireEvent.click(logout)

    await waitFor(() => expect(header().getByRole('link', { name: 'Masuk' })).toBeTruthy())
    expect(header().getByRole('link', { name: 'Daftar' })).toBeTruthy()
    expect(header().queryByRole('link', { name: 'Belajar Saya' })).toBeNull()
    expect(session).toBeNull()
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('menu mobile membuka nav & tombol akun, dan tertutup dengan Escape', async () => {
    renderFrontend()
    await waitFor(() => expect(header().getByRole('link', { name: 'Masuk' })).toBeTruthy())
    const toggle = header().getByRole('button', { name: 'Buka menu' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)

    const panel = within(document.getElementById('mobile-nav')!)
    expect(panel.getByRole('link', { name: 'Kursus' })).toBeTruthy()
    expect(panel.getByRole('link', { name: 'Daftar' })).toBeTruthy()
    expect(header().getByRole('button', { name: 'Tutup menu' }).getAttribute('aria-expanded')).toBe('true')

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(document.getElementById('mobile-nav')).toBeNull())
  })

  it('logout tetap membersihkan Header kalau sesi sudah habis duluan', async () => {
    session = testUser
    renderFrontend()
    const logout = await waitFor(() => header().getByRole('button', { name: 'Keluar' }))

    // Token kedaluwarsa saat tab dibiarkan terbuka: server balas 400 "No User".
    session = null
    fireEvent.click(logout)

    await waitFor(() => expect(header().getByRole('link', { name: 'Masuk' })).toBeTruthy())
    expect(header().queryByRole('button', { name: 'Keluar' })).toBeNull()
  })
})
