import { describe, expect, it } from 'vitest'

import { lexicalToPlainText } from '@/lib/lexicalText'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const paragraph = (...texts: string[]) => ({
  type: 'paragraph',
  children: texts.map((text) => ({ type: 'text', text })),
})

describe('lexicalToPlainText', () => {
  it('menggabungkan teks antar paragraf/heading dan melewati block kode', () => {
    const data = {
      root: {
        type: 'root',
        children: [
          { type: 'heading', children: [{ type: 'text', text: 'Judul' }] },
          paragraph('Python itu ', 'mudah', '.'),
          { type: 'block', fields: { blockType: 'code', code: 'print("x")' } },
          paragraph('Selesai.'),
        ],
      },
    }
    expect(lexicalToPlainText(data)).toBe('Judul Python itu mudah. Selesai.')
  })

  it('memotong di batas kata dengan elipsis', () => {
    const data = { root: { type: 'root', children: [paragraph('satu dua tiga empat lima enam')] } }
    expect(lexicalToPlainText(data, 16)).toBe('satu dua tiga…')
  })

  it('mengembalikan string kosong untuk data bukan Lexical', () => {
    expect(lexicalToPlainText(null)).toBe('')
    expect(lexicalToPlainText('teks biasa')).toBe('')
  })
})

describe('getClientIp', () => {
  it('memakai CF-Connecting-IP, lalu X-Forwarded-For pertama', () => {
    expect(getClientIp(new Headers({ 'cf-connecting-ip': '203.0.113.1', 'x-forwarded-for': '10.0.0.1' }))).toBe(
      '203.0.113.1',
    )
    expect(getClientIp(new Headers({ 'x-forwarded-for': '198.51.100.2, 10.0.0.1' }))).toBe('198.51.100.2')
    expect(getClientIp(new Headers())).toBe('unknown')
  })

  it('rate limit search terpisah per IP', () => {
    const key = (ip: string) => `search-test:${ip}:${Date.now()}`
    const a = key('a')
    const b = key('b')
    for (let i = 0; i < 2; i++) checkRateLimit(a, { limit: 2, windowMs: 60_000 })
    expect(checkRateLimit(a, { limit: 2, windowMs: 60_000 }).allowed).toBe(false)
    expect(checkRateLimit(b, { limit: 2, windowMs: 60_000 }).allowed).toBe(true)
  })
})
