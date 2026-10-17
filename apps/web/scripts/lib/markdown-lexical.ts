import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { CODE_LANGUAGES } from '../../src/lib/codeLanguages'
import { fnv1a } from './course-def'

const FORMAT_BOLD = 1
const FORMAT_CODE = 16

// Backtick di-match lebih dulu (leftmost) sehingga `**` di dalam `...` tetap kode.
const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*)/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = Record<string, any>

const base = { direction: 'ltr', format: '', indent: 0, version: 1 }

function textNode(text: string, format = 0): Node {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function inlineNodes(text: string): Node[] {
  const nodes: Node[] = []
  for (const part of text.split(INLINE_RE)) {
    if (!part) continue
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      nodes.push(textNode(part.slice(1, -1), FORMAT_CODE))
    } else if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      nodes.push(textNode(part.slice(2, -2), FORMAT_BOLD))
    } else {
      nodes.push(textNode(part))
    }
  }
  return nodes
}

function blockId(index: number, code: string): string {
  const key = `${index}:${code}`
  return [key, `a${key}`, `b${key}`].map((k) => fnv1a(k).toString(16).padStart(8, '0')).join('')
}

export function markdownToLexical(markdown: string | string[]): SerializedEditorState {
  const source = Array.isArray(markdown) ? markdown.join('\n\n') : markdown
  const lines = source.split('\n')
  const children: Node[] = []
  let paragraph: string[] = []
  let items: string[] = []
  let blockIndex = 0

  const flushParagraph = () => {
    if (!paragraph.length) return
    children.push({ type: 'paragraph', children: inlineNodes(paragraph.join(' ')), ...base })
    paragraph = []
  }
  const flushList = () => {
    if (!items.length) return
    children.push({
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      start: 1,
      children: items.map((item, i) => ({
        type: 'listitem',
        value: i + 1,
        children: inlineNodes(item),
        ...base,
      })),
      ...base,
    })
    items = []
  }
  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = /^```(\S*)\s*$/.exec(line)
    if (!fence && line.trimStart().startsWith('```')) {
      throw new Error(`Pembuka code fence tidak valid di baris ${i + 1}: ${JSON.stringify(line)}`)
    }
    if (fence) {
      flushAll()
      const language = fence[1] || 'plaintext'
      if (!Object.hasOwn(CODE_LANGUAGES, language)) {
        throw new Error(
          `Bahasa code block tidak dikenal: ${language} (baris ${i + 1}: ${JSON.stringify(line)})`,
        )
      }
      const openerLine = i + 1
      const codeLines: string[] = []
      let closed = false
      for (i++; i < lines.length; i++) {
        if (/^```\s*$/.test(lines[i])) {
          closed = true
          break
        }
        codeLines.push(lines[i])
      }
      if (!closed) {
        throw new Error(
          `Code fence "${language}" tidak ditutup (dibuka di baris ${openerLine}: ${JSON.stringify(line)})`,
        )
      }
      const code = codeLines.join('\n')
      children.push({
        type: 'block',
        version: 2,
        format: '',
        fields: { id: blockId(blockIndex++, code), blockName: '', blockType: 'Code', language, code },
      })
      continue
    }
    const heading = /^(##|###) (.*)$/.exec(line)
    if (heading) {
      flushAll()
      children.push({
        type: 'heading',
        tag: heading[1] === '##' ? 'h2' : 'h3',
        children: inlineNodes(heading[2]),
        ...base,
      })
      continue
    }
    if (line.startsWith('- ')) {
      flushParagraph()
      items.push(line.slice(2))
      continue
    }
    if (line.trim() === '') {
      flushAll()
      continue
    }
    flushList()
    paragraph.push(line.trim())
  }
  flushAll()

  return {
    root: { type: 'root', children, ...base },
  } as unknown as SerializedEditorState
}
