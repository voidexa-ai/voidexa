'use client'

import { useEditorStore } from '../hooks/useEditorStore'

const axes = ['x', 'y', 'z'] as const

function NumberInput({ value, onChange, step = 0.1 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? +value.toFixed(4) : 0}
      onChange={e => {
        const n = parseFloat(e.target.value)
        if (!Number.isNaN(n)) onChange(n)
      }}
      step={step}
      style={{
        width: '100%',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(0, 212, 255, 0.25)',
        color: '#e5e5f0',
        padding: '5px 7px',
        borderRadius: 4,
        fontSize: 13,
        outline: 'none',
      }}
    />
  )
}

export function TransformPanel() {
  const selectedId = useEditorStore(s => s.selectedId)
  const placedModels = useEditorStore(s => s.placedModels)
  const updateTransform = useEditorStore(s => s.updateTransform)
  const commitHistory = useEditorStore(s => s.commitHistory)

  const m = placedModels.find(x => x.id === selectedId)

  if (!m) {
    return (
      <div style={{ padding: 14, fontSize: 13, opacity: 0.6 }}>
        Select a model to edit its transform.
      </div>
    )
  }

  const setVec = (key: 'position' | 'rotation' | 'scale', idx: number, v: number) => {
    const next: [number, number, number] = [...m[key]] as [number, number, number]
    next[idx] = v
    updateTransform(m.id, { [key]: next } as any)
  }

  const rad2deg = (r: number) => (r * 180) / Math.PI
  const deg2rad = (d: number) => (d * Math.PI) / 180

  return (
    <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
      <div style={{ fontSize: 13, letterSpacing: 1, color: '#00d4ff', textTransform: 'uppercase', marginBottom: 10 }}>
        Transform
      </div>
      <div style={{ fontSize: 13, marginBottom: 10, opacity: 0.8 }}>{m.modelName}</div>

      <Section label="Position">
        {axes.map((a, i) => (
          <Row key={a} label={a.toUpperCase()}>
            <NumberInput
              value={m.position[i]}
              onChange={v => setVec('position', i, v)}
            />
          </Row>
        ))}
      </Section>

      <Section label="Rotation (deg)">
        {axes.map((a, i) => (
          <Row key={a} label={a.toUpperCase()}>
            <NumberInput
              value={rad2deg(m.rotation[i])}
              step={1}
              onChange={v => setVec('rotation', i, deg2rad(v))}
            />
          </Row>
        ))}
      </Section>

      <Section label="Scale">
        {axes.map((a, i) => (
          <Row key={a} label={a.toUpperCase()}>
            <NumberInput
              value={m.scale[i]}
              onChange={v => setVec('scale', i, v)}
            />
          </Row>
        ))}
        <button
          onClick={() => {
            const avg = (m.scale[0] + m.scale[1] + m.scale[2]) / 3
            updateTransform(m.id, { scale: [avg, avg, avg] }, true)
          }}
          style={btnSmall}
        >Uniform</button>
      </Section>

      <Section label="Opacity">
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={m.opacity}
          onChange={e => updateTransform(m.id, { opacity: parseFloat(e.target.value) })}
          onMouseUp={() => commitHistory()}
          style={{ width: '100%' }}
        />
        <div style={{ fontSize: 12, opacity: 0.7 }}>{m.opacity.toFixed(2)}</div>
      </Section>

      <button
        onClick={() => {
          updateTransform(m.id, { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }, true)
        }}
        style={btnSmall}
      >Reset Transform</button>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, color: '#a855f7', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 8, alignItems: 'center', marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: '#00d4ff' }}>{label}</span>
      {children}
    </div>
  )
}

const btnSmall: React.CSSProperties = {
  background: 'rgba(0, 212, 255, 0.08)',
  border: '1px solid rgba(0, 212, 255, 0.3)',
  color: '#00d4ff',
  padding: '5px 10px',
  borderRadius: 4,
  fontSize: 12,
  cursor: 'pointer',
  marginTop: 6,
}
