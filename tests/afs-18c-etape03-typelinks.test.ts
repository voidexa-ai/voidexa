import { describe, it, expect } from 'vitest'
import {
  CARD_TYPE_LINKS,
  injectTypeCrossLinks,
} from '@/lib/manual/cross-links'

// AFS-18c Task 7 - Runtime tests for the cross-link substitution helper.
// Etape 03 is the only consumer; behavior on prose / code blocks / headings
// / existing links must all be correct.

describe('AFS-18c CARD_TYPE_LINKS', () => {
  it('lists the 9 canonical types with correct titlecase + slug pairs', () => {
    const map = Object.fromEntries(
      CARD_TYPE_LINKS.map((l) => [l.titlecase, l.slug]),
    )
    expect(map).toEqual({
      'AI Routine': 'ai_routine',
      'Ship Core': 'ship_core',
      Weapon: 'weapon',
      Drone: 'drone',
      Defense: 'defense',
      Module: 'module',
      Maneuver: 'maneuver',
      Equipment: 'equipment',
      Field: 'field',
    })
  })

  it('processes compound names ("AI Routine", "Ship Core") before single words', () => {
    const compoundIdx = CARD_TYPE_LINKS.findIndex((l) =>
      l.titlecase.includes(' '),
    )
    const singleIdx = CARD_TYPE_LINKS.findIndex(
      (l) => !l.titlecase.includes(' '),
    )
    expect(compoundIdx).toBeLessThan(singleIdx)
  })
})

describe('AFS-18c injectTypeCrossLinks - prose substitution', () => {
  it('links a single type-name match in prose', () => {
    const out = injectTypeCrossLinks('A Weapon is one-shot.\n')
    expect(out).toContain('[Weapon](/cards?type=weapon)')
  })

  it('links every titlecase match in prose (D1)', () => {
    const out = injectTypeCrossLinks(
      'A Weapon is one-shot. The Weapon is reliable.\n',
    )
    const linkCount = (out.match(/\[Weapon\]\(\/cards\?type=weapon\)/g) ?? [])
      .length
    expect(linkCount).toBe(2)
  })

  it('handles the AI Routine compound name with space → underscore slug', () => {
    const out = injectTypeCrossLinks(
      'An AI Routine runs on the ship computer.\n',
    )
    expect(out).toContain('[AI Routine](/cards?type=ai_routine)')
  })

  it('handles the Ship Core compound name', () => {
    const out = injectTypeCrossLinks('Ship Core stays in play.\n')
    expect(out).toContain('[Ship Core](/cards?type=ship_core)')
  })

  it('handles every type from the 9-type list', () => {
    for (const { titlecase, slug } of CARD_TYPE_LINKS) {
      const out = injectTypeCrossLinks(`A ${titlecase} appears here.\n`)
      expect(out).toContain(`[${titlecase}](/cards?type=${slug})`)
    }
  })
})

describe('AFS-18c injectTypeCrossLinks - skip rules', () => {
  it('skips lines that start with # (markdown headings)', () => {
    const out = injectTypeCrossLinks('## TYPE 1: Weapon\n')
    expect(out).toContain('## TYPE 1: Weapon')
    expect(out).not.toContain('[Weapon](')
  })

  it('skips fenced code blocks', () => {
    const md = ['```', 'A Weapon in code', '```', ''].join('\n')
    const out = injectTypeCrossLinks(md)
    expect(out).toContain('A Weapon in code')
    expect(out).not.toMatch(/\[Weapon\]\(\/cards\?type=weapon\)/)
  })

  it('skips inline code spans', () => {
    const out = injectTypeCrossLinks('Inline `Drone` reference.\n')
    expect(out).toContain('`Drone`')
    expect(out).not.toContain('[Drone](/cards?type=drone)')
  })

  it('does not re-link an existing [Weapon](url) markdown link', () => {
    const out = injectTypeCrossLinks(
      'See [Weapon](/cards?type=weapon) for details.\n',
    )
    const matches =
      out.match(/\[Weapon\]\(\/cards\?type=weapon\)/g) ?? []
    expect(matches.length).toBe(1)
  })

  it('skips word-mid mentions like "Droneship"', () => {
    const out = injectTypeCrossLinks('Droneship is a compound word.\n')
    expect(out).not.toContain('[Drone](')
    expect(out).toContain('Droneship')
  })

  it('does not transform lowercase variants ("weapon" stays plain)', () => {
    const out = injectTypeCrossLinks(
      'The weapon hardpoint mounts on the hull.\n',
    )
    expect(out).not.toContain('[weapon](')
    expect(out).toContain('weapon hardpoint')
  })
})
