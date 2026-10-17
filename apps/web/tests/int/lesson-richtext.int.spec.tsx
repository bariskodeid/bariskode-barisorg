import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { LessonRichText } from '@/components/ui/LessonRichText'

import { markdownToLexical } from '../../scripts/lib/markdown-lexical'

// Bentuk persis output richText() lama di scripts/seed-*-from-zero.ts.
function legacyRichText(paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as unknown as SerializedEditorState
}

const render = (data: SerializedEditorState) => renderToStaticMarkup(<LessonRichText data={data} />)

describe('<LessonRichText>', () => {
  it('render paragraf lama tanpa block sama persis dengan <RichText> bawaan', () => {
    for (const paragraphs of [['Halo'], ['Halo', 'Dunia', 'Ketiga']]) {
      const data = legacyRichText(paragraphs)
      expect(render(data)).toBe(renderToStaticMarkup(<RichText data={data} />))
    }
  })

  it('render block Code dengan bahasa, label, dan isi kode', () => {
    const html = render(markdownToLexical('```python\nprint(1)\n```'))
    expect(html).toContain('<figure data-code-block')
    expect(html).toContain('data-language="python"')
    expect(html).toContain('print(1)')
    expect(html).toMatch(/<figcaption[^>]*>Python<\/figcaption>/)
    expect(html).toMatch(/<pre[^>]*><code data-language="python">print\(1\)<\/code><\/pre>/)
  })

  it('label memakai nama tampilan bahasa (cpp menjadi C++)', () => {
    expect(render(markdownToLexical('```cpp\nint x;\n```'))).toMatch(/<figcaption[^>]*>C\+\+<\/figcaption>/)
  })

  it('block tanpa bahasa jatuh ke plaintext', () => {
    const data = markdownToLexical('```\nhalo\n```')
    expect(render(data)).toContain('data-language="plaintext"')
    expect(render(data)).toMatch(/<figcaption[^>]*>Plain Text<\/figcaption>/)
  })

  it('isi kode di-escape dan baris baru dipertahankan', () => {
    const html = render(markdownToLexical('```plaintext\n<b>x</b>\n```'))
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;')
    expect(html).not.toContain('<b>x</b>')
    expect(render(markdownToLexical('```python\na = 1\nb = 2\n```'))).toContain('a = 1\nb = 2')
  })

  it('inline code memakai <code>', () => {
    expect(render(markdownToLexical('a `b`'))).toContain('<code>b</code>')
  })

  it('konten campuran: teks, list, dan block tetap berurutan', () => {
    const html = render(markdownToLexical('## Judul\n\n- satu\n- dua\n\n```bash\necho hi\n```\n\nPenutup'))
    expect(html.indexOf('<h2')).toBeLessThan(html.indexOf('<ul'))
    expect(html.indexOf('<ul')).toBeLessThan(html.indexOf('data-code-block'))
    expect(html.indexOf('data-code-block')).toBeLessThan(html.indexOf('Penutup'))
  })
})
