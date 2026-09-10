'use client'

import type { User } from '@/payload-types'
import { useState } from 'react'

import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { cn } from '@/lib/utils'

interface SettingsClientProps {
  user: User
}

type Tab = 'profile' | 'password'

export function SettingsClient({ user }: SettingsClientProps) {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: t.settings.tabs.profile },
    { id: 'password', label: t.settings.tabs.password },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            {t.settings.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {t.settings.subtitle}
          </p>

          {/* Tab Navigation */}
          <div role="tablist" className="flex gap-1 mb-8 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'text-white border-white'
                    : 'text-muted-foreground border-transparent hover:text-white',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            {activeTab === 'profile' && <ProfileForm user={user} />}
            {activeTab === 'password' && <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  )
}
