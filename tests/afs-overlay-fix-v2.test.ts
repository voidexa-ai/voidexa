// Sprint AFS-OVERLAY-FIX-V2 regression coverage.
//
// Locks the four fix groups shipped on 2026-04-28:
//   Fix 1 — Jarvis route-skip extended to /break-room (+/dk/break-room)
//   Fix 2 — Void Chat → Void Pro AI rename (route + UI strings + redirects)
//   Fix 3 — 5× hardcoded 960 → 1324 (ScienceDeck, starmap node, ControlPlane)
//
// Source-level assertions, mirrors AFS-FIX-COMBO / AFS-1 / AFS-3 pattern.

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')
const exists = (...parts: string[]) => existsSync(join(ROOT, ...parts))

// ─── Fix 1 — Jarvis route-skip ────────────────────────────────────────────────

const JARVIS_SRC = read('components', 'ui', 'JarvisAssistant.tsx')

describe('AFS-OVERLAY-FIX-V2 Fix 1 — Jarvis route-skip /break-room', () => {
  it('hide regex covers /starmap AND /break-room (EN + DK)', () => {
    // Single combined regex so /starmap, /dk/starmap, /break-room, /dk/break-room
    // and any sub-paths all return null.
    expect(JARVIS_SRC).toMatch(
      /\/\^\\\/\(\?:dk\\\/\)\?\(\?:starmap\|break-room\)\(\?:\\\/\|\$\)\//
    )
  })

  it('preserves earlier route skips (/, /freeflight, /assembly-editor)', () => {
    expect(JARVIS_SRC).toMatch(/pathname === '\/'/)
    expect(JARVIS_SRC).toMatch(/pathname === '\/freeflight'/)
    expect(JARVIS_SRC).toMatch(/pathname === '\/assembly-editor'/)
  })
})

// ─── Fix 2 — Void Chat → Void Pro AI rename ───────────────────────────────────

describe('AFS-OVERLAY-FIX-V2 Fix 2 — folder rename', () => {
  it('app/void-pro-ai/ exists with all expected files', () => {
    expect(exists('app', 'void-pro-ai', 'page.tsx')).toBe(true)
    expect(exists('app', 'void-pro-ai', 'layout.tsx')).toBe(true)
    expect(exists('app', 'void-pro-ai', 'pricing', 'page.tsx')).toBe(true)
    expect(exists('app', 'void-pro-ai', '[conversationId]', 'page.tsx')).toBe(true)
  })

  it('app/admin/void-pro-ai/ exists', () => {
    expect(exists('app', 'admin', 'void-pro-ai', 'page.tsx')).toBe(true)
  })

  it('old app/void-chat/ folder is gone', () => {
    expect(exists('app', 'void-chat')).toBe(false)
    expect(exists('app', 'admin', 'void-chat')).toBe(false)
  })
})

