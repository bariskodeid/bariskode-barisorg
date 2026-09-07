'use client'

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from '@uiw/react-codemirror'
import { Play } from 'lucide-react'
import { useRef, useState } from 'react'

import type { AllowedLanguageKey } from '@/lib/judge0'

const languageExtensions: Record<AllowedLanguageKey, ReturnType<typeof python | typeof javascript>> = {
  python: python(),
  javascript: javascript(),
}

// Status id dari Judge0 (docs/api/statuses_and_languages) — 1/2 berarti
// submission masih diproses, jadi polling harus lanjut.
const STILL_RUNNING_STATUS_IDS = new Set([1, 2])
const POLL_INTERVAL_MS = 1000
const MAX_POLL_ATTEMPTS = 20

interface SandboxResult {
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  message?: string | null
  status?: { id: number; description: string }
}

export function CodeSandbox({
  language,
  starterCode,
}: {
  language: AllowedLanguageKey
  starterCode: string
}) {
  const [code, setCode] = useState(starterCode)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<SandboxResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cancelledRef = useRef(false)

  async function handleRun() {
    setRunning(true)
    setResult(null)
    setError(null)
    cancelledRef.current = false

    try {
      const submitRes = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ source_code: code, language }),
      })
      const submitData = await submitRes.json()

      if (!submitRes.ok) {
        setError(submitData?.error || 'Gagal menjalankan kode.')
        setRunning(false)
        return
      }

      const token = submitData.token
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (cancelledRef.current) return
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))

        const pollRes = await fetch(`/api/sandbox?token=${encodeURIComponent(token)}`, {
          credentials: 'include',
        })
        const pollData: SandboxResult = await pollRes.json()

        if (!pollRes.ok) {
          setError('Gagal mengambil hasil eksekusi.')
          break
        }

        if (!pollData.status || !STILL_RUNNING_STATUS_IDS.has(pollData.status.id)) {
          setResult(pollData)
          break
        }
      }
    } catch {
      setError('Tidak bisa terhubung ke server sandbox.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-md disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          {running ? 'Menjalankan...' : 'Run'}
        </button>
      </div>

      <CodeMirror
        value={code}
        onChange={setCode}
        theme={oneDark}
        extensions={[languageExtensions[language]]}
        basicSetup={{ foldGutter: false }}
        height="240px"
      />

      {(result || error) && (
        <div className="border-t border-white/10 px-4 py-3 font-mono text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Output</p>
          {error && <p className="text-destructive whitespace-pre-wrap">{error}</p>}
          {result && (
            <>
              {result.status && result.status.id > 3 && (
                <p className="text-destructive mb-2">{result.status.description}</p>
              )}
              {result.compile_output && (
                <pre className="text-destructive whitespace-pre-wrap mb-2">
                  {result.compile_output}
                </pre>
              )}
              {result.stdout && (
                <pre className="text-white whitespace-pre-wrap">{result.stdout}</pre>
              )}
              {result.stderr && (
                <pre className="text-destructive whitespace-pre-wrap">{result.stderr}</pre>
              )}
              {!result.stdout && !result.stderr && !result.compile_output && (
                <p className="text-muted-foreground">(tidak ada output)</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
