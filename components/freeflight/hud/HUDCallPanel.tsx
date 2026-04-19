'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useEscStack } from '@/lib/ui/escStack'
import { useMissedCalls } from '@/lib/ui/missedCalls'

export type HUDCallType = 'exploration' | 'npc' | 'hostile' | 'mission' | 'system'

export interface HUDCallChoice {
  id: string
  label: string
  reward?: string
  onSelect: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface HUDCall {
  id: string
  type: HUDCallType
  title: string
  subtitle?: string
  iconUrl?: string
  flavor?: string
  body?: string
  choices: HUDCallChoice[]
  autoDismissMs?: number
  onDismiss: () => void
}

interface Props {
  call: HUDCall
}

interface TypeStyle {
  border: string
  glow: string
  accent: string
  urgent?: boolean
}

const TYPE_STYLES: Record<HUDCallType, TypeStyle> = {
  exploration: { border: 'rgba(0, 212, 255, 0.6)', glow: '0 0 18px rgba(0, 212, 255, 0.25)', accent: '#7fd8ff' },
  npc:         { border: 'rgba(0, 212, 255, 0.6)', glow: '0 0 18px rgba(0, 212, 255, 0.25)', accent: '#7fd8ff' },
  hostile:     { border: 'rgba(255, 68, 68, 0.75)', glow: '0 0 22px rgba(255, 68, 68, 0.35)', accent: '#ff6b6b', urgent: true },
  mission:     { border: 'rgba(255, 209, 102, 0.7)', glow: '0 0 20px rgba(255, 209, 102, 0.3)', accent: '#ffd166' },
  system:      { border: 'rgba(255, 140, 66, 0.65)', glow: '0 0 18px rgba(255, 140, 66, 0.3)', accent: '#ff8c42' },
}

export default function HUDCallPanel({ call }: Props) {
  const style = TYPE_STYLES[call.type]
  const registerEsc = useEscStack((s) => s.register)
  const unregisterEsc = useEscStack((s) => s.unregister)
  const logMissed = useMissedCalls((s) => s.push)
  const [fadingOut, setFadingOut] = useState(false)
  const dismissRef = useRef(call.onDismiss)
  const dismissedRef = useRef(false)
  dismissRef.current = call.onDismiss

  const dismissAsMissed = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    logMissed({ id: call.id, type: call.type, title: call.title, subtitle: call.subtitle })
    dismissRef.current()
  }

  const dismissWithFade = () => {
    if (dismissedRef.current) return
    setFadingOut(true)
    window.setTimeout(dismissAsMissed, 220)
  }

  useEffect(() => {
    void import('@/lib/sound/events').then(({ playEvent }) => {
      playEvent(call.type === 'hostile' ? 'ff.encounter.alert' : 'ff.scanner.ping', { volume: 0.5 })
    })
  }, [call.id, call.type])

