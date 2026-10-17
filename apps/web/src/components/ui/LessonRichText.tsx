import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'

import { CODE_LANGUAGES, type CodeLanguage } from '@/lib/codeLanguages'

// Field block `Code` dari `CodeBlock()` di payload.config.ts.
type CodeBlockFields = {
  blockType: 'Code'
  language?: string | null
  code?: string | null
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<CodeBlockFields>

const converters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    Code: ({ node }) => {
      const language = node.fields.language || 'plaintext'
      const label = Object.hasOwn(CODE_LANGUAGES, language)
        ? CODE_LANGUAGES[language as CodeLanguage]
        : language
      return (
        <figure
          data-code-block
          className="not-prose my-6 overflow-hidden rounded-lg border border-white/10 bg-black/40"
        >
          <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </figcaption>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-foreground">
            <code data-language={language}>{node.fields.code ?? ''}</code>
          </pre>
        </figure>
      )
    },
  },
})

// Rich text lesson, deskripsi course, dan post blog. Sama dengan <RichText>
// bawaan, ditambah render block Code (editor Lexical bersama, jadi semua
// collection bisa menyisipkan block itu).
export function LessonRichText({ data }: { data: SerializedEditorState }) {
  return <RichText data={data} converters={converters} />
}
