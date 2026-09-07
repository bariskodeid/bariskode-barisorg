# 07. Local Development Setup

## Prasyarat

- Node.js 20+ dan `pnpm` (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker & Docker Compose (untuk menjalankan Postgres lokal)
- Git

## Langkah Setup

1. **Clone repo & masuk ke folder aplikasi**
   ```bash
   git clone https://github.com/<username>/bariskode.git
   cd bariskode/apps/web
   ```

2. **Jalankan Postgres lokal** (pakai `infra/docker-compose.yml`, cukup service `postgres` saja untuk dev)
   ```bash
   docker compose -f ../../infra/docker-compose.yml up -d postgres
   ```

3. **Salin environment variables**
   ```bash
   cp .env.example .env
   # isi DATABASE_URI mengarah ke postgres lokal (localhost, bukan hostname docker "postgres")
   # DATABASE_URI=postgres://bariskode:password@localhost:5432/bariskode
   # generate PAYLOAD_SECRET: openssl rand -base64 32
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Jalankan dev server**
   ```bash
   pnpm dev
   ```
   Next.js jalan di `http://localhost:3000`, admin panel Payload otomatis tersedia
   di `http://localhost:3000/admin`.

6. **Buat user admin pertama**
   Buka `http://localhost:3000/admin`, Payload akan otomatis menampilkan form
   "Create your first user" — buat akun dengan `role: admin`.

## Menjalankan Judge0 & CTFd Secara Lokal (opsional)

Untuk pengembangan fitur sandbox/lab, tidak wajib menjalankan Judge0/CTFd penuh
di lokal setiap saat — gunakan hanya saat mengerjakan fitur terkait:

```bash
docker compose -f infra/docker-compose.yml up -d judge0-server judge0-workers judge0-redis judge0-db
docker compose -f infra/docker-compose.yml up -d ctfd ctfd-db ctfd-redis
```

Lihat detail konfigurasi di `11-FEATURE-CODE-SANDBOX.md` dan
`12-FEATURE-CYBERSECURITY-LABS.md`.

## Perintah Umum

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Jalankan dev server dengan hot reload |
| `pnpm build` | Build production |
| `pnpm lint` | Jalankan ESLint |
| `pnpm typecheck` | Cek TypeScript tanpa emit |
| `pnpm payload migrate:create` | Buat migration schema baru setelah ubah collection |
| `pnpm payload migrate` | Jalankan migration ke database |

## Troubleshooting Umum

- **Error koneksi database saat `pnpm dev`**: pastikan container `postgres` sudah
  `healthy` (`docker compose ps`) sebelum menjalankan Next.js.
- **Admin panel blank/error setelah ubah collection**: hapus cache `.next` folder
  lalu restart dev server.
