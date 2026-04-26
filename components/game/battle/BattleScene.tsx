'use client'

import { Suspense } from 'react'
import { SpaceSkybox } from '@/components/three/SpaceSkybox'
import BattleShip from './BattleShip'
import AbilityEffects from './AbilityEffects'
import type { BattleEffect } from '@/lib/game/battle/types'

interface Props {
  playerShipUrl: string
  enemyShipUrl: string
  activeEffect: BattleEffect | null
  playerDamaged: boolean
  enemyDamaged: boolean
  playerBlocking: boolean
  enemyBlocking: boolean
}

const PLAYER_POS: [number, number, number] = [0, -3.5, 8]
const ENEMY_POS: [number, number, number] = [0, 3.5, -14]

export default function BattleScene({
  playerShipUrl,
  enemyShipUrl,
  activeEffect,
  playerDamaged,
  enemyDamaged,
  playerBlocking,
  enemyBlocking,
}: Props) {
  return (
    <>
      <color attach="background" args={['#04030b']} />
      <fog attach="fog" args={['#04030b', 40, 160]} />
      <Suspense fallback={null}>
        <SpaceSkybox
          texture="/skybox/deep_space_universe.png"
          radius={1500}
          rotateWithCamera={false}
          intensity={1}
        />
      </Suspense>

      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 14, 6]} intensity={0.9} color="#b4cfff" />
      <directionalLight position={[-10, -6, 8]} intensity={0.4} color="#ff8a3c" />

      <Suspense fallback={null}>
        <BattleShip
          url={playerShipUrl}
          position={PLAYER_POS}
          rotationY={Math.PI}
          scale={1.4}
          damaged={playerDamaged}
        />
      </Suspense>

      <Suspense fallback={null}>
        <BattleShip
          url={enemyShipUrl}
          position={ENEMY_POS}
          rotationY={0}
          scale={1.6}
          damaged={enemyDamaged}
        />
      </Suspense>

      <AbilityEffects
        effect={activeEffect}
        playerPos={PLAYER_POS}
        enemyPos={ENEMY_POS}
        playerBlocking={playerBlocking}
        enemyBlocking={enemyBlocking}
      />
    </>
  )
}
