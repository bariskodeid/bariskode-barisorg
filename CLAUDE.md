# CLAUDE.md

Panduan kerja untuk Claude Code di repo **bariskode.org**. Baca ini dulu sebelum
mengerjakan apa pun di repo ini.

## Apa Ini

bariskode.org adalah platform pembelajaran open source (Bahasa Indonesia) untuk
programming, database, data science, dan cybersecurity — lengkap dengan code
sandbox (Judge0) dan lab CTF (CTFd). Spesifikasi lengkap ada di `docs/`, jangan
menebak-nebak keputusan produk/arsitektur yang sudah didokumentasikan di sana.

**Selalu baca dokumen `docs/` yang relevan sebelum menulis kode untuk area itu.**
Peta dokumen lengkap ada di `docs/README.md`. Yang paling penting:

- `docs/17-ROADMAP.md` — **acuan urutan kerja**. Kerjakan fase secara berurutan
  (Fase 0 → Fase 9). Jangan lompat fase kecuali diminta eksplisit.
- `docs/04-DATA-MODEL.md` — skema Payload collections, sudah berisi kode siap
  pakai. Jangan ubah relasi inti tanpa update dokumen ini juga.
- `docs/05-REPO-STRUCTURE.md` — struktur folder yang wajib diikuti.
- `docs/06-ENVIRONMENT-VARIABLES.md` — semua env var yang dipakai.

## Stack

Next.js 15 (App Router) + Payload CMS 3.x (embedded) + PostgreSQL 16, Tailwind
CSS, Lexical (rich text), Judge0 (sandbox kode), CTFd (lab cybersecurity,
aplikasi terpisah di subdomain). Detail & alasan pemilihan ada di
`docs/03-TECH-STACK.md`. Jangan usulkan penggantian stack (mis. Supabase,
Kubernetes, Strapi) — sudah dievaluasi dan sengaja dihindari, lihat bagian
"Hal yang Sengaja Dihindari di v1" di dokumen tersebut.

## Struktur Repo

```
apps/web/       # Next.js + Payload — satu-satunya app di v1
infra/          # docker-compose, Caddyfile, config Judge0/CTFd (deployment only)
docs/           # paket spesifikasi ini
```

Ikuti persis `docs/05-REPO-STRUCTURE.md` — jangan restrukturisasi tanpa alasan kuat.

## Desain / Tema Frontend

Tema visual frontend publik (`apps/web/src/app/(frontend)/`) sengaja disamakan
dengan portfolio pribadi di `/home/neko/projects/bariskode/portfolio` (situs
terpisah, SvelteKit — cuma dijadikan referensi desain, bukan dependency).
Ciri khasnya: monokrom gelap (background hitam pekat, `--radius: 0rem` di CSS
vars tapi elemen individual tetap pakai `rounded-lg/xl/full` langsung), font
Inter untuk body, font mono uppercase tracking-wide untuk nav/label/badge,
grid background pattern tipis di belakang konten, border putih transparan
(`border-white/10`), aksen hijau (`green-400/500`) dipakai tipis-tipis untuk
hover/status. Referensi implementasi: `src/app/(frontend)/globals.css`,
`src/components/layout/Header.tsx`, `Footer.tsx`,
`src/components/ui/GridBackground.tsx`. Ikuti pola ini untuk halaman baru
(blog, my-learning, auth, dst) supaya konsisten — jangan perkenalkan skema
warna/komponen baru tanpa alasan kuat.

## Konvensi Kode

- TypeScript **strict mode**, hindari `any` kecuali benar-benar diperlukan.
- Satu file per collection Payload di `apps/web/src/collections/`.
- Access control didefinisikan di collection (`access.read/create/update/delete`),
  **bukan** di frontend — frontend hanya menyembunyikan UI, bukan sumber
  kebenaran keamanan. Lihat pola yang sudah ada di `docs/04-DATA-MODEL.md`
  sebelum bikin pola akses baru.
- Komponen React: functional component + hooks, styling via Tailwind CSS.
- Package manager: **pnpm** (bukan npm/yarn).
- Sebelum PR/selesai kerja: `pnpm lint`, `pnpm typecheck`, `pnpm build` harus lolos.

## Role & Akses (ringkas)

Role: `student` (default, publik daftar sendiri), `instructor`, `admin`.
Tabel akses lengkap ada di `docs/10-FEATURE-ADMIN-DASHBOARD.md`. Intinya:
hanya instructor/admin yang bisa create/edit course & post, hanya admin yang
bisa hapus atau ubah role user lain, user hanya bisa baca/tulis `Progress`
miliknya sendiri.

## Keamanan — Perhatian Khusus

- **Jangan pernah** expose Judge0 API langsung ke internet — selalu lewat proxy
  `src/app/api/sandbox/route.ts`. Rate limit wajib sebelum dianggap selesai
  (lihat `docs/11-FEATURE-CODE-SANDBOX.md`).
