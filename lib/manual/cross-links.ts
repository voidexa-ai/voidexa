// lib/manual/cross-links.ts
//
// AFS-18c Task 7 - Inject /cards?type={slug} cross-links into etape 03
// markdown prose. Used only by app/manual/cards/page.tsx (and its DK
// mirror); other etapes render straight.
//
// Strategy (D1 - link every titlecase whole-word match):
//   1. Tokenize: replace fenced code blocks (``` ... ```) and inline
//      code (` ... `) with sentinel placeholders so type-name strings
//      inside code do not become links.
//   2. For each non-heading line (skip lines that start with `#`),
//      run a case-sensitive regex per type. Compound names ("AI
//      Routine", "Ship Core") are processed first so a single-word
//      regex never partially eats them.
//   3. Boundary classes prevent matches inside markdown links
//      (`[Weapon](url)` -> `Weapon` is preceded by `[`, followed by
//      `]`, both excluded) and inside word-mid mentions
//      ("Droneship" -> the `s` after `Drone` is alpha, excluded).
//   4. Restore code-block placeholders.

interface TypeLink {
  titlecase: string
  slug: string
}

// Compound-first ordering matters when a single-word entry is a
// substring of a compound entry. None of the 9 types overlap that
// way today, but keeping the order locks future safety in place.
export const CARD_TYPE_LINKS: ReadonlyArray<TypeLink> = [
  { titlecase: 'AI Routine', slug: 'ai_routine' },
  { titlecase: 'Ship Core', slug: 'ship_core' },
  { titlecase: 'Weapon', slug: 'weapon' },
  { titlecase: 'Drone', slug: 'drone' },
  { titlecase: 'Defense', slug: 'defense' },
  { titlecase: 'Module', slug: 'module' },
  { titlecase: 'Maneuver', slug: 'maneuver' },
  { titlecase: 'Equipment', slug: 'equipment' },
  { titlecase: 'Field', slug: 'field' },
]

// Sentinel marker chosen so it cannot collide with any type name regex
// nor with any plausible markdown content.
const CB_OPEN = '__VOIDEXA_CB_'
const CB_CLOSE = '__'
const CODE_BLOCK_RE = /```[\s\S]*?```|`[^`\n]+`/g

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function injectTypeCrossLinks(markdown: string): string {
  // 1. Tokenize code blocks.
  const codeBlocks: string[] = []
  const tokenized = markdown.replace(CODE_BLOCK_RE, (match) => {
    codeBlocks.push(match)
    return `${CB_OPEN}${codeBlocks.length - 1}${CB_CLOSE}`
  })

  // 2. Process line by line.
  const lines = tokenized.split('\n')
  const out: string[] = []
  for (const line of lines) {
    // Skip headings (#, ##, ###, etc.).
    if (/^\s*#/.test(line)) {
      out.push(line)
      continue
    }
    let processed = line
    for (const { titlecase, slug } of CARD_TYPE_LINKS) {
      const escaped = escapeRegExp(titlecase)
      // Boundary classes:
      //   (?<![A-Za-z\[]) - char before NOT alpha and NOT `[`
      //                     -> skips word-mid + skips inside `[Weapon`
      //   (?![A-Za-z\]])  - char after NOT alpha and NOT `]`
      //                     -> skips word-mid + skips inside `Weapon]`
      const re = new RegExp(`(?<![A-Za-z\\[])${escaped}(?![A-Za-z\\]])`, 'g')
      processed = processed.replace(re, `[${titlecase}](/cards?type=${slug})`)
    }
    out.push(processed)
  }

  // 3. Restore code blocks.
  let result = out.join('\n')
  const restoreRe = new RegExp(
    `${escapeRegExp(CB_OPEN)}(\\d+)${escapeRegExp(CB_CLOSE)}`,
    'g',
  )
  result = result.replace(
    restoreRe,
    (_, idx: string) => codeBlocks[Number.parseInt(idx, 10)],
  )

  return result
}
