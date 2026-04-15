'use client'

import { useState } from 'react'
import { useAssemblyStorage } from '../hooks/useAssemblyStorage'
import { useEditorStore } from '../hooks/useEditorStore'
import { buildConfig } from '../lib/exportConfig'

export function SaveLoadPanel() {
  const { assemblies, loading, error, save, remove, userId } = useAssemblyStorage()
  const placedModels = useEditorStore(s => s.placedModels)
  const importConfig = useEditorStore(s => s.importConfig)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500) }

  const onSave = async () => {
    if (!name.trim()) { flash('Enter a name first'); return }
    if (!placedModels.length) { flash('Scene is empty'); return }
    setBusy(true)
    try {
      await save(name.trim(), buildConfig(placedModels, [5, 4, 7], [0, 0, 0], name.trim()))
      flash('Saved')
      setName('')
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      padding: 14,
      borderTop: '1px solid rgba(168, 85, 247, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxHeight: '40%',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: 13, letterSpacing: 1, color: '#00d4ff', textTransform: 'uppercase' }}>
        Saved Assemblies
      </div>

      {!userId && (
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          Sign in to save assemblies to your account.
        </div>
      )}

      {userId && (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Assembly name"
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(0, 212, 255, 0.25)',
              color: '#e5e5f0',
              padding: '6px 8px',
              borderRadius: 4,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={onSave}
            disabled={busy}
            style={{
              background: 'rgba(0, 212, 255, 0.15)',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              color: '#00d4ff',
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: 13,
              cursor: 'pointer',
              opacity: busy ? 0.5 : 1,
            }}
          >Save</button>
        </div>
      )}

      {msg && <div style={{ fontSize: 12, color: '#00d4ff' }}>{msg}</div>}
      {error && <div style={{ fontSize: 12, color: '#ff6b9d' }}>{error}</div>}
      {loading && <div style={{ fontSize: 12, opacity: 0.65 }}>Loading...</div>}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {userId && !loading && assemblies.length === 0 && (
          <div style={{ fontSize: 12, opacity: 0.6 }}>No saved assemblies yet.</div>
        )}
        {assemblies.map(a => (
          <div key={a.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 6px',
            fontSize: 13,
            borderRadius: 4,
            background: 'rgba(30, 24, 60, 0.4)',
            marginBottom: 3,
          }}>
            <button
              onClick={() => importConfig(a.config_json)}
              style={{ background: 'transparent', border: 'none', color: '#e5e5f0', flex: 1, textAlign: 'left', cursor: 'pointer', fontSize: 13 }}
              title="Load into scene"
            >{a.name}</button>
            <button
              onClick={() => { if (confirm(`Delete "${a.name}"?`)) remove(a.id) }}
              style={{ background: 'transparent', border: 'none', color: '#ff6b9d', cursor: 'pointer', fontSize: 13 }}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
