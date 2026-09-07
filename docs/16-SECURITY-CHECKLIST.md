# 16. Security Checklist

## Sebelum Launch (Production Readiness)

- [ ] Semua secret (`PAYLOAD_SECRET`, `CTFD_SECRET_KEY`, password DB) adalah string
      acak unik, **bukan** nilai default/contoh dari dokumen ini.
- [ ] File `.env` tidak pernah ter-commit ke git (`.gitignore` sudah benar,
      cek riwayat commit tidak pernah bocor).
- [ ] SSL/TLS mode Cloudflare di **Full (strict)**, bukan "Flexible" (yang rentan
      MITM antara Cloudflare↔origin).
- [ ] Hanya port 80/443 yang terbuka ke internet di Security List Oracle & `ufw`
      di VM — Postgres, Judge0 internal, CTFd DB **tidak** exposed publik.
- [ ] Rate limiting aktif untuk `/api/progress` dan `/api/sandbox` (cegah abuse).
- [ ] Judge0 API tidak bisa diakses langsung dari luar (hanya lewat proxy Next.js).
- [ ] Resource limit (CPU/memory) diset di Judge0 config untuk tiap submission.
- [ ] Access control tiap collection Payload sudah diuji: user `student` tidak bisa
      baca/tulis data user lain, tidak bisa akses collection admin-only.
- [ ] Backup database (Postgres utama + CTFd) berjalan otomatis & tersimpan di
      lokasi terpisah dari VM (lihat `14-DEPLOYMENT-ORACLE-VM.md`).
- [ ] `robots.txt` dan `sitemap.xml` sudah benar — halaman `/admin` di-disallow
      dari crawler.
- [ ] Header keamanan dasar aktif (CSP, X-Frame-Options, dst) — bisa diset di
      `next.config.ts` atau lewat Caddy.
- [ ] Dependency audit (`pnpm audit`) tidak ada kerentanan critical yang belum
      di-patch.

## Berkala (Setelah Live)

- [ ] Update OS VM (`apt update && apt upgrade`) rutin, minimal bulanan.
- [ ] Update image Docker (Postgres, Judge0, CTFd, Caddy) mengikuti rilis keamanan.
- [ ] Rotasi `PAYLOAD_SECRET`/`CTFD_SECRET_KEY` jika ada indikasi kebocoran.
- [ ] Review log akses admin panel secara berkala untuk aktivitas mencurigakan.
- [ ] Uji restore dari backup secara periodik — backup yang tidak pernah dites
      restore-nya bukan backup yang bisa diandalkan.
- [ ] Pantau kuota resource VM (`docker stats`, uptime, disk usage) supaya tidak
      kena surprise saat traffic naik.

## Khusus Lab Cybersecurity (CTFd)

- [ ] Tidak ada challenge yang menyentuh infrastruktur produksi nyata — semua
      environment challenge terisolasi & disposable.
- [ ] Rate limiting login CTFd aktif untuk cegah brute force.
- [ ] Auth CTFd terpisah dari Payload — kebocoran salah satu tidak otomatis
      membuka yang lain.
