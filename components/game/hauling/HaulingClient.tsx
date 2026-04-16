'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  generateRoute,
  rollEncounter,
  weightsForRisk,
  type HaulingContract,
} from '@/lib/game/hauling/contracts'
import {
  ATMOSPHERE_ENCOUNTERS,
  CAST_CHATTER_QUOTES,
  NAVIGATION_ENCOUNTERS,
  OPPORTUNITY_ENCOUNTERS,
  pickAtmosphereVariant,
  pickNavigationVariant,
  pickOpportunityVariant,
  pickRandom,
  type AtmosphereEncounterId,
  type NavigationEncounterId,
  type OpportunityEncounterId,
} from '@/lib/game/hauling/encounters'
import HaulingHub from './HaulingHub'
import HaulingHUD from './HaulingHUD'
import DeliveryResults, { type DeliveryOutcome } from './DeliveryResults'
import DebrisFieldMinigame from './DebrisFieldMinigame'
import MiniCardBattle from './MiniCardBattle'
import {
  AtmosphereBanner,
  EngineFlickerNotice,
  OpportunityChoice,
  PirateAmbushChoice,
} from './EncounterOverlays'

const HaulingCanvas = dynamic(() => import('./HaulingCanvas'), { ssr: false })

const DEFAULT_SHIP_URL = process.env.NEXT_PUBLIC_BOB_SHIP_URL?.trim()
  || 'https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models/qs_bob.glb'
const DEFAULT_SHIP_SCALE = 1.2

type Stage = 'hub' | 'flying' | 'results'

type ActiveEncounter =
  | { kind: 'navigation'; variant: NavigationEncounterId }
  | { kind: 'combat' }
  | { kind: 'opportunity'; variant: OpportunityEncounterId }
  | { kind: 'atmosphere'; variant: AtmosphereEncounterId; speaker?: string; line?: string }
  | null

