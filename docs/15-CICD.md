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

## `deploy.yml` — Deploy ke VM Saat Push ke `main`

```yaml
# .github/workflows/deploy.yml
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
            docker compose -f infra/docker-compose.yml exec -T web pnpm payload migrate
```

## GitHub Actions Secrets yang Perlu Diset

| Secret | Isi |
|---|---|
| `VM_HOST` | IP publik VM Oracle |
| `VM_USER` | `ubuntu` (atau user SSH yang dipakai) |
| `VM_SSH_KEY` | Private key SSH yang public key-nya sudah terdaftar di VM |

Generate key pair khusus deploy (jangan pakai key personal):
```bash
ssh-keygen -t ed25519 -f deploy_key -C "github-actions-deploy"
# tempel deploy_key.pub ke ~/.ssh/authorized_keys di VM
# tempel isi deploy_key (private) ke GitHub Secret VM_SSH_KEY
```

## Strategi Branching

- `main` — selalu deployable, protected branch (require PR review + CI hijau).
- Feature branch → PR ke `main` → CI jalan otomatis → merge → auto-deploy.
- Untuk perubahan berisiko (migration besar, perubahan infra), pertimbangkan
  manual deploy dulu di staging/VM terpisah sebelum merge ke `main`, terutama
  di awal proyek saat belum ada staging environment resmi.
