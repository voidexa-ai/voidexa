// scripts/rename-sounds.js
// Sprint 7 — copies docs/sounds/*.mp3 to public/sounds/ with kebab-case names
// and emits a mapping JSON + markdown index.
//
// Naming rule:
//   "14_Card_play_____weapon.mp3"  →  "card-play-weapon.mp3"
//   1. strip leading <digits>_
//   2. replace 5+ underscores with single hyphen (Suno separator)
//   3. replace remaining underscores with hyphens
//   4. lowercase
//
// Usage: node scripts/rename-sounds.js

const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'docs', 'sounds')
const DST = path.join(__dirname, '..', 'public', 'sounds')
const INDEX = path.join(DST, 'SOUND_INDEX.md')
const MAP = path.join(DST, 'sound-map.json')

if (!fs.existsSync(DST)) fs.mkdirSync(DST, { recursive: true })

const files = fs
  .readdirSync(SRC)
  .filter((f) => f.toLowerCase().endsWith('.mp3'))
  .sort((a, b) => {
    const na = parseInt(a.match(/^(\d+)/)?.[1] ?? '999', 10)
    const nb = parseInt(b.match(/^(\d+)/)?.[1] ?? '999', 10)
    return na - nb
  })

const mapping = []
for (const oldName of files) {
  const stripped = oldName
    .replace(/\.mp3$/i, '')
    .replace(/^\d+_/, '')
    .replace(/_{5,}/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
  const newName = `${stripped}.mp3`
  const eventKey = stripped
  const src = path.join(SRC, oldName)
  const dst = path.join(DST, newName)
  fs.copyFileSync(src, dst)
  mapping.push({ originalName: oldName, fileName: newName, eventKey })
  console.log(`${oldName.padEnd(50)} → ${newName}`)
}

fs.writeFileSync(MAP, JSON.stringify(mapping, null, 2))

const lines = [
  '# Sound Index — voidexa',
  '',
  'Sprint 7 inventory. Source files in `docs/sounds/` (Suno export, kept for re-export).',
  'Runtime files in `public/sounds/`. Binaries are gitignored — only this index and',
  '`sound-map.json` are tracked.',
  '',
  `Total: ${mapping.length} sounds.`,
  '',
  '| Event Key | Runtime File | Original |',
  '|---|---|---|',
  ...mapping.map(
    (m) => `| \`${m.eventKey}\` | \`${m.fileName}\` | \`${m.originalName}\` |`
  ),
  '',
]
fs.writeFileSync(INDEX, lines.join('\n'))

console.log(`\nWrote ${mapping.length} entries to:`)
console.log(`  ${INDEX}`)
console.log(`  ${MAP}`)
