# 23. Deployment Local dengan Cloudflare Tunnel (cloudflared)

Panduan ini untuk deployment bariskode.org di **komputer local** (rumah/kantor)
menggunakan **Cloudflare Tunnel** — tidak perlu VPS, tidak perlu port forwarding,
IP publik tidak harus statis.

## Mengapa Cloudflared?

| VM (Oracle/VPS) | Local + Cloudflared |
|-----------------|---------------------|
| Butuh VPS/bayar | Jalankan di PC sendiri |
| Port 80/443 harus terbuka | **Tidak perlu buka port** |
| IP harus statis | IP boleh dinamis |
| TLS diurus Caddy/Let's Encrypt | TLS diurus Cloudflare |
| Butuh SSH key management | Tidak perlu SSH |

**Kekurangan**: PC harus menyala 24/7. Kalau PC mati, situs down.

## Prasyarat

- [ ] Domain sudah dibeli (mis. `bariskode.org`)
- [ ] Akun Cloudflare (gratis)
- [ ] Docker & Docker Compose terinstall
- [ ] PC/komputer tetap menyala (24/7 untuk production)

## Langkah 1: Buat Akun Cloudflare & Tambah Domain

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Add a Site** → masukkan domain (`bariskode.org`)
3. Pilih plan **Free**
4. Catat nameserver yang diberikan
5. Ubah nameserver di registrar domain ke yang diberikan Cloudflare
6. Tunggu propagasi (sampai 24 jam, biasanya 1-2 jam)

## Langkah 2: Buat Cloudflare Tunnel

1. Di Cloudflare dashboard, buka **Networks** → **Tunnels**
2. Klik **Create a tunnel**
3. Pilih **Cloudflared** (bukan Cloudflare Connector)
4. Beri nama tunnel (mis. `bariskode-home`)
5. **Copy token** — simpan, akan dipakai di step 4

## Langkah 3: Konfigurasi DNS di Cloudflare

Setelah tunnel dibuat, Cloudflare akan memberikan hostname untuk tunnel.
Kita perlu buat DNS records manual:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `@` | `<tunnel-id>.cfargotunnel.com` | Proxied |
| CNAME | `www` | `<tunnel-id>.cfargotunnel.com` | Proxied |
| CNAME | `ctf` | `<tunnel-id>.cfargotunnel.com` | Proxied |

> **Atau** gunakan otomatis di Cloudflare dashboard: Tunnels → Configure →
> Public Hostnames → Add di sini (lebih mudah).

## Langkah 4: Konfigurasi Tunnel Routing

Di Cloudflare dashboard → Tunnels → **Configure** → **Public Hostnames**:

### Route 1: Domain Utama

| Field | Nilai |
|-------|-------|
| Subdomain | `(kosongkan untuk apex domain)` |
| Domain | `bariskode.org` |
| Service Type | `HTTP` |
| URL | `web:3000` |

### Route 2: WWW

| Field | Nilai |
|-------|-------|
| Subdomain | `www` |
| Domain | `bariskode.org` |
| Service Type | `HTTP` |
| URL | `web:3000` |

### Route 3: CTFd

| Field | Nilai |
|-------|-------|
| Subdomain | `ctf` |
| Domain | `bariskode.org` |
| Service Type | `HTTP` |
| URL | `ctfd:8000` |

> **Penting**: URL menggunakan nama service Docker (`web:3000`, `ctfd:8000`),
> bukan `localhost:3000`. Cloudflared berada di Docker network yang sama.

## Langkah 5: Setup Environment

```bash
cd /path/to/bariskode

# Copy env files
cp infra/.env.example infra/.env
cp apps/web/.env.example apps/web/.env
```

Edit `infra/.env`:

```bash
# Isi semua secret (generate dengan openssl rand -base64 32)
POSTGRES_PASSWORD=<random>
CTFD_SECRET_KEY=<random>
CTFD_DB_PASSWORD=<random>

# Domain
DOMAIN=bariskode.org
CTF_SUBDOMAIN=ctf.bariskode.org

# Cloudflare Tunnel Token (dari step 2)
CLOUDFLARE_TUNNEL_TOKEN=<paste-token-di-sini>
```

Edit `apps/web/.env`:

