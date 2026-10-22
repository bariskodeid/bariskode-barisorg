// Ambil teks polos dari rich text Lexical (field `description`/`content` di
// Payload disimpan sebagai JSON, bukan string HTML). Dipakai untuk index
// search dan meta description/Open Graph. Block (mis. block Code) dilewati —
// isinya kode, bukan kalimat yang cocok jadi ringkasan.

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}

const BLOCK_LEVEL = new Set(['paragraph', 'heading', 'listitem', 'quote'])

function collect(node: LexicalNode, out: string[]): void {
  if (node.type === 'block') return
  if (typeof node.text === 'string') out.push(node.text)
  for (const child of node.children ?? []) collect(child, out)
  if (node.type && BLOCK_LEVEL.has(node.type)) out.push(' ')
}

export function lexicalToPlainText(data: unknown, maxLength?: number): string {
  const root = (data as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return ''

  const parts: string[] = []
  collect(root, parts)
  const text = parts.join('').replace(/\s+/g, ' ').trim()

  if (!maxLength || text.length <= maxLength) return text
  // Potong di batas kata supaya ringkasan tidak berakhir di tengah kata.
  const cut = text.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
