'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CockpitHUD from './cockpit/CockpitHUD'
import CockpitPicker from './cockpit/CockpitPicker'
import ShipPicker from './ships/ShipPicker'
import AchievementPanel from '@/components/achievements/AchievementPanel'
import MissionOverlay from './MissionOverlay'
import NPCDialogueBubble from './NPCDialogueBubble'
import ExplorationChoiceModal from './ExplorationChoiceModal'
import TutorialGuide from './TutorialGuide'
import CardDropReveal from '@/components/ui/CardDropReveal'
import HolographicMap from './HolographicMap'
import WarpAnimation from './WarpAnimation'
import { useActiveMission } from './useActiveMission'
import { useExplorationResolved } from './useExplorationResolved'
import { useActiveQuestChain } from '@/lib/game/quests/progress'
import { useWarp } from './useWarp'
import type { CardTemplate, GameCardRarity } from '@/lib/game/cards/index'
import type { LandmarkDef } from '@/lib/game/freeflight/landmarks'
import type { NPCDef } from '@/lib/game/freeflight/npcs'
import type { ExplorationEncounter } from '@/lib/game/freeflight/explorationEncounters'
import type { ShipState, StationDef, DerelictDef } from './types'
import { createShipState } from './types'
import { recordArchaeologist, recordSalvager } from './achievements'
import { findShip, getStoredShipId, type ShipCatalogEntry } from './ships/catalog'
import { findCockpit, getStoredCockpitId, type CockpitCatalogEntry, COCKPIT_CATALOG } from './cockpit/catalog'
import { getCockpitForShip, getCockpitSpec } from '@/lib/data/shipCockpits'

const FreeFlightCanvas = dynamic(() => import('./FreeFlightCanvas'), {
  ssr: false,
  loading: () => null,
})

interface Toast {
  id: number
  text: string
  color: string
}

