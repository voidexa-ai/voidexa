'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useCinematicTimeline } from '@/hooks/useCinematicTimeline'
import { phaseProgress } from '@/lib/cinematic/config'
import { preloadGameAssets } from '@/lib/game/preload'
import SceneApproach from './scenes/SceneApproach'
import SceneWarp from './scenes/SceneWarp'
import SceneArrival from './scenes/SceneArrival'
import SceneDoorOpen from './scenes/SceneDoorOpen'
import SkipButton from './SkipButton'
import CinematicOverlay from './CinematicOverlay'

const VoiceoverPlayer = dynamic(() => import('./VoiceoverPlayer'), { ssr: false })

export default function HomeCinematic() {
  const timeline = useCinematicTimeline()
  const voiceoverRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    preloadGameAssets().catch(() => {})
  }, [])

  useEffect(() => {
    if (timeline.skipped) voiceoverRef.current?.stop()
  }, [timeline.skipped])

  const { elapsed, phase, overlayVisible } = timeline
  const approachActive = phase === 'approach'
  const warpActive = phase === 'warp'
  const arrivalActive = phase === 'arrival'
  const doorActive = phase === 'door-open' || phase === 'reveal'
  const doorProgress =
    phase === 'door-open' ? phaseProgress(elapsed, 'door-open') : 1
  const revealProgress =
    phase === 'reveal' ? phaseProgress(elapsed, 'reveal') : phase === 'door-open' ? 0 : 1
  const warpProgress = phaseProgress(elapsed, 'warp')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#02060f',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 200 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <color attach="background" args={['#02060f']} />
        <fog attach="fog" args={['#02060f', 30, 120]} />
        <SceneApproach active={approachActive} elapsed={elapsed} />
        <SceneWarp active={warpActive} progress={warpProgress} />
        <SceneArrival active={arrivalActive} elapsed={elapsed} />
        <SceneDoorOpen
          active={doorActive}
          doorProgress={doorProgress}
          revealProgress={revealProgress}
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.95} luminanceThreshold={0.18} mipmapBlur />
          <Vignette eskil={false} offset={0.3} darkness={0.65} />
        </EffectComposer>
      </Canvas>

      <VoiceoverPlayer
        ref={voiceoverRef as React.Ref<{ unmute: () => void; stop: () => void; isMuted: () => boolean }>}
        elapsed={elapsed}
      />
      <SkipButton elapsed={elapsed} onSkip={timeline.skipToEnd} hidden={overlayVisible} />
      <CinematicOverlay visible={overlayVisible} />
    </div>
  )
}