```bash
# Production: host = "postgres" (nama service di Docker network)
DATABASE_URI=postgres://bariskode:<POSTGRES_PASSWORD>@postgres:5432/bariskode
PAYLOAD_SECRET=<random_32_chars>

# Domain
NEXT_PUBLIC_SERVER_URL=https://bariskode.org

# CTFd
NEXT_PUBLIC_CTF_URL=https://ctf.bariskode.org

# Judge0
JUDGE0_API_URL=http://judge0-server:2358
```

## Langkah 6: Build & Jalankan

```bash
# Build semua service
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml up -d --build

# Cek status
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml ps
```

Semua service harus running termasuk `cloudflared`. Caddy tetap jalan di internal (untuk local access).

## Langkah 7: Migration Database

```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml run --rm web-migrate migrate
```

## Langkah 8: Verifikasi

1. Buka `https://bariskode.org` — harusnya loading
2. Buka `https://bariskode.org/admin` — admin panel
3. Buka `https://ctf.bariskode.org` — CTFd

## Langkah 9: Seed CTFd (Opsional)

```bash
CTFD_ADMIN_PASSWORD=<password> infra/ctfd/seed-ctfd.sh
```

## Perintah Umum

### Start
```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml up -d --build
```

### Stop
```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml down
```

### Logs
```bash
# Semua service
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml logs -f

# Cloudflared saja
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml logs -f cloudflared
```

### Restart
```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml restart
```

### Update
```bash
cd /path/to/bariskode
git pull origin main
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml up -d --build
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml run --rm web-migrate migrate
```

## Troubleshooting

### Cloudflared tidak mau start

```bash
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml logs cloudflared
```

Error umum:
- `error="No tunnel token found"` → Token belum diisi di `.env`
- `error="TLS handshake failed"` → Tunnel belum dikonfigurasi di dashboard

### Website tidak bisa diakses

1. Cek cloudflared running:
   ```bash
   docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml ps cloudflared
   ```

2. Cek tunnel status di Cloudflare dashboard → Networks → Tunnels

3. Cek DNS records di Cloudflare → DNS

4. Cek web service running:
   ```bash
   docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml logs web
   ```

### CTFd tidak bisa diakses

1. Cek ctfd running:
   ```bash
   docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml logs ctfd
   ```

2. Pastikan route `ctf.bariskode.org` → `ctfd:8000` sudah di-set di tunnel config

### Cloudflared restart terus

```bash
# Cek resource usage
docker stats --no-stream cloudflared
```

Cloudflared sangat ringan (~50MB RAM). Jika restart terus, cek token validity di dashboard.

## Security Notes

- **Tidak perlu buka port di router** — cloudflared membuat outbound connection saja
- **TLS diurus Cloudflare** — tidak perlu Let's Encrypt/Caddy
- **DDS protection otomatis** — Cloudflare edge melindungi dari serangan
- **Rate limiting** bisa di-set di Cloudflare dashboard → Security → WAF
- **Access policies** bisa di-set per-route di dashboard (mis. proteksi `/admin`)

## Resource Usage

| Service | RAM | Catatan |
|---------|-----|---------|
| cloudflared | ~50-100MB | Tunnel client |
| web | ~600MB | Next.js + Payload |
| postgres | ~400MB | Database |
| ctfd | ~400MB | Lab cybersecurity |
| ctfd-db | ~400MB | MariaDB |
| ctfd-redis | ~48MB | Cache |
| judge0-* | ~1.2GB | Code sandbox (opsional) |
| **Total** | **~3.2GB** | Tanpa Judge0: ~2GB |

Untuk PC dengan RAM 8GB+, semua service bisa jalan bersamaan.
Untuk RAM 4GB, matikan Judge0 dulu: `docker compose ... up -d postgres web caddy ctfd ctfd-db ctfd-redis cloudflared`

## Auto-Start di Boot (Linux)

Buat systemd service:

```bash
sudo tee /etc/systemd/system/bariskode.service << 'EOF'
[Unit]
Description=bariskode.org
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/bariskode
ExecStart=/usr/bin/docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml up -d
ExecStop=/usr/bin/docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable bariskode.service
sudo systemctl start bariskode.service
```

## Auto-Start di Boot (Docker Desktop - Windows/Mac)

Docker Desktop → Settings → General → **Start Docker Desktop when you log in**

Lalu buat script start script:
```bash
#!/bin/bash
cd /path/to/bariskode
docker compose -f infra/docker-compose.yml -f infra/docker-compose.cloudflared.yml up -d
```