  useEffect(() => {
    const id = `hud-call-${call.id}`
    registerEsc({ id, priority: 'hud-call', onEscape: dismissWithFade })
    return () => unregisterEsc(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.id, registerEsc, unregisterEsc])

  useEffect(() => {
    if (!call.autoDismissMs) return
    const t = window.setTimeout(dismissWithFade, call.autoDismissMs)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.autoDismissMs, call.id])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && call.choices.length > 0) {
        const primary = call.choices.find((c) => c.variant === 'primary') ?? call.choices[0]
        handleChoice(primary)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call.id])

  function handleChoice(choice: HUDCallChoice) {
    if (dismissedRef.current) return
    dismissedRef.current = true
    choice.onSelect()
    call.onDismiss()
  }

  const wrap = useMemo<React.CSSProperties>(() => ({
    position: 'fixed',
    top: 24,
    left: 24,
    zIndex: 40,
    width: 320,
    maxWidth: 'calc(100vw - 48px)',
    minHeight: 140,
    padding: '12px 14px',
    display: 'flex',
    gap: 12,
    background: 'rgba(0, 20, 40, 0.75)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: `1px solid ${style.border}`,
    borderRadius: 8,
    color: '#ffffff',
    fontFamily: 'var(--font-inter, system-ui)',
    opacity: fadingOut ? 0 : 1,
    transform: fadingOut ? 'translateX(-12px)' : 'translateX(0)',
    transition: 'opacity 200ms ease-out, transform 200ms ease-out',
    boxShadow: style.glow,
    pointerEvents: 'auto',
    animation: style.urgent && !fadingOut ? 'hudCallPulse 1.2s ease-in-out infinite' : undefined,
  }), [style, fadingOut])

  return (
    <div
      role="alert"
      data-testid={`hud-call-${call.type}`}
      data-call-id={call.id}
      style={wrap}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Scan-line overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        borderRadius: 8, opacity: 0.35,
        background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 2px, rgba(0,212,255,0.05) 2px, rgba(0,212,255,0.05) 3px)',
      }} />

      <div style={{
        width: 48, height: 48, flexShrink: 0,
        borderRadius: 6,
        border: `1px solid ${style.border}`,
        background: `rgba(0, 0, 0, 0.4)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        fontSize: 22,
        color: style.accent,
      }}>
        {call.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={call.iconUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <TypeGlyph type={call.type} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {call.subtitle && (
          <div style={{
            fontSize: 14, fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: style.accent,
            textShadow: `0 0 6px ${style.accent}80`,
          }}>{call.subtitle}</div>
        )}
        <div style={{
          fontSize: 16, fontWeight: 700, lineHeight: 1.25,
          color: '#ffffff',
          letterSpacing: '-0.01em',
        }}>{call.title}</div>
        {call.flavor && (
          <div style={{
            fontSize: 14, fontStyle: 'italic',
            color: 'rgba(220, 236, 255, 0.75)',
            lineHeight: 1.35,
          }}>&ldquo;{call.flavor}&rdquo;</div>
        )}
        {call.body && (
          <div style={{
            fontSize: 14, lineHeight: 1.4,
            color: 'rgba(220, 236, 255, 0.88)',
          }}>{call.body}</div>
        )}
        {call.choices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {call.choices.map((choice, i) => (
              <button
                key={choice.id}
                type="button"
                data-testid={`hud-call-choice-${choice.id}`}
                onClick={() => handleChoice(choice)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px',
                  fontSize: 14, fontWeight: 600,
                  letterSpacing: '0.02em',
                  borderRadius: 6,
                  border: `1px solid ${choice.variant === 'danger' ? 'rgba(255,107,107,0.6)' : style.border}`,
                  background: choice.variant === 'primary' ? `${style.accent}22` : 'rgba(0, 0, 0, 0.35)',
                  color: choice.variant === 'danger' ? '#ff8a8a' : '#ffffff',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <span>
                  {i === 0 ? <span style={{ opacity: 0.6, marginRight: 6 }}>⏎</span> : null}
                  {choice.label}
                </span>
                {choice.reward && (
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 999,
                    background: 'rgba(255, 209, 102, 0.14)',
                    border: '1px solid rgba(255, 209, 102, 0.5)',
                    color: '#ffd166',
                    letterSpacing: '0.04em',
                  }}>{choice.reward}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes hudCallPulse {
          0%, 100% { border-color: rgba(255, 68, 68, 0.75); box-shadow: 0 0 18px rgba(255, 68, 68, 0.3); }
          50%      { border-color: rgba(255, 120, 120, 1); box-shadow: 0 0 28px rgba(255, 68, 68, 0.6); }
        }
      `}</style>
    </div>
  )
}

function TypeGlyph({ type }: { type: HUDCallType }) {
  const glyph: Record<HUDCallType, string> = {
    exploration: '◉',
    npc: '✦',
    hostile: '⚠',
    mission: '◆',
    system: 'ⓘ',
  }
  return <span aria-hidden>{glyph[type]}</span>
}
