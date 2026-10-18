#!/usr/bin/env bash
# Forced command untuk key SSH deploy GitHub Actions di nekosama. Key CI
# didaftarkan di ~/.ssh/authorized_keys dengan:
#   restrict,command="/home/apin/srv/prod/bariskode-barisorg/ci-deploy.sh" ssh-ed25519 AAAA... github-actions-deploy
# sehingga key itu TIDAK bisa membuka shell — hanya dua aksi di bawah ini.
#
#   ssh nekosama load            < image.tar.gz   # docker load ke daemon rootful
#   ssh nekosama release <tag>                    # migrate + ganti web + health check
#
# Rilis gagal (migration error atau health check gagal) tidak mengubah WEB_TAG
# yang aktif; kalau web baru gagal health check, web dikembalikan ke tag lama.
# Migration TIDAK di-rollback otomatis — kalau migration sudah jalan lalu web
# gagal, tangani manual (dump ada di backups/ dari setiap rilis).
set -euo pipefail
cd "$(dirname "$0")"

read -r action tag extra <<<"${SSH_ORIGINAL_COMMAND:-}"
if [ -n "${extra:-}" ]; then
  echo "argumen berlebih ditolak" >&2
  exit 2
fi
DOCKER="docker --context default"

prune_old_images() {
  local keep_current=$1 keep_prev=$2
  for repo in bariskode-web bariskode-web-builder; do
    $DOCKER image ls "$repo" --format '{{.Tag}}' | while read -r t; do
      if [ "$t" != "$keep_current" ] && [ "$t" != "$keep_prev" ]; then
        $DOCKER image rm "$repo:$t" >/dev/null 2>&1 || true
      fi
    done
  done
}

case "$action" in
  load)
    gunzip | $DOCKER load
    ;;
  release)
    if ! [[ "$tag" =~ ^[0-9a-f]{7,40}$ ]]; then
      echo "tag tidak valid: $tag" >&2
      exit 2
    fi
    $DOCKER image inspect "bariskode-web:$tag" "bariskode-web-builder:$tag" >/dev/null
    prev=$(grep '^WEB_TAG=' infra/.env | cut -d= -f2)
    . infra/.env

    umask 077
    dump="backups/pre-release-$tag-$(date +%Y%m%d-%H%M%S).dump"
    $DOCKER exec bariskode-postgres-1 pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$dump"
    echo "backup: $dump"

    # Migration pakai image baru (WEB_TAG dari env shell menang atas infra/.env).
    WEB_TAG=$tag ./dcr --profile migrate run --rm -T web-migrate migrate

    sed -i "s/^WEB_TAG=.*/WEB_TAG=$tag/" infra/.env
    ./dcr up -d web
    for _ in $(seq 1 30); do
      if curl -fs -o /dev/null http://127.0.0.1:3040/; then
        echo "release OK: $tag (sebelumnya $prev)"
        prune_old_images "$tag" "$prev"
        ls -1t backups/pre-release-*.dump 2>/dev/null | tail -n +6 | xargs -r rm -f
        exit 0
      fi
      sleep 2
    done
    echo "health check gagal untuk $tag, kembali ke $prev" >&2
    sed -i "s/^WEB_TAG=.*/WEB_TAG=$prev/" infra/.env
    ./dcr up -d web
    exit 1
    ;;
  *)
    echo "perintah tidak dikenal (pakai: load | release <tag>)" >&2
    exit 2
    ;;
esac
