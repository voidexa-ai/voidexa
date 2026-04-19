'use client'

const LINES: readonly string[] = [
  'WASD · Thrust',
  'Q / E · Roll Left / Right',
  'R / F · Ascend / Descend',
  'Mouse · Look (click canvas to lock)',
  'RMB · Free Look · Scroll · Zoom',
  'Shift · Boost · Space · Brake',
  'M / Tab · Warp Map',
  'V · Cockpit · E · Dock · F · Scan',
  'ESC · Menu',
]

export default function ControlsLegend() {
  return (
    <div
      data-testid="controls-legend"
      style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 10,
        color: '#6fe6ff', fontFamily: 'var(--font-space, monospace)',
        fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
        padding: '10px 14px',
        background: 'rgba(0,18,30,0.3)',
        border: '1px solid rgba(0,212,255,0.35)',
        borderRadius: 6, backdropFilter: 'blur(6px)',
        textShadow: '0 0 8px #00d4ff88',
        lineHeight: 1.7,
      }}
    >
      {LINES.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  )
}

export const CONTROLS_LEGEND_LINES = LINES
