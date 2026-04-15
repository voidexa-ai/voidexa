// lib/voidforge/scoring.ts
//
// Template selection scoring. Rules-based for now: pick whichever template's
// styleProfile has the highest dot product against the user's requested style.
// Opus can override by passing an explicit templateSlug.

import type { CockpitTemplate, TemplateStyleProfile } from './types'

export function scoreTemplateAgainstStyle(template: CockpitTemplate, style: TemplateStyleProfile): number {
  let score = 0
  for (const [key, weight] of Object.entries(template.styleProfile)) {
    const userWeight = (style as Record<string, number | undefined>)[key] ?? 0
    score += (weight ?? 0) * userWeight
  }
  return score
}

export function selectTemplate(
  templates: CockpitTemplate[],
  style: TemplateStyleProfile,
  preferredSlug?: string
): CockpitTemplate {
  if (preferredSlug) {
    const found = templates.find((t) => t.slug === preferredSlug)
    if (found) return found
  }
  if (templates.length === 0) throw new Error('no active templates')
  let best = templates[0]
  let bestScore = -Infinity
  for (const t of templates) {
    const s = scoreTemplateAgainstStyle(t, style)
    if (s > bestScore) {
      bestScore = s
      best = t
    }
  }
  return best
}

// Keyword-based prompt → style weight extraction. Keeps Opus inputs deterministic
// and stable across variants. Weights clamp to 0..1.
const STYLE_KEYWORDS: Record<keyof TemplateStyleProfile, string[]> = {
  aggressive: ['aggressive', 'fighter', 'combat', 'attack', 'warrior', 'sharp', 'mean'],
  industrial: ['industrial', 'worn', 'rust', 'utility', 'hauler', 'cargo', 'miner', 'rough'],
  sleek: ['sleek', 'smooth', 'luxury', 'civilian', 'modern', 'clean', 'minimal'],
  submarine: ['submarine', 'pressure', 'claustrophobic', 'enclosed', 'dense', 'naval'],
  military: ['military', 'armored', 'command', 'tactical', 'armada', 'marine'],
  civilian: ['civilian', 'passenger', 'yacht', 'personal', 'private'],
  ceremonial: ['ceremonial', 'royal', 'ornate', 'throne', 'gold'],
}

export function extractStyleFromPrompt(prompt: string): TemplateStyleProfile {
  const lower = prompt.toLowerCase()
  const style: TemplateStyleProfile = {}
  for (const [key, words] of Object.entries(STYLE_KEYWORDS) as Array<[keyof TemplateStyleProfile, string[]]>) {
    let hits = 0
    for (const w of words) if (lower.includes(w)) hits++
    if (hits > 0) style[key] = Math.min(1, 0.4 + hits * 0.2)
  }
  return style
}
