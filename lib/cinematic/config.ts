export type CinematicPhase =
  | 'approach'
  | 'warp'
  | 'arrival'
  | 'door-open'
  | 'reveal'
  | 'end-state'

export interface PhaseRange {
  phase: CinematicPhase
  start: number
  end: number
}

export const TOTAL_DURATION_SECONDS = 45

export const PHASES: PhaseRange[] = [
  { phase: 'approach', start: 0, end: 8 },
  { phase: 'warp', start: 8, end: 12 },
  { phase: 'arrival', start: 12, end: 25 },
  { phase: 'door-open', start: 25, end: 35 },
  { phase: 'reveal', start: 35, end: 42 },
  { phase: 'end-state', start: 42, end: TOTAL_DURATION_SECONDS },
]

export const SKIP_TARGET_SECONDS = 42
export const SKIP_BUTTON_VISIBLE_FROM = 3
export const OVERLAY_FADE_IN_AT = 42
export const UNMUTE_PROMPT_DURATION_MS = 2000

export interface VoiceoverLine {
  time: number
  text: string
}

export const VOICEOVER_SCRIPT: VoiceoverLine[] = [
  { time: 1, text: "Welcome to voidexa. This is not just a website — it's a universe we built." },
  { time: 14, text: "Out here, companies can claim their own planet and build their presence. Your business in the stars." },
  { time: 27, text: "We build websites, custom apps, AI tools — the things that make your business fly." },
  { time: 37, text: "And if you want to explore the universe itself — fly a ship, collect cards, race against pilots — free flight is one click away." },
  { time: 42, text: "Website Creation. Custom Apps. Universe. Tools. Or press Enter Free Flight to jump right in." },
]

export type PanelIcon = 'Globe' | 'Wrench' | 'Compass' | 'Zap'

export interface HomePanel {
  title: string
  description: string
  cta: string
  route: string
  icon: PanelIcon
}

export const HOMEPAGE_PANELS: HomePanel[] = [
  { title: 'Website Creation', description: 'From sketch to live in days.', cta: 'Explore', route: '/products', icon: 'Globe' },
  { title: 'Custom Apps', description: 'Bespoke solutions for any business.', cta: 'Explore', route: '/apps', icon: 'Wrench' },
  { title: 'Universe', description: 'A living sci-fi world to explore.', cta: 'Enter', route: '/starmap', icon: 'Compass' },
  { title: 'Tools', description: 'AI tools ready to use now.', cta: 'Try', route: '/tools', icon: 'Zap' },
]

export const FREE_FLIGHT_CTA = {
  label: 'Enter Free Flight',
  loadingText: 'Requisitioning your ship from docking bay…',
  route: '/freeflight',
  loadingDurationMs: 2400,
}

export function phaseAt(elapsed: number): CinematicPhase {
  for (const p of PHASES) {
    if (elapsed >= p.start && elapsed < p.end) return p.phase
  }
  return 'end-state'
}

export function phaseProgress(elapsed: number, phase: CinematicPhase): number {
  const range = PHASES.find((p) => p.phase === phase)
  if (!range) return 0
  const span = range.end - range.start
  if (span <= 0) return 1
  const local = (elapsed - range.start) / span
  if (local < 0) return 0
  if (local > 1) return 1
  return local
}

export function isOverlayVisibleAt(elapsed: number): boolean {
  return elapsed >= OVERLAY_FADE_IN_AT
}

export function activeVoiceoverLine(elapsed: number): VoiceoverLine | null {
  let active: VoiceoverLine | null = null
  for (const line of VOICEOVER_SCRIPT) {
    if (elapsed + 0.0001 >= line.time) active = line
  }
  return active
}
