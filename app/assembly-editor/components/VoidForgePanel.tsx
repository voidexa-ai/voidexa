'use client'

import { useCallback, useState } from 'react'
import type { AssemblyJson, RepairReport, ValidationReport } from '@/lib/voidforge/types'

// ---- Types -----------------------------------------------------------------

export interface VoidForgeVariant {
  variantIndex: number
  label: string
  temperature: number
  assembly: AssemblyJson
  validation: ValidationReport
  repair: RepairReport
  plan: { templateSlug: string; styleSummary: string }
  finalScore: number
}

export interface VoidForgeGenerationResult {
  generationId: string
  status: string
  templateSlug: string
  styleSummary: string
  variants: VoidForgeVariant[]
  errorMessage?: string
}

interface Props {
  onVariantsReady: (result: VoidForgeGenerationResult) => void
}

type StylePreset = 'aggressive' | 'industrial' | 'sleek' | 'submarine' | 'military' | 'civilian'
type TemplateChoice =
  | 'auto'
  | 'compact_fighter'
  | 'heavy_military'
  | 'panoramic_bridge'
  | 'industrial_hauler'
  | 'submarine_command'
type Complexity = 'low' | 'medium' | 'high'
type Stage = 'idle' | 'planning' | 'placing' | 'validating' | 'repairing' | 'done' | 'error'

const STYLE_PRESETS: { key: StylePreset; label: string }[] = [
  { key: 'aggressive', label: 'Aggressive' },
  { key: 'industrial', label: 'Industrial' },
  { key: 'sleek', label: 'Sleek' },
  { key: 'submarine', label: 'Submarine' },
  { key: 'military', label: 'Military' },
  { key: 'civilian', label: 'Civilian' },
]

const TEMPLATES: { key: TemplateChoice; label: string }[] = [
  { key: 'auto', label: 'Auto (pick for me)' },
  { key: 'compact_fighter', label: 'Compact Fighter' },
  { key: 'heavy_military', label: 'Heavy Military' },
  { key: 'panoramic_bridge', label: 'Panoramic Bridge' },
  { key: 'industrial_hauler', label: 'Industrial Hauler' },
  { key: 'submarine_command', label: 'Submarine Command' },
]

// ---- Component -------------------------------------------------------------

