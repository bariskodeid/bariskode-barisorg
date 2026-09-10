'use client'

import { useEffect, useState } from 'react'

import type { Setting } from '@/payload-types'

type SettingsData = Setting

// Cache settings client-side to avoid repeated fetches within the same page
let cachedSettings: SettingsData | null = null
let fetchPromise: Promise<SettingsData | null> | null = null

async function fetchSettings(): Promise<SettingsData | null> {
  if (cachedSettings) return cachedSettings
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('/api/globals/settings', { credentials: 'include' })
    .then((res) => {
      if (!res.ok) return null
      return res.json()
    })
    .then((data) => {
      cachedSettings = data as SettingsData
      return cachedSettings
    })
    .catch(() => null)

  return fetchPromise
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)

  useEffect(() => {
    let cancelled = false
    fetchSettings().then((data) => {
      if (!cancelled) {
        setSettings(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { settings, loading }
}
