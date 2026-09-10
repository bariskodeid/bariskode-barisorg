# 22. Panduan Deployment Lengkap

Dokumen ini menggabungkan seluruh langkah deployment dari VM provisioning sampai
production-ready dalam satu panduan praktis. Untuk detail spesifik masing-masing
area, lihat dokumen terkait yang direferensikan.

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Provisioning VM](#2-provisioning-vm)
3. [Setup Awal VM](#3-setup-awal-vm)
4. [Konfigurasi DNS & Cloudflare](#4-konfigurasi-dns--cloudflare)
5. [Setup Environment Variables](#5-setup-environment-variables)
6. [Deploy Stack](#6-deploy-stack)
7. [Post-Deploy Tasks](#7-post-deploy-tasks)
8. [CI/CD dengan GitHub Actions](#8-cicd-dengan-github-actions)
9. [Monitoring & Maintenance](#9-monitoring--maintenance)
10. [Backup & Restore](#10-backup--restore)
11. [Troubleshooting](#11-troubleshooting)
12. [Security Checklist](#12-security-checklist)

---

## 1. Prasyarat

### Akun & Resource

- **Oracle Cloud account** (atau VPS provider lain) — Always Free tier cukup
  untuk MVP
- **Domain name** (mis. `bariskode.org`) — bisa beli di registrar mana pun
- **Cloudflare account** (gratis) — untuk DNS, CDN, SSL, proteksi DDoS
- **GitHub account** — untuk repo source code & GitHub Actions

### Resource Minimum VM

| Komponen | Minimum | Rekomendasi |
|----------|---------|-------------|
| CPU | 2 core (ARM) | 2 OCPU Ampere |
| RAM | 4 GB | 12 GB (Always Free quota) |
| Storage | 20 GB | 50 GB (dari kuota 200GB block) |
| Network | 1 Public IPv4 | — |

### Software di VM

- Ubuntu 24.04 LTS (ARM64 untuk Oracle Ampere)
- Docker Engine + Docker Compose plugin
- Git

---

## 2. Provisioning VM

### Oracle Cloud (Recommended — Always Free)

1. Login ke [cloud.oracle.com](https://cloud.oracle.com)
2. Compute → Instances → **Create Instance**
3. Konfigurasi:
   - **Name**: `bariskode-prod`
   - **Image**: Ubuntu 24.04 LTS (ARM64)
   - **Shape**: VM.Standard.A1.Flex
     - OCPU: **2** (atau sisakan 1 untuk service lain)
     - RAM: **12 GB** (atau sesuai kuota)
   - **Storage**: 50 GB boot volume
   - **Networking**: buat Virtual Cloud Network (VCN) baru dengan Internet Gateway

4. **Security List** — buka port:
   - `80/tcp` (HTTP)
   - `443/tcp` (HTTPS)
   - `22/tcp` (SSH — bisa dibatasi ke IP tertentu)

5. Catat **Public IPv4** yang diberikan — ini yang akan dipakai di DNS

> **Catatan**: kuota Always-Free ARM per pertengahan 2026 adalah 2 OCPU / 12 GB
> RAM total. Jangan asumsikan angka lama dari tutorial di internet.

### VPS Lain (Non-Oracle)

Pastikan:
- OS: Ubuntu 24.04 LTS
- Port 80 & 443 terbuka ke internet
- Akses SSH dengan key-based authentication

---

## 3. Setup Awal VM

SSH ke VM:

```bash
ssh ubuntu@<IP_VM>
```

### 3.1 Update Sistem

```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

Verifikasi:

```bash
docker --version
docker compose version
```

### 3.3 Setup Firewall (Defense-in-Depth)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

> **Penting**: ini lapisan kedua. Oracle Cloud Security List adalah lapisan
> pertama. Keduanya harus mengizinkan port 80/443.

### 3.4 Setup Swap (untuk VM RAM ≤ 4GB)

Kalau VM punya RAM 4GB atau kurang, jalankan:

```bash
sudo bash infra/setup-swap.sh 4G
```

Script ini:
- Membuat swap file 4GB
- Set `vm.swappiness=10` (swap jadi jaring pengaman, bukan prioritas)
- Idempotent — aman dijalankan ulang

Untuk VM ≥ 8GB RAM, skip langkah ini.

### 3.5 Clone Repo

```bash
cd ~
git clone https://github.com/bariskodeid/bariskode-barisorg.git bariskode
cd bariskode
```

---

## 4. Konfigurasi DNS & Cloudflare

> Detail lengkap: `docs/13-DEPLOYMENT-CLOUDFLARE.md`

### 4.1 Tambah Situs ke Cloudflare

1. Login ke [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Add a Site** → masukkan domain (`bariskode.org`)
3. Pilih plan **Free**
4. Cloudflare akan memberikan **2 nameserver** (format `xxx.ns.cloudflare.com`)

### 4.2 Ubah Nameserver di Registrar

Di registrar domain (tempat beli domain), ubah nameserver ke yang diberikan
Cloudflare. Propagasi bisa memakan waktu hingga 24 jam.

### 4.3 Buat DNS Records

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | `@` | `<IP publik VM>` | Proxied (orange cloud) |
| A | `www` | `<IP publik VM>` | Proxied |
| A | `ctf` | `<IP publik VM>` | Proxied |

Semua diarahkan ke IP VM yang sama — Caddy di dalam VM yang routing berdasarkan
subdomain.

### 4.4 SSL/TLS Mode

SSL/TLS → Overview → set ke **Full (strict)**

> Jangan pakai "Flexible" — rentan MITM antara Cloudflare↔origin.

### 4.5 Caching Rules

- Default caching level cukup untuk aset statis Next.js
- Tambahkan **Cache Rule** untuk `bariskode.org/_next/static/*`:
  - Cache Level: **Cache Everything**
  - Edge TTL: **1 month** (aset ini sudah content-hashed oleh Next.js)
- **Jangan cache** `/admin/*` dan `/api/*`

### 4.6 Proteksi Tambahan (Gratis)

- **WAF** → Security → WAF → aktifkan managed rules
- **Bot Fight Mode** → Security → Bots → aktifkan
- **Rate Limiting** → Security → WAF → Rate limiting rules

---

## 5. Setup Environment Variables

### 5.1 Generate Secret Acak

```bash
# Jalankan di VM atau local — hasilnya dipakai di .env
openssl rand -base64 32
```

Buat 3 secret berbeda untuk:
- `PAYLOAD_SECRET`
- `CTFD_SECRET_KEY`
- `POSTGRES_PASSWORD` (dan `CTFD_DB_PASSWORD`)

### 5.2 `infra/.env`

```bash
cp infra/.env.example infra/.env
```

Edit `infra/.env`:

```bash
# --- Postgres utama (Payload) ---
POSTGRES_USER=bariskode
POSTGRES_PASSWORD=<random_32_chars>    # Ganti!
POSTGRES_DB=bariskode

# --- CTFd ---
CTFD_SECRET_KEY=<random_32_chars>      # Ganti!
CTFD_DB_USER=ctfd
CTFD_DB_PASSWORD=<random_32_chars>     # Ganti! Bisa sama dengan POSTGRES_PASSWORD
CTFD_DB_NAME=ctfd

# --- Domain ---
DOMAIN=bariskode.org
CTF_SUBDOMAIN=ctf.bariskode.org
```

### 5.3 `apps/web/.env`

```bash
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env`:

```bash
# --- Payload / Database ---
# Production: host = "postgres" (nama service di Docker network)
DATABASE_URI=postgres://bariskode:<POSTGRES_PASSWORD>@postgres:5432/bariskode
PAYLOAD_SECRET=<random_32_chars>       # Sama dengan di infra/.env

# --- Next.js ---
NEXT_PUBLIC_SERVER_URL=https://bariskode.org

# --- Giscus (opsional, bisa diisi nanti) ---
NEXT_PUBLIC_GISCUS_REPO=bariskodeid/bariskode-barisorg
NEXT_PUBLIC_GISCUS_REPO_ID=<dari giscus.app>
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=<dari giscus.app>

# --- Judge0 (code sandbox) ---
JUDGE0_API_URL=http://judge0-server:2358
JUDGE0_API_KEY=                         # Kosongkan kalau tidak pakai auth

# --- CTFd ---
NEXT_PUBLIC_CTF_URL=https://ctf.bariskode.org

# --- Email (opsional) ---
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@bariskode.org
```

### 5.4 `infra/judge0/judge0.conf`

```bash
cp infra/judge0/judge0.conf.example infra/judge0/judge0.conf
```

Edit yang perlu diubah:

```bash
# Worker count — turunkan untuk VM 4GB RAM
COUNT=1

# Redis auth
REDIS_PASSWORD=<random_32_chars>

# Postgres
POSTGRES_PASSWORD=<random_32_chars>

# Resource limits (sudah di-set default, sesuaikan jika perlu)
CPU_TIME_LIMIT=5
MEMORY_LIMIT=128000
WALL_TIME_LIMIT=10
```

> **Pastikan** `REDIS_PASSWORD` di `judge0.conf` sama dengan yang dipakai
> service `judge0-redis` di docker-compose.yml.

### 5.5 Pastikan `.env` Tidak Ter-Commit

```bash
cat .gitignore | grep -E "\.env$"
# Harus ada: .env
```

---

## 6. Deploy Stack

### 6.1 Build & Jalankan Semua Service

```bash
cd ~/bariskode
docker compose -f infra/docker-compose.yml up -d --build
```

Ini akan:
1. Build image `web` (Next.js + Payload) dari Dockerfile
2. Pull image Postgres, Caddy, Judge0, CTFd, MariaDB, Redis
3. Jalankan semua service

### 6.2 Verifikasi Status

```bash
docker compose -f infra/docker-compose.yml ps
```

Semua service harus **running** atau **healthy**. Service yang diawali `web-migrate`
dan `web-script` boleh exited — itu on-demand service.

### 6.3 Cek Log Jika Error

```bash
# Log semua service
docker compose -f infra/docker-compose.yml logs -f

# Log service tertentu
docker compose -f infra/docker-compose.yml logs -f web
docker compose -f infra/docker-compose.yml logs -f postgres
docker compose -f infra/docker-compose.yml logs -f caddy
```

### 6.4 Jalankan Migration Database

```bash
docker compose -f infra/docker-compose.yml run --rm web-migrate migrate
```

> **Penting**: pakai service `web-migrate` (bukan `exec web`).
> Image `web` yang jalan (final stage Dockerfile, `output: standalone`) ramping
> dan tidak menyertakan pnpm/source lengkap — tidak bisa menjalankan CLI Payload.
> Service `web-migrate` pakai stage `builder` yang masih punya everything.

### 6.5 Verifikasi Aplikasi

Buka browser:
- `https://bariskode.org` — halaman utama
- `https://bariskode.org/admin` — admin panel Payload
- `https://ctf.bariskode.org` — CTFd (lab cybersecurity)

---

## 7. Post-Deploy Tasks

### 7.1 Seed CTFd (Challenge Contoh)

```bash
docker compose -f infra/docker-compose.yml up -d ctfd ctfd-db ctfd-redis

# Tunggu beberapa detik sampai CTFd siap, lalu:
CTFD_ADMIN_PASSWORD=<password> infra/ctfd/seed-ctfd.sh
```

Ini akan:
- Menyelesaikan setup wizard CTFd (nama CTF, akun admin)
- Membuat 3 challenge contoh

> Kurikulum lab lengkap di luar 3 challenge ini adalah keputusan konten terpisah.
> Lihat `docs/12-FEATURE-CYBERSECURITY-LABS.md`.

### 7.2 Setup Cron Jobs

#### Backup Database

```bash
sudo tee /etc/cron.d/bariskode-backup << 'EOF'
# Backup harian jam 3 pagi
0 3 * * * root BACKUP_DIR=/backups /path/to/bariskode/infra/backup.sh >> /var/log/bariskode-backup.log 2>&1
EOF
sudo chmod 644 /etc/cron.d/bariskode-backup
```

#### Email Reminder (Opsional)

Kalau SMTP sudah dikonfigurasi:

```bash
sudo tee /etc/cron.d/bariskode-emails << 'EOF'
# Reminder progress mandek, jam 8 pagi
0 8 * * * root cd /path/to/bariskode && docker compose -f infra/docker-compose.yml run --rm web-script scripts/send-progress-reminders.ts >> /var/log/bariskode-reminders.log 2>&1
EOF
sudo chmod 644 /etc/cron.d/bariskode-emails
```

### 7.3 Aktifkan Giscus (Komentar Blog)

1. Buat GitHub repo publik untuk proyek ini
2. Aktifkan **Discussions** di repo settings
3. Install [Giscus app](https://github.com/apps/giscus)
4. Buka `https://giscus.app`, ikuti setup
5. Isi `NEXT_PUBLIC_GISCUS_*` di `apps/web/.env`
6. Rebuild: `docker compose -f infra/docker-compose.yml up -d --build web`

### 7.4 Setup Backup Storage Eksternal

Script `infra/backup.sh` hanya membuat dump lokal. Untuk production, sinkronkan
ke storage terpisah:

**Oracle Object Storage** (gratis 10GB):

```bash
# Install OCI CLI
sudo apt install -y python3-oci

# Config (ikuti wizard)
oci setup config

# Contoh sync backup ke Object Storage
rclone sync /backups oracle-cloud:bariskode-backups/backups/
```

**Atau rclone ke S3-compatible storage**:

```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Config
rclone config
# Pilih S3-compatible (Backblaze B2, Wasabi, dll)
```

Tambahkan ke cron setelah backup dump:

```bash
0 4 * * * root rclone sync /backups remote:bariskode-backups/ >> /var/log/bariskode-backup-sync.log 2>&1
```

---

## 8. CI/CD dengan GitHub Actions

> Detail: `docs/15-CICD.md`

### 8.1 Buat Deploy Key

```bash
ssh-keygen -t ed25519 -f deploy_key -C "github-actions-deploy"
```

- Tempel `deploy_key.pub` ke `~/.ssh/authorized_keys` di VM
- Tempel isi `deploy_key` (private) ke GitHub Secrets

### 8.2 Set GitHub Secrets

Di repo GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Nilai |
|--------|-------|
| `VM_HOST` | IP publik VM |
| `VM_USER` | `ubuntu` |
| `VM_SSH_KEY` | Isi file `deploy_key` (private key, multi-line) |

### 8.3 Buat Workflow Files

Buat folder `.github/workflows/` di repo:

#### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/web
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: apps/web/pnpm-lock.yaml

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
        env:
          DATABASE_URI: postgres://dummy:dummy@localhost:5432/dummy
          PAYLOAD_SECRET: ci-dummy-secret-for-build-only
```

#### `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            cd ~/bariskode
            git pull origin main
            docker compose -f infra/docker-compose.yml up -d --build
            docker compose -f infra/docker-compose.yml run --rm web-migrate migrate
```

### 8.4 Strategi Branching

- `main` — selalu deployable, protected branch (require PR review + CI hijau)
- Feature branch → PR ke `main` → CI jalan otomatis → merge → auto-deploy
- Untuk perubahan berisiko (migration besar), pertimbangkan manual deploy dulu

### 8.5 Test Auto-Deploy

1. Buat branch `test-deploy`
2. Ubah sesuatu yang kecil (mis. README)
3. Push & buka PR
4. Pastikan CI hijau
5. Merge ke `main`
6. Cek VM — harusnya auto-deploy terjadi

---

## 9. Monitoring & Maintenance

### 9.1 Cek Status Service

```bash
docker compose -f infra/docker-compose.yml ps
docker stats --no-stream
```

### 9.2 Resource Usage

Alokasi kasar (VM 4GB RAM):

| Service | Memory Limit | Catatan |
|---------|-------------|---------|
| postgres | 400m | Database utama |
| web | 600m | Next.js + Payload |
| caddy | 96m | Reverse proxy |
| judge0-server | 200m | API server |
| judge0-workers | 700m | Eksekusi kode |
| judge0-db | 200m | Database Judge0 |
| judge0-redis | 48m | Cache Judge0 |
| ctfd | 400m | Lab cybersecurity |
| ctfd-db | 400m | Database CTFd |
| ctfd-redis | 48m | Cache CTFd |
| **Total** | **~3.1GB** | Sisa untuk OS/Docker |

Kalau VM ≥ 8GB, angka `mem_limit` boleh dihapus/dinaikkan di
`infra/docker-compose.yml`.

### 9.3 Cek Log Error

```bash
# Semua service
docker compose -f infra/docker-compose.yml logs --tail=100

# Service tertentu
docker compose -f infra/docker-compose.yml logs --tail=50 web
docker compose -f infra/docker-compose.yml logs --tail=50 postgres
```

### 9.4 Update OS VM

```bash
sudo apt update && sudo apt upgrade -y
# Reboot jika perlu
sudo reboot
```

Lakukan minimal bulanan.

### 9.5 Update Docker Images

```bash
cd ~/bariskode

# Pull image terbaru
docker compose -f infra/docker-compose.yml pull

# Rebuild & restart
docker compose -f infra/docker-compose.yml up -d --build
```

> **Catatan**: image `web` di-build dari source (bukan pull), jadi
> `docker compose pull` tidak mengubahnya. `--build` akan rebuild jika ada
> perubahan di Dockerfile atau source code.

### 9.6 Cek OOM Kill

```bash
# Cek apakah ada container yang pernah di-OOM-kill
docker inspect <container_name> | grep OOMKilled
```

Kalau iya, naikkan `mem_limit` service itu atau turunkan service lain.

---

## 10. Backup & Restore

### 10.1 Backup Manual

```bash
# Postgres utama
docker exec infra-postgres-1 pg_dump -U bariskode bariskode | gzip > backup-$(date +%F).sql.gz

# CTFd (MariaDB)
docker exec infra-ctfd-db-1 sh -c 'exec mariadb-dump -u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"' | gzip > ctfd-backup-$(date +%F).sql.gz
```

### 10.2 Backup Otomatis (Cron)

Sudah dikonfigurasi di langkah 7.2. Verifikasi:

```bash
sudo cat /etc/cron.d/bariskode-backup
```

### 10.3 Restore Postgres

```bash
# Stop aplikasi dulu supaya tidak ada write
docker compose -f infra/docker-compose.yml stop web

# Restore
gunzip -c /backups/bariskode-postgres-YYYY-MM-DD.sql.gz | \
  docker exec -i infra-postgres-1 psql -U bariskode -d bariskode

# Start ulang
docker compose -f infra/docker-compose.yml start web
```

### 10.4 Restore CTFd

```bash
docker compose -f infra/docker-compose.yml stop ctfd

gunzip -c /backups/bariskode-ctfd-YYYY-MM-DD.sql.gz | \
  docker exec -i infra-ctfd-db-1 mariadb -u root -p"$MARIADB_ROOT_PASSWORD" "$MARIADB_DATABASE"

docker compose -f infra/docker-compose.yml start ctfd
```

### 10.5 Penting: Test Restore

> **Backup yang belum pernah dites restore bukan backup yang bisa diandalkan.**

Test restore ke environment terpisah (mis. local dev) secara berkala.

---

## 11. Troubleshooting

### 11.1 Container Tidak Mau Start

```bash
# Cek log error
docker compose -f infra/docker-compose.yml logs <service_name>

# Cek apakah port sudah dipakai
sudo lsof -i :80
sudo lsof -i :443
```

### 11.2 `ECONNREFUSED` ke Postgres

**Local dev** (`pnpm dev`): host harus `localhost`
**Production** (Docker): host harus `postgres` (nama service)

Pastikan `DATABASE_URI` di `apps/web/.env` sesuai environment.

### 11.3 Website Tidak Aksesible

1. Cek DNS sudah mengarah ke IP VM:
   ```bash
   dig bariskode.org +short
   ```

2. Cek Caddy running:
   ```bash
   docker compose -f infra/docker-compose.yml logs caddy
   ```

3. Cek port 80/443 terbuka:
   ```bash
   sudo ufw status
   # Oracle: cek Security List di console
   ```

4. Cek SSL certificate:
   ```bash
   curl -I https://bariskode.org
   # Harus ada header: strict-transport-security
   ```

### 11.4 Judge0 Tidak Mau Start

Judge0 butuh `privileged: true`. Kalau environment memblokir privileged
container:

```bash
docker compose -f infra/docker-compose.yml logs judge0-server
# Akan ada error tentangprivileged mode
```

**Solusi**: jalankan di environment yang mengizinkan privileged container
(VM asli, bukan CI runner sandbox).

### 11.5 CTFd Setup Wizard Muncul Lagi

CTFd menyimpan state setup di database. Kalau database fresh (container
recreated), wizard muncul lagi. Jalankan seed ulang:

```bash
CTFD_ADMIN_PASSWORD=<password> infra/ctfd/seed-ctfd.sh
```

### 11.6 Migration Gagal

```bash
# Cek status migration
docker compose -f infra/docker-compose.yml run --rm web-migrate migrate:status

# Jalankan migration manual
docker compose -f infra/docker-compose.yml run --rm web-migrate migrate
```

### 11.7 Website Lambat

1. Cek resource usage:
   ```bash
   docker stats --no-stream
   free -h
   ```

2. Cek apakah swap terlalu sering dipakai (tanda RAM kurang):
   ```bash
   vmstat 1 5
   # Kolom si/so harusnya kecil (< 100)
   ```

3. Pertimbangkan upgrade RAM atau kurangi service (disable Judge0/CTFd dulu).

---

## 12. Security Checklist

> Detail: `docs/16-SECURITY-CHECKLIST.md`

### Sebelum Launch

- [ ] Semua secret (`PAYLOAD_SECRET`, `CTFD_SECRET_KEY`, password DB) adalah
      string acak unik, **bukan** nilai default/contoh
- [ ] File `.env` tidak ter-commit ke git
- [ ] SSL/TLS mode Cloudflare di **Full (strict)**
- [ ] Hanya port 80/443 terbuka ke internet
- [ ] Rate limiting aktif untuk `/api/progress` dan `/api/sandbox`
- [ ] Judge0 API tidak bisa diakses langsung dari luar
- [ ] Access control tiap collection Payload sudah diuji
- [ ] Backup database berjalan otomatis & tersimpan di lokasi terpisah
- [ ] `robots.txt` dan `sitemap.xml` sudah benar
- [ ] Header keamanan dasar aktif
- [ ] `pnpm audit` tidak ada kerentanan critical

### Berkala (Setelah Live)

- [ ] Update OS VM rutin (minimal bulanan)
- [ ] Update Docker images mengikuti rilis keamanan
- [ ] Rotasi secret jika ada indikasi kebocoran
- [ ] Review log akses admin panel secara berkala
- [ ] Uji restore dari backup secara periodik
- [ ] Pantau kuota resource VM

---

## Referensi

| Dokumen | Isi |
|---------|-----|
| `docs/13-DEPLOYMENT-CLOUDFLARE.md` | Detail DNS, CDN, SSL Cloudflare |
| `docs/14-DEPLOYMENT-ORACLE-VM.md` | Detail provisioning & resource VM |
| `docs/15-CICD.md` | Detail GitHub Actions workflow |
| `docs/16-SECURITY-CHECKLIST.md` | Checklist keamanan lengkap |
| `docs/06-ENVIRONMENT-VARIABLES.md` | Referensi semua env var |
| `docs/11-FEATURE-CODE-SANDBOX.md` | Konfigurasi Judge0 |
| `docs/12-FEATURE-CYBERSECURITY-LABS.md` | Konfigurasi CTFd |
| `docs/21-FEATURE-EMAIL-NOTIFICATIONS.md` | Setup email notifikasi |
