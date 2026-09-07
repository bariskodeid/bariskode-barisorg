'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.errors?.[0]?.message || data?.message || t.auth.login.genericError)
        setLoading(false)
        return
      }

      router.push('/my-learning')
      router.refresh()
    } catch {
      setError(t.auth.login.networkError)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tighter mb-2 text-center">{t.auth.login.title}</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">{t.auth.login.subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {t.auth.login.email}
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
              {t.auth.login.password}
            </label>
            <input
              id="password"
              type="password"
              required
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
            {loading ? t.auth.login.submitting : t.auth.login.submit}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {t.auth.login.noAccount}{' '}
          <Link href="/register" className="text-white hover:underline">
            {t.auth.login.register}
          </Link>
        </p>
      </div>
    </div>
  )
}
