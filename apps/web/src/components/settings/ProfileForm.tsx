'use client'

import type { Media, User } from '@/payload-types'
import Image from 'next/image'
import { useRef, useState, type FormEvent } from 'react'

import { useLocale } from '@/lib/i18n/LocaleContext'

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t } = useLocale()
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentAvatar = user.avatar && typeof user.avatar === 'object' ? (user.avatar as Media) : null
  const displayAvatar = avatarPreview || currentAvatar?.url || null

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t.settings.profile.error)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t.settings.profile.maxSizeError)
      return
    }

    setAvatarFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      let avatarId: number | undefined

      // Upload new avatar if selected
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        formData.append('alt', `${name}'s avatar`)

        const uploadRes = await fetch('/api/media', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!uploadRes.ok) {
          setError(t.settings.profile.error)
          setLoading(false)
          return
        }

        const uploadData = await uploadRes.json()
        avatarId = uploadData.doc?.id
      }

      // Update user profile
      const body: Record<string, string | number | undefined> = {
        name,
        bio: bio || undefined,
      }
      if (avatarId) {
        body.avatar = avatarId
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || t.settings.profile.error)
        setLoading(false)
        return
      }

      setSuccess(t.settings.profile.success)
      setLoading(false)
    } catch {
      setError(t.settings.profile.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Avatar */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.profile.avatar}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
          {t.settings.profile.avatarDesc}
        </p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt={user.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              {avatarFile ? t.settings.profile.changePhoto : t.settings.profile.choosePhoto}
            </button>
            {avatarFile && (
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null)
                  setAvatarPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-xs font-mono uppercase tracking-wider px-4 py-2 ml-2 text-muted-foreground hover:text-white transition-colors"
              >
                {t.settings.profile.cancel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.profile.name}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.profile.nameDesc}
        </p>
        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.profile.email}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.profile.emailDesc}
        </p>
        <input
          id="email"
          type="email"
          value={user.email}
          readOnly
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none text-muted-foreground cursor-not-allowed"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {t.settings.profile.bio}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">
          {t.settings.profile.bioDesc}
        </p>
        <textarea
          id="bio"
          rows={3}
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t.settings.profile.bioPlaceholder}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"
        />
      </div>

      {success && <p className="text-sm text-green-400">{success}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-lg disabled:opacity-50 self-start"
      >
        {loading ? t.settings.profile.saving : t.settings.profile.save}
      </button>
    </form>
  )
}
