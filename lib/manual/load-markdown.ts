// lib/manual/load-markdown.ts
//
// AFS-18c - Load an etape markdown file from disk and strip the shared
// "# VOIDEXA - USER MANUAL & UNIVERSE GUIDE" H1 so the route page can
// render its own per-slug H1 (from ETAPE_META[slug].title).
//
// Reads at request time (each etape file is <30 KB, single fs.readFileSync
// is cold-start-cheap and avoids the build-time import shenanigans).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const MANUAL_DIR = join(process.cwd(), 'docs', 'VOIDEXA_USER_MANUAL')

const SHARED_H1 = '# VOIDEXA — USER MANUAL & UNIVERSE GUIDE'

/**
 * Read the etape markdown and remove the shared H1 line (and any
 * immediately-following blank line). All other content stays untouched
 * so any intro paragraph or H2 below the H1 renders normally.
 */
export function loadEtapeMarkdown(filename: string): string {
  const filepath = join(MANUAL_DIR, filename)
  const raw = readFileSync(filepath, 'utf-8')

  // Match the H1 at the start of the file, optionally followed by one
  // blank line. Keep everything after.
  const escaped = SHARED_H1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const stripRe = new RegExp(`^${escaped}\\s*\\n+`)
  return raw.replace(stripRe, '').trimStart()
}
