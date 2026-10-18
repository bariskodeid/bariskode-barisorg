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
- **Menyisipkan block `Code` lewat editor Lexical di `/admin` belum pernah
  dicoba**: yang sudah dicek cuma config server (block `Code` terdaftar,
  importMap ter-generate) dan output render-nya di frontend (`LessonRichText`).
  Alur editor sungguhan (insert block Code di lesson/post, isi kode, pilih
  bahasa, Save, lalu buka halamannya) belum pernah dijalankan di browser.
  Coba sekali secara manual, terutama sebelum editor mulai menulis post blog.

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
      7 benar-benar dieksekusi. Repo GitHub sendiri sudah ada & sinkron
      (`origin` terpasang, `main` lokal = `origin/main`).
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
- [x] Fase 10 — Sertifikat PDF, Notifikasi Email, Quiz Builder, i18n UI —
      diangkat dari backlog atas permintaan eksplisit user. Sertifikat:
      collection `Certificates` + `@react-pdf/renderer` (bukan Puppeteer,
      VM 4GB RAM) + `GET /api/certificates/[courseId]`. Email: hook
      `afterChange` di Courses.ts (course published) + script cron
      `scripts/send-progress-reminders.ts` (reminder progress mandek,
      dijalankan via `payload run`, service `web-script` baru di
      docker-compose). Quiz: field `hasQuiz`/`quizQuestions` pilihan-ganda
      di Lessons (field `isCorrect` dikunci field-access dari role student
      — lihat docs/19-FEATURE-QUIZ.md soal kenapa ini penting), grading di
      `POST /api/quiz`, skor ke `Progress.score` (field lama yang sebelumnya
      placeholder kosong). i18n: toggle ID/EN UI-only (cookie-based, BUKAN
      next-intl/routing per-locale) — konten CMS tetap Indonesia, lihat
      docs/20-FEATURE-I18N-UI.md soal kenapa root layout sengaja tidak baca
      cookies() (supaya ISR courses/blog tidak ikut rusak). Migration
      Certificates & Lessons quiz fields sudah dibuat via `payload
      migrate:create` & diverifikasi jalan lokal. Semua lolos `pnpm lint &&
      pnpm typecheck && pnpm build`, DAN sudah diverifikasi end-to-end via
      `pnpm dev` sungguhan (bukan cuma build-time): submit quiz dengan
      jawaban benar → skor 100% & lesson auto-completed, isCorrect
      dikonfirmasi TIDAK muncul di response fetch lesson sebagai role
      student, resubmit quiz idempotent (balikan `alreadyCompleted`), course
      100% → download sertifikat PDF valid (`%PDF-1.3` magic bytes), flip
      course draft→published men-trigger hook email (log graceful skip
      karena SMTP_HOST kosong di dev, tidak crash), script
      `send-progress-reminders.ts` jalan bersih via `payload run`, dan
      locale switch ID/EN lewat cookie mengubah teks UI di halaman
      server-rendered (`force-dynamic`) tanpa mengubah konten course. SATU
      bug ketemu & diperbaiki saat smoke test: komponen `<T>` awalnya
      menerima function sebagai children yang dilempar dari Server ke Client
      Component (RSC tidak bisa serialize function lewat boundary itu, bikin
      /courses & /blog 500) — diganti jadi props `ns`/`k` (string,
      serializable). Belum dites: pengiriman email SUNGGUHAN ke SMTP asli
      (cuma dites sampai titik "siap kirim, SMTP kosong di dev").
- [x] Overhaul konten 12 course "from Zero" — 21 lesson per course (252
      total), soal quiz diacak saat seed, lesson merender block kode, seed
      idempotent lewat `pnpm seed:courses`. Detail & angka di bagian
      "Konten" di bawah. Eksekusi Judge0 live tetap belum dites.

Semua 9 fase v1 + Fase 10 di docs/17-ROADMAP.md sudah dikerjakan sejauh yang bisa
dilakukan tanpa infrastruktur production asli. Sisa pekerjaan proyek ini
adalah aksi manual user (lihat "Pending Aksi Manual" di atas) + fase lanjutan
di luar v1 (bagian bawah docs/17-ROADMAP.md) kalau dibutuhkan nanti.

## Konten: 12 Course "from Zero"

