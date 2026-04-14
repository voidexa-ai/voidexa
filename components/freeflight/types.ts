import * as THREE from 'three'

export interface ShipState {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  velocity: THREE.Vector3
  speed: number
  boost: boolean
  brake: boolean
  health: number
  shield: number
  firstPerson: boolean
  shakeUntil: number
  shakeStrength: number
}

export interface PlanetInfo {
  id: string
  name: string
  position: THREE.Vector3
  radius: number
}

export const PLANETS: PlanetInfo[] = [
  { id: 'voidexa',  name: 'voidexa Hub',   position: new THREE.Vector3(   0,   0,   0), radius: 12 },
  { id: 'alpha',    name: 'Alpha',         position: new THREE.Vector3( 180,  20, -120), radius: 8  },
  { id: 'beta',     name: 'Beta',          position: new THREE.Vector3(-220,  40, -260), radius: 10 },
  { id: 'gamma',    name: 'Gamma',         position: new THREE.Vector3( 120, -80,  300), radius: 6  },
  { id: 'delta',    name: 'Delta Outpost', position: new THREE.Vector3(-140, -10,  220), radius: 5  },
]

export type StationKind = 'hub' | 'repair' | 'trading' | 'abandoned'

export interface StationDef {
  id: string
  name: string
  kind: StationKind
  position: THREE.Vector3
  dockRadius: number
}

export const STATIONS: StationDef[] = [
  { id: 'voidexa-hub', name: 'voidexa Hub',      kind: 'hub',       position: new THREE.Vector3(40, 0, 30),     dockRadius: 60 },
  { id: 'repair-n',    name: 'Repair Station N', kind: 'repair',    position: new THREE.Vector3(80, 10, -180),  dockRadius: 45 },
  { id: 'repair-s',    name: 'Repair Station S', kind: 'repair',    position: new THREE.Vector3(-90, -30, 140), dockRadius: 45 },
  { id: 'trade-post',  name: 'Orion Trading Post', kind: 'trading', position: new THREE.Vector3(-60, 20, -90),  dockRadius: 50 },
  { id: 'derelict-01', name: 'Station XR-7',     kind: 'abandoned', position: new THREE.Vector3(260, -40, 180), dockRadius: 45 },
]

export interface NebulaZoneDef {
  id: string
  position: THREE.Vector3
  radius: number
  color: string
}

export const NEBULA_ZONES: NebulaZoneDef[] = [
  { id: 'neb-purple', position: new THREE.Vector3( 140,  30, -260), radius: 90,  color: '#9a5cff' },
  { id: 'neb-orange', position: new THREE.Vector3(-180, -20,  -40), radius: 110, color: '#ff8a3c' },
  { id: 'neb-green',  position: new THREE.Vector3(  80, -60,  260), radius: 80,  color: '#3cff9a' },
]

export interface DerelictDef {
  id: string
  name: string
  position: THREE.Vector3
  rotation: [number, number, number]
  model: string
  lore: string
}

export const DERELICTS: DerelictDef[] = [
  {
    id: 'der-01',
    name: 'Derelict · UEV Horizon',
    position: new THREE.Vector3(-40, 10, -220),
    rotation: [0.4, 1.2, 0.9],
    model: '/models/glb-ready/qs_challenger.glb',
    lore: 'Horizon — flight recorder recovered. Final log: "They came from the nebula. Comms dead. Hull breached. Abandoning..."',
  },
  {
    id: 'der-02',
    name: 'Derelict · Tiberius',
    position: new THREE.Vector3(220, -10, 40),
    rotation: [0.8, 0.3, -0.2],
    model: '/models/glb-ready/qs_executioner.glb',
    lore: 'Tiberius — class-III hauler. Cargo manifest wiped. Scorch pattern consistent with high-energy weapons fire.',
  },
  {
    id: 'der-03',
    name: 'Derelict · Shrike',
    position: new THREE.Vector3(-260, 40, 60),
    rotation: [-0.3, 2.0, 0.6],
    model: '/models/glb-ready/qs_spitfire.glb',
    lore: 'Shrike — scout frigate. Navcom log contains coordinates to an unmapped sector. Partially corrupted.',
  },
]

export interface WarpGateDef {
  id: string
  name: string
  position: THREE.Vector3
  rotation: [number, number, number]
  pairId: string
}

export const WARP_GATES: WarpGateDef[] = [
  {
    id: 'gate-hub',
    name: 'Warp Gate · Core',
    position: new THREE.Vector3(100, 0, 0),
    rotation: [0, Math.PI / 2, 0],
    pairId: 'gate-rim',
  },
  {
    id: 'gate-rim',
    name: 'Warp Gate · Rim',
    position: new THREE.Vector3(-300, 60, 320),
    rotation: [0, Math.PI / 2, 0],
    pairId: 'gate-hub',
  },
]

export function createShipState(): ShipState {
  return {
    position: new THREE.Vector3(60, 8, 60),
    quaternion: new THREE.Quaternion(),
    velocity: new THREE.Vector3(),
    speed: 0,
    boost: false,
    brake: false,
    health: 100,
    shield: 100,
    firstPerson: false,
    shakeUntil: 0,
    shakeStrength: 0,
  }
}
