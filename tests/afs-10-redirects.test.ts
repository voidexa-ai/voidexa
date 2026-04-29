import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const CONFIG_SRC = readFileSync(
  join(process.cwd(), 'next.config.ts'),
  'utf8',
)

describe('AFS-10 308 redirects', () => {
  it('/space-station → /station permanent', () => {
    expect(CONFIG_SRC).toMatch(
      /source:\s*['"]\/space-station['"][\s\S]{0,80}destination:\s*['"]\/station['"][\s\S]{0,40}permanent:\s*true/,
    )
  })

  it('/tools → /ai-tools permanent', () => {
    expect(CONFIG_SRC).toMatch(
      /source:\s*['"]\/tools['"][\s\S]{0,80}destination:\s*['"]\/ai-tools['"][\s\S]{0,40}permanent:\s*true/,
    )
  })

  it('/ai-trading → /trading-hub permanent (was /trading)', () => {
    expect(CONFIG_SRC).toMatch(
      /source:\s*['"]\/ai-trading['"][\s\S]{0,80}destination:\s*['"]\/trading-hub['"][\s\S]{0,40}permanent:\s*true/,
    )
  })

  it('legacy app/ai-trading/page.tsx server-redirect was removed', () => {
    const legacy = join(process.cwd(), 'app', 'ai-trading', 'page.tsx')
    expect(existsSync(legacy)).toBe(false)
  })

  it('does NOT introduce DK mirrors for AFS-10 redirects (DK universe handled by AFS-26)', () => {
    expect(CONFIG_SRC).not.toMatch(/source:\s*['"]\/dk\/space-station['"]/)
    expect(CONFIG_SRC).not.toMatch(/source:\s*['"]\/dk\/tools['"]/)
    expect(CONFIG_SRC).not.toMatch(/source:\s*['"]\/dk\/ai-trading['"]/)
  })

  it('preserves AFS-2 / AFS-3 / AFS-18 / OVERLAY-FIX-V2 redirects (regression guard)', () => {
    expect(CONFIG_SRC).toMatch(/source:\s*['"]\/login['"][\s\S]{0,80}destination:\s*['"]\/auth\/login['"]/)
    expect(CONFIG_SRC).toMatch(/source:\s*['"]\/game\/card-battle['"]/)
    expect(CONFIG_SRC).toMatch(/source:\s*['"]\/cards\/deck-builder['"]/)
    expect(CONFIG_SRC).toMatch(/source:\s*['"]\/void-chat['"]/)
  })
})
