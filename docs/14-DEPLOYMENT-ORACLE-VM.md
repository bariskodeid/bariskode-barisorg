# 14. Deployment: Oracle Cloud VM (Production)

## 1. Provisioning VM

1. Buat akun Oracle Cloud, masuk ke Compute → Instances → Create Instance.
2. Pilih shape **VM.Standard.A1.Flex** (Ampere ARM, Always Free eligible).
   > Catatan penting: per pertengahan 2026 kuota Always-Free ARM adalah **2 OCPU /
   > 12 GB RAM total** (turun dari 4 OCPU/24GB sebelumnya). Alokasikan sesuai itu —
   > jangan asumsikan angka lama dari tutorial di internet.
3. OS: **Ubuntu 24.04 LTS** (ARM64 image).
4. Storage: gunakan sebagian dari kuota 200GB block storage Always Free.
5. Pastikan **Public IPv4** dibuat, dan buka port di Security List / Network
   Security Group: **80 (HTTP)**, **443 (HTTPS)** saja dari internet. Port lain
   (Postgres, Judge0, CTFd internal) tidak perlu exposed publik — cukup diakses
   antar-container lewat Docker network internal.

## 2. Setup Awal VM

```bash
ssh ubuntu@<IP_VM>

# update sistem
sudo apt update && sudo apt upgrade -y

# install Docker & Docker Compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# firewall dasar (selain Security List Oracle)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 3. Clone Repo & Konfigurasi

```bash
git clone https://github.com/<username>/bariskode.git
cd bariskode
cp infra/.env.example infra/.env   # isi sesuai 06-ENVIRONMENT-VARIABLES.md
cp apps/web/.env.example apps/web/.env
```

## 4. `infra/docker-compose.yml`

```yaml
# infra/docker-compose.yml
version: '3.9'

services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
      - ctfd

  web:
    build: ../apps/web
    restart: unless-stopped
    env_file: ../apps/web/.env
    depends_on:
      - postgres
    expose:
      - '3000'

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file: .env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
      interval: 10s
      timeout: 5s
      retries: 5

  # --- Judge0 stack ---
  # Ganti dengan docker-compose resmi dari repo judge0/judge0 (cek versi terbaru).
  # Service minimal: judge0-server, judge0-workers, judge0-redis, judge0-db.
  judge0-server:
    image: judge0/judge0:latest # cek tag resmi terbaru sebelum deploy
    restart: unless-stopped
    volumes:
      - ./judge0/judge0.conf:/judge0.conf:ro
    depends_on:
      - judge0-db
      - judge0-redis
    expose:
      - '2358'

  judge0-workers:
    image: judge0/judge0:latest
    command: ['./scripts/workers']
    restart: unless-stopped
    volumes:
      - ./judge0/judge0.conf:/judge0.conf:ro
    depends_on:
      - judge0-db
      - judge0-redis
    privileged: true # dibutuhkan Judge0 untuk isolasi eksekusi (isolate/cgroups)

  judge0-db:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - judge0_db_data:/var/lib/postgresql/data

  judge0-redis:
    image: redis:7-alpine
    restart: unless-stopped

  # --- CTFd stack ---
  ctfd:
    image: ctfd/ctfd:latest # cek tag resmi terbaru sebelum deploy
    restart: unless-stopped
    env_file: .env
    environment:
      SECRET_KEY: ${CTFD_SECRET_KEY}
      DATABASE_URL: mysql+pymysql://${CTFD_DB_USER}:${CTFD_DB_PASSWORD}@ctfd-db/${CTFD_DB_NAME}
      REDIS_URL: redis://ctfd-redis:6379
    volumes:
      - ctfd_uploads:/var/uploads
    depends_on:
      - ctfd-db
      - ctfd-redis
    expose:
      - '8000'

  ctfd-db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${CTFD_DB_PASSWORD}
      MYSQL_USER: ${CTFD_DB_USER}
      MYSQL_PASSWORD: ${CTFD_DB_PASSWORD}
      MYSQL_DATABASE: ${CTFD_DB_NAME}
    volumes:
      - ctfd_db_data:/var/lib/mysql

  ctfd-redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
  judge0_db_data:
  ctfd_db_data:
  ctfd_uploads:
  caddy_data:
  caddy_config:
```

## 5. `infra/Caddyfile`

```caddyfile
{$DOMAIN} {
    reverse_proxy web:3000
}

www.{$DOMAIN} {
    redir https://{$DOMAIN}{uri} permanent
}

