# 13. Deployment: Cloudflare (DNS, CDN, SSL)

## 1. Pindahkan Nameserver

Di registrar domain `bariskode.org`, ubah nameserver ke nameserver yang diberikan
Cloudflare setelah menambahkan situs (biasanya 2 nameserver, format
`xxx.ns.cloudflare.com`). Propagasi bisa memakan waktu hingga 24 jam.

## 2. DNS Records

| Type | Name | Content | Proxy status |
|---|---|---|---|
| A | `@` | `<IP publik VM Oracle>` | Proxied (orange cloud) |
| A | `www` | `<IP publik VM Oracle>` | Proxied |
| A | `ctf` | `<IP publik VM Oracle>` | Proxied |

Semua diarahkan ke IP VM yang sama karena Caddy di dalam VM yang akan routing
berdasarkan subdomain (lihat `14-DEPLOYMENT-ORACLE-VM.md`).

## 3. SSL/TLS Mode

Set ke **Full (strict)** di SSL/TLS → Overview. Ini mengharuskan origin (Caddy di
VM) menyajikan sertifikat valid, bukan self-signed — Caddy handle ini otomatis
lewat Let's Encrypt, atau gunakan **Cloudflare Origin CA certificate** (gratis,
generate dari dashboard Cloudflare → SSL/TLS → Origin Server) untuk komunikasi
Cloudflare↔VM.

## 4. Caching

- Default caching level cukup untuk aset statis Next.js (`_next/static/*`).
- Tambahkan **Page Rule** atau **Cache Rule** untuk `bariskode.org/_next/static/*`
  dengan cache level "Cache Everything" + edge TTL panjang (aset ini sudah
  content-hashed oleh Next.js, aman di-cache lama).
- Jangan cache halaman `/admin/*` dan `/api/*` — pastikan Cache Rule mengecualikan
  path ini.

## 5. Proteksi Tambahan (gratis)

- **WAF managed rules** (Free plan menyediakan proteksi dasar) — aktifkan di
  Security → WAF.
- **Rate limiting** dasar untuk endpoint `/api/*` supaya sejalan dengan rate
  limiting aplikasi di `11-FEATURE-CODE-SANDBOX.md`.
- **Bot Fight Mode** — aktifkan untuk mengurangi traffic bot murahan ke situs.

## 6. Subdomain CTFd

`ctf.bariskode.org` diarahkan ke IP VM yang sama; Caddy yang membedakan routing
ke container CTFd vs container web utama berdasarkan `Host` header. Pastikan
Cloudflare proxy diaktifkan (orange cloud) juga untuk subdomain ini supaya dapat
proteksi DDoS yang sama.
