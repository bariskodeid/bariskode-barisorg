# 12. Fitur: Lab Cybersecurity (CTFd)

## Ringkasan

CTFd dijalankan sebagai **aplikasi terpisah** di subdomain `ctf.bariskode.org`,
bukan di-embed penuh ke dalam Next.js. Materi cybersecurity di bariskode.org
me-link ke challenge terkait di CTFd.

## Kenapa Dipisah, Bukan Di-embed

- CTFd punya sistem auth, scoring, dan isolasi challenge sendiri yang sudah matang —
  membangun ulang ini di Payload tidak perlu dan berisiko keamanan.
- Isolasi arsitektur: kalau ada masalah keamanan di lab CTF (yang secara sifat
  memang berurusan dengan kode/exploit "berbahaya"), dampaknya tidak langsung
  menyentuh database utama bariskode.org.

## Docker Compose (ringkasan)

Service: `ctfd` (app), `ctfd-db` (MariaDB, database CTFd terpisah dari Postgres
utama), `ctfd-redis` (cache/session). Gunakan `docker-compose.yml` resmi dari repo
CTFd (https://github.com/CTFd/CTFd) sebagai basis.

> Sama seperti Judge0, cek versi image terbaru di repo resmi saat implementasi.

## Integrasi dengan bariskode.org

- Lesson cybersecurity (collection `Lessons`) menyertakan link/tombol "Buka Lab"
  yang mengarah ke `https://ctf.bariskode.org/challenges#<challenge-id>`.
- User perlu **login terpisah** di CTFd (auth CTFd tidak di-share dengan Payload
  di v1) — cukup jelaskan di UI bahwa ini "ruang lab" terpisah.
- (Opsional, fase lanjutan) Single Sign-On antara Payload dan CTFd lewat OAuth2
  provider custom — CTFd mendukung OAuth, tapi ini kompleksitas tambahan, taruh di
  roadmap fase lanjutan (lihat `17-ROADMAP.md`), bukan v1.

## Keamanan Lab — WAJIB dibaca sebelum production

- **Jangan pernah** menjalankan challenge yang butuh akses ke infrastruktur nyata
  bariskode.org (database production, VM yang sama tanpa isolasi). Semua challenge
  harus berjalan di container/environment yang sepenuhnya terpisah & disposable.
- Aktifkan **rate limiting login** CTFd bawaan untuk mencegah brute force akun.
- Simpan `CTFD_SECRET_KEY` yang kuat & unik, berbeda dari `PAYLOAD_SECRET`.
- Backup database CTFd terpisah dari backup database utama (lihat
  `16-SECURITY-CHECKLIST.md`).
- Pertimbangkan resource limit per-container challenge (CPU/memory quota di Docker)
  supaya satu challenge yang "berat" tidak mengganggu layanan lain di VM yang sama.

## Roadmap Konten Lab

Untuk v1, cukup 3-5 challenge dasar per kategori (mis. web exploitation dasar,
cryptography dasar) sebagai bukti konsep — daftar lengkap kurikulum lab adalah
keputusan konten, didokumentasikan terpisah dari dokumen teknis ini.
