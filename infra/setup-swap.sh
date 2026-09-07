#!/usr/bin/env bash
# Setup swap file di VM production dengan RAM kecil (mis. 4GB) — jaring
# pengaman OOM saat beberapa service (Postgres, Judge0 worker, CTFd, web)
# jalan bersamaan. BUKAN pengganti RAM asli, cuma mencegah OOM-kill mematikan
# container saat lonjakan pemakaian singkat. Lihat catatan resource di
# docs/14-DEPLOYMENT-ORACLE-VM.md dan `mem_limit` per service di
# infra/docker-compose.yml (proteksi lapis pertama).
#
# Idempotent — aman dijalankan ulang, tidak bikin swap dobel.
#
# Pakai: sudo infra/setup-swap.sh [ukuran, default 4G]
set -euo pipefail

SWAP_SIZE="${1:-4G}"
SWAP_FILE="/swapfile"

if [ "$(id -u)" -ne 0 ]; then
  echo "Jalankan sebagai root: sudo $0 [ukuran]" >&2
  exit 1
fi

if swapon --show=NAME --noheadings 2>/dev/null | grep -qx "$SWAP_FILE"; then
  echo "==> Swap $SWAP_FILE sudah aktif, skip pembuatan."
else
  if [ -f "$SWAP_FILE" ]; then
    echo "==> $SWAP_FILE sudah ada tapi belum aktif, aktifkan langsung..."
  else
    echo "==> Membuat $SWAP_FILE ($SWAP_SIZE)..."
    fallocate -l "$SWAP_SIZE" "$SWAP_FILE"
    chmod 600 "$SWAP_FILE"
    mkswap "$SWAP_FILE"
  fi
  swapon "$SWAP_FILE"
fi

if ! grep -qE "^\s*$SWAP_FILE\s" /etc/fstab; then
  echo "==> Tambah entry ke /etc/fstab supaya swap aktif lagi setelah reboot..."
  echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab
fi

# swappiness rendah — swap dipakai sebagai jaring pengaman terakhir, bukan
# didahulukan sebelum RAM habis (swap agresif memperlambat Postgres/Judge0).
echo "==> Set vm.swappiness=10..."
sysctl -w vm.swappiness=10 > /dev/null
if [ -d /etc/sysctl.d ]; then
  echo "vm.swappiness=10" > /etc/sysctl.d/99-bariskode-swap.conf
fi

echo "==> Selesai. Status swap:"
swapon --show
free -h
