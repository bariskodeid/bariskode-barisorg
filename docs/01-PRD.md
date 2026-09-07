# 01. Product Requirements Document (PRD)

## Visi

bariskode.org adalah platform pembelajaran **open source** berbahasa Indonesia yang
menyediakan materi terstruktur untuk programming, database, data science, dan
cybersecurity — lengkap dengan lab praktik langsung di browser (code sandbox & CTF).

Platform ini sendiri dibangun sebagai proyek open source: siapa pun bisa berkontribusi
materi maupun kode lewat GitHub.

## Target Pengguna

- **Pemula–menengah** yang belajar programming/data/security secara mandiri.
- **Kontributor materi** (instruktur relawan) yang menulis course & artikel blog.
- **Admin platform** yang mengelola konten, user, dan melihat statistik penggunaan.

## Fitur Inti (v1)

1. **Katalog course terstruktur** — Course → Module → Lesson, dikelompokkan per
   kategori (Programming, Database, Data Science, Cybersecurity, dst).
2. **Progress tracking** — user login bisa menandai lesson selesai, melihat persentase
   penyelesaian per course di halaman "Belajar Saya".
3. **Admin dashboard** — CRUD course/lesson, manajemen user & role, statistik dasar
   (jumlah user aktif, completion rate, course terpopuler).
4. **Blog** — artikel programming/tutorial pendek, dengan komentar via Giscus
   (berbasis GitHub Discussions).
5. **Code sandbox** — lesson programming punya editor kode interaktif yang bisa
   dieksekusi langsung (via Judge0), tanpa install apa pun di sisi user.
6. **Lab cybersecurity** — challenge hands-on (CTF-style) via CTFd, terhubung dari
   materi cybersecurity.
7. **Autentikasi & role** — role `student`, `instructor`, `admin` dengan hak akses
   berbeda di admin panel.

## Non-Goals (v1)

Fitur berikut **sengaja tidak** masuk v1, didaftar di `17-ROADMAP.md` sebagai fase
lanjutan bila dibutuhkan:

- Pembayaran / course berbayar.
- Aplikasi mobile native.
- Live class / cohort dengan jadwal.

Update: sertifikat otomatis, quiz builder, dan notifikasi email sudah
diimplementasikan (Fase 10, lihat `17-ROADMAP.md`) meski awalnya dicatat di
sini sebagai kandidat "belakangan". Soal bahasa: **konten** (course/lesson/
blog) tetap fokus Bahasa Indonesia seperti keputusan awal — yang berubah
hanya UI/interface (nav, tombol, label) yang sekarang punya toggle
Indonesia/English, TIDAK menerjemahkan konten. Lihat
`docs/20-FEATURE-I18N-UI.md`.

## Prinsip Desain

- **Content-first**: konten (course, lesson, blog) adalah struktur data utama,
  bukan tempelan di atas sistem lain.
- **Self-hosted & free-tier friendly**: seluruh stack harus bisa jalan gratis di
  awal (lihat `03-TECH-STACK.md`), tanpa vendor lock-in.
- **Open source dari hari pertama**: kode di GitHub publik, lisensi MIT untuk kode.

## Metrik Sukses (indikatif, bukan target keras)

- Jumlah course & lesson published.
- Completion rate rata-rata per course.
- Jumlah kontributor eksternal (PR ke repo).
- Traffic blog sebagai kanal akuisisi user baru ke course.
