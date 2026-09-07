# 05. Struktur Repository

```
bariskode/
├── apps/
│   └── web/                          # Next.js + Payload (aplikasi utama)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (frontend)/       # Route publik
│       │   │   │   ├── page.tsx              # Landing page
│       │   │   │   ├── courses/
│       │   │   │   │   ├── page.tsx          # Katalog course
│       │   │   │   │   └── [slug]/page.tsx   # Detail course
│       │   │   │   ├── lessons/[slug]/page.tsx
│       │   │   │   ├── blog/
│       │   │   │   │   ├── page.tsx          # Listing blog
│       │   │   │   │   └── [slug]/page.tsx   # Detail post
│       │   │   │   ├── my-learning/page.tsx  # Dashboard progress user
│       │   │   │   └── sitemap.ts
│       │   │   ├── (payload)/        # Admin panel Payload (auto-generated route group)
│       │   │   └── api/
│       │   │       ├── progress/route.ts     # Endpoint tandai lesson selesai
│       │   │       └── sandbox/route.ts      # Proxy ke Judge0
│       │   ├── collections/          # Semua file dari 04-DATA-MODEL.md
│       │   │   ├── Users.ts
│       │   │   ├── Categories.ts
│       │   │   ├── Media.ts
│       │   │   ├── Courses.ts
│       │   │   ├── Modules.ts
│       │   │   ├── Lessons.ts
│       │   │   ├── Progress.ts
│       │   │   ├── Posts.ts
│       │   │   └── index.ts
│       │   ├── components/
│       │   │   ├── admin/            # Custom admin dashboard components
│       │   │   │   └── DashboardStats.tsx
│       │   │   ├── CodeSandbox.tsx
│       │   │   ├── GiscusComments.tsx
│       │   │   └── ProgressBar.tsx
│       │   ├── lib/
│       │   │   ├── payload.ts        # Helper getPayload()
│       │   │   └── judge0.ts         # Client Judge0 API
│       │   └── payload.config.ts
│       ├── public/
│       ├── Dockerfile
│       ├── package.json
│       └── next.config.ts
│
├── infra/                            # Semua konfigurasi infrastruktur production
│   ├── docker-compose.yml            # Stack lengkap: web, db, judge0, ctfd, caddy
│   ├── Caddyfile
│   ├── judge0/
│   │   └── judge0.conf
│   └── ctfd/
│       └── .env.ctfd.example
│
├── docs/                             # Paket dokumentasi ini
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, build di setiap PR
│       └── deploy.yml                # Deploy ke VM saat push ke main
│
├── .env.example
├── CONTRIBUTING.md
├── LICENSE                           # MIT
└── README.md
```

## Prinsip Struktur

- **Monorepo sederhana** — cukup satu app (`apps/web`) untuk v1. Struktur `apps/`
  disiapkan supaya gampang nambah aplikasi lain nanti (mis. dashboard analytics
  terpisah) tanpa restrukturisasi besar.
- **`infra/` terpisah dari `apps/`** — konfigurasi deployment tidak bercampur dengan
  kode aplikasi, memudahkan siapa pun yang ingin fork hanya kode aplikasinya.
- **Collections satu file per collection** — memudahkan navigasi & review PR,
  konsisten dengan pola resmi Payload.
