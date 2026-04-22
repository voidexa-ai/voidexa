'use client'

interface Props {
  onChoose: (audio: 'enabled' | 'muted') => void
  /** Sprint AFS-1 Task 3: the answer the user gave previously (from localStorage). */
  defaultChoice?: 'enabled' | 'muted' | null
}

export default function AudioGatePopup({ onChoose, defaultChoice = null }: Props) {
  const yesIsDefault = defaultChoice === 'enabled'
  const noIsDefault = defaultChoice === 'muted'
  return (
    <div
      data-testid="audio-gate-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-gate-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '70vw', maxWidth: 780,
          height: '50vh', minHeight: 320,
          padding: '32px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 28,
          background: 'linear-gradient(145deg, rgba(12,20,40,0.92), rgba(5,10,25,0.92))',
          border: '1px solid rgba(127,216,255,0.4)',
          borderRadius: 18,
          boxShadow: '0 40px 120px rgba(0,0,0,0.75), 0 0 60px rgba(127,216,255,0.2)',
          color: '#ffffff',
          fontFamily: 'var(--font-sans, system-ui)',
          textAlign: 'center',
        }}
      >
        <h1
          id="audio-gate-title"
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            letterSpacing: '0.02em',
            margin: 0,
            lineHeight: 1.15,
            textShadow: '0 0 28px rgba(127,216,255,0.5)',
          }}
        >
          Enable sound for the best experience
        </h1>

        <p style={{
          fontSize: 16, lineHeight: 1.5,
          color: 'rgba(220,236,255,0.78)',
          margin: 0,
          maxWidth: 520,
        }}>
          The voidexa intro has a narrated voiceover.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            data-testid="audio-gate-yes"
            data-default={yesIsDefault ? 'true' : undefined}
            onClick={() => onChoose('enabled')}
            style={{
              minWidth: 200, minHeight: 60,
              padding: '14px 28px',
              background: '#22c55e',
              color: '#ffffff',
              border: yesIsDefault ? '2px solid rgba(255,255,255,0.85)' : 'none',
              borderRadius: 12,
              fontSize: 18, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: yesIsDefault
                ? '0 0 34px rgba(34,197,94,0.85)'
                : '0 0 24px rgba(34,197,94,0.55)',
              fontFamily: 'inherit',
            }}
          >
            Yes
          </button>
          <button
            type="button"
            data-testid="audio-gate-no"
            data-default={noIsDefault ? 'true' : undefined}
            onClick={() => onChoose('muted')}
            style={{
              minWidth: 200, minHeight: 60,
              padding: '14px 28px',
              background: '#ef4444',
              color: '#ffffff',
              border: noIsDefault ? '2px solid rgba(255,255,255,0.85)' : 'none',
              borderRadius: 12,
              fontSize: 18, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: noIsDefault
                ? '0 0 34px rgba(239,68,68,0.85)'
                : '0 0 24px rgba(239,68,68,0.55)',
              fontFamily: 'inherit',
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
