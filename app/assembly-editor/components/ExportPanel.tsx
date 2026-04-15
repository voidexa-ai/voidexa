'use client'

import { useState } from 'react'
import { useEditorStore } from '../hooks/useEditorStore'
import { buildConfig, copyJson, downloadJson, parseConfig } from '../lib/exportConfig'

export function ExportPanel() {
  const placedModels = useEditorStore(s => s.placedModels)
  const importConfig = useEditorStore(s => s.importConfig)
  const clearScene = useEditorStore(s => s.clearScene)
  const [name, setName] = useState('my_assembly')
  const [msg, setMsg] = useState<string | null>(null)

  const flash = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(null), 2200)
  }

  const getConfig = () => buildConfig(placedModels, [5, 4, 7], [0, 0, 0], name)

  const onCopy = async () => {
    await copyJson(getConfig())
    flash('Copied JSON to clipboard')
  }

  const onDownload = () => {
    downloadJson(getConfig())
    flash('Downloaded .json')
  }

  const onPaste = async () => {
    try {
      const raw = await navigator.clipboard.readText()
      const cfg = parseConfig(raw)
      if (!cfg) { flash('Clipboard did not contain a valid assembly config'); return }
      importConfig(cfg)
      flash(`Imported ${cfg.models.length} models`)
    } catch {
      flash('Clipboard read failed')
    }
  }

  return (
    <div style={{
      height: 56,
      background: 'rgba(10, 8, 25, 0.95)',
      borderTop: '1px solid rgba(168, 85, 247, 0.2)',
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    }}>
      <label style={{ fontSize: 13, color: '#a855f7' }}>Name</label>
      <input
        value={name}
        onChange={e => setName(e.target.value.replace(/\s+/g, '_'))}
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(0, 212, 255, 0.25)',
          color: '#e5e5f0',
          padding: '6px 10px',
          borderRadius: 5,
          fontSize: 14,
          minWidth: 200,
          outline: 'none',
        }}
      />

      <button onClick={onCopy} style={exportBtn}>📋 Copy JSON</button>
      <button onClick={onDownload} style={exportBtn}>⬇ Download</button>
      <button onClick={onPaste} style={exportBtn}>📥 Import from Clipboard</button>
      <button
        onClick={() => { if (confirm('Clear the scene?')) clearScene() }}
        style={{ ...exportBtn, borderColor: '#ff6b9d', color: '#ff6b9d' }}
      >🗑 Clear</button>

      <div style={{ flex: 1 }} />

      {msg && <div style={{ fontSize: 13, color: '#00d4ff', opacity: 0.85 }}>{msg}</div>}
      <div style={{ fontSize: 13, opacity: 0.55 }}>
        {placedModels.length} model{placedModels.length === 1 ? '' : 's'} in scene
      </div>
    </div>
  )
}

const exportBtn: React.CSSProperties = {
  background: 'rgba(0, 212, 255, 0.1)',
  border: '1px solid rgba(0, 212, 255, 0.35)',
  color: '#00d4ff',
  padding: '7px 12px',
  borderRadius: 5,
  fontSize: 13,
  cursor: 'pointer',
}
