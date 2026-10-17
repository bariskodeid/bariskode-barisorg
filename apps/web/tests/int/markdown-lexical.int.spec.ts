import { describe, expect, it } from 'vitest'

import { markdownToLexical } from '../../scripts/lib/markdown-lexical'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kids = (md: string | string[]): any[] => (markdownToLexical(md).root.children as any[])

describe('markdownToLexical()', () => {
  it('memecah inline code dan bold', () => {
    const [p] = kids('Halo `x` dan **y**')
    expect(p.type).toBe('paragraph')
    expect(p.children.map((c: { format: number }) => c.format)).toEqual([0, 16, 0, 1])
  })

  it('backtick menang atas ** (** di dalam kode tetap kode)', () => {
    const [p] = kids('`*` kali, `/` bagi, `%` sisa bagi, `**` pangkat')
    const code = p.children.filter((c: { format: number }) => c.format === 16)
    expect(code.map((c: { text: string }) => c.text)).toEqual(['*', '/', '%', '**'])
    expect(p.children.some((c: { format: number }) => c.format === 1)).toBe(false)
  })

  it('heading h2', () => {
    const [h] = kids('## Judul')
    expect(h.type).toBe('heading')
    expect(h.tag).toBe('h2')
  })

  it('list bullet', () => {
    const res = kids('- a\n- b')
    expect(res).toHaveLength(1)
    expect(res[0].type).toBe('list')
    expect(res[0].tag).toBe('ul')
    expect(res[0].children.map((c: { value: number }) => c.value)).toEqual([1, 2])
  })

  it('fence menjadi block Code', () => {
    const [b] = kids('```python\nprint(1)\n```')
    expect(b.type).toBe('block')
    expect(b.fields.blockType).toBe('Code')
    expect(b.fields.language).toBe('python')
    expect(b.fields.code).toBe('print(1)')
    expect(b.fields.id).toMatch(/^[0-9a-f]{24}$/)
  })

  it('array menjadi paragraf terpisah, bentuk kompatibel dengan richText() lama', () => {
    const res = kids(['a', 'b'])
    expect(res).toHaveLength(2)
    expect(res[0]).toMatchObject({ type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1 })
    expect(res[0].children[0]).toMatchObject({ type: 'text', text: 'a', version: 1 })
  })

  it('fence tanpa penutup melempar', () => {
    expect(() => markdownToLexical('```python\nx')).toThrow(/fence.*tidak ditutup/i)
  })

  it('bahasa tidak dikenal melempar', () => {
    expect(() => markdownToLexical('```kotlin\nx\n```')).toThrow(/bahasa.*kotlin/i)
  })

  it('pembuka fence malformed (atribut / indentasi) melempar dengan nomor baris dan isi baris', () => {
    expect(() =>
      markdownToLexical('intro\n\n```python title="x"\nprint(1)\n```\n\nprosa\n\n```python\nprint(2)\n```'),
    ).toThrow(/pembuka.*baris 3.*title=\\"x\\"/i)
    expect(() => markdownToLexical('a\n  ```python\nx\n```')).toThrow(/pembuka.*baris 2.*```python/i)
  })

  it('penutup fence berindentasi (bukan penutup polos) melempar dengan nomor baris dan isi baris', () => {
    expect(() =>
      markdownToLexical('```python\nprint(1)\n  ```\n\nprosa yang tidak boleh ikut tertelan\n\n```python\nprint(2)\n```'),
    ).toThrow(/penutup.*baris 3.*  ```/i)
    expect(() => markdownToLexical('```python\nprint(1)\n\t```\n```')).toThrow(/penutup.*baris 3/i)
  })

  it('penutup polos dengan spasi di belakang tetap valid', () => {
    const res = kids('```python\nprint(1)\n```  \n\nprosa')
    expect(res).toHaveLength(2)
    expect(res[0].fields.code).toBe('print(1)')
  })

  it('nama bahasa dari prototype (constructor, toString) ditolak', () => {
    expect(() => markdownToLexical('```constructor\nx\n```')).toThrow(/bahasa.*constructor/i)
    expect(() => markdownToLexical('```toString\nx\n```')).toThrow(/bahasa.*toString/i)
  })

  it('error menyebut nomor baris dan isi baris pembuka', () => {
    expect(() => markdownToLexical('a\n\n```kotlin\nx\n```')).toThrow(/bahasa.*kotlin.*baris 3.*```kotlin/i)
    expect(() => markdownToLexical('a\n\n```python\nprint(1)')).toThrow(
      /fence.*tidak ditutup.*baris 3.*```python/i,
    )
  })

  it('backtick ganjil jadi teks literal', () => {
    const [p] = kids('ada ` sendirian')
    expect(p.children.map((c: { text: string }) => c.text).join('')).toBe('ada ` sendirian')
    expect(p.children.every((c: { format: number }) => c.format === 0)).toBe(true)
  })
})