Konten produksi pertama (non-dummy): **12 course "dari nol", satu per bahasa
sandbox Judge0** — Linux, Python, C, C++, Go, Java, JavaScript, PHP, Ruby,
Rust, SQL, TypeScript. Semua level `pemula`, status `published`, 5 module,
**21 lesson per course**. Total, dihitung dari `allCourses`
(`apps/web/scripts/courses/index.ts`) dan dicocokkan dengan query DB setelah
seed: **60 module, 252 lesson, 229 lesson sandbox, 222 lesson quiz (199
lesson punya keduanya, tidak ada lesson tanpa sandbox maupun quiz), 774 soal
quiz**. Kategori: Linux pakai "Sistem & Linux" (`sistem-linux`), 11 lainnya
pakai "Programming" (`programming`) — kategori di-reuse (cek `payload.find`
dulu sebelum `create`), bukan dibuat duplikat.

**Sumber konten & cara seed:**

- Definisi tiap course ada di `apps/web/scripts/courses/<bahasa>.ts` (tipe
  `CourseDef` di `scripts/lib/course-def.ts`), diekspor semua lewat
  `allCourses`. Isi lesson ditulis sebagai Markdown, lalu diubah ke Lexical
  oleh `scripts/lib/markdown-lexical.ts` (heading, list, bold, inline code,
  dan fence kode jadi block `Code` yang dirender `LessonRichText`).
- **`pnpm seed:courses`** (dari `apps/web`) men-seed ke-12 course sekaligus.
  `pnpm seed:<bahasa>` (`seed:linux`, `seed:python`, dst) men-seed satu course
  saja lewat fungsi yang sama (`scripts/lib/seed-course.ts`).
