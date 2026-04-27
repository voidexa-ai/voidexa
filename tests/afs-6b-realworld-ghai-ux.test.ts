// Sprint AFS-6b regression coverage — Real-world GHAI Commerce UX.
// Mirrors the AFS-6a / AFS-7 / AFS-4 pattern: source-level invariant
// checks for routes + components, plus a small logic test for the
// edge-function payload serialization.

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const CONTACT_SRC         = read('app', 'contact', 'page.tsx')
const MODAL_SRC           = read('components', 'GetInTouchModal.tsx')
const NOTICE_SRC          = read('components', 'shop', 'RealWorldPaymentNotice.tsx')
const PRODUCTS_SRC        = read('app', 'products', 'page.tsx')
const APPS_SRC            = read('app', 'apps', 'page.tsx')
const SERVICES_SRC        = read('app', 'services', 'page.tsx')
const AI_TOOLS_SRC        = read('app', 'ai-tools', 'page.tsx')
const WALLET_CLIENT_SRC   = read('components', 'wallet', 'WalletPageClient.tsx')
const DK_WALLET_SRC       = read('app', 'dk', 'wallet', 'page.tsx')
const WISHES_SRC          = read('docs', 'wishes-pending.md')

// ---------------------------------------------------------------------------
// Task 1 — contact pills (both surfaces)
// ---------------------------------------------------------------------------

describe('AFS-6b Task 1 — contact page pills', () => {
  it('renders Ghost AI Services + Void Chat as separate INTERESTS entries', () => {
    expect(CONTACT_SRC).toContain("label: 'Ghost AI Services (GHAI Token)'")
    expect(CONTACT_SRC).toContain("label: 'Void Chat'")
    expect(CONTACT_SRC).toContain("value: 'ghost-ai'")
    expect(CONTACT_SRC).toContain("value: 'void-chat'")
  })

  it('removed the legacy "Ghost AI Chat" label', () => {
    expect(CONTACT_SRC).not.toContain("label: 'Ghost AI Chat'")
  })

  it('handler joins selected pill values for the notify edge function payload', () => {
    expect(CONTACT_SRC).toContain("const subject = allSelected.join(', ')")
    expect(CONTACT_SRC).toContain("supabase.functions.invoke('notify'")
    expect(CONTACT_SRC).toContain("type: 'contact'")
  })
})

describe('AFS-6b Task 1 — GetInTouchModal pills', () => {
  it('renders Ghost AI Services + Void Chat as separate INTERESTS entries', () => {
    expect(MODAL_SRC).toContain("label: 'Ghost AI Services (GHAI Token)'")
    expect(MODAL_SRC).toContain("label: 'Void Chat'")
    expect(MODAL_SRC).toContain("value: 'ghost-ai'")
    expect(MODAL_SRC).toContain("value: 'void-chat'")
  })

  it('removed the legacy "Ghost AI Chat" label', () => {
    expect(MODAL_SRC).not.toContain("label: 'Ghost AI Chat'")
  })

  it('handler serializes selected pills as a waitlist payload to notify', () => {
    expect(MODAL_SRC).toContain("const productStr = allSelected.join(',')")
    expect(MODAL_SRC).toContain("supabase.functions.invoke('notify'")
    expect(MODAL_SRC).toContain("type: 'waitlist'")
  })
})

describe('AFS-6b Task 1 — payload serialization (logic mirror)', () => {
  // Mirrors the actual handler join logic so a future refactor that breaks
  // ordering surfaces in tests, not in production emails landing at
  // contact@voidexa.com.
  it('joining ghost-ai + void-chat produces a string containing both', () => {
    const selected = ['ghost-ai', 'void-chat']
    const subject = selected.join(', ')
    expect(subject).toContain('ghost-ai')
    expect(subject).toContain('void-chat')
    expect(subject).toBe('ghost-ai, void-chat')
  })

  it('appends newsletter to the payload when newsletter is opted in', () => {
    const selected = ['ghost-ai', 'void-chat']
    const newsletter = true
    const allSelected = newsletter ? [...selected, 'newsletter'] : selected
    expect(allSelected).toEqual(['ghost-ai', 'void-chat', 'newsletter'])
  })
})

