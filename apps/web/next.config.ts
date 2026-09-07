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
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
