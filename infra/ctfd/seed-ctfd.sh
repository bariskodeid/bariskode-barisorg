#!/usr/bin/env bash
# Menyelesaikan setup wizard CTFd (sekali jalan, sebelum ada admin) dan
# membuat 2-3 challenge contoh (bukti konsep) sesuai docs/17-ROADMAP.md
# Fase 6 & docs/12-FEATURE-CYBERSECURITY-LABS.md ("Roadmap Konten Lab").
#
# Prasyarat: service `ctfd` sudah jalan (lihat docs/07-LOCAL-DEVELOPMENT.md):
#   docker compose -f infra/docker-compose.yml up -d ctfd ctfd-db ctfd-redis
#
# Pakai: CTFD_URL=http://localhost:8000 ./infra/ctfd/seed-ctfd.sh
#
# Kurikulum lab lengkap adalah keputusan konten terpisah (lihat catatan di
# docs/12) — script ini cuma bukti-konsep 3 challenge dasar per kategori.
set -euo pipefail

CTFD_URL="${CTFD_URL:-http://localhost:8000}"
COOKIEJAR="$(mktemp)"
tmp_html="$(mktemp)"
trap 'rm -f "$COOKIEJAR" "$tmp_html"' EXIT

ADMIN_NAME="${CTFD_ADMIN_NAME:-admin}"
ADMIN_EMAIL="${CTFD_ADMIN_EMAIL:-admin@bariskode.org}"
ADMIN_PASSWORD="${CTFD_ADMIN_PASSWORD:?Set CTFD_ADMIN_PASSWORD (min 8 karakter) sebelum menjalankan script ini}"

extract_nonce() {
  grep -o 'id="nonce"[^>]*value="[^"]*"' "$1" | head -1 | sed -E 's/.*value="([^"]*)".*/\1/'
}

extract_csrf() {
  grep -o "csrfNonce.\{0,80\}" "$1" | sed -E "s/.*: \"([a-f0-9]+)\".*/\1/"
}

echo "==> Cek status setup CTFd..."
curl -s -c "$COOKIEJAR" "$CTFD_URL/setup" -o "$tmp_html"
nonce="$(extract_nonce "$tmp_html")"

if [ -z "$nonce" ]; then
  echo "Setup sudah pernah dijalankan sebelumnya (atau CTFd belum siap). Lewati ke pembuatan challenge."
else
  echo "==> Menjalankan setup wizard CTFd (admin: $ADMIN_EMAIL)..."
  curl -s -b "$COOKIEJAR" -c "$COOKIEJAR" -X POST "$CTFD_URL/setup" -o /dev/null \
    --data-urlencode "nonce=$nonce" \
    --data-urlencode "ctf_name=bariskode.org CTF" \
    --data-urlencode "ctf_description=Lab praktik cybersecurity bariskode.org" \
    --data-urlencode "user_mode=users" \
    --data-urlencode "name=$ADMIN_NAME" \
    --data-urlencode "email=$ADMIN_EMAIL" \
    --data-urlencode "password=$ADMIN_PASSWORD" \
    --data-urlencode "ctf_theme=core-beta" \
    --data-urlencode "challenge_visibility=public" \
    --data-urlencode "account_visibility=public" \
    --data-urlencode "score_visibility=public" \
    --data-urlencode "registration_visibility=public"
  echo "Setup selesai. Login admin: $ADMIN_EMAIL / (password yang kamu set)"
fi

curl -sL -b "$COOKIEJAR" -c "$COOKIEJAR" "$CTFD_URL/admin" -o "$tmp_html"
csrf="$(extract_csrf "$tmp_html")"
if [ -z "$csrf" ]; then
  echo "Gagal ambil CSRF token — pastikan kamu sudah login sebagai admin (jalankan ulang setelah setup manual kalau perlu)."
  exit 1
fi

create_challenge() {
  local name="$1" category="$2" description="$3" value="$4" flag="$5"
  echo "==> Challenge: $name"
  local resp
  resp="$(curl -s -b "$COOKIEJAR" -X POST "$CTFD_URL/api/v1/challenges" \
    -H "Content-Type: application/json" -H "CSRF-Token: $csrf" \
    -d "{\"name\":\"$name\",\"category\":\"$category\",\"description\":\"$description\",\"value\":$value,\"state\":\"visible\",\"type\":\"standard\"}")"
  local id
  id="$(echo "$resp" | grep -o '"id": [0-9]*' | head -1 | grep -o '[0-9]*')"
  if [ -z "$id" ]; then
    echo "    Gagal membuat challenge (mungkin sudah ada). Response: $resp"
    return
  fi
  curl -s -b "$COOKIEJAR" -X POST "$CTFD_URL/api/v1/flags" \
    -H "Content-Type: application/json" -H "CSRF-Token: $csrf" \
    -d "{\"challenge_id\":$id,\"content\":\"$flag\",\"type\":\"static\"}" > /dev/null
  echo "    id=$id, flag=$flag"
}

create_challenge \
  "SQL Injection Dasar" "Web Exploitation" \
  "Cari cara login sebagai admin tanpa tahu password lewat form login yang rentan SQL injection." \
  100 "bariskode{sql_1nj3ct10n_basic}"

create_challenge \
  "Caesar Cipher" "Cryptography" \
  "Pesan berikut dienkripsi dengan Caesar cipher (shift 5): GFWNXPTIJ UWTLWFRRNSL. Dekripsi pesannya, lalu submit flag dengan format bariskode{teks_hasil_dekripsi_huruf_kecil_pakai_underscore}." \
  50 "bariskode{bariskode_programming}"

create_challenge \
  "Base64 Sederhana" "Cryptography" \
  "String berikut di-encode Base64: YmFyaXNrb2Rle2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=. Decode untuk dapat flag-nya." \
  25 "bariskode{base64_is_not_encryption}"

echo "==> Selesai. Buka $CTFD_URL/challenges untuk lihat hasilnya."
