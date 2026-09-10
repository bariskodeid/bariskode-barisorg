import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // ── Site Identity ──
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'bariskode.org',
      admin: { description: 'Nama situs yang tampil di header, metadata, dll.' },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      admin: { description: 'Deskripsi singkat situs untuk meta tags & footer.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Logo situs — tampil di header.' },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Favicon (ICO/PNG, 32x32 recommended).' },
    },
    // ── Tabs ──
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Social Links',
          fields: [
            {
              name: 'github',
              type: 'text',
              admin: { description: 'URL GitHub repo/organisasi.' },
            },
            {
              name: 'twitter',
              type: 'text',
              admin: { description: 'URL profil Twitter/X.' },
            },
            {
              name: 'discord',
              type: 'text',
              admin: { description: 'URL invite Discord.' },
            },
            {
              name: 'youtube',
              type: 'text',
              admin: { description: 'URL channel YouTube.' },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'copyrightText',
              type: 'text',
              admin: { description: 'Teks copyright di footer.' },
            },
            {
              name: 'footerTagline',
              type: 'textarea',
              admin: { description: 'Tagline singkat di footer.' },
            },
          ],
        },
        {
          label: 'Maintenance',
          fields: [
            {
              name: 'maintenanceMode',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Aktifkan mode maintenance — publik lihat halaman maintenance saat diakses.',
              },
            },
            {
              name: 'maintenanceMessage',
              type: 'textarea',
              admin: {
                description: 'Pesan yang ditampilkan saat maintenance aktif.',
                condition: (_, siblingData) => siblingData?.maintenanceMode === true,
              },
            },
          ],
        },
        {
          label: 'Features',
          fields: [
            {
              name: 'enableSandbox',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Aktifkan fitur code sandbox (Judge0) di lesson. Nonaktifkan untuk menyembunyikan tombol Run.',
              },
            },
            {
              name: 'ctfdEnabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'Aktifkan CTFd (lab cybersecurity). Nonaktifkan untuk menyembunyikan semua link "Buka Lab" di seluruh situs.',
              },
            },
          ],
        },
        {
          label: 'Integrations',
          fields: [
            {
              name: 'judge0ApiUrl',
              type: 'text',
              admin: {
                description:
                  'URL API Judge0 (server-side only). Kosongkan untuk pakai nilai dari env JUDGE0_API_URL.',
              },
            },
            {
              name: 'ctfdUrl',
              type: 'text',
              admin: {
                description:
                  'URL publik CTFd (contoh: https://ctf.bariskode.org). Kosongkan untuk pakai nilai dari env NEXT_PUBLIC_CTF_URL.',
              },
            },
          ],
        },
      ],
    },
  ],
}
