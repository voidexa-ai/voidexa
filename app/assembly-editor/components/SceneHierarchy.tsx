'use client'

import { useEditorStore } from '../hooks/useEditorStore'

export function SceneHierarchy() {
  const placedModels = useEditorStore(s => s.placedModels)
  const selectedId = useEditorStore(s => s.selectedId)
  const selectModel = useEditorStore(s => s.selectModel)
  const removeModel = useEditorStore(s => s.removeModel)
  const toggleVisibility = useEditorStore(s => s.toggleVisibility)
  const duplicateModel = useEditorStore(s => s.duplicateModel)

  return (
    <div style={{
      borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
      padding: 12,
      maxHeight: '45%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        fontSize: 13, letterSpacing: 1, color: '#00d4ff',
        textTransform: 'uppercase', marginBottom: 8,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Scene ({placedModels.length})</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {placedModels.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.6, padding: '10px 4px' }}>
            Scene empty — click a model in the library to add it.
          </div>
        )}
        {placedModels.map((m, i) => {
          const sel = m.id === selectedId
          return (
            <div
              key={m.id}
              onClick={() => selectModel(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 8px',
                marginBottom: 3,
                borderRadius: 5,
                background: sel ? 'rgba(0, 212, 255, 0.15)' : 'rgba(30, 24, 60, 0.45)',
                border: sel ? '1px solid rgba(0, 212, 255, 0.5)' : '1px solid rgba(168, 85, 247, 0.08)',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i + 1}. {m.modelName}
              </span>
              <button
                title="Visibility"
                onClick={(e) => { e.stopPropagation(); toggleVisibility(m.id) }}
                style={iconBtn}
              >{m.visible ? '👁' : '◯'}</button>
              <button
                title="Duplicate"
                onClick={(e) => { e.stopPropagation(); duplicateModel(m.id) }}
                style={iconBtn}
              >⎘</button>
              <button
                title="Delete"
                onClick={(e) => { e.stopPropagation(); removeModel(m.id) }}
                style={{ ...iconBtn, color: '#ff6b9d' }}
              >✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#e5e5f0',
  cursor: 'pointer',
  fontSize: 14,
  padding: '2px 4px',
  opacity: 0.7,
}
