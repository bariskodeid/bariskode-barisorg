'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const createData = await createRes.json()

      if (!createRes.ok) {
        setError(createData?.errors?.[0]?.message || createData?.message || t.auth.register.genericError)
        setLoading(false)
        return
      }

      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!loginRes.ok) {
        // Akun berhasil dibuat tapi auto-login gagal — arahkan ke login manual.
        router.push('/login')
        return
      }

      router.push('/my-learning')
      router.refresh()
    } catch {
      setError(t.auth.register.networkError)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tighter mb-2 text-center">{t.auth.register.title}</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">{t.auth.register.subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {t.auth.register.name}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {t.auth.register.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              {t.auth.register.password}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50"
          >
            {loading ? t.auth.register.submitting : t.auth.register.submit}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {t.auth.register.hasAccount}{' '}
          <Link href="/login" className="text-white hover:underline">
            {t.auth.register.login}
          </Link>
        </p>
      </div>
    </div>
  )
}
