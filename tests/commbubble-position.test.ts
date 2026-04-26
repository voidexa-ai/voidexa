// Sprint 1 — CommBubble Hotfix regression coverage.
// Source-level invariants for JarvisAssistant + UniverseChat positioning,
// matching the pattern used in tests/afs-7-legal-pages.test.ts.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const JARVIS_SRC = read('components', 'ui', 'JarvisAssistant.tsx')
const UNIVERSE_CHAT_SRC = read('components', 'chat', 'UniverseChat.tsx')

describe('CommBubble position invariants', () => {
  it('Jarvis trigger bubble is positioned bottom-right (not bottom-left)', () => {
    expect(JARVIS_SRC).toMatch(/className="fixed bottom-6 right-6 z-\[60\]"/)
    expect(JARVIS_SRC).not.toMatch(/className="fixed bottom-6 left-6 z-\[60\]"/)
  })

  it('Jarvis chat panel mirrors the trigger position (bottom-right)', () => {
    expect(JARVIS_SRC).toMatch(/fixed bottom-24 right-6 z-\[60\]/)
    expect(JARVIS_SRC).not.toMatch(/fixed bottom-24 left-6 z-\[60\]/)
  })

  it('Jarvis maintains z-[60] (not lowered)', () => {
    expect(JARVIS_SRC).toMatch(/z-\[60\]/)
  })

  it('UniverseChat remains bottom-left z-50', () => {
    expect(UNIVERSE_CHAT_SRC).toMatch(/fixed bottom-6 left-6 z-50/)
  })
})

describe('CommBubble route-skip invariants', () => {
  it('Jarvis hides on /starmap and /dk/starmap to avoid KCP-90 terminal collision', () => {
    // Regex pattern must be present in source so the bubble returns null on
    // these routes. Boundary `(?:\/|$)` prevents matching unrelated routes
    // like /starmaps that may exist in the future.
    expect(JARVIS_SRC).toContain('/^\\/(?:dk\\/)?starmap(?:\\/|$)/')
  })

  it('Jarvis preserves existing route skips (/, /freeflight, /assembly-editor)', () => {
    expect(JARVIS_SRC).toMatch(/pathname === '\/'/)
    expect(JARVIS_SRC).toMatch(/pathname === '\/freeflight'/)
    expect(JARVIS_SRC).toMatch(/pathname === '\/assembly-editor'/)
  })
})
