// scripts/audit-card-keywords.js
// Sprint 9 — scans the 257-card library for keyword usage and produces a
// histogram comparing voidexa's existing vocabulary against the canonical
// MTG evergreen + deciduous keyword set.

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', 'lib', 'game', 'cards')
const baseline = require(path.join(ROOT, 'baseline.json'))
const expansion = require(path.join(ROOT, 'expansion_set_1.json'))
const full = require(path.join(ROOT, 'full_card_library.json'))

const all = [...baseline, ...expansion, ...full]
const byId = new Map()
for (const c of all) byId.set(c.id, c)

console.log(`Total unique cards: ${byId.size}`)

// MTG keyword reference set (evergreen + selected deciduous, sci-fi-relevant)
const MTG_KEYWORDS = [
  'Flying', 'Trample', 'Vigilance', 'Haste', 'First Strike', 'Double Strike',
  'Lifelink', 'Deathtouch', 'Reach', 'Hexproof', 'Indestructible', 'Menace',
  'Defender', 'Flash', 'Ward', 'Prowess', 'Scry', 'Surveil', 'Mill',
  'Convoke', 'Cycling', 'Equip', 'Kicker', 'Flashback', 'Madness', 'Storm',
  'Affinity', 'Dredge', 'Suspend', 'Embalm',
]

// voidexa keyword candidates — words/phrases that appear in abilityText and
// look like ability flags (capitalized, followed by punctuation or end of clause)
const KEYWORD_RE = /\b([A-Z][a-z]+(?:[ -][A-Z][a-z]+)?)(?=[.,;:\s])/g
const histogram = new Map()
const cardsByKeyword = new Map()

for (const card of byId.values()) {
  const text = String(card.abilityText ?? '')
  const seen = new Set()
  let m
  while ((m = KEYWORD_RE.exec(text))) {
    const kw = m[1]
    if (kw.length < 4) continue
    if (/^(If|Then|When|Whenever|At|Each|This|Your|Target|Add|Deal|Draw|Discard|Gain|Choose|Cast|Pay|Spend|Counter|Return|Put|Move|Attack|Block|Tap|Untap|Sacrifice|Otherwise|Until|During|During|Reveal|Look|Search|Library|Hand|Grave|Battlefield|Damage|Combat|Phase|Mana|Cost|All|Each|Any|None|May|Must|Cannot|Should|Number|Permanent|Token|Card|Cards)$/.test(kw)) continue
    seen.add(kw)
  }
  for (const kw of seen) {
    histogram.set(kw, (histogram.get(kw) ?? 0) + 1)
    if (!cardsByKeyword.has(kw)) cardsByKeyword.set(kw, [])
    cardsByKeyword.get(kw).push(card.id)
  }
}

const sorted = [...histogram.entries()].sort((a, b) => b[1] - a[1])
console.log('\n=== Top 40 keyword candidates by frequency ===')
for (const [kw, n] of sorted.slice(0, 40)) {
  console.log(`  ${String(n).padStart(3)} × ${kw}`)
}

// MTG → voidexa equivalence guess (manual mapping based on observed vocab)
const MTG_TO_VOIDEXA_GUESS = {
  'Flying':         { equivalent: 'n/a (3D space, no flying axis)', status: 'N-A' },
  'Trample':        { equivalent: 'Pierce / Overflow', status: '?' },
  'Vigilance':      { equivalent: 'Stalwart / Hold', status: '?' },
  'Haste':          { equivalent: 'Charge / Quick', status: '?' },
  'First Strike':   { equivalent: 'Volley / Initiative', status: '?' },
  'Double Strike':  { equivalent: 'n/a (consider for legendaries)', status: 'GAP' },
  'Lifelink':       { equivalent: 'Salvage / Drain', status: '?' },
  'Deathtouch':     { equivalent: 'Corrosive / Critical', status: '?' },
  'Reach':          { equivalent: 'Long-range / Sniper', status: '?' },
  'Hexproof':       { equivalent: 'Cloak / Phase / Stealth', status: '?' },
  'Indestructible': { equivalent: 'Hardened / Reinforced', status: '?' },
  'Menace':         { equivalent: 'Intimidate / Threat', status: '?' },
  'Defender':       { equivalent: 'Shield / Bulwark', status: '?' },
  'Flash':          { equivalent: 'Reactive / Instant', status: '?' },
  'Ward':           { equivalent: 'Shield / Barrier', status: '?' },
  'Prowess':        { equivalent: 'Momentum / Combo', status: '?' },
  'Scry':           { equivalent: 'Scan / Probe', status: '?' },
  'Surveil':        { equivalent: 'n/a (consider for AI cards)', status: 'GAP' },
  'Mill':           { equivalent: 'Discard / Disrupt', status: '?' },
  'Convoke':        { equivalent: 'Coordinate / Squadron', status: '?' },
  'Cycling':        { equivalent: 'Discard-draw / Recycle', status: '?' },
  'Equip':          { equivalent: 'Module / Attach', status: '?' },
  'Kicker':         { equivalent: 'Overcharge / Boost', status: '?' },
  'Flashback':      { equivalent: 'n/a (consider for AI cards)', status: 'GAP' },
  'Madness':        { equivalent: 'n/a', status: 'N-A' },
  'Storm':          { equivalent: 'n/a (very strong, skip)', status: 'N-A' },
  'Affinity':       { equivalent: 'Synergy / Faction-cost', status: '?' },
  'Dredge':         { equivalent: 'n/a', status: 'N-A' },
  'Suspend':        { equivalent: 'Cooldown / Charge-up', status: '?' },
  'Embalm':         { equivalent: 'n/a', status: 'N-A' },
}

console.log('\n=== MTG → voidexa equivalence guess ===')
for (const [mtg, info] of Object.entries(MTG_TO_VOIDEXA_GUESS)) {
  console.log(`  [${info.status}] ${mtg.padEnd(16)} ↔ ${info.equivalent}`)
}

// Output JSON for the audit doc
const auditData = {
  totalCards: byId.size,
  totalKeywordCandidates: histogram.size,
  topKeywords: sorted.slice(0, 40).map(([kw, n]) => ({ keyword: kw, count: n, sampleCardIds: cardsByKeyword.get(kw).slice(0, 5) })),
  mtgEquivalence: MTG_TO_VOIDEXA_GUESS,
}
const outPath = path.join(__dirname, '..', 'docs', 'mtg_audit_data.json')
fs.writeFileSync(outPath, JSON.stringify(auditData, null, 2))
console.log(`\nWrote audit data → ${outPath}`)
