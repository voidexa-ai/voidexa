'use client'

import { useState } from 'react'
import type { VoidForgeGenerationResult, VoidForgeVariant } from './VoidForgePanel'

interface Props {
  result: VoidForgeGenerationResult
  onLoad: (variant: VoidForgeVariant, result: VoidForgeGenerationResult) => void
  onDismiss: () => void
}

export function VoidForgeVariantPicker({ result, onLoad, onDismiss }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(result.variants[0]?.variantIndex ?? null)

  if (result.variants.length === 0) {
    return (
      <Overlay onDismiss={onDismiss}>
        <div
          style={{
            maxWidth: 480,
            padding: 24,
            background: 'rgba(10, 8, 25, 0.95)',
            border: '1px solid rgba(255, 80, 90, 0.4)',
            borderRadius: 12,
            color: '#ff8b97',
            fontSize: 14,
          }}
        >
          <h3 style={{ marginTop: 0, color: '#ff8b97', fontSize: 18 }}>Generation failed</h3>
          <p style={{ marginBottom: 16 }}>{result.errorMessage ?? 'No variants were produced.'}</p>
          <button type="button" onClick={onDismiss} style={dismissBtn}>
            Close
          </button>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onDismiss={onDismiss}>
      <div
        style={{
          width: 'min(980px, 94vw)',
          maxHeight: '86vh',
          overflow: 'auto',
          padding: 24,
          background: 'rgba(10, 8, 25, 0.98)',
          border: '1px solid rgba(0, 212, 255, 0.35)',
          borderRadius: 14,
          color: '#e5e5f0',
          boxShadow: '0 16px 56px rgba(0,0,0,0.55)',
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: '#00d4ff', letterSpacing: 1.2 }}>VoidForge Variants</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#a9b4d0', opacity: 0.75 }}>
              Template: <span style={{ color: '#e5e5f0' }}>{result.templateSlug}</span>
              {result.styleSummary ? ` · ${result.styleSummary}` : ''}
            </p>
          </div>
          <button type="button" onClick={onDismiss} style={dismissBtn}>
            Close
          </button>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(3, result.variants.length)}, 1fr)`,
            gap: 14,
          }}
        >
          {result.variants.map((v) => (
            <VariantCard
              key={v.variantIndex}
              variant={v}
              selected={selectedIdx === v.variantIndex}
              onSelect={() => setSelectedIdx(v.variantIndex)}
              onLoad={() => onLoad(v, result)}
            />
          ))}
        </div>
      </div>
    </Overlay>
  )
}

function VariantCard({
  variant,
  selected,
  onSelect,
  onLoad,
}: {
  variant: VoidForgeVariant
  selected: boolean
  onSelect: () => void
  onLoad: () => void
}) {
  const score = variant.finalScore
  const color = score > 0.8 ? '#66ff99' : score > 0.5 ? '#ffcc55' : '#ff8b97'
  const errorCount = variant.validation.issues.filter((i) => i.severity === 'error').length
  const warnCount = variant.validation.issues.filter((i) => i.severity === 'warning').length
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        textAlign: 'left',
        padding: 16,
        borderRadius: 10,
        background: 'rgba(6, 4, 18, 0.92)',
        border: selected ? '1px solid #00d4ff' : '1px solid rgba(168, 85, 247, 0.3)',
        color: '#e5e5f0',
        fontFamily: 'inherit',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 0 3px rgba(0, 212, 255, 0.18)' : 'none',
        transition: 'all 120ms ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#00d4ff' }}>{variant.label}</span>
        <span style={{ fontSize: 13, color: '#a9b4d0' }}>temp {variant.temperature.toFixed(2)}</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        <span style={{ color }}>● {Math.round(score * 100)}</span>
        <span style={{ color: '#a9b4d0' }}>
          {variant.validation.passed ? 'Passed' : 'Issues'}: {errorCount} err · {warnCount} warn
        </span>
      </div>

      {variant.plan.styleSummary && (
        <p style={{ margin: '6px 0 10px', fontSize: 13, color: '#cbd2e6', lineHeight: 1.5, opacity: 0.85 }}>
          {variant.plan.styleSummary}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 13,
          color: '#8c95b3',
          marginBottom: 12,
        }}
      >
        <span>Parts placed: {variant.assembly.instances.length}</span>
        <span>Repair iterations: {variant.repair.iterations}</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onLoad()
        }}
        style={{
          width: '100%',
          padding: '8px 10px',
          background: selected ? 'linear-gradient(90deg, #00d4ff, #a855f7)' : 'rgba(0, 212, 255, 0.18)',
          color: selected ? '#050314' : '#00d4ff',
          border: '1px solid rgba(0, 212, 255, 0.5)',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.4,
          cursor: 'pointer',
        }}
      >
        Load into Editor
      </button>
    </button>
  )
}

function Overlay({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 2, 10, 0.68)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

const dismissBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  color: '#a9b4d0',
  border: '1px solid rgba(168, 85, 247, 0.4)',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
}
