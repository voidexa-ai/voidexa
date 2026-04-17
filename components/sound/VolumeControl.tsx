'use client'

/**
 * Sprint 7 — top-nav volume + mute control. Drops into MiniNav.
 *
 * Renders as a 32x32 icon that opens a small slider popover on hover/click.
 * Font 14px+, opacity 0.85 (over 0.5 floor) per voidexa style minima.
 */

import { useState } from 'react'
import { useSoundManager } from '@/lib/sound/useSoundManager'

export default function VolumeControl() {
  const { volume, muted, setVolume, toggleMute } = useSoundManager()
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        style={{
          width: 32,
          height: 32,
          background: 'rgba(0, 20, 40, 0.5)',
          border: '1px solid rgba(0, 212, 255, 0.4)',
          borderRadius: 6,
          color: '#00d4ff',
          cursor: 'pointer',
          fontSize: 14,
          opacity: 0.85,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {muted || volume === 0 ? '🔇' : volume < 0.4 ? '🔈' : volume < 0.75 ? '🔉' : '🔊'}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 38,
            right: 0,
            background: 'rgba(0, 10, 24, 0.92)',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            borderRadius: 8,
            padding: '12px 14px',
            backdropFilter: 'blur(10px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 180,
          }}
        >
          <span style={{ color: '#00d4ff', fontSize: 14, opacity: 0.9 }}>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={muted}
            style={{ flex: 1, accentColor: '#00d4ff' }}
            aria-label="Master volume"
          />
          <span style={{ color: '#fff', fontSize: 14, minWidth: 28, textAlign: 'right' }}>
            {Math.round((muted ? 0 : volume) * 100)}
          </span>
        </div>
      )}
    </div>
  )
}
