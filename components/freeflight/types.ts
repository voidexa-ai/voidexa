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

export const STATIONS = [
  { id: 'voidexa-hub', name: 'voidexa Hub', position: new THREE.Vector3(40, 0, 30), dockRadius: 50 },
  { id: 'alpha-post',  name: 'Alpha Post',  position: new THREE.Vector3(190, 20, -130), dockRadius: 40 },
  { id: 'delta-post',  name: 'Delta Post',  position: new THREE.Vector3(-145, -10, 218), dockRadius: 40 },
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
