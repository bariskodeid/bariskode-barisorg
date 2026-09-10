'use client'

import { useState, type FormEvent } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

export function ChangePasswordForm() {
  const { t } = useLocale()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError(t.settings.password.mismatch)
      return
    }

    if (newPassword.length < 8) {
      setError(t.settings.password.minLength)
      return
    }

    setLoading(true)

    try {
      // Use dedicated endpoint to verify current password and change it
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 && data.error === 'Current password is incorrect') {
          setError(t.settings.password.wrongPassword)
        } else {
          setError(data?.error || t.settings.password.error)
        }
        setLoading(false)
        return
      }

      setSuccess(t.settings.password.success)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
    } catch {
      setError(t.settings.password.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Current Password */}
      <div>
        <label htmlFor="current-password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.password.current}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.password.currentDesc}
        </p>
        <input
          id="current-password"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="new-password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.password.newPass}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.password.newPassDesc}
        </p>
        <input
          id="new-password"
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm-password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.password.confirm}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.password.confirmDesc}
        </p>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {success && <p className="text-sm text-green-400">{success}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50 self-start"
      >
        {loading ? t.settings.password.saving : t.settings.password.save}
      </button>
    </form>
  )
}