- CTFd **sengaja terpisah** (auth & app sendiri di `ctf.bariskode.org`) —
  jangan coba embed atau share session dengan Payload, itu keputusan arsitektur
  sadar (lihat `docs/12-FEATURE-CYBERSECURITY-LABS.md`).
- Jangan commit file `.env` asli — hanya `.env.example`. Secret minimal 32
  karakter acak.
- Sebelum deployment/production, jalankan checklist penuh di
  `docs/16-SECURITY-CHECKLIST.md`.

## Cara Kerja yang Diharapkan

1. Cek fase mana yang sedang berjalan (lihat progress di bawah atau tanyakan
   kalau tidak jelas).
2. Baca dokumen yang direferensikan fase tersebut di `docs/17-ROADMAP.md`
   sebelum mulai coding.
3. Kerjakan sampai memenuhi "Definition of done" fase itu.
4. Jalankan `pnpm lint && pnpm typecheck && pnpm build` di `apps/web` sebelum
   melapor selesai.
5. Untuk perubahan schema collection, buat migration
   (`pnpm payload migrate:create`) — jangan andalkan `push` mode di production.

## Non-Goals v1 (jangan implementasikan tanpa diminta eksplisit)

Pembayaran/course berbayar, aplikasi mobile native, live class terjadwal,
sertifikat otomatis, multi-bahasa (i18n). Daftar lengkap fase lanjutan ada di
bagian bawah `docs/17-ROADMAP.md`.

## Pending Aksi Manual dari User

- **Giscus (komentar blog)**: `GiscusComments.tsx` sudah dipasang dan sengaja
  tidak merender apa pun selama env var `NEXT_PUBLIC_GISCUS_*` masih nilai
  placeholder. Untuk mengaktifkan: buat repo GitHub publik untuk proyek ini,
  aktifkan Discussions, install app giscus, ikuti langkah lengkap di
  `docs/08-FEATURE-BLOG.md`, lalu isi env var di `apps/web/.env`.
- **Judge0 (code sandbox) belum pernah benar-benar dites eksekusi kodenya**:
  `judge0-server`/`judge0-workers` butuh `privileged: true` (sandbox
  "isolate" milik Judge0 perlu akses kernel low-level) — di lingkungan
  development Claude Code, container privileged diblokir oleh classifier
  auto-mode, jadi kedua service ini belum pernah berhasil dinyalakan &
  end-to-end run kode belum diverifikasi nyata. Yang SUDAH diverifikasi:
  config compose valid, `judge0-db`/`judge0-redis` (tidak butuh privileged)
  jalan & auth redis benar, dan seluruh logic proxy `/api/sandbox` (auth
  gate, validasi input, rate limit, allowlist bahasa, graceful failure saat
  Judge0 unreachable) via HTTP test langsung. Sebelum anggap Fase 5 selesai
  total: jalankan `docker compose -f infra/docker-compose.yml up -d
  judge0-server judge0-workers` di environment yang mengizinkan privileged
  container, lalu coba tombol Run beneran di lesson dengan `hasSandbox: true`.
- **CTFd**: setelah `docker compose up -d ctfd ctfd-db ctfd-redis`, jalankan
  `CTFD_ADMIN_PASSWORD=<password> infra/ctfd/seed-ctfd.sh` untuk menyelesaikan
  setup wizard CTFd (nama CTF, akun admin) sekaligus membuat 3 challenge
  contoh — sudah diverifikasi jalan bersih dari instance kosong. Kurikulum
  lab lengkap (di luar 3 challenge bukti-konsep ini) tetap keputusan konten
  terpisah, lihat docs/12-FEATURE-CYBERSECURITY-LABS.md.
- **Repo GitHub (Fase 8) sudah ada & sinkron** — remote `origin` sudah
  terpasang (`github-bariskode:bariskodeid/bariskode-barisorg.git`) dan
  `main` lokal sinkron dengan `origin/main`. Yang **masih** perlu user
  lakukan sendiri untuk Fase 7 (butuh akun/domain asli, tidak bisa Claude
  Code lakukan): (1) provisioning VM (Oracle Cloud —
  docs/14-DEPLOYMENT-ORACLE-VM.md — atau VPS lain, lihat juga bagian 9 di
  dokumen itu untuk tuning VM RAM kecil mis. 4GB); (2) arahkan domain ke
  Cloudflare + DNS records ke IP VM (docs/13-DEPLOYMENT-CLOUDFLARE.md); (3)
  set GitHub Secrets VM_HOST/VM_USER/VM_SSH_KEY (docs/15-CICD.md) baru
  `deploy.yml` bisa jalan. Semua config/kode sisi bariskode.org sendiri
  (Dockerfile, docker-compose.yml lengkap dengan service `web`+`caddy`,
  Caddyfile, ci.yml, deploy.yml) sudah ditulis & DITES SUNGGUHAN secara lokal
  (bukan cuma ditulis lalu didiamkan) — lihat detail bug yang ketemu &
  diperbaiki di commit Fase 7.
