/**
 * Phase 2 — Speed Run track data + power-up defs.
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 4 (Speed Run) + PART 11.
 */

export type TrackId = 'core_circuit' | 'nebula_run' | 'void_prix'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface GatePosition {
  x: number
  y: number
  z: number
  /** Yaw (Y-axis) rotation of the ring — direction player must fly through. */
  yaw?: number
}

export interface TrackDef {
  id: TrackId
  name: string
  difficulty: Difficulty
  timeEstimate: string
  zone: string
  summary: string
  /** Par time in ms. Gold = par, Silver = par+15%, Bronze = par+30%. */
  parMs: number
  startPosition: { x: number; y: number; z: number }
  startYaw: number
  gates: GatePosition[]
}

export interface PowerUpDef {
  id: PowerUpId
  name: string
  description: string
  visual: string
  costGhai: number
  durationMs: number
}

export type PowerUpId = 'thruster_surge' | 'phase_shell' | 'null_drift'

export const POWERUPS: Readonly<Record<PowerUpId, PowerUpDef>> = {
  thruster_surge: {
    id: 'thruster_surge',
    name: 'Thruster Surge',
    description: '3 seconds of 2× speed. Blue flame trail.',
    visual: 'Blue flame',
    costGhai: 10,
    durationMs: 3000,
  },
  phase_shell: {
    id: 'phase_shell',
    name: 'Phase Shell',
    description: 'Ignore next collision. Translucent bubble around ship.',
    visual: 'Bubble',
    costGhai: 10,
    durationMs: 12000,
  },
  null_drift: {
    id: 'null_drift',
    name: 'Null Drift',
    description: 'Phase through one gate without flying through it. Ship turns transparent.',
    visual: 'Transparent',
    costGhai: 15,
    durationMs: 6000,
  },
}

// Grade thresholds (relative to parMs)
export const GRADE_MULTIPLIERS = {
  gold: 1.0,
  silver: 1.15,
  bronze: 1.3,
} as const

export const GRADE_REWARDS = {
  gold: 80,
  silver: 50,
  bronze: 30,
  dnf: 0,
} as const

export type Grade = 'gold' | 'silver' | 'bronze' | 'dnf'

export function calculateGrade(timeMs: number, parMs: number, completed: boolean): Grade {
  if (!completed) return 'dnf'
  if (timeMs <= parMs * GRADE_MULTIPLIERS.gold) return 'gold'
  if (timeMs <= parMs * GRADE_MULTIPLIERS.silver) return 'silver'
  if (timeMs <= parMs * GRADE_MULTIPLIERS.bronze) return 'bronze'
  return 'dnf'
}

export function formatTime(ms: number): string {
  if (ms <= 0) return '00:00.00'
  const totalSec = ms / 1000
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  const cs = Math.floor((ms % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

// --- Tracks ---

// Core Circuit — wide planar loop, 15 gates, all in similar plane (gentle bobs).
function coreCircuitGates(): GatePosition[] {
  const gates: GatePosition[] = []
  const radius = 180
  const count = 15
  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * Math.PI * 2
    gates.push({
      x: Math.sin(angle) * radius,
      y: Math.sin(angle * 2) * 8,
      z: -Math.cos(angle) * radius,
      yaw: angle + Math.PI / 2,
    })
  }
  return gates
}

// Nebula Run — vertical variation, tight sequence middle, one 90-degree turn.
function nebulaRunGates(): GatePosition[] {
  return [
    { x: 0, y: 0, z: -50, yaw: 0 },
    { x: 10, y: 10, z: -110, yaw: 0 },
    { x: 30, y: 20, z: -170, yaw: 0 },
    { x: 60, y: 25, z: -220, yaw: -0.3 },
    { x: 110, y: 20, z: -250, yaw: -0.9 },
    { x: 170, y: 10, z: -260, yaw: -Math.PI / 2 },   // 90° turn
    { x: 220, y: 0, z: -230, yaw: -Math.PI / 2 - 0.3 },
    { x: 245, y: -10, z: -180, yaw: -Math.PI / 2 - 0.8 },
    { x: 250, y: -15, z: -120, yaw: -Math.PI },      // tight sequence
    { x: 240, y: -5, z: -60, yaw: -Math.PI },
    { x: 210, y: 10, z: 0, yaw: -Math.PI - 0.4 },
    { x: 160, y: 20, z: 40, yaw: -Math.PI - 0.9 },
    { x: 100, y: 15, z: 60, yaw: -Math.PI - 1.3 },
    { x: 40, y: 5, z: 50, yaw: -Math.PI * 1.7 },
    { x: 0, y: 0, z: 20, yaw: -Math.PI * 2 },
  ]
}

// Void Prix Championship — full 3D, vertical climbs, dives, tight.
function voidPrixGates(): GatePosition[] {
  return [
    { x: 0, y: 0, z: -60, yaw: 0 },
    { x: 30, y: 30, z: -130, yaw: 0 },         // climb
    { x: 70, y: 60, z: -180, yaw: -0.2 },
    { x: 130, y: 80, z: -200, yaw: -0.7 },
    { x: 200, y: 70, z: -170, yaw: -1.2 },
    { x: 260, y: 40, z: -100, yaw: -1.6 },     // dive begin
    { x: 280, y: 0, z: -20, yaw: -Math.PI },
    { x: 260, y: -40, z: 60, yaw: -Math.PI - 0.5 },  // deep dive
    { x: 200, y: -60, z: 120, yaw: -Math.PI - 1.0 },
    { x: 120, y: -50, z: 150, yaw: -Math.PI - 1.5 },
    { x: 40, y: -20, z: 130, yaw: -Math.PI - 2.0 },
    { x: -30, y: 20, z: 80, yaw: -Math.PI - 2.4 },   // climb back
    { x: -60, y: 50, z: 10, yaw: -Math.PI - 2.8 },
    { x: -40, y: 30, z: -30, yaw: -Math.PI * 2 - 0.2 },
    { x: 0, y: 10, z: -30, yaw: -Math.PI * 2 },
  ]
}

export const TRACKS: readonly TrackDef[] = [
  {
    id: 'core_circuit',
    name: 'Core Circuit',
    difficulty: 'Easy',
    timeEstimate: '3–4 min',
    zone: 'Core',
    summary: 'Tutorial loop. Wide gates, gentle bobs. Perfect first ride.',
    parMs: 180_000,
    startPosition: { x: 0, y: 0, z: 180 },
    startYaw: Math.PI,
    gates: coreCircuitGates(),
  },
  {
    id: 'nebula_run',
    name: 'Nebula Run',
    difficulty: 'Medium',
    timeEstimate: '5–7 min',
    zone: 'Mid Ring',
    summary: 'Vertical variation. Tight middle sequence. One 90° turn.',
    parMs: 330_000,
    startPosition: { x: 0, y: 0, z: 0 },
    startYaw: 0,
    gates: nebulaRunGates(),
  },
  {
    id: 'void_prix',
    name: 'Void Prix Championship',
    difficulty: 'Hard',
    timeEstimate: '8–10 min',
    zone: 'Outer Ring',
    summary: 'Full 3D. Vertical climbs, deep dives, dense route.',
    parMs: 540_000,
    startPosition: { x: 0, y: 0, z: 0 },
    startYaw: 0,
    gates: voidPrixGates(),
  },
] as const

export function getTrack(id: TrackId): TrackDef | undefined {
  return TRACKS.find(t => t.id === id)
}

export const GATE_RADIUS = 10
export const GATE_TUBE = 0.6
export const GATE_COLLISION_DIST = GATE_RADIUS
export const GATE_APPROACH_DIST = 20
