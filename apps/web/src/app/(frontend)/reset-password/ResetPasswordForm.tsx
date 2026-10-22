'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { useAuth } from '@/lib/auth/AuthContext'
import { useLocale } from '@/lib/i18n/LocaleContext'

const MIN_PASSWORD_LENGTH = 8

// Memanggil endpoint bawaan Payload POST /api/users/reset-password. Kalau
// berhasil, Payload langsung memasang cookie login, jadi user diarahkan ke
// /my-learning tanpa perlu masuk ulang. Panjang minimum juga dicek di server
// (collections/hooks/passwordReset.ts).
export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const { t } = useLocale()
  const { setUser } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [tokenInvalid, setTokenInvalid] = useState(!token)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t.auth.reset.minLength)
      return
    }
    if (password !== confirm) {
      setError(t.auth.reset.mismatch)
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        // Token salah/kedaluwarsa dibalas Payload dengan 403 Forbidden.
        if (res.status === 403) setTokenInvalid(true)
        else setError(res.status === 400 ? t.auth.reset.minLength : t.auth.reset.genericError)
        setLoading(false)
        return
      }
      setUser(data?.user ?? null)
      router.push('/my-learning')
      router.refresh()
    } catch {
      setError(t.auth.reset.networkError)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tighter mb-2 text-center">{t.auth.reset.title}</h1>

        {tokenInvalid ? (
          <div className="mt-6 text-center">
            <p className="text-sm text-destructive">
              {token ? t.auth.reset.invalidToken : t.auth.reset.missingToken}
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg"
            >
              {t.auth.reset.requestNew}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground text-center mb-8">{t.auth.reset.subtitle}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  {t.auth.reset.password}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  {t.auth.reset.confirm}
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50"
              >
                {loading ? t.auth.reset.submitting : t.auth.reset.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
