#!/usr/bin/env bash
# Backup harian bariskode.org di nekosama — bagian dari kerangka backup host
# (~/srv/backups, lihat ~/srv/backups/README.md): dipanggil bin/run-all.sh dari
# prod-backup.timer (03:00 WIB), lalu bin/offsite.sh mengirim arsip terbaru,
# dienkripsi age, ke gdrive:nekosama-backups/bariskode/. Gagal = alert Telegram
# (OnFailure di prod-backup.service).
#
# Pasang/perbarui: salin file ini ke ~/srv/backups/bin/backup-bariskode.sh
# (mode 700). Sumbernya di repo: infra/nekosama/backup-bariskode.sh.
#
# Isi arsip ~/srv/backups/bariskode/bariskode-YYYY-MM-DD_HHMM.tar.gz:
#   bariskode.dump   pg_dump -Fc Postgres bariskode (restore: pg_restore)
#   media.tar.gz     isi volume bariskode_media_data (/app/media: avatar,
#                    thumbnail course, gambar blog) — owner uid 1001 ikut tersimpan
#   infra/.env, apps/web/.env.docker, infra/judge0/judge0.conf, .admin-credentials
. "$(dirname "$0")/lib.sh"

# lib.sh default ke daemon rootless milik app lain; seluruh stack bariskode
# jalan di daemon ROOTFUL (lihat CLAUDE.md, "Deployment Production (nekosama)").
export DOCKER_HOST=unix:///var/run/docker.sock
# lib.sh pakai postgres:17-alpine (adanya di daemon rootless); di rootful yang
# sudah ada postgres:16-alpine — sama-sama punya tar, tidak perlu pull image.
TOOL_IMAGE="postgres:16-alpine"

cd "$HOME/srv/prod/bariskode-barisorg"

docker exec bariskode-postgres-1 sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' < /dev/null > "$TMP/bariskode.dump"
docker exec -i bariskode-postgres-1 pg_restore --list < "$TMP/bariskode.dump" > /dev/null \
  || { echo "pg_restore --list gagal: dump rusak" >&2; exit 1; }

volume_tar bariskode_media_data "$TMP/media.tar.gz"
tar -tzf "$TMP/media.tar.gz" > /dev/null || { echo "media.tar.gz rusak" >&2; exit 1; }

cp -a --parents infra/.env apps/web/.env.docker infra/judge0/judge0.conf .admin-credentials "$TMP/"

finish bariskode
