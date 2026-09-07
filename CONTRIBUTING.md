# Contributing to bariskode.org

Terima kasih sudah tertarik berkontribusi! Proyek ini terbuka untuk kontribusi
kode maupun materi pembelajaran.

## Jenis Kontribusi

- **Kode**: perbaikan bug, fitur baru, peningkatan performa.
- **Konten**: course, lesson, artikel blog baru — lewat admin panel (untuk
  kontributor terpercaya) atau proposal lewat Issue terlebih dahulu.
- **Dokumentasi**: perbaikan dokumen di folder `docs/`.

## Alur Kontribusi Kode

1. Fork repo, buat branch dari `main`: `git checkout -b fitur/nama-fitur`.
2. Ikuti `docs/07-LOCAL-DEVELOPMENT.md` untuk setup environment.
3. Pastikan `pnpm lint`, `pnpm typecheck`, dan `pnpm build` lolos sebelum membuat PR.
4. Tulis pesan commit yang jelas (format bebas, tapi deskriptif — mis.
   `fix: perbaiki perhitungan progress course`).
5. Buka Pull Request ke `main`, jelaskan perubahan & alasannya.
6. Tunggu review — CI (`ci.yml`) harus hijau sebelum bisa di-merge.

## Konvensi Kode

- TypeScript strict mode, hindari `any` kecuali benar-benar diperlukan.
- Ikuti struktur collection & pola access control yang sudah ada di
  `docs/04-DATA-MODEL.md` — jangan buat pola akses baru tanpa diskusi.
- Komponen React: functional component + hooks, styling via Tailwind CSS.

## Kontribusi Konten Pembelajaran

- Course/lesson baru diajukan lewat Issue dengan label `content-proposal`,
  jelaskan topik, target level (pemula/menengah/lanjutan), dan outline singkat.
- Konten pembelajaran dilisensikan **CC BY-SA 4.0** — dengan berkontribusi,
  kamu setuju materi bisa digunakan ulang & dimodifikasi pihak lain dengan
  atribusi yang sama.

## Kode Etik

Bersikap hormat dan konstruktif dalam diskusi Issue, PR, maupun forum komunitas
(Giscus di blog). Kritik terhadap kode/konten dipersilakan, serangan personal
tidak ditoleransi.

## Lisensi

Kode di repo ini dilisensikan **MIT** (lihat `LICENSE`). Dengan membuka PR, kamu
setuju kontribusimu dilisensikan di bawah lisensi yang sama.