{$CTF_SUBDOMAIN} {
    reverse_proxy ctfd:8000
}
```

Caddy otomatis mengurus sertifikat HTTPS (Let's Encrypt) untuk domain-domain ini
selama DNS sudah mengarah dengan benar dan port 80/443 terbuka.

## 6. Menjalankan Stack

```bash
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps   # pastikan semua "healthy"/"running"
```

## 7. Migration Database Pertama Kali

```bash
docker compose -f infra/docker-compose.yml exec web pnpm payload migrate
```

## 8. Backup Rutin (cron di VM)

```bash
# /etc/cron.d/bariskode-backup
0 3 * * * root docker exec bariskode-postgres-1 pg_dump -U bariskode bariskode | gzip > /backups/bariskode-$(date +\%F).sql.gz
```

Simpan backup di storage terpisah (mis. Object Storage Oracle, termasuk dalam free
tier) — jangan hanya simpan di disk VM yang sama.

## Catatan Resource

Dengan kuota 2 OCPU/12GB, alokasi kasar: web (Next.js+Payload) ~1–2GB, Postgres
~512MB–1GB, Judge0 stack ~2–3GB (workers cukup rakus saat eksekusi), CTFd stack
~1–2GB. Masih ada slack untuk MVP dengan traffic rendah–menengah; monitor lewat
`docker stats` dan siap upgrade VM (paid) kalau salah satu servis konsisten
mendekati limit.

## 9. Deploy di VM Non-Oracle / RAM Lebih Kecil (mis. 4GB)

Stack ini tidak terikat ke Oracle — bisa jalan di VPS/server Ubuntu mana pun
selama resource cukup. Untuk RAM di bawah rekomendasi 12GB di atas (mis. 4
core/4GB, storage bukan bottleneck), `infra/docker-compose.yml` yang
sebenarnya (bukan contoh YAML di bagian 4, itu sekadar ilustrasi awal) sudah
diisi `mem_limit` per service yang dikira-kira untuk pas di ~4GB — total hard
limit ~3.1GB, sisa untuk OS/Docker daemon. Langkah tambahan:

1. **Turunkan worker Judge0**: `infra/judge0/judge0.conf` sudah di-set
   `COUNT=1` (dari default `2`) supaya sesuai `mem_limit: 700m` di service
   `judge0-workers` — cukup untuk satu eksekusi kode bersamaan. Naikkan lagi
   kalau RAM di-upgrade.
2. **Pasang swap sebagai jaring pengaman**: `sudo infra/setup-swap.sh` (default
   4GB, idempotent, aman dijalankan ulang). Ini bukan pengganti RAM — tujuannya
   supaya lonjakan singkat tidak langsung memicu OOM-kill container, dan
   performa tetap prioritas RAM asli karena `vm.swappiness` di-set rendah (10).
3. **Pantau setelah deploy**: `docker stats` dan `free -h` selama beberapa hari
   pertama, khususnya saat ada yang submit kode ke sandbox *dan* pakai CTFd
   bersamaan. Kalau salah satu container sering kena `mem_limit`-nya (cek
   `docker inspect <container> | grep OOMKilled`), naikkan limit service itu
   di `infra/docker-compose.yml` dan turunkan yang lain, atau pertimbangkan
   pisah CTFd/Judge0 ke VM lain — arsitekturnya sudah mendukung service
   terpisah lewat subdomain.
4. Kalau prioritasnya cuma course/blog dulu (bukan sandbox/lab), bisa juga
   deploy tanpa `judge0-*` dan `ctfd*` dulu (`docker compose up -d postgres
   web caddy`) dan nyalakan sisanya belakangan setelah lihat sisa RAM riil.

## 10. Cron Reminder Email

Selain backup (bagian 8), reminder progress mandek (lihat
docs/21-FEATURE-EMAIL-NOTIFICATIONS.md) juga dijalankan lewat cron di VM,
lewat service `web-script` di `infra/docker-compose.yml` (pola sama seperti
`web-migrate` — image `web` yang jalan production sengaja ramping/standalone,
tidak bisa jalankan script langsung, jadi `web-script` pakai stage `builder`).
Contoh `/etc/cron.d/bariskode-emails`:

```
0 8 * * * root cd /path/to/repo && docker compose -f infra/docker-compose.yml run --rm web-script scripts/send-progress-reminders.ts >> /var/log/bariskode-reminders.log 2>&1
```

Butuh `SMTP_HOST/PORT/USER/PASS/FROM` terisi di `apps/web/.env` — tanpa itu
script tetap jalan tapi cuma log warning & tidak mengirim apa pun (lihat
`src/lib/email.ts`).
