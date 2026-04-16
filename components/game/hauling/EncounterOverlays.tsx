'use client'

import { useEffect, useState } from 'react'
import type { EncounterDescriptor } from '@/lib/game/hauling/encounters'

const MODAL_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(2,1,10,0.85)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: 20,
}
const CARD_STYLE: React.CSSProperties = {
  width: '100%',
  maxWidth: 480,
  padding: 28,
  borderRadius: 14,
  background: 'linear-gradient(145deg, rgba(20,22,40,0.98), rgba(12,14,30,0.98))',
  border: '1px solid rgba(127,119,221,0.4)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
  color: '#e8e4f0',
  fontFamily: 'var(--font-sans)',
}
const EYEBROW: React.CSSProperties = { fontSize: 12, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#00d4ff', marginBottom: 6 }
const TITLE_STYLE: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 12px' }
const BODY_STYLE: React.CSSProperties = { fontSize: 16, lineHeight: 1.55, color: 'rgba(220,216,230,0.85)', margin: '0 0 22px' }
const ACTIONS_ROW: React.CSSProperties = { display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }
const SECONDARY_BTN: React.CSSProperties = { padding: '11px 18px', borderRadius: 10, border: '1px solid rgba(127,119,221,0.35)', background: 'transparent', color: '#e8e4f0', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
const PRIMARY_BTN: React.CSSProperties = { padding: '11px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #af52de)', color: '#050210', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }
const DANGER_BTN: React.CSSProperties = { ...PRIMARY_BTN, background: 'linear-gradient(135deg, #ff6b6b, #ff9447)', boxShadow: '0 0 20px rgba(255,107,107,0.35)' }

// --- Pirate Ambush: fight-or-pay modal ---
export function PirateAmbushChoice({ onFight, onPayTax }: { onFight: () => void; onPayTax: () => void }) {
  return (
    <div style={MODAL_STYLE}>
      <div style={{ ...CARD_STYLE, borderColor: 'rgba(255,107,107,0.45)' }}>
        <div style={{ ...EYEBROW, color: '#ff6b6b' }}>Combat Encounter</div>
        <h2 style={TITLE_STYLE}>Pirate Ambush</h2>
        <p style={BODY_STYLE}>
          A pirate frigate cuts across your bow. Their comms crackle: &ldquo;Cargo or combat. Your call, pilot.&rdquo;
        </p>
        <div style={ACTIONS_ROW}>
          <button onClick={onPayTax} style={SECONDARY_BTN}>Drop 20% cargo</button>
          <button onClick={onFight} style={DANGER_BTN}>Fight (3-turn battle)</button>
        </div>
      </div>
    </div>
  )
}

// --- Opportunity: yes/no modal ---
export function OpportunityChoice({
  title,
  description,
  acceptLabel,
  declineLabel,
  onAccept,
  onDecline,
}: {
  title: string
  description: string
  acceptLabel: string
  declineLabel: string
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div style={MODAL_STYLE}>
      <div style={{ ...CARD_STYLE, borderColor: 'rgba(127,255,159,0.4)' }}>
        <div style={{ ...EYEBROW, color: '#7fff9f' }}>Opportunity</div>
        <h2 style={TITLE_STYLE}>{title}</h2>
        <p style={BODY_STYLE}>{description}</p>
        <div style={ACTIONS_ROW}>
          <button onClick={onDecline} style={SECONDARY_BTN}>{declineLabel}</button>
          <button onClick={onAccept} style={PRIMARY_BTN}>{acceptLabel}</button>
        </div>
      </div>
    </div>
  )
}

// --- Engine Flicker: informational modal (auto-closes after delay) ---
export function EngineFlickerNotice({ durationMs, onDismiss }: { durationMs: number; onDismiss: () => void }) {
  const [remaining, setRemaining] = useState(durationMs)
  useEffect(() => {
    const start = performance.now()
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start
      const left = Math.max(0, durationMs - elapsed)
      setRemaining(left)
      if (left <= 0) {
        window.clearInterval(id)
        onDismiss()
      }
    }, 150)
    return () => window.clearInterval(id)
  }, [durationMs, onDismiss])
  return (
    <div style={MODAL_STYLE}>
      <div style={{ ...CARD_STYLE, borderColor: 'rgba(255,179,71,0.45)' }}>
        <div style={{ ...EYEBROW, color: '#ffb347' }}>Navigation Hazard</div>
        <h2 style={TITLE_STYLE}>Engine Flicker</h2>
        <p style={BODY_STYLE}>
          Thrusters sputter. Power drops 50% while the coolant cycles. Wait it out.
        </p>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#ffb347', textAlign: 'center', marginBottom: 18, fontFamily: 'var(--font-mono), Consolas, monospace' }}>
          {(remaining / 1000).toFixed(1)}s
        </div>
        <div style={ACTIONS_ROW}>
          <button onClick={onDismiss} style={SECONDARY_BTN}>Skip</button>
        </div>
      </div>
    </div>
  )
}

// --- Atmosphere banner: non-blocking, auto-dismisses after 5s ---
export function AtmosphereBanner({
  variant,
  descriptor,
  chatterSpeaker,
  chatterLine,
  onDismiss,
}: {
  variant: 'cast_chatter' | 'deep_space_silence'
  descriptor: EncounterDescriptor
  chatterSpeaker?: string
  chatterLine?: string
  onDismiss: () => void
}) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, 5000)
    return () => window.clearTimeout(t)
  }, [onDismiss])

  const isChatter = variant === 'cast_chatter'

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '14px 22px',
      borderRadius: 12,
      background: isChatter ? 'rgba(127,119,221,0.14)' : 'rgba(12,14,30,0.9)',
      border: `1px solid ${isChatter ? 'rgba(127,119,221,0.55)' : 'rgba(220,216,230,0.45)'}`,
      backdropFilter: 'blur(10px)',
      color: '#e8e4f0',
      fontFamily: 'var(--font-sans)',
      zIndex: 40,
      maxWidth: 520,
      textAlign: 'center',
      animation: 'fadeInBanner 0.4s ease',
    }}>
      <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: isChatter ? '#af52de' : 'rgba(220,216,230,0.6)', fontWeight: 600, marginBottom: 4 }}>
        {descriptor.title}
      </div>
      {isChatter && chatterSpeaker && chatterLine ? (
        <div style={{ fontSize: 16, color: '#fff' }}>
          <b style={{ color: '#00d4ff' }}>{chatterSpeaker}:</b> <span style={{ fontStyle: 'italic' }}>&ldquo;{chatterLine}&rdquo;</span>
        </div>
      ) : (
        <div style={{ fontSize: 15, color: 'rgba(220,216,230,0.85)', fontStyle: 'italic' }}>
          {descriptor.description}
        </div>
      )}
    </div>
  )
}