describe('AFS-OVERLAY-FIX-V2 Fix 2 — 308 redirects', () => {
  const NEXT_CONFIG = read('next.config.ts')

  it('/void-chat root redirects to /void-pro-ai (permanent)', () => {
    expect(NEXT_CONFIG).toMatch(
      /source:\s*['"]\/void-chat['"][^}]*destination:\s*['"]\/void-pro-ai['"][^}]*permanent:\s*true/
    )
  })

  it('/void-chat/:path* wildcard redirects to /void-pro-ai/:path* (permanent)', () => {
    expect(NEXT_CONFIG).toMatch(
      /source:\s*['"]\/void-chat\/:path\*['"][^}]*destination:\s*['"]\/void-pro-ai\/:path\*['"][^}]*permanent:\s*true/
    )
  })

  it('/admin/void-chat redirects to /admin/void-pro-ai (permanent)', () => {
    expect(NEXT_CONFIG).toMatch(
      /source:\s*['"]\/admin\/void-chat['"][^}]*destination:\s*['"]\/admin\/void-pro-ai['"][^}]*permanent:\s*true/
    )
  })
})

describe('AFS-OVERLAY-FIX-V2 Fix 2 — renamed page content', () => {
  const PAGE_SRC      = read('app', 'void-pro-ai', 'page.tsx')
  const LAYOUT_SRC    = read('app', 'void-pro-ai', 'layout.tsx')
  const PRICING_SRC   = read('app', 'void-pro-ai', 'pricing', 'page.tsx')
  const ADMIN_SRC     = read('app', 'admin', 'void-pro-ai', 'page.tsx')
  const SIDEBAR_SRC   = read('components', 'ghost-ai', 'ChatSidebar.tsx')

  it('landing H1 reads "Void Pro AI"', () => {
    expect(PAGE_SRC).toContain('>Void Pro AI</h1>')
  })

  it('landing subtitle pitches premium AI access (not chat)', () => {
    expect(PAGE_SRC).toContain('Premium access to Claude, ChatGPT, and Gemini. Pay per message.')
    expect(PAGE_SRC).not.toContain('then start chatting')
  })

  it('preview banner text uses Void Pro AI', () => {
    expect(PAGE_SRC).toContain('experience Void Pro AI')
    expect(PAGE_SRC).not.toContain('experience Void Chat')
  })

  it('layout metadata title is the new premium-access title', () => {
    expect(LAYOUT_SRC).toContain("title: 'voidexa Void Pro AI — Premium AI Access'")
    expect(LAYOUT_SRC).not.toContain("'voidexa Void Chat — Multi-AI Chat'")
  })

  it('layout auth redirect targets the new path', () => {
    expect(LAYOUT_SRC).toContain("redirect('/auth/login?redirect=/void-pro-ai')")
  })

  it('pricing page H1 + tier name reflect the rename (Q1: drop "Void Chat Pro" prefix)', () => {
    expect(PRICING_SRC).toContain('>Void Pro AI Pricing</h1>')
    expect(PRICING_SRC).toContain('>Pro</h3>')
    expect(PRICING_SRC).not.toContain('Void Chat Pro')
    expect(PRICING_SRC).not.toContain('Void Chat Pricing')
  })

  it('admin dashboard H1 + non-admin redirect target updated', () => {
    expect(ADMIN_SRC).toContain('>Void Pro AI — Admin Dashboard</h1>')
    expect(ADMIN_SRC).toContain("redirect('/void-pro-ai')")
    // File-header comment "// Void Chat — Admin Dashboard …" is intentionally
    // left alone per Q4 (internal). Assert the user-facing H1 only.
    expect(ADMIN_SRC).not.toMatch(/>Void Chat — Admin Dashboard</)
  })

  it('sidebar shell header (rendered inside the renamed layout) uses Void Pro AI', () => {
    expect(SIDEBAR_SRC).toContain('>Void Pro AI</h2>')
    expect(SIDEBAR_SRC).not.toContain('>Void Chat</h2>')
  })
})

describe('AFS-OVERLAY-FIX-V2 Fix 2 — internal href + i18n', () => {
  const NAV_SRC      = read('components', 'layout', 'Navigation.tsx')
  const FOOTER_SRC   = read('components', 'layout', 'ConditionalFooter.tsx')
  const NODES_SRC    = read('components', 'starmap', 'nodes.ts')
  const I18N_EN_SRC  = read('lib', 'i18n', 'en.ts')
  const I18N_DA_SRC  = read('lib', 'i18n', 'da.ts')
  const CONV_SRC     = read('components', 'ghost-ai', 'ConversationList.tsx')
  const SIDEBAR_SRC  = read('components', 'ghost-ai', 'ChatSidebar.tsx')
  const CREDIT_SRC   = read('components', 'ghost-ai', 'CreditDisplay.tsx')

  it('top nav Quantum Tools entry uses /void-pro-ai + Void Pro AI label', () => {
    expect(NAV_SRC).toMatch(/href:\s*'\/void-pro-ai'[^,]*,\s*label:\s*'Void Pro AI'/)
  })

  it('ConditionalFooter hide-list uses the new path prefix', () => {
    expect(FOOTER_SRC).toContain("pathname.startsWith('/void-pro-ai')")
    expect(FOOTER_SRC).not.toContain("pathname.startsWith('/void-chat')")
  })

  it('starmap node label + path renamed', () => {
    expect(NODES_SRC).toMatch(/id:\s*'ghost-ai',\s*label:\s*'Void Pro AI',\s*path:\s*'\/void-pro-ai'/)
  })

  it('i18n EN + DK keys use /void-pro-ai with Void Pro AI labels', () => {
    expect(I18N_EN_SRC).toContain("'/void-pro-ai': { label: 'Void Pro AI'")
    expect(I18N_DA_SRC).toContain("'/void-pro-ai': { label: 'Void Pro AI'")
    expect(I18N_EN_SRC).not.toMatch(/'\/void-chat':/)
    expect(I18N_DA_SRC).not.toMatch(/'\/void-chat':/)
  })

  it('ghost-ai client components route to /void-pro-ai', () => {
    expect(CONV_SRC).toContain("router.push('/void-pro-ai')")
    expect(CONV_SRC).toContain("router.push(`/void-pro-ai/${conv.id}`)")
    expect(SIDEBAR_SRC).toContain("router.push(`/void-pro-ai/${data.conversation.id}`)")
    expect(CREDIT_SRC).toContain('href="/void-pro-ai/pricing"')
  })
})

describe('AFS-OVERLAY-FIX-V2 Fix 2 — Group D legal copy ("formerly Void Chat" pattern)', () => {
  const PRIVACY_SRC = read('app', 'privacy', 'page.tsx')
  const TERMS_SRC   = read('app', 'terms', 'page.tsx')

  it('/privacy first occurrence uses parenthetical, second is clean', () => {
    expect(PRIVACY_SRC).toContain('Void Pro AI (formerly Void Chat) / Quantum / Trading Hub')
    // Subsequent occurrence (sub-processor list) is clean
    expect(PRIVACY_SRC).toContain('OpenAI</strong> — Void Pro AI, quantum debate')
  })

  it('/terms uses the parenthetical on first occurrence', () => {
    expect(TERMS_SRC).toContain('Void Pro AI (formerly Void Chat), the Quantum debate engine')
  })
})

describe('AFS-OVERLAY-FIX-V2 Fix 2 — Q6 contact form (label changed, value preserved)', () => {
  const CONTACT_SRC = read('app', 'contact', 'page.tsx')
  const MODAL_SRC   = read('components', 'GetInTouchModal.tsx')

  it('contact page INTERESTS dropdown updates label, keeps slug for inbox automation', () => {
    expect(CONTACT_SRC).toMatch(/value:\s*'void-chat',\s*label:\s*'Void Pro AI'/)
    expect(CONTACT_SRC).not.toMatch(/label:\s*'Void Chat'/)
  })

  it('GetInTouchModal mirrors the same label/value pairing', () => {
    expect(MODAL_SRC).toMatch(/value:\s*'void-chat',\s*label:\s*'Void Pro AI'/)
    expect(MODAL_SRC).not.toMatch(/label:\s*'Void Chat'/)
  })
})

// ─── Fix 3 — 5× 960 → 1324 ────────────────────────────────────────────────────

describe('AFS-OVERLAY-FIX-V2 Fix 3 — 960 marketing copy audit', () => {
  const SCIENCE_DECK = read('components', 'station', 'ScienceDeck.tsx')
  const STARMAP     = read('components', 'starmap', 'nodes.ts')
  const CONTROL     = read('components', 'control-plane', 'ControlPlaneDashboard.tsx')

  it('ScienceDeck Quantum card desc + tooltip use 1324, not 960', () => {
    expect(SCIENCE_DECK).toContain('Multi-AI debate engine. 1324 tests. KCP-90 middleware.')
    expect(SCIENCE_DECK).toContain('1324 tests. KCP-90 middleware integrated. Multi-provider debate engine live.')
    expect(SCIENCE_DECK).not.toContain('960 tests')
  })

  it('starmap Quantum node sublabel uses 1324, not 960', () => {
    expect(STARMAP).toContain("sublabel: 'Live — 1324 Tests Passed'")
    expect(STARMAP).not.toContain('960 Tests Passed')
  })

  it('ControlPlaneDashboard QuantumPanel tests-passed = 1324 / 1324', () => {
    expect(CONTROL).toContain("value: '1324 / 1324'")
    expect(CONTROL).not.toContain("value: '960 / 960'")
  })

  it('ControlPlaneDashboard SYSTEMS Quantum note uses 1324', () => {
    expect(CONTROL).toContain('1324 tests passed — fully operational')
    expect(CONTROL).not.toContain('960 tests passed — fully operational')
  })
})
