import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18b/5b - Walker tests for the TCG-grammar layout overhaul on
// AlphaCardFrame.tsx (header name+cost, type-line below image, body
// effect+flavor with separator, footer ATK/DEF in opposite corners).

const FRAME_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCardFrame.tsx'),
  'utf8',
)

describe('AFS-18b/5b header - name on the left, cost circle on the right', () => {
  it('renders the card name in an <h3> with truncate', () => {
    expect(FRAME_SRC).toMatch(/<h3[^>]*\btruncate\b[^>]*>[\s\S]*?\{name\}/)
  })

  it('header uses flex justify-between so name and cost split to ends', () => {
    expect(FRAME_SRC).toMatch(/<header[^>]*flex[\s\S]*?justify-between/)
  })

  it('cost circle stays in the header (background uses rarity color)', () => {
    expect(FRAME_SRC).toMatch(
      /<span[\s\S]*?backgroundColor:\s*color[\s\S]*?\{energy_cost\}/,
    )
  })

  it('removes the AFS-18b earlier rarity badge testid (now in type-line)', () => {
    expect(FRAME_SRC).not.toMatch(/data-testid=['"]rarity-badge['"]/)
  })
})

describe('AFS-18b/5b type-line - TYPE - RARITY below image', () => {
  it('renders a <p> with data-testid="type-line" carrying the type-line', () => {
    expect(FRAME_SRC).toMatch(/<p[\s\S]*?data-testid=['"]type-line['"]/)
  })

  it('type-line embeds {type} - {rarity} with em-dash separator', () => {
    // Match the JSX template literal as it appears in source.
    expect(FRAME_SRC).toMatch(/\{type\}\s*—\s*\{rarity\}/)
  })

  it('type-line uses uppercase + tracking-wider so source values stay lowercase / titlecase', () => {
    expect(FRAME_SRC).toMatch(
      /data-testid=['"]type-line['"][\s\S]*?className=[^>]*uppercase[\s\S]*?tracking-wider/,
    )
  })

  it('type-line text color uses the rarity color (color CSS var)', () => {
    expect(FRAME_SRC).toMatch(
      /data-testid=['"]type-line['"][\s\S]*?style=\{[^}]*color\s*[,}]/,
    )
  })
})

describe('AFS-18b/5b body - effect + flavor with visible separator', () => {
  it('flavor text renders with a top-border + padding-top separator', () => {
    expect(FRAME_SRC).toMatch(
      /flavor_text\s*&&[\s\S]*?<p[\s\S]*?border-t[\s\S]*?pt-2[\s\S]*?italic/,
    )
  })

  it('separator border color uses rarity tint (color + alpha hex)', () => {
    // Two body separators tinted with rarity color: type-line bottom + flavor top.
    // Match the flavor block specifically.
    expect(FRAME_SRC).toMatch(
      /flavor_text\s*&&[\s\S]*?borderColor:\s*`\$\{color\}33`/,
    )
  })
})

describe('AFS-18b/5b footer - ATK left, DEF right (opposite corners)', () => {
  it('footer container uses flex justify-between', () => {
    expect(FRAME_SRC).toMatch(/<footer[\s\S]*?flex[\s\S]*?justify-between/)
  })

  it('footer is gated on hasStats so spell-style cards omit it entirely', () => {
    expect(FRAME_SRC).toMatch(/\{hasStats\s*&&[\s\S]*?<footer/)
  })

  it('renders <span data-testid="stat-attack"> when attack !== undefined', () => {
    expect(FRAME_SRC).toMatch(
      /attack\s*!==\s*undefined\s*\?[\s\S]*?data-testid=['"]stat-attack['"]/,
    )
  })

  it('renders <span data-testid="stat-defense"> when defense !== undefined', () => {
    expect(FRAME_SRC).toMatch(
      /defense\s*!==\s*undefined\s*\?[\s\S]*?data-testid=['"]stat-defense['"]/,
    )
  })

  it('renders aria-hidden placeholder spans to keep corner alignment when only one stat is set', () => {
    // Two such placeholders in source (one for ATK, one for DEF).
    const matches = FRAME_SRC.match(/<span\s+aria-hidden=['"]true['"]\s*\/>/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBeGreaterThanOrEqual(2)
  })

  it('ATK and DEF text use rarity color', () => {
    expect(FRAME_SRC).toMatch(
      /data-testid=['"]stat-attack['"][\s\S]*?style=\{[^}]*color\s*[,}]/,
    )
    expect(FRAME_SRC).toMatch(
      /data-testid=['"]stat-defense['"][\s\S]*?style=\{[^}]*color\s*[,}]/,
    )
  })
})
