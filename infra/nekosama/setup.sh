#!/usr/bin/env bash
# Setup sekali jalan folder deploy production di nekosama
# (~/srv/prod/bariskode-barisorg). Taruh script ini di folder itu bersama:
#   infra/docker-compose.yml               (salinan dari repo)
#   infra/docker-compose.nekosama.yml      (salinan dari infra/nekosama/)
#   infra/judge0/judge0.conf.example       (salinan dari repo)
#   ci-deploy.sh                           (salinan dari infra/nekosama/)
#
# Script ini membuat secret acak (tidak pernah dicetak) dan wrapper `./dcr`.
# Idempotent: file yang sudah ada tidak ditimpa.
#
# Pakai: ./setup.sh <WEB_TAG awal, mis. short sha image yang sudah di-load>
set -euo pipefail
cd "$(dirname "$0")"
umask 077
rand() { openssl rand -hex "$1"; }
if [ ! -f infra/.env ]; then
  WEB_TAG_INITIAL=${1:?WEB_TAG awal wajib diisi}
  PG_PW=$(rand 24); MEILI=$(rand 24)
  cat > infra/.env <<EOT
WEB_TAG=$WEB_TAG_INITIAL
POSTGRES_USER=bariskode
POSTGRES_PASSWORD=$PG_PW
POSTGRES_DB=bariskode
MEILI_MASTER_KEY=$MEILI
EOT
fi
. infra/.env
if [ ! -f infra/judge0/judge0.conf ]; then
  J_REDIS=$(rand 24); J_PG=$(rand 24); J_TOKEN=$(rand 24)
  sed -e "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$J_REDIS/" \
      -e "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$J_PG/" \
      -e "s/^AUTHN_TOKEN=.*/AUTHN_TOKEN=$J_TOKEN/" \
      -e "s/^COUNT=.*/COUNT=1/" infra/judge0/judge0.conf.example > infra/judge0/judge0.conf
fi
J_TOKEN=$(grep '^AUTHN_TOKEN=' infra/judge0/judge0.conf | cut -d= -f2)
mkdir -p apps/web infra/meilisearch_data backups
if [ ! -f apps/web/.env.docker ]; then
  cat > apps/web/.env.docker <<EOT
DATABASE_URI=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5432/$POSTGRES_DB
PAYLOAD_SECRET=$(rand 32)
NEXT_PUBLIC_SERVER_URL=https://bariskode.org
JUDGE0_API_URL=http://judge0-server:2358
JUDGE0_API_KEY=$J_TOKEN
NEXT_PUBLIC_CTF_URL=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@bariskode.org
MEILISEARCH_HOST=http://meilisearch:7700
MEILI_MASTER_KEY=$MEILI_MASTER_KEY
EOT
fi
# Context Docker default di nekosama adalah rootless (dipakai app lain); stack
# bariskode harus di daemon rootful karena Judge0 butuh privileged container.
cat > dcr <<'EOT'
#!/usr/bin/env bash
cd "$(dirname "$0")/infra" && DOCKER_CONTEXT=default exec docker compose -p bariskode -f docker-compose.yml -f docker-compose.nekosama.yml "$@"
EOT
chmod 755 dcr
echo "setup ok (secrets written, not printed)"
