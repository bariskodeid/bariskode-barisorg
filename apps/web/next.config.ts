import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Dibutuhkan Dockerfile (lihat apps/web/Dockerfile) — build production
  // menghasilkan .next/standalone/server.js yang self-contained.
  output: 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // Header keamanan dasar (docs/16-SECURITY-CHECKLIST.md). Sengaja TIDAK set
  // script-src/style-src di CSP — Payload admin panel & Next.js pakai inline
  // script/style yang belum diaudit; CSP yang salah bisa mengunci admin dari
  // /admin, lebih berbahaya daripada tidak ada CSP sama sekali. Directive di
  // bawah cuma yang aman (tidak menyentuh script/style) tapi tetap berguna:
  // blok <object>/<embed>, batasi <base href>, & clickjacking.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Browser mengabaikan header ini di respons HTTP biasa, jadi aman
          // dikirim dari origin (cloudflared -> http://127.0.0.1:3040). Sengaja
          // tanpa includeSubDomains/preload: subdomain lain (ctf, dst) belum
          // tentu semuanya HTTPS.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
          },
        ],
      },
    ]
  },
  // Redirect di sini untuk deployment tanpa Caddy (nekosama: Cloudflare ->
  // cloudflared -> Next.js langsung). Di skenario Caddy (docs/14) Caddy yang
  // menangani, dan kedua rule ini tidak pernah cocok.
  async redirects() {
    return [
      // www.bariskode.org -> bariskode.org (sama seperti Caddyfile). Butuh
      // public hostname `www` di tunnel cloudflared supaya request-nya sampai.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www\\.(?<apex>.+)' }],
        destination: 'https://:apex/:path*',
        permanent: true,
      },
      // HTTP -> HTTPS. Dicek dari header CF-Visitor (diisi edge Cloudflare
      // dengan skema yang dipakai pengunjung), BUKAN X-Forwarded-Proto: Next.js
      // mengisi X-Forwarded-Proto=http sendiri untuk request tanpa header itu,
      // termasuk health check ci-deploy.sh ke http://127.0.0.1:3040 yang tidak
      // boleh ikut di-redirect.
      {
        source: '/:path*',
        has: [
          { type: 'header', key: 'cf-visitor', value: '.*"scheme":"http".*' },
          { type: 'host', value: '(?<host>.+)' },
        ],
        destination: 'https://:host/:path*',
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