export function VoidForgePanel({ onVariantsReady }: Props) {
  const [open, setOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [activeStyles, setActiveStyles] = useState<Set<StylePreset>>(new Set())
  const [template, setTemplate] = useState<TemplateChoice>('auto')
  const [complexity, setComplexity] = useState<Complexity>('medium')
  const [stage, setStage] = useState<Stage>('idle')
  const [error, setError] = useState<string | null>(null)

  const toggleStyle = useCallback((key: StylePreset) => {
    setActiveStyles((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const runGenerate = useCallback(
    async (variantCount: number) => {
      setError(null)
      if (!prompt.trim()) {
        setError('Describe your cockpit first.')
        return
      }
      setStage('planning')
      const styleWeights: Record<string, number> = {}
      for (const key of activeStyles) styleWeights[key] = 0.8
      const body = {
        promptText: prompt,
        styleWeights,
        templateHint: template === 'auto' ? undefined : template,
        complexity,
        variantCount,
      }
      try {
        // Tick stages while waiting for the response. This is purely visual — the
        // server runs them sequentially regardless. Users want to see progress.
        const stages: Stage[] = ['placing', 'validating', 'repairing']
        let sIdx = 0
        const timer = setInterval(() => {
          sIdx = (sIdx + 1) % stages.length
          setStage(stages[sIdx])
        }, 1600)

        const res = await fetch('/api/voidforge/generate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        })
        clearInterval(timer)
        const json = (await res.json()) as VoidForgeGenerationResult & { error?: string }
        if (!res.ok || json.error) {
          throw new Error(json.error || `HTTP ${res.status}`)
        }
        setStage('done')
        onVariantsReady(json)
      } catch (e) {
        setStage('error')
        setError(e instanceof Error ? e.message : String(e))
      }
    },
    [prompt, activeStyles, template, complexity, onVariantsReady]
  )

  return (
    <section
      style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(168, 85, 247, 0.22)',
        background: 'rgba(10, 8, 25, 0.95)',
        color: '#e5e5f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          color: '#00d4ff',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          padding: 0,
          cursor: 'pointer',
          marginBottom: open ? 12 : 0,
        }}
      >
        {open ? '▾' : '▸'} VoidForge
      </button>

      {open && (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your cockpit…"
            rows={3}
            style={{
              width: '100%',
              resize: 'vertical',
              fontSize: 14,
              padding: 10,
              borderRadius: 6,
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'rgba(6, 4, 18, 0.9)',
              color: '#e5e5f0',
              fontFamily: 'inherit',
              outline: 'none',
              marginBottom: 10,
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {STYLE_PRESETS.map((p) => {
              const active = activeStyles.has(p.key)
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => toggleStyle(p.key)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: active ? '1px solid #00d4ff' : '1px solid rgba(168, 85, 247, 0.35)',
                    background: active ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
                    color: active ? '#00d4ff' : '#cbd2e6',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <label style={{ fontSize: 13, color: '#a9b4d0', display: 'block', marginBottom: 4 }}>Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as TemplateChoice)}
            style={{
              width: '100%',
              fontSize: 14,
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'rgba(6, 4, 18, 0.9)',
              color: '#e5e5f0',
              marginBottom: 10,
            }}
          >
            {TEMPLATES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          <label style={{ fontSize: 13, color: '#a9b4d0', display: 'block', marginBottom: 4 }}>Complexity</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {(['low', 'medium', 'high'] as Complexity[]).map((c) => {
              const active = complexity === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setComplexity(c)}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    fontSize: 13,
                    textTransform: 'capitalize',
                    border: active ? '1px solid #00d4ff' : '1px solid rgba(168, 85, 247, 0.3)',
                    background: active ? 'rgba(0, 212, 255, 0.15)' : 'transparent',
                    color: active ? '#00d4ff' : '#cbd2e6',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              disabled={stage !== 'idle' && stage !== 'done' && stage !== 'error'}
              onClick={() => runGenerate(1)}
              style={primaryBtn(stage !== 'idle' && stage !== 'done' && stage !== 'error')}
            >
              Generate Cockpit
            </button>
            <button
              type="button"
              disabled={stage !== 'idle' && stage !== 'done' && stage !== 'error'}
              onClick={() => runGenerate(3)}
              style={secondaryBtn(stage !== 'idle' && stage !== 'done' && stage !== 'error')}
            >
              3 Variants
            </button>
          </div>

          {(stage === 'planning' ||
            stage === 'placing' ||
            stage === 'validating' ||
            stage === 'repairing') && (
            <div
              style={{
                marginTop: 12,
                padding: '8px 10px',
                background: 'rgba(0, 212, 255, 0.08)',
                border: '1px solid rgba(0, 212, 255, 0.35)',
                borderRadius: 6,
                fontSize: 13,
                color: '#00d4ff',
                letterSpacing: 0.6,
              }}
            >
              {stageLabel(stage)}
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 10px',
                background: 'rgba(255, 80, 90, 0.12)',
                border: '1px solid rgba(255, 80, 90, 0.5)',
                borderRadius: 6,
                fontSize: 13,
                color: '#ff8b97',
              }}
            >
              {error}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function stageLabel(stage: Stage): string {
  switch (stage) {
    case 'planning':
      return 'Planning with Opus 4.7…'
    case 'placing':
      return 'Placing parts via sockets…'
    case 'validating':
      return 'Running validator…'
    case 'repairing':
      return 'Repairing collisions…'
    default:
      return ''
  }
}

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #00d4ff',
    background: disabled ? 'rgba(0, 212, 255, 0.15)' : 'linear-gradient(90deg, #00d4ff, #a855f7)',
    color: disabled ? '#00d4ff' : '#050314',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.6,
    cursor: disabled ? 'wait' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  }
}

function secondaryBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(168, 85, 247, 0.5)',
    background: 'transparent',
    color: '#cbd2e6',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.6,
    cursor: disabled ? 'wait' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  }
}