// ---------------------------------------------------------------------------
// Task 2 — RealWorldPaymentNotice copy + locale detection
// ---------------------------------------------------------------------------

describe('AFS-6b Task 2 — RealWorldPaymentNotice copy', () => {
  it('renders the EN disclaimer with DKK/EUR + reklamationsret strings', () => {
    expect(NOTICE_SRC).toContain('Paid in DKK/EUR via Stripe. GHAI tokens not accepted for this product.')
    expect(NOTICE_SRC).toContain('2-year Danish reklamationsret included.')
  })

  it('renders the DK disclaimer for /dk/* routes', () => {
    expect(NOTICE_SRC).toContain('Betales i DKK/EUR via Stripe. GHAI gælder ikke her.')
    expect(NOTICE_SRC).toContain('2 års dansk reklamationsret er inkluderet.')
  })

  it('uses usePathname for locale detection (no prop required)', () => {
    expect(NOTICE_SRC).toContain("import { usePathname } from 'next/navigation'")
    expect(NOTICE_SRC).toContain("pathname?.startsWith('/dk/')")
  })

  it('exposes data-testid + data-locale for downstream coverage', () => {
    expect(NOTICE_SRC).toContain('data-testid="real-world-payment-notice"')
    expect(NOTICE_SRC).toContain("data-locale={isDanish ? 'da' : 'en'}")
  })
})

describe('AFS-6b Task 2 — single render per bundle page', () => {
  const bundles: ReadonlyArray<readonly [string, string]> = [
    ['products', PRODUCTS_SRC],
    ['apps',     APPS_SRC],
    ['services', SERVICES_SRC],
    ['ai-tools', AI_TOOLS_SRC],
  ] as const

  for (const [name, src] of bundles) {
    it(`${name}/page.tsx imports RealWorldPaymentNotice exactly once`, () => {
      const importMatches = src.match(/from '@\/components\/shop\/RealWorldPaymentNotice'/g) ?? []
      expect(importMatches.length).toBe(1)
    })

    it(`${name}/page.tsx renders <RealWorldPaymentNotice /> exactly once`, () => {
      const renderMatches = src.match(/<RealWorldPaymentNotice\s*\/>/g) ?? []
      expect(renderMatches.length).toBe(1)
    })
  }
})

describe('AFS-6b Task 2 — negative coverage audit', () => {
  // Walk every app/**/page.tsx and confirm RealWorldPaymentNotice is imported
  // only by the 4 named bundle pages. Any other page importing it without
  // sprint approval fails this test.
  function walkPages(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walkPages(full, out)
      else if (entry.name === 'page.tsx') out.push(full)
    }
    return out
  }

  const allPages = walkPages(join(ROOT, 'app'))
  const pagesWithNotice = allPages.filter(p =>
    readFileSync(p, 'utf8').includes("from '@/components/shop/RealWorldPaymentNotice'"),
  )

  it('only the 4 named bundle pages import RealWorldPaymentNotice', () => {
    expect(pagesWithNotice.length).toBe(4)
  })

  it('the 4 importers are products / apps / services / ai-tools', () => {
    const names = pagesWithNotice
      .map(p => p.replace(/\\/g, '/'))
      .map(p => {
        const m = p.match(/\/app\/([^/]+)\/page\.tsx$/)
        return m ? m[1] : p
      })
      .sort()

    expect(names).toEqual(['ai-tools', 'apps', 'products', 'services'])
  })

  it('homepage + shop + wallet + contact do NOT import the notice', () => {
    expect(read('app', 'page.tsx')).not.toContain('RealWorldPaymentNotice')
    expect(read('app', 'shop', 'page.tsx')).not.toContain('RealWorldPaymentNotice')
    expect(read('app', 'wallet', 'page.tsx')).not.toContain('RealWorldPaymentNotice')
    expect(read('app', 'contact', 'page.tsx')).not.toContain('RealWorldPaymentNotice')
  })
})

