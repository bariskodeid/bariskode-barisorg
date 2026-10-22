'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

// Memanggil endpoint bawaan Payload POST /api/users/forgot-password. Payload
// sengaja selalu membalas sukses walau email tidak terdaftar (supaya daftar
// email user tidak bisa ditebak), jadi pesan sukses di sini juga netral.
// Rate limit & isi email: collections/hooks/passwordReset.ts.
export function ForgotPasswordForm({ emailEnabled }: { emailEnabled: boolean }) {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('loading')
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        setError(res.status === 429 ? t.auth.forgot.rateLimited : t.auth.forgot.genericError)
        setStatus('idle')
        return
      }
      setStatus('sent')
    } catch {
      setError(t.auth.forgot.networkError)
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tighter mb-2 text-center">{t.auth.forgot.title}</h1>

        {!emailEnabled ? (
          <p className="text-sm text-muted-foreground text-center mt-6">{t.auth.forgot.unavailable}</p>
        ) : status === 'sent' ? (
          <p className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            {t.auth.forgot.sent}
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground text-center mb-8">{t.auth.forgot.subtitle}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                >
                  {t.auth.forgot.email}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50"
              >
                {status === 'loading' ? t.auth.forgot.submitting : t.auth.forgot.submit}
              </button>
            </form>
          </>
        )}

        <p className="text-sm text-muted-foreground text-center mt-6">
          <Link href="/login" className="text-white hover:underline">
            {t.auth.forgot.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  )
}
