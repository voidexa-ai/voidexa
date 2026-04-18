import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { computeIntroMode } from '@/lib/intro/preferences'

const HOME_SRC = readFileSync(join(process.cwd(), 'app', 'page.tsx'), 'utf8')

describe('quick menu route — /?menu=true', () => {
  it('menuOnly wins over the skip-intro redirect', () => {
    // Users clicking "Quick Menu" from the nav should see the menu, not jump to /starmap.
    expect(computeIntroMode({ menuOnly: true, skipIntro: true })).toBe('menu-only')
    expect(computeIntroMode({ menuOnly: true, skipIntro: false })).toBe('menu-only')
  })

  it('returning visitors with skip flag redirect to /starmap when no menu param', () => {
    expect(computeIntroMode({ menuOnly: false, skipIntro: true })).toBe('redirect')
  })

  it('first-time visitors with no params play the video', () => {
    expect(computeIntroMode({ menuOnly: false, skipIntro: false })).toBe('video')
  })

  it('homepage reads ?menu=true from useSearchParams', () => {
    expect(HOME_SRC).toMatch(/useSearchParams/)
    expect(HOME_SRC).toMatch(/searchParams\?\.get\(['"]menu['"]\)\s*===\s*['"]true['"]/)
  })

  it('homepage initialises showOverlay + videoEnded to menuOnly so the overlay renders instantly', () => {
    expect(HOME_SRC).toMatch(/useState\(menuOnly\)/)
  })

  it('homepage skips the <IntroVideo> element when menuOnly is true', () => {
    // The !menuOnly guard before <IntroVideo ... must exist.
    expect(HOME_SRC).toMatch(/!menuOnly[^\n]*!videoEnded[^\n]*VIDEO_URL/)
  })

  it('homepage still renders the <QuickMenuOverlay> unconditionally', () => {
    expect(HOME_SRC).toMatch(/<QuickMenuOverlay/)
  })
})