- **Checklist keamanan (docs/16-SECURITY-CHECKLIST.md) — sebagian butuh VM
  asli, belum bisa dikerjakan**: rotate ke secret production yang benar-benar
  acak (bukan nilai dev di `.env`), set SSL/TLS Cloudflare ke Full (strict),
  konfigurasi Oracle Security List + `ufw` (cuma 80/443 publik), pasang
  `infra/backup.sh` sebagai cron (`/etc/cron.d/bariskode-backup`, contoh
  perintah ada di komentar script-nya) dan **tes restore-nya** — backup yang
  belum pernah dites restore bukan backup yang bisa diandalkan. Bagian
  mekanisme dump Postgres di `infra/backup.sh` sendiri sudah dites (bukan
  cuma ditulis) terhadap Postgres lokal.
- **2 vulnerability (1 moderate, sisanya transitive) belum ada fix upstream**:
  `esbuild` (lewat drizzle-kit, dependency `@payloadcms/db-postgres`, dev-time
  saja) dan DOMPurify (lewat monaco-editor, dependency `@payloadcms/ui`, dipakai
  admin panel Payload sendiri) — keduanya transitive dependency internal
  Payload, tidak bisa di-bump manual tanpa upstream Payload merilis versi
  baru. Juga ada 1 CVE moderate langsung di `payload@3.88.0` sendiri
  ("default account-unlock access", GHSA-jg8r-5jh2-v2xj) yang per saat ini
  belum ada versi patch (`pnpm audit` update berkala untuk cek apakah sudah
  ada rilis baru).

## Status Implementasi

- [x] Fase 0 — Scaffolding & Dev Environment
- [x] Fase 1 — Data Model & Admin Panel Dasar
- [x] Fase 2 — Frontend Publik: Katalog Course
- [x] Fase 3 — Auth & Progress Tracking
- [x] Fase 4 — Blog + Giscus (Giscus butuh setup manual GitHub, lihat catatan di bawah)
- [x] Fase 5 — Code Sandbox (Judge0) — eksekusi kode live belum dites, lihat catatan di atas
- [x] Fase 6 — Lab Cybersecurity (CTFd) — diverifikasi penuh end-to-end (lihat
      di atas), termasuk 3 challenge contoh & solve lewat akun terpisah
- [x] Fase 7 — Deployment Production — **konfigurasi & image siap + sudah
      dites lokal (lihat catatan di atas), TAPI belum benar-benar deploy ke
      VM asli.** Provisioning VM Oracle & setup DNS Cloudflare adalah aksi
      manual yang cuma bisa dilakukan user (butuh akun & domain asli) — lihat
      docs/13/14. Kode/config sisi bariskode.org sudah siap dipakai begitu
      VM & domain ada.
- [x] Fase 8 — CI/CD — `ci.yml` ditulis & logic-nya diverifikasi identik
      lewat simulasi lokal (migrate fresh DB lalu build, persis alur CI).
      `deploy.yml` ditulis sesuai docs/15-CICD.md tapi baru template — perlu
      GitHub Secrets (VM_HOST/VM_USER/VM_SSH_KEY) yang cuma ada setelah Fase
      7 benar-benar dieksekusi, dan repo ini belum pernah di-push ke GitHub
      sama sekali (masih git lokal murni).
- [x] Fase 9 — Security Hardening & Launch Checklist — semua item yang bisa
      dikerjakan tanpa VM/domain asli sudah selesai: rate limit ditambah ke
      `/api/progress` (sebelumnya cuma `/api/sandbox`), security header
      dasar (`next.config.ts` headers — sengaja tidak menyentuh
      script-src/style-src CSP, diverifikasi /admin & login tetap jalan),
      `pnpm audit` dijalankan & 2 vulnerability actionable (critical vitest,
      high sharp) di-bump, `infra/backup.sh` ditulis & mekanisme dump
      Postgres-nya dites nyata, rate limiting login CTFd dikonfirmasi aktif
      by default dari source code CTFd. Item yang BUTUH VM/domain asli
      (SSL Cloudflare, firewall Oracle, rotate secret production, tes
      restore backup) dicatat di "Pending Aksi Manual" di atas — ini bukan
      "belum selesai", tapi memang tidak bisa dikerjakan sebelum Fase 7
      benar-benar dieksekusi oleh user.

Semua 9 fase v1 di docs/17-ROADMAP.md sudah dikerjakan sejauh yang bisa
dilakukan tanpa infrastruktur production asli. Sisa pekerjaan proyek ini
adalah aksi manual user (lihat "Pending Aksi Manual" di atas) + fase lanjutan
di luar v1 (bagian bawah docs/17-ROADMAP.md) kalau dibutuhkan nanti.

Update checklist ini setiap fase selesai supaya sesi Claude Code berikutnya tahu
harus lanjut dari mana.