export default function FreeFlightPage() {
  const router = useRouter()
  const shipRef = useRef<ShipState>(createShipState())
  const [firstPerson, setFirstPerson] = useState(false)
  const [dockStation, setDockStation] = useState<StationDef | null>(null)
  const [nearDerelict, setNearDerelict] = useState<DerelictDef | null>(null)
  const [nearLandmark, setNearLandmark] = useState<LandmarkDef | null>(null)
  const [nearNPC, setNearNPC] = useState<NPCDef | null>(null)
  const [npcHostile, setNPCHostile] = useState(false)
  const [activeDialogue, setActiveDialogue] = useState<{ npc: NPCDef; line: string } | null>(null)
  const [activeEncounter, setActiveEncounter] = useState<ExplorationEncounter | null>(null)

  const { resolved: resolvedEncounterIds, resolve: resolveEncounter } = useExplorationResolved(
    (ghai, name) => pushToast(`+${ghai} GHAI · ${name.toUpperCase()}`, '#ffd166'),
  )

  const questChain = useActiveQuestChain((title) => {
    pushToast(`TITLE UNLOCKED · ${title.toUpperCase()}`, '#ffd166')
  })

  const [missionCardDrop, setMissionCardDrop] = useState<{ card: CardTemplate; rarity: GameCardRarity } | null>(null)
  const warp = useWarp()

  const handleEncounterTrigger = (enc: ExplorationEncounter) => {
    if (resolvedEncounterIds.has(enc.id)) return
    if (document.pointerLockElement) document.exitPointerLock()
    setActiveEncounter(enc)
  }

  const handleNearNPCChange = (npc: NPCDef | null, hostile: boolean) => {
    setNearNPC(npc)
    setNPCHostile(hostile)
  }

  const handleGreet = () => {
    if (!nearNPC || npcHostile) return
    setActiveDialogue({ npc: nearNPC, line: nearNPC.dialogue.greeting })
  }
  const [nebulaColor, setNebulaColor] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dockedAt, setDockedAt] = useState<StationDef | null>(null)
  const [lorePopup, setLorePopup] = useState<{ title: string; body: string } | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)
  const [selectedShip, setSelectedShip] = useState<ShipCatalogEntry | null>(null)
  const [pickerOpen, setPickerOpen] = useState(true)
  const [selectedCockpit, setSelectedCockpit] = useState<CockpitCatalogEntry>(() => findCockpit(null))
  const [cockpitPickerOpen, setCockpitPickerOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)

  useEffect(() => {
    const storedId = getStoredShipId()
    if (storedId) {
      const ship = findShip(storedId)
      setSelectedShip(ship)
      setPickerOpen(false)
    }
    const cid = getStoredCockpitId()
    if (cid) setSelectedCockpit(findCockpit(cid))
  }, [])

  const pushToast = (text: string, color = '#66ff99') => {
    const id = ++toastIdRef.current
    setToasts(ts => [...ts, { id, text, color }])
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2800)
  }

  const {
    mission: activeMission,
    waypoints: missionWaypoints,
    currentIndex: missionWaypointIndex,
    total: missionWaypointTotal,
    handleWaypointCleared,
  } = useActiveMission(
    (ghai, name) => {
      pushToast(`+${ghai} GHAI · ${name.toUpperCase()} DELIVERED`, '#ffd166')
    },
    (card, rarity) => {
      setMissionCardDrop({ card, rarity })
    },
  )

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const handleDock = () => {
    if (!dockStation) return
    if (document.pointerLockElement) document.exitPointerLock()
    setDockedAt(dockStation)

    if (dockStation.kind === 'repair') {
      shipRef.current.health = 100
      shipRef.current.shield = 100
      pushToast('REPAIRED · HULL 100 · SHIELD 100', '#66ff99')
      // Repair stations don't open menu — instant top-up
      setDockedAt(null)
      return
    }
    if (dockStation.kind === 'abandoned') {
      const res = recordArchaeologist(dockStation.id)
      setLorePopup({
        title: `${dockStation.name} · Salvaged Data`,
        body: `Station Log #001: Last entry dated 2089. Emergency evacuation ordered. Reason: [CORRUPTED]\n\nArchaeologist progress: ${res.total} / 1 station${res.isNew ? ' · NEW DISCOVERY' : ''}`,
      })
      if (res.isNew) pushToast(`ARCHAEOLOGIST +1 · ${res.total} stations logged`, '#ff6699')
      return
    }
    if (dockStation.kind === 'trading') {
      setMenuOpen(true)
      return
    }
    // hub
    setMenuOpen(true)
  }

  const handleScanDerelict = () => {
    if (!nearDerelict) return
    const res = recordSalvager(nearDerelict.id)
    setLorePopup({
      title: nearDerelict.name,
      body: `${nearDerelict.lore}\n\nSalvager progress: ${res.total} / 3 derelicts scanned${res.isNew ? ' · NEW DISCOVERY' : ''}`,
    })
    if (res.isNew) pushToast(`SALVAGER +1 · ${res.total} ships scanned`, '#00d4ff')
  }

  const handleScanLandmark = () => {
    if (!nearLandmark) return
    setLorePopup({
      title: `${nearLandmark.name} · ${nearLandmark.zone}`,
      body: `${nearLandmark.scanText}\n\n${nearLandmark.loreSnippet}\n\n— ${nearLandmark.hook}`,
    })
    pushToast(`SCANNED · ${nearLandmark.name.toUpperCase()}`, '#ffd166')
    // Sprint 3 Task 1: advance First Day Real Sky if this landmark triggers a step.
    void questChain.recordEvent({ type: 'landmark_scan', target: nearLandmark.id })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (lorePopup) { setLorePopup(null); return }
        if (achievementsOpen) { setAchievementsOpen(false); return }
        setMenuOpen(v => !v)
        setDockedAt(null)
        if (document.pointerLockElement) document.exitPointerLock()
      }
      if (e.code === 'KeyE' && dockStation && !menuOpen && !lorePopup) {
        handleDock()
      }
      if (e.code === 'KeyF' && nearDerelict && !menuOpen && !lorePopup) {
        handleScanDerelict()
      }
      if (e.code === 'KeyF' && nearLandmark && !nearDerelict && !menuOpen && !lorePopup) {
        handleScanLandmark()
      }
      if (e.code === 'KeyG' && nearNPC && !npcHostile && !menuOpen && !lorePopup) {
        handleGreet()
      }
      if (e.code === 'KeyW' && !menuOpen && !lorePopup && !activeEncounter && !warp.state.warping && !warp.state.mapOpen) {
        // Open the warp map. Ship is at the nearest warp node by default (Sprint 4 uses 'voidexa_hub').
        warp.openMap()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dockStation, nearDerelict, nearLandmark, nearNPC, npcHostile, menuOpen, lorePopup, achievementsOpen])

  const onShipState = (ref: React.MutableRefObject<ShipState>) => {
    shipRef.current = ref.current
  }

  const onWarpJump = (_from: string, to: string) => {
    pushToast(`WARP JUMP · ARRIVED AT ${to.toUpperCase()}`, '#a866ff')
  }

  const exitToGalaxy = () => router.push('/starmap')

  // Ship drives cockpit. Small fighters (qs_*, small USC) map to the Vattalus
  // standalone cockpit; everything else keeps the Hi-Rez frame+interior bundle
  // and honors the user's manual cockpit pick from CockpitPicker.
  const { cockpitUrl, cockpitSpec } = useMemo(() => {
    if (!selectedShip) {
      return { cockpitUrl: selectedCockpit.url, cockpitSpec: undefined }
    }
    const type = getCockpitForShip(selectedShip.id)
    if (type === 'fighter_light' || type === 'fighter_medium') {
      const spec = getCockpitSpec(selectedShip.id)
      return { cockpitUrl: spec.url, cockpitSpec: spec }
    }
    return { cockpitUrl: selectedCockpit.url, cockpitSpec: undefined }
  }, [selectedShip, selectedCockpit])

  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#02030a',
    }}>
      {selectedShip && (
        <FreeFlightCanvas
          onShipState={onShipState}
          onDockStationChange={setDockStation}
          onNearDerelictChange={setNearDerelict}
          onNebulaChange={setNebulaColor}
          onWarpJump={onWarpJump}
          onFirstPersonChange={setFirstPerson}
          shipUrl={selectedShip.url}
          shipScale={selectedShip.ingameScale}
          cockpitUrl={cockpitUrl}
          cockpitSpec={cockpitSpec}
          missionWaypoints={missionWaypoints}
          missionWaypointIndex={missionWaypointIndex}
          onMissionWaypointCleared={handleWaypointCleared}
          onNearLandmarkChange={setNearLandmark}
          onNearNPCChange={handleNearNPCChange}
          onEncounterTrigger={handleEncounterTrigger}
          resolvedEncounterIds={resolvedEncounterIds}
        />
      )}

      {activeMission && (
        <MissionOverlay
          mission={activeMission}
          cleared={missionWaypointIndex}
          total={missionWaypointTotal}
          visible={!menuOpen && !lorePopup && !pickerOpen && !cockpitPickerOpen && !achievementsOpen}
        />
      )}

      {pickerOpen && (
        <ShipPicker
          currentId={selectedShip?.id}
          onPick={(ship) => {
            setSelectedShip(ship)
            setPickerOpen(false)
            pushToast(`LAUNCHED · ${ship.name.toUpperCase()}`, '#00d4ff')
          }}
          onCancel={selectedShip ? () => setPickerOpen(false) : undefined}
        />
      )}

      {achievementsOpen && (
        <AchievementPanel overlay onClose={() => setAchievementsOpen(false)} />
      )}

      {cockpitPickerOpen && (
        <CockpitPicker
          currentId={selectedCockpit.id}
          onPick={(cockpit) => {
            setSelectedCockpit(cockpit)
            setCockpitPickerOpen(false)
            pushToast(`COCKPIT · ${cockpit.name.toUpperCase()}`, '#a866ff')
          }}
          onCancel={() => setCockpitPickerOpen(false)}
        />
      )}

      {/* Nebula fog overlay */}
      {nebulaColor && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 5,
          pointerEvents: 'none',
          background: `radial-gradient(circle at center, ${nebulaColor}22 0%, ${nebulaColor}11 40%, transparent 80%)`,
          mixBlendMode: 'screen',
          animation: 'nebulaPulse 6s ease-in-out infinite',
        }}>
          <style>{`
            @keyframes nebulaPulse {
              0%,100%{opacity:0.6}
              50%{opacity:0.9}
            }
          `}</style>
        </div>
      )}

      <CockpitHUD ship={shipRef} visible={firstPerson && !menuOpen && !lorePopup} />

      {!firstPerson && !menuOpen && !lorePopup && (
        <div style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 10,
          color: '#6fe6ff', fontFamily: 'var(--font-space, monospace)',
          fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '10px 14px',
          background: 'rgba(0,18,30,0.3)',
          border: '1px solid rgba(0,212,255,0.35)',
          borderRadius: 6, backdropFilter: 'blur(6px)',
          textShadow: '0 0 8px #00d4ff88',
        }}>
          <div>WASD · Thrust</div>
          <div>Mouse · Look (click to lock)</div>
          <div>RMB · Free Look · Scroll · Zoom</div>
          <div>Shift · Boost · Space · Brake</div>
          <div>V · Cockpit · E · Dock · F · Scan · ESC · Menu</div>
        </div>
      )}

      {/* Dock prompt */}
      {dockStation && !menuOpen && !lorePopup && (
        <PromptBanner
          text={`Press E to dock · ${dockStation.name}${dockStation.kind === 'abandoned' ? ' · ABANDONED' : ''}`}
          color={
            dockStation.kind === 'repair' ? '#66ff99' :
            dockStation.kind === 'trading' ? '#ffaa33' :
            dockStation.kind === 'abandoned' ? '#ff3355' :
            '#00d4ff'
          }
        />
      )}

      {/* Scan prompt */}
      {nearDerelict && !menuOpen && !lorePopup && !dockStation && (
        <PromptBanner text={`Press F to scan · ${nearDerelict.name}`} color="#ff8855" offset={60} />
      )}

      {/* Landmark scan prompt */}
      {nearLandmark && !nearDerelict && !menuOpen && !lorePopup && !dockStation && (
        <PromptBanner text={`Press F to scan · ${nearLandmark.name}`} color={nearLandmark.color} offset={60} />
      )}

      {/* NPC greet / hostile prompt */}
      {nearNPC && !menuOpen && !lorePopup && !activeDialogue && (
        <PromptBanner
          text={npcHostile ? `⚠ HOSTILE · ${nearNPC.name}` : `Press G to greet · ${nearNPC.name}`}
          color={nearNPC.color}
          offset={120}
        />
      )}

      {/* NPC dialogue bubble */}
      {activeDialogue && (
        <NPCDialogueBubble
          npc={activeDialogue.npc}
          line={activeDialogue.line}
          onDismiss={() => setActiveDialogue(null)}
        />
      )}

      {/* Exploration encounter choice modal */}
      {activeEncounter && (
        <ExplorationChoiceModal
          encounter={activeEncounter}
          onChoose={choice => { void resolveEncounter(activeEncounter, choice) }}
          onDismiss={() => setActiveEncounter(null)}
        />
      )}

      {/* First Day Real Sky tutorial panel */}
      {questChain.step && !questChain.loading && (
        <TutorialGuide
          step={questChain.step}
          completedIds={questChain.completedIds}
          onSkip={questChain.skip}
          visible={!menuOpen && !lorePopup && !activeEncounter && !activeDialogue}
        />
      )}

      {/* Card drop reveal — fires when a mission completion rolls a loot card. */}
      {missionCardDrop && (
        <CardDropReveal
          card={missionCardDrop.card}
          rarity={missionCardDrop.rarity}
          onDismiss={() => setMissionCardDrop(null)}
        />
      )}

      {/* Sprint 4 Task 2: Holographic warp map + animation. */}
      {warp.state.mapOpen && (
        <HolographicMap
          currentNodeId="voidexa_hub"
          ghaiBalance={warp.state.balance ?? 0}
          onClose={warp.closeMap}
          onWarp={async (dest, cost) => {
            const ok = await warp.beginWarp(dest, cost)
            if (ok) {
              // Snap the ship position to the destination after animation ends.
              window.setTimeout(() => {
                shipRef.current.position.set(dest.x, dest.y + 8, dest.z + 12)
                warp.finishWarp()
                pushToast(`WARPED · ${dest.name.toUpperCase()} · -${cost} GHAI`, '#7fd8ff')
              }, 1900)
            }
          }}
        />
      )}
      {warp.state.warping && (
        <WarpAnimation
          destinationName={warp.state.warping.destination.name}
          onComplete={warp.finishWarp}
        />
      )}
      {warp.state.error && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 30,
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(255,107,107,0.14)', border: '1px solid rgba(255,107,107,0.5)',
          color: '#ffafaf', fontSize: 14, fontFamily: 'var(--font-sans)',
        }}>{warp.state.error}</div>
      )}

      {/* Toasts */}
      <div style={{
        position: 'fixed', top: 80, right: 24, zIndex: 25,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '10px 16px',
            background: 'rgba(6, 10, 20, 0.75)',
            border: `1px solid ${t.color}88`,
            borderRadius: 6,
            color: '#fff',
            fontFamily: 'var(--font-space, monospace)',
            fontSize: 14,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: `0 0 18px ${t.color}55`,
            textShadow: `0 0 8px ${t.color}`,
            backdropFilter: 'blur(8px)',
          }}>
            {t.text}
          </div>
        ))}
      </div>

      {/* Lore popup */}
      {lorePopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(2, 4, 14, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            maxWidth: 560,
            padding: '28px 32px',
            background: 'linear-gradient(135deg, rgba(20,10,30,0.85), rgba(10,20,30,0.75))',
            border: '1px solid rgba(255, 136, 85, 0.5)',
            borderRadius: 10,
            boxShadow: '0 0 40px rgba(255, 136, 85, 0.3)',
            color: '#fff',
            fontFamily: 'var(--font-inter, system-ui)',
          }}>
            <div style={{
              fontSize: 18, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#ffaa77',
              textShadow: '0 0 12px #ff8855',
              marginBottom: 14,
              fontFamily: 'var(--font-space, monospace)',
            }}>
              {lorePopup.title}
            </div>
            <div style={{
              fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              color: 'rgba(255,255,255,0.88)',
            }}>
              {lorePopup.body}
            </div>
            <button
              onClick={() => setLorePopup(null)}
              style={{
                marginTop: 22,
                padding: '10px 22px',
                background: 'rgba(255, 136, 85, 0.15)',
                border: '1px solid rgba(255, 136, 85, 0.6)',
                borderRadius: 6,
                color: '#fff',
                fontFamily: 'var(--font-space, monospace)',
                fontSize: 14,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textShadow: '0 0 8px #ff8855',
              }}
            >
              Close · ESC
            </button>
          </div>
        </div>
      )}

      {/* ESC / Dock menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(2, 4, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          color: '#fff', fontFamily: 'var(--font-space, system-ui)',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#00ffff',
            textShadow: '0 0 16px #00d4ff',
          }}>
            {dockedAt ? `Docked · ${dockedAt.name}` : 'Flight Menu'}
          </div>

          {dockedAt?.kind === 'trading' && (
            <div style={{
              maxWidth: 440,
              padding: '18px 24px',
              background: 'rgba(255, 170, 51, 0.1)',
              border: '1px solid rgba(255, 170, 51, 0.5)',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 15, lineHeight: 1.6,
              color: '#ffd699',
              textShadow: '0 0 10px #ffaa33',
              fontFamily: 'var(--font-inter, system-ui)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, letterSpacing: '0.1em' }}>
                TRADING POST
              </div>
              Player-to-player trade terminal. Post offers, browse open contracts, complete exchanges.
              <div style={{ marginTop: 14, opacity: 0.75, fontStyle: 'italic' }}>
                Coming Soon · Phase 9
              </div>
            </div>
          )}

          {dockedAt?.kind === 'hub' && (
            <div style={{
              maxWidth: 440,
              padding: '18px 24px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.5)',
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 15, lineHeight: 1.6,
              color: '#a8ecff',
              textShadow: '0 0 10px #00d4ff',
              fontFamily: 'var(--font-inter, system-ui)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, letterSpacing: '0.1em' }}>
                VOIDEXA HUB
              </div>
              Universal spawn. Shop, leaderboard, missions, card terminal — all landing here in future phases.
            </div>
          )}

          <button onClick={() => { setMenuOpen(false); setDockedAt(null) }} style={btnStyle('#00d4ff')}>Resume</button>
          <button onClick={() => { setMenuOpen(false); setDockedAt(null); setPickerOpen(true) }} style={btnStyle('#a866ff')}>Change Ship</button>
          <button onClick={() => { setMenuOpen(false); setDockedAt(null); setCockpitPickerOpen(true) }} style={btnStyle('#66e6ff')}>Change Cockpit</button>
          <button onClick={() => { setMenuOpen(false); setDockedAt(null); setAchievementsOpen(true) }} style={btnStyle('#f5b642')}>Achievements</button>
          <button onClick={exitToGalaxy} style={btnStyle('#ff6699')}>Return to Galaxy</button>
          <div style={{ marginTop: 20, fontSize: 14, opacity: 0.6, letterSpacing: '0.06em' }}>
            Click the canvas to re-lock mouse after resuming
          </div>
        </div>
      )}

      {!menuOpen && !lorePopup && (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            position: 'fixed', top: 20, left: '50%',
            transform: 'translateX(-50%)', zIndex: 30,
            padding: '6px 16px',
            background: 'rgba(6, 8, 18, 0.5)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: 999,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-space, system-ui)',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          Free Flight
        </button>
      )}
    </div>
  )
}

function PromptBanner({ text, color, offset = 0 }: { text: string; color: string; offset?: number }) {
  return (
    <div style={{
      position: 'fixed',
      top: `calc(62% - ${offset}px)`,
      left: '50%',
      transform: 'translate(-50%, -50%)', zIndex: 15,
      color: '#fff', fontFamily: 'var(--font-space, monospace)',
      fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '10px 20px',
      background: 'rgba(6, 10, 20, 0.55)',
      border: `1px solid ${color}88`,
      borderRadius: 6, backdropFilter: 'blur(8px)',
      boxShadow: `0 0 24px ${color}55`,
      textShadow: `0 0 10px ${color}`,
    }}>
      {text}
    </div>
  )
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '12px 32px',
    minWidth: 260,
    fontSize: 16,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    background: `${color}18`,
    border: `1px solid ${color}88`,
    borderRadius: 6,
    color: '#fff',
    fontFamily: 'var(--font-space, system-ui)',
    cursor: 'pointer',
    boxShadow: `0 0 18px ${color}44`,
    textShadow: `0 0 10px ${color}`,
  }
}
