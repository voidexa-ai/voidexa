// scripts/build-ship-catalog.ts
//
// Scans public/models/glb-ready/ and generates public/data/ship-catalog.json
// with one entry per unique ship type (variant 01 / base name).
//
// Usage: npx tsx scripts/build-ship-catalog.ts

import { readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'

const GLB_DIR = join(process.cwd(), 'public/models/glb-ready')
const OUT_DIR = join(process.cwd(), 'public/data')
const OUT_FILE = join(OUT_DIR, 'ship-catalog.json')

interface CatalogEntry {
  name: string
  displayName: string
  filename: string
  path: string
  category: 'hirez' | 'usc' | 'uscx' | 'qs'
  skinsCount: number
  fileSizeMb: number
  thumbnailPath: string | null
}

// Defines which variant-01 filename to use for each unique type.
const SHIP_TYPES: Array<{
  typePrefix: string
  variant01: string
  displayName: string
  category: CatalogEntry['category']
}> = [
  // Hi-Rez full ships
  ...Array.from({ length: 24 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return { typePrefix: `hirez_ship${n}`, variant01: `hirez_ship${n}_full.glb`, displayName: `Hi-Rez Ship ${n}`, category: 'hirez' as const }
  }),
  { typePrefix: 'hirez_spaceship', variant01: 'hirez_spaceship01.glb', displayName: 'Hi-Rez Spaceship', category: 'hirez' },

  // USC ships
  { typePrefix: 'usc_astroeagle', variant01: 'usc_astroeagle01.glb', displayName: 'Astro Eagle', category: 'usc' },
  { typePrefix: 'usc_cosmicshark', variant01: 'usc_cosmicshark01.glb', displayName: 'Cosmic Shark', category: 'usc' },
  { typePrefix: 'usc_craizanstar', variant01: 'usc_craizanstar01.glb', displayName: 'Craizan Star', category: 'usc' },
  { typePrefix: 'usc_flyinginsect', variant01: 'usc_flyinginsect01.glb', displayName: 'Flying Insect', category: 'usc' },
  { typePrefix: 'usc_forcebadger', variant01: 'usc_forcebadger01.glb', displayName: 'Force Badger', category: 'usc' },
  { typePrefix: 'usc_galacticleopard', variant01: 'usc_galacticleopard1.glb', displayName: 'Galactic Leopard', category: 'usc' },
  { typePrefix: 'usc_galaxyraptor', variant01: 'usc_galaxyraptor01.glb', displayName: 'Galaxy Raptor', category: 'usc' },
  { typePrefix: 'usc_genericspaceship', variant01: 'usc_genericspaceship01.glb', displayName: 'Generic Spaceship', category: 'usc' },
  { typePrefix: 'usc_hyperfalcon', variant01: 'usc_hyperfalcon01.glb', displayName: 'Hyper Falcon', category: 'usc' },
  { typePrefix: 'usc_lightfox', variant01: 'usc_lightfox01.glb', displayName: 'Light Fox', category: 'usc' },
  { typePrefix: 'usc_meteormantis', variant01: 'usc_meteormantis01.glb', displayName: 'Meteor Mantis', category: 'usc' },
  { typePrefix: 'usc_nightaye', variant01: 'usc_nightaye01.glb', displayName: 'Night Aye', category: 'usc' },
  { typePrefix: 'usc_protonlegacy', variant01: 'usc_protonlegacy01.glb', displayName: 'Proton Legacy', category: 'usc' },
  { typePrefix: 'usc_spaceexcalibur', variant01: 'usc_spaceexcalibur01.glb', displayName: 'Space Excalibur', category: 'usc' },
  { typePrefix: 'usc_spacesphinx', variant01: 'usc_spacesphinx01.glb', displayName: 'Space Sphinx', category: 'usc' },
  { typePrefix: 'usc_starsparrow', variant01: 'usc_starsparrow01.glb', displayName: 'Star Sparrow', category: 'usc' },
  { typePrefix: 'usc_striderox', variant01: 'usc_striderox01.glb', displayName: 'Strider Ox', category: 'usc' },
  { typePrefix: 'usc_voidwhale', variant01: 'usc_voidwhale01.glb', displayName: 'Void Whale', category: 'usc' },

  // USC Expansion
  { typePrefix: 'uscx_arrowship', variant01: 'uscx_arrowship.glb', displayName: 'Arrow Ship', category: 'uscx' },
  { typePrefix: 'uscx_galacticokamoto', variant01: 'uscx_galacticokamoto1.glb', displayName: 'Galactic Okamoto', category: 'uscx' },
  { typePrefix: 'uscx_nova', variant01: 'uscx_nova.glb', displayName: 'Nova', category: 'uscx' },
  { typePrefix: 'uscx_pullora', variant01: 'uscx_pullora.glb', displayName: 'Pullora', category: 'uscx' },
  { typePrefix: 'uscx_scorpionship', variant01: 'uscx_scorpionship.glb', displayName: 'Scorpion Ship', category: 'uscx' },
  { typePrefix: 'uscx_spidership', variant01: 'uscx_spidership.glb', displayName: 'Spider Ship', category: 'uscx' },
  { typePrefix: 'uscx_starforce', variant01: 'uscx_starforce01.glb', displayName: 'Star Force', category: 'uscx' },
  { typePrefix: 'uscx_starship', variant01: 'uscx_starship.glb', displayName: 'Star Ship', category: 'uscx' },

  // Quaternius
  { typePrefix: 'qs_bob', variant01: 'qs_bob.glb', displayName: 'Bob', category: 'qs' },
  { typePrefix: 'qs_challenger', variant01: 'qs_challenger.glb', displayName: 'Challenger', category: 'qs' },
  { typePrefix: 'qs_dispatcher', variant01: 'qs_dispatcher.glb', displayName: 'Dispatcher', category: 'qs' },
  { typePrefix: 'qs_executioner', variant01: 'qs_executioner.glb', displayName: 'Executioner', category: 'qs' },
  { typePrefix: 'qs_imperial', variant01: 'qs_imperial.glb', displayName: 'Imperial', category: 'qs' },
  { typePrefix: 'qs_insurgent', variant01: 'qs_insurgent.glb', displayName: 'Insurgent', category: 'qs' },
  { typePrefix: 'qs_omen', variant01: 'qs_omen.glb', displayName: 'Omen', category: 'qs' },
  { typePrefix: 'qs_pancake', variant01: 'qs_pancake.glb', displayName: 'Pancake', category: 'qs' },
  { typePrefix: 'qs_spitfire', variant01: 'qs_spitfire.glb', displayName: 'Spitfire', category: 'qs' },
  { typePrefix: 'qs_striker', variant01: 'qs_striker.glb', displayName: 'Striker', category: 'qs' },
  { typePrefix: 'qs_zenith', variant01: 'qs_zenith.glb', displayName: 'Zenith', category: 'qs' },
]

function main() {
  const allFiles = readdirSync(GLB_DIR).filter((f) => f.endsWith('.glb'))
  const catalog: CatalogEntry[] = []

  for (const type of SHIP_TYPES) {
    const fullPath = join(GLB_DIR, type.variant01)
    let fileSizeMb = 0
    try {
      const stat = statSync(fullPath)
      fileSizeMb = parseFloat((stat.size / (1024 * 1024)).toFixed(1))
    } catch {
      console.warn(`  MISSING: ${type.variant01}`)
      continue
    }

    // Count skins: all files starting with the typePrefix (before the variant number).
    const skins = allFiles.filter((f) => {
      const base = f.replace(/\.glb$/i, '').toLowerCase()
      const prefix = type.typePrefix.toLowerCase()
      return base === prefix || base.startsWith(prefix) && /^[0-9_]/.test(base.slice(prefix.length))
    }).length

    catalog.push({
      name: type.typePrefix,
      displayName: type.displayName,
      filename: type.variant01,
      path: `/models/glb-ready/${type.variant01}`,
      category: type.category,
      skinsCount: Math.max(1, skins),
      fileSizeMb,
      thumbnailPath: null,
    })

    console.log(`  ${type.displayName.padEnd(22)} ${type.category.padEnd(5)} skins=${String(skins).padStart(3)} size=${fileSizeMb}MB`)
  }

  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2))
  console.log(`\nWrote ${catalog.length} entries to ${OUT_FILE}`)
}

main()
