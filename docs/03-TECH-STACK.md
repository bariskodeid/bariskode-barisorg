# 03. Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | **Next.js 15** (App Router) | SSR/ISR untuk konten SEO-friendly, ekosistem React matang, integrasi native dengan Payload 3.x |
| Styling | **Tailwind CSS** | Cepat untuk membangun UI konsisten, mudah dikustomisasi untuk identitas visual bariskode.org |
| CMS / Backend | **Payload CMS 3.x** (embedded di Next.js) | Admin dashboard auto-generated, TypeScript-native, auth & access control bawaan, open source (MIT) |
| Rich text editor | **Lexical** (bawaan Payload) | Mendukung code block dengan syntax highlighting — penting untuk konten programming |
| Database | **PostgreSQL 16** | Adapter resmi Payload, self-hosted via Docker, gratis, teruji untuk beban production kecil–menengah |
| Auth | **Payload built-in auth** | Tidak perlu layanan auth terpisah; role-based access control langsung terintegrasi dengan collections |
| Komentar blog | **Giscus** | Berbasis GitHub Discussions, gratis, cocok untuk audiens programmer yang sudah punya akun GitHub |
| SEO | **`@payloadcms/plugin-seo`** | Field meta title/description/OG image terkelola dari admin panel, tanpa hardcode di kode |
| Code sandbox | **Judge0 CE** (self-hosted) | Eksekusi kode multi-bahasa (bukan cuma JS), open source, terkontrol penuh |
| Lab cybersecurity | **CTFd** (self-hosted) | Platform CTF open source paling matang, scoring & isolasi challenge sudah tersedia |
| Reverse proxy | **Caddy** | Auto-HTTPS, konfigurasi sederhana, ringan untuk VM kecil |
| DNS / CDN | **Cloudflare (Free)** | DNS cepat, CDN global, proteksi DDoS gratis |
| Hosting | **Oracle Cloud Always Free (ARM)** | VM gratis permanen (2 OCPU/12GB pada kuota terbaru), cukup untuk MVP |
| Container orchestration | **Docker Compose** | Cukup untuk single-VM deployment, mudah dipahami & di-maintain |
| CI/CD | **GitHub Actions** | Gratis untuk repo publik, terintegrasi langsung dengan GitHub tempat kode di-host |
| Package manager | **pnpm** | Lebih hemat disk & lebih cepat dibanding npm/yarn untuk monorepo |

## Lisensi

- **Kode aplikasi**: MIT License.
- **Konten pembelajaran** (course, lesson, artikel blog): rekomendasi **CC BY-SA 4.0**
  supaya materi bisa dipakai ulang/dimodifikasi orang lain dengan atribusi, sekaligus
  menjaga turunannya tetap terbuka. Ini keputusan produk, bukan teknis — sesuaikan
  kalau ada preferensi lain.

## Hal yang Sengaja Dihindari di v1

- **Managed BaaS** (Supabase dkk) sebagai database utama — dipakai opsional hanya
  kalau nanti ingin lepas dari maintenance Postgres sendiri (lihat catatan trade-off
  di `02-ARCHITECTURE.md`).
- **Kubernetes** — overkill untuk single-VM deployment; Docker Compose cukup sampai
  ada kebutuhan scale-out nyata.
- **Headless CMS lain (Strapi, Contentful)** — sudah dibandingkan sebelumnya, Payload
  dipilih karena native TypeScript + jalan di dalam Next.js.
