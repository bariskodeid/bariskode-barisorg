import { describe, expect, it } from 'vitest'

import { q, shuffleOptions } from '../../scripts/lib/course-def'

describe('q()', () => {
  it('mempertahankan tepat satu jawaban benar', () => {
    const res = q('Apa?', [
      ['a', true],
      ['b', false],
      ['c', false],
      ['d', false],
    ])
    expect(res.options.filter((o) => o.isCorrect)).toHaveLength(1)
    expect(res.options.map((o) => o.text).sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(res.options.find((o) => o.isCorrect)?.text).toBe('a')
  })

  it('deterministik', () => {
    const opts: [string, boolean][] = [['a', true], ['b', false], ['c', false], ['d', false]]
    expect(q('Soal X', opts)).toEqual(q('Soal X', opts))
  })

  it('tidak selalu menaruh jawaban benar di index 0', () => {
    const counts = [0, 0, 0, 0]
    for (let i = 0; i < 200; i++) {
      const res = q(`Soal ${i}`, [['benar', true], ['x', false], ['y', false], ['z', false]])
      counts[res.options.findIndex((o) => o.isCorrect)]++
    }
    expect(counts[0] / 200).toBeLessThan(0.4)
    counts.forEach((c) => expect(c).toBeGreaterThan(0))
  })
})

describe('shuffleOptions()', () => {
  it('tidak memutasi input', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const copy = [...input]
    const out = shuffleOptions(input, 'seed')
    expect(input).toEqual(copy)
    expect([...out].sort()).toEqual(copy)
  })
})