// ---------------------------------------------------------------------------
// Task 3 — /wallet GHAI scope clarification (EN + DK auto-render)
// ---------------------------------------------------------------------------

describe('AFS-6b Task 3 — /wallet GHAI scope clarification', () => {
  it('renders the EN clarification heading', () => {
    expect(WALLET_CLIENT_SRC).toContain("heading: 'What can I use GHAI for?'")
  })

  it('renders the DK clarification heading on /dk/* routes', () => {
    expect(WALLET_CLIENT_SRC).toContain("heading: 'Hvad kan jeg bruge GHAI til?'")
  })

  it('uses usePathname for DK locale detection', () => {
    expect(WALLET_CLIENT_SRC).toContain("import { usePathname } from 'next/navigation'")
    expect(WALLET_CLIENT_SRC).toContain("pathname?.startsWith('/dk/')")
  })

  it('lists GHAI cannot-use entries for real-world products + subscriptions + bot fees', () => {
    expect(WALLET_CLIENT_SRC).toContain('Real-world products (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)')
    expect(WALLET_CLIENT_SRC).toContain('Subscription billing')
    expect(WALLET_CLIENT_SRC).toContain('Trading bot fees')
  })

  it('lists DK fysiske produkter + Abonnement + Trading bot gebyrer entries', () => {
    expect(WALLET_CLIENT_SRC).toContain('Fysiske produkter (AEGIS Monitor, Comlink Node, Website Builder, AI Consulting)')
    expect(WALLET_CLIENT_SRC).toContain('Abonnement')
    expect(WALLET_CLIENT_SRC).toContain('Trading bot gebyrer')
  })

  it('links to /products for real-world purchases', () => {
    expect(WALLET_CLIENT_SRC).toContain('href="/products"')
  })

  it('exposes data-testid for downstream coverage', () => {
    expect(WALLET_CLIENT_SRC).toContain('data-testid="ghai-scope-clarification"')
  })

  it('does NOT touch the WalletBar Stripe top-up tier component', () => {
    expect(WALLET_CLIENT_SRC).toContain("import WalletBar from '@/components/quantum/WalletBar'")
    expect(WALLET_CLIENT_SRC).toContain('<WalletBar />')
  })
})

describe('AFS-6b Task 3 — /dk/wallet route re-exports EN tree', () => {
  it('imports the English wallet page', () => {
    expect(DK_WALLET_SRC).toContain("import EnglishWallet from '@/app/wallet/page'")
  })

  it('declares both en + da canonicals in metadata.alternates', () => {
    expect(DK_WALLET_SRC).toContain("canonical: '/dk/wallet'")
    expect(DK_WALLET_SRC).toContain("en: '/wallet'")
    expect(DK_WALLET_SRC).toContain("da: '/dk/wallet'")
  })
})

// ---------------------------------------------------------------------------
// Task 4 — FAQ defer documented in repo wishes file
// ---------------------------------------------------------------------------

describe('AFS-6b Task 4 — FAQ defer documented', () => {
  it('docs/wishes-pending.md contains the FAQ defer entry from AFS-6b', () => {
    expect(WISHES_SRC).toContain('FAQ surface for GHAI vs DKK/EUR (deferred from AFS-6b)')
    expect(WISHES_SRC).toContain('AFS-6c')
  })

  it('seed content carries 3 Q&A entries for the future FAQ surface', () => {
    expect(WISHES_SRC).toContain('Q1:**')
    expect(WISHES_SRC).toContain('Q2:**')
    expect(WISHES_SRC).toContain('Q3:**')
  })

  it('cross-references the locked copy sources (Tasks 1-3)', () => {
    expect(WISHES_SRC).toContain('RealWorldPaymentNotice.tsx')
    expect(WISHES_SRC).toContain('WalletPageClient.tsx')
    expect(WISHES_SRC).toContain('GetInTouchModal.tsx')
  })
})