export default function HaulingClient() {
  const [stage, setStage] = useState<Stage>('hub')
  const [contract, setContract] = useState<HaulingContract | null>(null)

  // Flight state
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  const [checkpointTotal, setCheckpointTotal] = useState(0)
  const [cargoIntegrity, setCargoIntegrity] = useState(100)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [engineFlicker, setEngineFlicker] = useState(false)
  const [active, setActive] = useState<ActiveEncounter>(null)
  const [bonusGhai, setBonusGhai] = useState(0)
  const [outcome, setOutcome] = useState<DeliveryOutcome>('delivered')
  const [failureReason, setFailureReason] = useState<string | undefined>(undefined)
  const shipPosRef = useRef(new THREE.Vector3())

  const route = useMemo(() => (contract ? generateRoute(contract) : null), [contract])

  // Timer tick
  useEffect(() => {
    if (stage !== 'flying' || startedAt == null) return
    const id = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt)
    }, 200)
    return () => window.clearInterval(id)
  }, [stage, startedAt])

  const handleAccept = useCallback((c: HaulingContract) => {
    setContract(c)
    setCheckpointIndex(0)
    setCheckpointTotal(0)
    setCargoIntegrity(100)
    setSpeedMultiplier(1)
    setEngineFlicker(false)
    setActive(null)
    setBonusGhai(0)
    setOutcome('delivered')
    setFailureReason(undefined)
    setStartedAt(performance.now())
    setElapsedMs(0)
    setStage('flying')
  }, [])

  const rollAtCheckpoint = useCallback((risk: HaulingContract['risk']) => {
    const weights = weightsForRisk(risk)
    const kind = rollEncounter(weights, Math.random())
    if (kind === 'none') return
    if (kind === 'navigation') {
      setActive({ kind: 'navigation', variant: pickNavigationVariant(Math.random()) })
    } else if (kind === 'combat') {
      setActive({ kind: 'combat' })
    } else if (kind === 'opportunity') {
      setActive({ kind: 'opportunity', variant: pickOpportunityVariant(Math.random()) })
    } else if (kind === 'atmosphere') {
      const variant = pickAtmosphereVariant(Math.random())
      if (variant === 'cast_chatter') {
        const q = pickRandom(CAST_CHATTER_QUOTES, Math.random())
        setActive({ kind: 'atmosphere', variant, speaker: q.speaker, line: q.line })
      } else {
        setActive({ kind: 'atmosphere', variant })
      }
    }
  }, [])

  const handleCheckpointReached = useCallback((index: number, total: number) => {
    setCheckpointIndex(index)
    setCheckpointTotal(total)
    if (contract) rollAtCheckpoint(contract.risk)
  }, [contract, rollAtCheckpoint])

  const handleDelivered = useCallback(() => {
    setOutcome('delivered')
    setStage('results')
  }, [])

  const handleExit = useCallback(() => {
    setOutcome('failed')
    setFailureReason('You abandoned the run.')
    setStage('results')
  }, [])

  const closeEncounter = useCallback(() => setActive(null), [])

  const handleDebrisFieldDone = useCallback((collisions: number) => {
    const penalty = collisions * 8 // each hit = 8% integrity
    setCargoIntegrity(v => Math.max(0, v - penalty))
    closeEncounter()
  }, [closeEncounter])

  const handleEngineFlickerStart = useCallback(() => {
    setSpeedMultiplier(0.5)
    setEngineFlicker(true)
  }, [])

  const handleEngineFlickerEnd = useCallback(() => {
    setSpeedMultiplier(1)
    setEngineFlicker(false)
    closeEncounter()
  }, [closeEncounter])

  const handlePirateFightResolved = useCallback((result: { outcome: 'won' | 'lost'; playerHullLeft: number }) => {
    if (result.outcome === 'won') {
      setBonusGhai(v => v + 40)
    } else {
      // Hull damage translates to integrity loss + potential run failure.
      const integrityHit = Math.round((40 - result.playerHullLeft) * 0.8)
      setCargoIntegrity(v => Math.max(0, v - integrityHit))
      if (result.playerHullLeft <= 0) {
        setOutcome('failed')
        setFailureReason('Hull destroyed in combat. Cargo lost.')
        closeEncounter()
        setStage('results')
        return
      }
    }
    closeEncounter()
  }, [closeEncounter])

  const handlePirateDropCargo = useCallback(() => {
    setCargoIntegrity(v => Math.max(0, v - 20))
    setBonusGhai(v => Math.max(0, v - 30))
    closeEncounter()
  }, [closeEncounter])

  const handleOpportunityAccept = useCallback((variant: OpportunityEncounterId) => {
    if (variant === 'floating_cargo_pod') setBonusGhai(v => v + 40)
    else setBonusGhai(v => v + 50)
    // Add simulated delay to elapsed time.
    const delay = variant === 'floating_cargo_pod' ? 30_000 : 60_000
    setStartedAt(prev => (prev == null ? prev : prev - delay))
    closeEncounter()
  }, [closeEncounter])

  if (stage === 'hub') {
    return <HaulingHub onAccept={handleAccept} />
  }

  if (stage === 'flying' && contract && route) {
    return (
      <div style={S.flightPage}>
        <HaulingCanvas
          route={route}
          shipUrl={DEFAULT_SHIP_URL}
          shipScale={DEFAULT_SHIP_SCALE}
          speedMultiplier={speedMultiplier}
          paused={active !== null && active.kind !== 'atmosphere'}
          phase={active && active.kind !== 'atmosphere' ? 'encounter_paused' : 'cruising'}
          onCheckpointReached={handleCheckpointReached}
          onDelivered={handleDelivered}
          onShipPosition={p => shipPosRef.current.copy(p)}
        />
        <HaulingHUD
          contract={contract}
          elapsedMs={elapsedMs}
          checkpointIndex={checkpointIndex}
          checkpointTotal={checkpointTotal || (route.checkpoints.length + 1)}
          cargoIntegrity={cargoIntegrity}
          engineFlicker={engineFlicker}
          onExit={handleExit}
        />

        {active?.kind === 'navigation' && active.variant === 'debris_field' && (
          <DebrisFieldMinigame onComplete={handleDebrisFieldDone} />
        )}
        {active?.kind === 'navigation' && active.variant === 'engine_flicker' && (
          <EngineFlickerKickOff
            onStart={handleEngineFlickerStart}
            onEnd={handleEngineFlickerEnd}
          />
        )}
        {active?.kind === 'combat' && (
          <PirateResolver
            onResolved={handlePirateFightResolved}
            onDropCargo={handlePirateDropCargo}
          />
        )}
        {active?.kind === 'opportunity' && (
          <OpportunityChoice
            title={OPPORTUNITY_ENCOUNTERS[active.variant].title}
            description={OPPORTUNITY_ENCOUNTERS[active.variant].description}
            acceptLabel={active.variant === 'floating_cargo_pod' ? 'Collect (+40 GHAI)' : 'Help them (+50 GHAI)'}
            declineLabel="Keep flying"
            onAccept={() => handleOpportunityAccept(active.variant)}
            onDecline={closeEncounter}
          />
        )}
        {active?.kind === 'atmosphere' && (
          <AtmosphereBanner
            variant={active.variant}
            descriptor={ATMOSPHERE_ENCOUNTERS[active.variant]}
            chatterSpeaker={active.speaker}
            chatterLine={active.line}
            onDismiss={closeEncounter}
          />
        )}
      </div>
    )
  }

  if (stage === 'results' && contract) {
    return (
      <DeliveryResults
        contract={contract}
        outcome={outcome}
        elapsedMs={elapsedMs}
        cargoIntegrity={cargoIntegrity}
        bonusGhai={bonusGhai}
        failureReason={failureReason}
        onBackToHub={() => { setContract(null); setStage('hub') }}
      />
    )
  }

  return null
}

/** Small wrapper — shows the notice modal, starts/ends the speed penalty via side effects. */
function EngineFlickerKickOff({ onStart, onEnd }: { onStart: () => void; onEnd: () => void }) {
  useEffect(() => {
    onStart()
  }, [onStart])
  return <EngineFlickerNotice durationMs={8000} onDismiss={onEnd} />
}

/** Shows fight-or-pay first, then launches MiniCardBattle on Fight. */
function PirateResolver({
  onResolved,
  onDropCargo,
}: {
  onResolved: (r: { outcome: 'won' | 'lost'; playerHullLeft: number }) => void
  onDropCargo: () => void
}) {
  const [fighting, setFighting] = useState(false)
  if (!fighting) {
    return <PirateAmbushChoice onFight={() => setFighting(true)} onPayTax={onDropCargo} />
  }
  return <MiniCardBattle onResolved={onResolved} />
}

const S: Record<string, React.CSSProperties> = {
  flightPage: { position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' },
}
