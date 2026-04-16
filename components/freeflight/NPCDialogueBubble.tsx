'use client'

import { useEffect } from 'react'
import type { NPCDef } from '@/lib/game/freeflight/npcs'

interface Props {
  npc: NPCDef
  line: string
  onDismiss: () => void
}

export default function NPCDialogueBubble({ npc, line, onDismiss }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, 6000)
    return () => window.clearTimeout(t)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed',
      top: 120,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: 520,
      padding: '14px 22px',
      borderRadius: 12,
      background: 'rgba(6,10,20,0.82)',
      border: `1px solid ${npc.color}88`,
      backdropFilter: 'blur(10px)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      boxShadow: `0 0 22px ${npc.color}40`,
      zIndex: 30,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 12,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: npc.color,
        fontWeight: 600,
        marginBottom: 4,
        textShadow: `0 0 8px ${npc.color}`,
      }}>
        {npc.name} · {npc.homeZone}
      </div>
      <div style={{
        fontSize: 16,
        lineHeight: 1.55,
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.92)',
      }}>
        &ldquo;{line}&rdquo;
      </div>
    </div>
  )
}
