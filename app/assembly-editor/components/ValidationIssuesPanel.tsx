'use client'

import { useMemo } from 'react'
import { useEditorStore } from '../hooks/useEditorStore'
import type { ValidationIssue, ValidationSeverity } from '@/lib/voidforge/types'

const SEVERITY_ORDER: ValidationSeverity[] = ['error', 'warning', 'info']

const SEVERITY_STYLE: Record<ValidationSeverity, { icon: string; color: string; bg: string }> = {
  error: { icon: '✖', color: '#ff8b97', bg: 'rgba(255, 80, 90, 0.10)' },
  warning: { icon: '▲', color: '#ffcc55', bg: 'rgba(255, 204, 85, 0.08)' },
  info: { icon: 'ℹ', color: '#8ad7ff', bg: 'rgba(0, 212, 255, 0.08)' },
}

export function ValidationIssuesPanel() {
  const issues = useEditorStore((s) => s.voidForgeIssues)
  const placedModels = useEditorStore((s) => s.placedModels)
  const selectModel = useEditorStore((s) => s.selectModel)

  const idByVoidForgeInstanceId = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of placedModels) {
      if (m.voidforgeInstanceId) map.set(m.voidforgeInstanceId, m.id)
    }
    return map
  }, [placedModels])

  if (!issues || issues.length === 0) return null

  const grouped: Record<ValidationSeverity, ValidationIssue[]> = { error: [], warning: [], info: [] }
  for (const issue of issues) grouped[issue.severity].push(issue)

  return (
    <section
      style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(168, 85, 247, 0.22)',
        color: '#e5e5f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'auto',
        maxHeight: '40vh',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <h3
          style={{
            margin: 0,
            color: '#00d4ff',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          Validation
        </h3>
        <span style={{ fontSize: 13, color: '#a9b4d0', opacity: 0.7 }}>
          {grouped.error.length} err · {grouped.warning.length} warn · {grouped.info.length} info
        </span>
      </header>

      {SEVERITY_ORDER.map((sev) => {
        const bucket = grouped[sev]
        if (bucket.length === 0) return null
        return (
          <div key={sev} style={{ marginBottom: 10 }}>
            {bucket.map((issue, i) => {
              const style = SEVERITY_STYLE[sev]
              const placedId = issue.targetInstanceId ? idByVoidForgeInstanceId.get(issue.targetInstanceId) : undefined
              const clickable = !!placedId
              return (
                <button
                  key={`${sev}-${i}`}
                  type="button"
                  onClick={() => placedId && selectModel(placedId)}
                  disabled={!clickable}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    marginBottom: 6,
                    borderRadius: 6,
                    background: style.bg,
                    border: `1px solid ${style.color}40`,
                    color: '#e5e5f0',
                    fontFamily: 'inherit',
                    cursor: clickable ? 'pointer' : 'default',
                    opacity: clickable ? 1 : 0.85,
                  }}
                >
                  <span style={{ color: style.color, fontSize: 14, lineHeight: '18px', width: 14 }}>{style.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
                    <span
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        fontSize: 12,
                        color: style.color,
                        marginRight: 6,
                      }}
                    >
                      {issue.ruleCode}
                    </span>
                    {issue.message}
                  </span>
                </button>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}
