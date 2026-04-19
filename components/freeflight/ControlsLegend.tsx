'use client'

// Sprint 16 Task 5 — premium redesign.
//
// Three-tier visual hierarchy:
//   • Keys: white-bold chips tinted cyan — the "what you press"
//   • Actions: muted gray prose — the "what it does"
//   • Category headers: dim cyan/amber uppercase — the "organization"
//
// Grouped into five categories with 1px hairline dividers so the pilot can
// parse the list at a glance instead of scanning nine uniform lines.

export interface ControlsLegendBinding {
  keys: readonly string[]
  action: string
}

export interface ControlsLegendCategory {
  id: string
  label: string
  bindings: readonly ControlsLegendBinding[]
}

export const CONTROLS_LEGEND_CATEGORIES: readonly ControlsLegendCategory[] = [
  {
    id: 'thrust',
    label: 'Thrust & Movement',
    bindings: [
      { keys: ['W', 'A', 'S', 'D'], action: 'Thrust' },
      { keys: ['Q', 'E'], action: 'Roll left / right' },
      { keys: ['R', 'F'], action: 'Ascend / descend' },
    ],
  },
  {
    id: 'camera',
    label: 'Camera',
    bindings: [
      { keys: ['Mouse'], action: 'Look (click canvas to lock)' },
      { keys: ['RMB'], action: 'Free look' },
      { keys: ['Scroll'], action: 'Zoom' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    bindings: [
      { keys: ['Shift'], action: 'Boost' },
      { keys: ['Space'], action: 'Brake' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    bindings: [
      { keys: ['M', 'Tab'], action: 'Warp map' },
      { keys: ['V'], action: 'Cockpit toggle' },
      { keys: ['E'], action: 'Dock at station' },
      { keys: ['F'], action: 'Scan target' },
    ],
  },
  {
    id: 'menu',
    label: 'Menu',
    bindings: [
      { keys: ['Esc'], action: 'Flight menu' },
    ],
  },
]

// Legacy flat-string export — kept so existing tests + consumers that read
// the old `CONTROLS_LEGEND_LINES` don't break during Sprint 16. The 4-key
// WASD grouping collapses into a single token; 2-key pairs (Q/E, R/F, M/Tab)
// keep the " / " separator so Sprint 15 text assertions still match.
function formatKeys(keys: readonly string[]): string {
  const allSingleLetters = keys.every((k) => /^[A-Z]$/.test(k))
  if (allSingleLetters && keys.length >= 4) return keys.join('')
  return keys.join(' / ')
}
export const CONTROLS_LEGEND_LINES: readonly string[] = CONTROLS_LEGEND_CATEGORIES.flatMap(
  (c) => c.bindings.map((b) => `${formatKeys(b.keys)} · ${b.action}`),
)

function KeyChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        padding: '2px 8px',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color: '#ffffff',
        background: 'rgba(0, 212, 255, 0.12)',
        border: '1px solid rgba(0, 212, 255, 0.4)',
        borderRadius: 4,
        fontFamily: 'var(--font-sans, system-ui)',
        boxShadow: 'inset 0 -1px 0 rgba(0, 212, 255, 0.25), 0 1px 0 rgba(0, 0, 0, 0.4)',
      }}
    >
      {label}
    </span>
  )
}

function Binding({ keys, action }: ControlsLegendBinding) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.5 }}>
      <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
        {keys.map((k, i) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <KeyChip label={k} />
            {i < keys.length - 1 && (
              <span style={{ fontSize: 14, color: 'rgba(220, 230, 245, 0.5)' }}>/</span>
            )}
          </span>
        ))}
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: 'rgba(220, 230, 245, 0.82)',
          letterSpacing: '0.01em',
        }}
      >
        {action}
      </span>
    </div>
  )
}

function Category({ label, bindings }: ControlsLegendCategory) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(0, 212, 255, 0.72)',
          textShadow: '0 0 6px rgba(0, 212, 255, 0.35)',
          fontFamily: 'var(--font-space, monospace)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {bindings.map((b) => <Binding key={`${b.keys.join('+')}-${b.action}`} {...b} />)}
      </div>
    </div>
  )
}

export default function ControlsLegend() {
  return (
    <div
      data-testid="controls-legend"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 10,
        maxWidth: 320,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'rgba(5, 8, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: 10,
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.08), 0 8px 28px rgba(0, 0, 0, 0.45)',
        color: '#ffffff',
        fontFamily: 'var(--font-sans, system-ui)',
      }}
    >
      {CONTROLS_LEGEND_CATEGORIES.map((c, i) => (
        <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Category {...c} />
          {i < CONTROLS_LEGEND_CATEGORIES.length - 1 && (
            <div
              aria-hidden
              style={{
                height: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                marginTop: 2,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
