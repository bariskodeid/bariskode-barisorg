#!/usr/bin/env bash
# Backup harian database Postgres utama (bariskode) & CTFd (MariaDB).
# Simpan HASIL backup ini di storage terpisah dari VM (mis. Object Storage
# Oracle) — lihat docs/14-DEPLOYMENT-ORACLE-VM.md & docs/16-SECURITY-CHECKLIST.md
# ("Backup database ... tersimpan di lokasi terpisah dari VM").
#
# Pakai lewat cron di VM production, contoh /etc/cron.d/bariskode-backup:
#   0 3 * * * root BACKUP_DIR=/backups /path/to/repo/infra/backup.sh >> /var/log/bariskode-backup.log 2>&1
#
# Script ini CUMA membuat dump lokal — sinkronisasi ke storage eksternal
# (rclone/aws s3 cp/dst lain) belum termasuk, sesuaikan dengan provider
# storage yang dipakai saat deploy sungguhan.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/backups}"
DATE="$(date +%F)"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

echo "==> Backup Postgres utama (bariskode)..."
docker exec infra-postgres-1 pg_dump -U "${POSTGRES_USER:-bariskode}" "${POSTGRES_DB:-bariskode}" \
  | gzip > "$BACKUP_DIR/bariskode-postgres-$DATE.sql.gz"

echo "==> Backup CTFd (MariaDB)..."
docker exec infra-ctfd-db-1 sh -c "exec mariadb-dump -u root -p\"\$MARIADB_ROOT_PASSWORD\" \"\$MARIADB_DATABASE\"" \
  | gzip > "$BACKUP_DIR/bariskode-ctfd-$DATE.sql.gz"

echo "==> Hapus backup lebih tua dari $RETENTION_DAYS hari..."
find "$BACKUP_DIR" -name 'bariskode-*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete

echo "==> Selesai: $BACKUP_DIR/bariskode-{postgres,ctfd}-$DATE.sql.gz"
