# 15. CI/CD — GitHub Actions

## `ci.yml` — Jalan di Setiap PR

```yaml
# .github/workflows/ci.yml
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

## `deploy.yml` — Verifikasi + Deploy ke nekosama Saat Push ke `main`

Production berjalan di server **nekosama** (lihat CLAUDE.md, bagian
"Deployment Production (nekosama)"), bukan VM Oracle. Isi workflow ada di
`.github/workflows/deploy.yml`; ringkasnya:

1. **Job `verify`** (selalu jalan): `pnpm lint`, `pnpm typecheck`, dan 4 spec
   konten (`course-content`, `course-def`, `markdown-lexical`,
   `lesson-richtext`). Spec ini tidak butuh database.
2. **Job `deploy`** (hanya kalau repository variable `DEPLOY_ENABLED` =
   `true`): build image `bariskode-web:<short-sha>` dan
   `bariskode-web-builder:<short-sha>` di runner (nekosama tidak sanggup
   `next build`), sambung ke Tailscale (nekosama hanya bisa dijangkau lewat
   tailnet), kirim image lewat SSH, lalu `release <tag>`. Terakhir cek
   `https://bariskode.org` merespons 2xx.

Di server, key SSH CI dikunci ke forced command `ci-deploy.sh`
(`infra/nekosama/ci-deploy.sh`, disalin ke `~/srv/prod/bariskode-barisorg/`),
jadi key itu tidak bisa membuka shell. Script itu cuma menerima dua aksi:

- `load` — `docker load` image dari stdin ke daemon rootful.
- `release <tag>` — `pg_dump` ke `backups/pre-release-<tag>-*.dump` (5
  terakhir disimpan), migration dengan image baru, ganti `WEB_TAG` di
  `infra/.env`, `./dcr up -d web`, lalu health check `127.0.0.1:3040`. Kalau
  migration gagal, `WEB_TAG` tidak berubah. Kalau health check gagal, web
  dikembalikan ke tag sebelumnya. Migration **tidak** di-rollback otomatis;
  pulihkan manual dari dump kalau perlu. Image lama selain tag aktif dan tag
  sebelumnya dihapus.

### Mengaktifkan job `deploy`

Langkah ini butuh akses akun Tailscale, GitHub, dan server, jadi dikerjakan
pemilik repo:

1. **Tailscale**: buat tag `tag:ci` di ACL (dengan owner yang sesuai) dan izinkan
   `tag:ci` mengakses nekosama port 22. Lalu buat OAuth client dengan scope
   `auth_keys` (writable) untuk tag `tag:ci`.
2. **Key deploy**: buat key khusus, jangan pakai key personal:
   ```bash
   ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-deploy"
   ```
   Di nekosama, tambahkan satu baris ke `~/.ssh/authorized_keys`:
   ```
   restrict,command="/home/apin/srv/prod/bariskode-barisorg/ci-deploy.sh" <isi deploy_key.pub>
   ```
3. **Known hosts**: `ssh-keyscan -t ed25519 <IP Tailscale nekosama>` dari mesin
   yang ada di tailnet; simpan output-nya.
4. **GitHub** (Settings → Secrets and variables → Actions):

   | Jenis | Nama | Isi |
   |---|---|---|
   | Secret | `TS_OAUTH_CLIENT_ID` | client ID OAuth Tailscale |
   | Secret | `TS_OAUTH_SECRET` | secret OAuth Tailscale |
   | Secret | `DEPLOY_SSH_KEY` | isi file `deploy_key` (private) |
   | Secret | `DEPLOY_SSH_KNOWN_HOSTS` | output `ssh-keyscan` langkah 3 |
   | Variable | `DEPLOY_HOST` | IP Tailscale nekosama |
   | Variable | `DEPLOY_USER` | `apin` |
   | Variable | `DEPLOY_ENABLED` | `true` (isi paling akhir) |

5. Jalankan workflow sekali lewat **Actions → Deploy → Run workflow**
   (`workflow_dispatch`) dan pastikan semua step hijau.

### Deploy manual (tanpa GitHub Actions)

Sama seperti yang dilakukan workflow, dari Mac yang ada di tailnet:

```bash
TAG=$(git rev-parse --short HEAD)
docker build --platform linux/amd64 -t bariskode-web:$TAG apps/web
docker build --platform linux/amd64 --target builder -t bariskode-web-builder:$TAG apps/web
docker save bariskode-web:$TAG bariskode-web-builder:$TAG | gzip -1 \
  | ssh nekosama 'gunzip | docker --context default load'
ssh nekosama "cd ~/srv/prod/bariskode-barisorg && SSH_ORIGINAL_COMMAND='release $TAG' ./ci-deploy.sh"
```

## Strategi Branching

- `main` — selalu deployable, protected branch (require PR review + CI hijau).
- Feature branch → PR ke `main` → CI jalan otomatis → merge → auto-deploy.
- Untuk perubahan berisiko (migration besar, perubahan infra), pertimbangkan
  manual deploy dulu di staging/VM terpisah sebelum merge ke `main`, terutama
  di awal proyek saat belum ada staging environment resmi.
