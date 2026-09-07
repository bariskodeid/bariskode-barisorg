# 02. Arsitektur Sistem

## Gambaran Umum

Semua layanan dijalankan **self-hosted** di satu VM Oracle Cloud Always Free, diatur
lewat Docker Compose, dan diletakkan di belakang Cloudflare untuk DNS, CDN, dan SSL
edge. Pendekatan ini dipilih supaya seluruh stack bisa berjalan gratis di tahap awal
dan tetap mudah discale (upgrade VM/spec) begitu traffic bertambah.

```
                              ┌────────────────────────────┐
                              │        Cloudflare           │
                              │  DNS + CDN + SSL (proxied)  │
                              └──────────────┬───────────────┘
                                              │
                                   bariskode.org / ctf.bariskode.org
                                              │
                              ┌───────────────▼───────────────┐
                              │      Oracle Cloud VM (ARM)     │
                              │  Ubuntu 24.04 + Docker Compose │
                              │                                │
                              │  ┌──────────┐   ┌────────────┐ │
                              │  │  Caddy   │──▶│  Next.js + │ │
                              │  │ (reverse │   │  Payload   │ │
                              │  │  proxy)  │   │   (web)    │ │
                              │  └────┬─────┘   └─────┬──────┘ │
                              │       │               │        │
                              │       │        ┌──────▼─────┐  │
                              │       │        │ PostgreSQL │  │
                              │       │        └────────────┘  │
                              │       │                        │
                              │       ├──▶ ┌────────────────┐  │
                              │       │    │  Judge0 stack  │  │
                              │       │    │ (api+workers+  │  │
                              │       │    │  redis+db)     │  │
                              │       │    └────────────────┘  │
                              │       │                        │
                              │       └──▶ ┌────────────────┐  │
                              │            │  CTFd stack    │  │
                              │            │ (app+mariadb+  │  │
                              │            │  redis)        │  │
                              │            └────────────────┘  │
                              └────────────────────────────────┘
```

## Komponen

| Komponen | Peran |
|---|---|
| **Cloudflare** | DNS untuk `bariskode.org`, proxy (orange-cloud) untuk CDN + DDoS protection, terminasi SSL di edge |
| **Caddy** | Reverse proxy di dalam VM, routing berdasarkan (sub)domain ke container yang tepat, auto-HTTPS antara Cloudflare↔VM |
| **Next.js + Payload (web)** | Satu aplikasi Node.js: frontend publik (course, lesson, blog), admin panel Payload (`/admin`), REST/GraphQL API |
| **PostgreSQL** | Database utama untuk seluruh data Payload (users, courses, lessons, progress, posts) |
| **Judge0 stack** | Sandbox eksekusi kode untuk latihan programming interaktif |
| **CTFd stack** | Platform lab cybersecurity (challenge hands-on) |

## Alur Request Penting

### 1. Render halaman course/lesson (publik)
`Browser → Cloudflare → Caddy → Next.js (SSR/ISR) → Payload Local API → Postgres`

### 2. Tandai lesson selesai (progress tracking)
`Browser (logged in) → Next.js API route → Payload Local API → tulis record di collection Progress → Postgres`

### 3. Eksekusi kode di sandbox
`Browser → Next.js API route (proxy) → Judge0 API (submission) → poll status → hasil dikirim balik ke browser`

### 4. Akses admin dashboard
`Browser → /admin → Payload Admin UI (auth via Payload session) → query/mutate collections`

### 5. Lab cybersecurity
`Browser → link dari lesson → ctf.bariskode.org (CTFd, aplikasi terpisah) → auth terpisah di CTFd`

> Catatan: CTFd sengaja dipisah sebagai aplikasi & auth tersendiri (bukan di-embed
> penuh), karena karakteristik lab CTF (isolasi container per-challenge, scoring
> engine) sudah ditangani baik oleh CTFd sendiri. Cukup taruh di subdomain dan
> link dari materi.

## Keputusan Arsitektur Kunci

- **Payload berjalan di dalam Next.js** (arsitektur Payload 3.x) — satu codebase,
  satu deployment unit untuk web utama. Lihat `03-TECH-STACK.md`.
- **Database self-hosted di VM yang sama**, bukan managed service (Supabase dsb),
  untuk menghindari batas free-tier (pause setelah inactivity, kuota bandwidth)
  yang mengganggu platform yang sudah live. Trade-off: kamu bertanggung jawab atas
  backup (lihat `16-SECURITY-CHECKLIST.md`).
- **Satu VM untuk semua layanan** di tahap awal — cukup untuk MVP dengan traffic
  rendah–menengah. Kalau salah satu layanan (mis. Judge0) jadi bottleneck, itu bisa
  dipindah ke VM terpisah tanpa mengubah arsitektur aplikasi lain.
