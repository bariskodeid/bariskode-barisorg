# 17. Roadmap Implementasi

Dokumen ini adalah panduan eksekusi bertahap untuk Claude Code. Kerjakan berurutan —
setiap fase idealnya jadi satu atau beberapa PR yang bisa direview terpisah.

## Fase 0 — Scaffolding & Dev Environment

- Inisialisasi repo dengan struktur di `05-REPO-STRUCTURE.md`.
- Setup Next.js 15 + Payload 3.x (`npx create-payload-app@latest`) di `apps/web`.
- Konfigurasi Postgres adapter, `.env.example`.
- Setup ESLint, Prettier, TypeScript strict mode.
- Pastikan `pnpm dev` jalan lokal dengan Postgres via Docker (`07-LOCAL-DEVELOPMENT.md`).

**Definition of done**: dev bisa clone repo, ikuti `07-LOCAL-DEVELOPMENT.md`, dan
berhasil buka `/admin` di localhost.

## Fase 1 — Data Model & Admin Panel Dasar

- Implementasi semua collection dari `04-DATA-MODEL.md`: `Users`, `Categories`,
  `Media`, `Courses`, `Modules`, `Lessons`, `Progress`, `Posts`.
- Terapkan access control per role sesuai tabel di `10-FEATURE-ADMIN-DASHBOARD.md`.
- Jalankan migration awal, buat beberapa dummy data lewat admin panel untuk testing.

**Definition of done**: admin bisa CRUD semua collection lewat `/admin`, access
control terverifikasi (user `student` tidak bisa akses fitur admin).

## Fase 2 — Frontend Publik: Katalog Course

- Halaman `/courses` (listing + filter kategori), `/courses/[slug]` (detail),
  `/lessons/[slug]` (konten lesson).
- Render Lexical richText → HTML dengan syntax highlighting untuk code block.
- Landing page `/` dengan highlight course & kategori.

**Definition of done**: pengunjung anonim bisa browse & baca seluruh course
published tanpa login.

## Fase 3 — Auth & Progress Tracking

- Halaman register/login (pakai auth bawaan Payload).
- Implementasi `POST /api/progress` dan `getCourseProgress()` sesuai
  `09-FEATURE-PROGRESS-TRACKING.md`.
- Halaman `/my-learning` dengan progress bar per course.

**Definition of done**: user bisa daftar, login, tandai lesson selesai, dan lihat
persentase progress yang akurat.

## Fase 4 — Blog + Giscus

- Implementasi collection `Posts` (sudah ada dari Fase 1), halaman `/blog` dan
  `/blog/[slug]`.
- Setup Giscus sesuai `08-FEATURE-BLOG.md`, pasang `GiscusComments.tsx`.
- Pasang `seoPlugin`, sitemap dinamis termasuk blog post.

**Definition of done**: artikel blog published bisa dibaca publik, komentar Giscus
berfungsi, meta tag SEO terisi dari admin panel.

## Fase 5 — Code Sandbox (Judge0)

- Setup Judge0 stack lokal untuk development.
- Implementasi `CodeSandbox.tsx`, API route proxy (`11-FEATURE-CODE-SANDBOX.md`).
- Terapkan rate limiting & resource limit sebelum dianggap selesai.

**Definition of done**: lesson dengan `hasSandbox: true` bisa eksekusi kode
Python/JS dasar dan menampilkan output dengan aman (sudah lewat rate limit).

## Fase 6 — Lab Cybersecurity (CTFd)

- Setup CTFd stack lokal, buat 2-3 challenge contoh.
- Tambahkan link "Buka Lab" di lesson cybersecurity mengarah ke `ctf.bariskode.org`.

**Definition of done**: user bisa akses CTFd dari link di materi, register akun
terpisah, submit flag untuk challenge contoh.

## Fase 7 — Deployment Production

- Provision VM Oracle sesuai `14-DEPLOYMENT-ORACLE-VM.md`.
- Setup Cloudflare sesuai `13-DEPLOYMENT-CLOUDFLARE.md`.
- Deploy stack penuh lewat `docker-compose.yml`, jalankan migration production.

**Definition of done**: bariskode.org live dengan HTTPS valid, semua fitur dari
fase 1-6 berfungsi di production.

## Fase 8 — CI/CD

- Setup `ci.yml` dan `deploy.yml` sesuai `15-CICD.md`.
- Set GitHub Secrets, uji auto-deploy dengan PR percobaan.

**Definition of done**: push ke `main` otomatis ter-deploy ke VM tanpa intervensi
manual.

## Fase 9 — Security Hardening & Launch Checklist

- Jalankan seluruh checklist di `16-SECURITY-CHECKLIST.md`.
- Setup backup otomatis & uji restore.
- Review final access control & rate limiting.

**Definition of done**: semua item checklist tercentang, platform siap diumumkan
publik.

---

## Fase Lanjutan (Backlog, di luar v1)

Dicatat di sini supaya tidak hilang, tapi **tidak dikerjakan sampai v1 stabil**:

- Sertifikat penyelesaian course (generate PDF otomatis).
- Search full-text (Meilisearch/Typesense self-hosted).
- SSO antara Payload dan CTFd.
- Multi-bahasa (i18n) untuk konten.
- Quiz builder terintegrasi (bukan hanya `score` manual di Progress).
- Notifikasi email (course baru, reminder progress).
