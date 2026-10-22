import { ImageResponse } from 'next/og'

// Gambar preview tautan (Open Graph/Twitter Card) untuk semua halaman
// frontend. Di-generate statis saat build (tidak membaca DB/cookies), jadi
// isinya sengaja teks umum, bukan judul per halaman — judul & deskripsi per
// halaman tetap muncul di kartu preview lewat og:title/og:description.
// Warna mengikuti tema situs: hitam pekat, grid tipis, aksen hijau.
export const alt = 'bariskode.org — Belajar programming, data, dan cybersecurity'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: '#050505',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        color: '#fafafa',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 16, height: 16, borderRadius: 9999, backgroundColor: '#22c55e' }} />
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          bariskode.org
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          Belajar coding, data,
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            color: '#a1a1aa',
          }}
        >
          sampai cybersecurity.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {['Open source', 'Gratis', 'Sandbox kode di browser'].map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '10px 22px',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 9999,
              fontSize: 24,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#d4d4d8',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}
