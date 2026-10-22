# 06. Environment Variables

## `apps/web/.env.example`

```bash
# --- Payload / Database ---
DATABASE_URI=postgres://bariskode:CHANGE_ME@postgres:5432/bariskode
PAYLOAD_SECRET=CHANGE_ME_random_string_min_32_chars

# --- Next.js ---
# Dipakai server (sitemap, link email, metadata Open Graph). PENTING: semua
# variabel NEXT_PUBLIC_* juga dibaca saat BUILD (bundle client & halaman
# statis seperti robots.txt). Image Docker production tidak membaca .env saat
# build — nilainya diambil dari ARG di apps/web/Dockerfile (default
# https://bariskode.org; domain lain: --build-arg NEXT_PUBLIC_SERVER_URL=...).
NEXT_PUBLIC_SERVER_URL=https://bariskode.org

# --- Giscus (dari giscus.app setelah aktifkan Discussions di repo) ---
# Komponen client: untuk image Docker production, isi lewat --build-arg saat
# `docker build` (lihat Dockerfile), bukan di .env.docker.
NEXT_PUBLIC_GISCUS_REPO=username/bariskode
NEXT_PUBLIC_GISCUS_REPO_ID=CHANGE_ME
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=CHANGE_ME

# --- Judge0 (code sandbox) ---
JUDGE0_API_URL=http://judge0-server:2358
JUDGE0_API_KEY= # kosongkan jika instance self-hosted tanpa auth di jaringan internal

# --- Email (opsional — kosongkan untuk skip kirim) ---
# Dipakai untuk notifikasi course baru published, reminder progress mandek,
# dan email lupa password (docs/21-FEATURE-EMAIL-NOTIFICATIONS.md). Selama
# SMTP_HOST kosong, halaman /forgot-password menampilkan pesan bahwa reset
# lewat email belum tersedia.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@bariskode.org

# --- Meilisearch (search, docs/25-FEATURE-SEARCH.md) ---
# Kosongkan MEILISEARCH_HOST untuk mematikan search: hook sinkronisasi index
# jadi no-op dan /api/search membalas "Search temporarily unavailable".
# Lokal: http://localhost:7700. Production: http://meilisearch:7700.
MEILISEARCH_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=CHANGE_ME_random_string_min_32_chars
```

## `infra/.env` (dipakai oleh docker-compose.yml)

```bash
# --- Postgres utama (Payload) ---
POSTGRES_USER=bariskode
POSTGRES_PASSWORD=CHANGE_ME
POSTGRES_DB=bariskode

# --- CTFd ---
CTFD_SECRET_KEY=CHANGE_ME_random_string
CTFD_DB_USER=ctfd
CTFD_DB_PASSWORD=CHANGE_ME
CTFD_DB_NAME=ctfd

# --- Domain (dipakai Caddyfile) ---
DOMAIN=bariskode.org
CTF_SUBDOMAIN=ctf.bariskode.org
```

## Aturan Pengelolaan Secret

- **Jangan pernah commit file `.env` asli** — hanya `.env.example` yang masuk git.
  Pastikan `.env` ada di `.gitignore`.
- `PAYLOAD_SECRET` dan `CTFD_SECRET_KEY` harus string acak minimal 32 karakter,
  generate dengan `openssl rand -base64 32`.
- Di production, simpan `.env` langsung di VM (bukan lewat CI variabel yang bisa
  ter-log), atau pakai GitHub Actions Secrets untuk env yang dibutuhkan saat deploy
  (lihat `15-CICD.md`).
- Rotasi `PAYLOAD_SECRET` akan meng-invalidate semua sesi login yang sedang aktif —
  lakukan di luar jam sibuk kalau platform sudah live.