- **Seed ini idempotent (upsert), aman dijalankan ulang di DB yang sudah
  berisi data** (untuk DB production, WAJIB ikuti bullet "Seed di
  production" di bawah). Course & lesson di-upsert berdasarkan `slug`, module
  berdasarkan (course, `order`). ID lesson tetap stabil di antara run,
  sehingga `Progress` dan `Bookmarks` user tidak putus. Seed tidak pernah
  menghapus apa pun: lesson yang ada di DB tapi tidak lagi ada di definisi
  dilaporkan sebagai orphan di hasil seed (`orphanedLessonSlugs`), sedangkan
  module berlebih (order di luar definisi) cuma di-`console.warn`, tidak
  masuk `orphanedLessonSlugs`. Seed juga tidak menyentuh `Courses.status`
  pada course yang sudah ada (hook `afterChange` di `Courses.ts` mengirim
  email tiap status berubah jadi `published`) dan menolak (throw) kalau slug
  lesson ternyata dipakai lesson di course lain.
- **Seed di production WAJIB dengan `NODE_ENV=production`.** Perintahnya
  (service `web-script` memakai stage `builder` Dockerfile, yang tidak
  men-set `NODE_ENV`):
  `docker compose -f infra/docker-compose.yml --profile script run --rm -e NODE_ENV=production web-script scripts/seed-all-courses.ts`.
  Jangan pernah menjalankan seed ke DB production tanpa flag itu. Tanpa
  `NODE_ENV=production`, `payload run` jalan dalam dev mode: adapter Postgres
  mem-push schema langsung ke DB (mengubah schema hasil migration; push dan
  migration tidak identik, mis. default/NOT NULL sepasang kolom
  `created_at`/`updated_at`) dan menambah baris penanda `dev` (`batch = -1`)
  di `payload_migrations`. `payload migrate` berikutnya lalu berhenti di
  prompt interaktif "you've run Payload in dev mode" (default No), jadi
  deploy non-TTY bisa gagal atau migration diam-diam tidak jalan. Selain
  itu, re-seed **menimpa edit admin** pada ke-12 course ini: judul,
  kategori, level, deskripsi course, judul module, dan seluruh isi lesson
  (konten, sandbox, quiz); hanya `status` course yang tidak disentuh. Dump DB
  (`pg_dump`) dulu sebelum re-seed. Prosedur yang sama tercatat di
  docs/14-DEPLOYMENT-ORACLE-VM.md bagian 7.
- **Slug lesson yang sudah ada TIDAK BOLEH diganti.** Slug adalah URL lesson
  sekaligus kunci upsert seed; `Progress` dan `Bookmarks` menunjuk ke ID
  lesson, bukan slug. Kalau slug diganti, seed membuat lesson baru (ID baru)
  dan lesson lama jadi orphan (tidak terhapus, progress & bookmark user tetap
  menempel di lesson lama). Lesson baru memakai prefix slug course-nya (mis.
  `pfz-`, `sqlfz-`, `rustfz-`) dan harus unik di seluruh DB. Tes slug unik di
  `tests/int/course-content.int.spec.ts` hanya membandingkan lesson di
  `allCourses`; bentrok dengan lesson lain di DB (mis. fixture `seed-dev.ts`
  atau lesson buatan admin) baru ketahuan saat seed, yang lalu throw.
- **Urutan opsi quiz diacak saat seed** (deterministik — seed-nya teks soal,
  jadi hasilnya sama tiap run). Sebelumnya 424 dari 427 soal punya jawaban
  benar di opsi pertama (temuan audit konten), jadi siswa bisa lulus dengan
  selalu memilih A. Distribusi index jawaban benar sekarang: 221/181/202/170
  untuk index 0/1/2/3 (dari 774 soal). Grading di `POST /api/quiz` tetap
  berbasis index opsi, bukan teks — lihat `docs/19-FEATURE-QUIZ.md`.

**Verifikasi akhir overhaul konten (di DB dev yang sudah berisi seed
lama):** 98 tes unit konten/seed/markdown/render lolos (termasuk guard
markup mentah: tidak ada backtick atau `**` tersisa di teks non-kode setelah
konversi Lexical); `pnpm seed:courses`
di atas data lama →
12 course di-update, 36 lesson baru dibuat, `orphanedLessonSlugs` kosong di
semua course; query SQL → 12 course, tiap course persis 5 module/21 lesson
(252 lesson total), 0 slug lesson duplikat, 0 soal quiz tanpa tepat satu
`isCorrect`, 0 baris `Progress` yang lesson-nya hilang, ID lesson lama
(mis. 1-18 untuk Python) dan baris `Progress` yang sudah ada tetap utuh.
Smoke test lewat `pnpm dev` + curl (bukan browser sungguhan): halaman lesson
lama & baru Python/SQL/Rust me-render heading, list, inline code, dan block
`Code` sesuai isi DB; `/courses/<slug>` menampilkan deskripsi; submit quiz
lewat `POST /api/quiz` sebagai student → skor 100% dengan jawaban benar tidak
selalu di index 0, resubmit idempotent (`alreadyCompleted`), `isCorrect` tidak
bocor di HTML lesson untuk student. Starter code sandbox sudah dijalankan
lokal di Docker dengan versi yang mendekati runtime Judge0 (versi persisnya
beda tipis di beberapa bahasa): Python di `python:3.8-alpine`; JavaScript di
`node:12-alpine`; TypeScript di-compile di host (bukan di Docker, bukan lewat
`npx`) dengan `typescript@3.7.4` yang di-install lokal, lalu JS hasilnya
dijalankan di `node:12-alpine` (tanpa image khusus TypeScript); C & C++ di
`gcc:9.2`; Rust di `rust:1.40` (rustup 1.40.0); Go di `golang:1.13-alpine`
(Go 1.13.15, sedangkan Judge0 pakai 1.13.5); Java di `eclipse-temurin:17-jdk`
dengan `javac --release 13` (BUKAN OpenJDK 13 asli); PHP di `php:7.4-cli`;
Ruby di `ruby:2.7`; SQL lewat CLI SQLite 3.27.2 asli yang di-build dari
source di dalam `gcc:9.2`; Bash di `bash:5.0` (coreutils busybox) dan bash
5.0.3 GNU milik `gcc:9.2`, dijalankan sebagai uid tanpa entri passwd. Guard
di `course-content.int.spec.ts` juga menolak fitur runtime yang lebih baru
di starter. Ini bukan pengganti runtime Judge0 asli, yang belum pernah
dipakai (lihat di bawah).

**Belum dites:** eksekusi nyata tombol Run lewat Judge0 live — blocker sama
dengan catatan Judge0 di "Pending Aksi Manual" di atas (container privileged
belum bisa dinyalakan di environment development ini), jadi starter hanya
diverifikasi di Docker lokal (daftar di atas), dan runtime Judge0 asli belum
dipakai sama sekali. Smoke test klik quiz/lesson di browser sungguhan juga
belum (API & HTML dites lewat curl). Topik yang butuh network/root sungguhan
(mis. package manager & cron di Linux) sengaja quiz-only karena sandbox
Judge0 stateless tanpa network/root.

Update checklist ini setiap fase selesai supaya sesi Claude Code berikutnya tahu
harus lanjut dari mana.
