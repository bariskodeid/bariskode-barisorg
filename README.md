# Dokumentasi bariskode.org

Paket dokumentasi ini adalah spesifikasi lengkap untuk membangun **bariskode.org** —
platform pembelajaran open source untuk programming, database, data science, dan
cybersecurity — dari nol sampai production.

Dokumen ini dirancang untuk dikonsumsi oleh **Claude Code** sebagai acuan implementasi.
Ikuti urutan dokumen di bawah, terutama `17-ROADMAP.md` yang memecah pekerjaan jadi
fase-fase kecil yang bisa dieksekusi berurutan.

## Daftar Isi

| # | Dokumen | Isi |
|---|---------|-----|
| 1 | `01-PRD.md` | Visi produk, target user, fitur inti & non-goals |
| 2 | `02-ARCHITECTURE.md` | Arsitektur sistem, topologi infrastruktur, alur request |
| 3 | `03-TECH-STACK.md` | Keputusan stack teknologi & alasannya |
| 4 | `04-DATA-MODEL.md` | Skema lengkap semua Payload collections (kode siap pakai) |
| 5 | `05-REPO-STRUCTURE.md` | Struktur folder monorepo |
| 6 | `06-ENVIRONMENT-VARIABLES.md` | Referensi semua env var + `.env.example` |
| 7 | `07-LOCAL-DEVELOPMENT.md` | Cara setup environment development |
| 8 | `08-FEATURE-BLOG.md` | Spesifikasi fitur blog + integrasi Giscus |
| 9 | `09-FEATURE-PROGRESS-TRACKING.md` | Spesifikasi progress tracking user |
| 10 | `10-FEATURE-ADMIN-DASHBOARD.md` | Spesifikasi admin dashboard & RBAC |
| 11 | `11-FEATURE-CODE-SANDBOX.md` | Integrasi Judge0 untuk sandbox eksekusi kode |
| 12 | `12-FEATURE-CYBERSECURITY-LABS.md` | Integrasi CTFd untuk lab cybersecurity |
| 13 | `13-DEPLOYMENT-CLOUDFLARE.md` | Setup DNS, CDN, SSL via Cloudflare |
| 14 | `14-DEPLOYMENT-ORACLE-VM.md` | Provisioning VM & Docker Compose stack production |
| 15 | `15-CICD.md` | Pipeline CI/CD via GitHub Actions |
| 16 | `16-SECURITY-CHECKLIST.md` | Checklist keamanan sebelum & sesudah launch |
| 17 | `17-ROADMAP.md` | Rencana implementasi bertahap (fase 0–9) |
| — | `CONTRIBUTING.md` | Panduan kontribusi open source |

## Fakta Cepat

- **Domain**: bariskode.org
- **Stack utama**: Next.js 15 (App Router) + Payload CMS 3.x (embedded), PostgreSQL
- **Hosting**: Self-hosted di Oracle Cloud Always Free (ARM VM) + Cloudflare (DNS/CDN)
- **Lisensi kode**: MIT
- **Lisensi konten pembelajaran**: CC BY-SA 4.0 (rekomendasi — bisa disesuaikan)

## Cara Pakai dengan Claude Code

1. Buka repo kosong di terminal, taruh folder `docs/` ini di root repo.
2. Minta Claude Code membaca `17-ROADMAP.md` lalu mengerjakan Fase 0 terlebih dahulu.
3. Setiap fase mereferensikan dokumen detail terkait — Claude Code sebaiknya membaca
   dokumen yang direferensikan sebelum menulis kode untuk fase tersebut.
4. Setelah tiap fase selesai, jalankan checklist di `16-SECURITY-CHECKLIST.md` yang
   relevan sebelum lanjut ke fase berikutnya (terutama sebelum deployment).
