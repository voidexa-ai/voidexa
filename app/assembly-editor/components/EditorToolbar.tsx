'use client'

import { useEditorStore } from '../hooks/useEditorStore'

export function EditorToolbar({ onQuickCockpit }: { onQuickCockpit: () => void }) {
  const transformMode = useEditorStore(s => s.transformMode)
  const setTransformMode = useEditorStore(s => s.setTransformMode)
  const snapEnabled = useEditorStore(s => s.snapEnabled)
  const toggleSnap = useEditorStore(s => s.toggleSnap)
  const snapValue = useEditorStore(s => s.snapValue)
  const setSnapValue = useEditorStore(s => s.setSnapValue)
  const undo = useEditorStore(s => s.undo)
  const redo = useEditorStore(s => s.redo)
  const historyLen = useEditorStore(s => s.history.length)
  const futureLen = useEditorStore(s => s.future.length)
  const setCameraPreset = useEditorStore(s => s.setCameraPreset)

  const modeBtn = (mode: 'translate' | 'rotate' | 'scale', label: string, key: string) => (
    <button
      key={mode}
      onClick={() => setTransformMode(mode)}
      style={{
        ...toolBtn,
        background: transformMode === mode ? 'rgba(0, 212, 255, 0.25)' : 'rgba(30, 24, 60, 0.55)',
        borderColor: transformMode === mode ? '#00d4ff' : 'rgba(168, 85, 247, 0.2)',
        color: transformMode === mode ? '#00d4ff' : '#e5e5f0',
      }}
      title={`${label} [${key}]`}
    >{label}</button>
  )

  const presetBtn = (p: 'top' | 'front' | 'side' | 'pilot', label: string, key: string) => (
    <button
      key={p}
      onClick={() => setCameraPreset(p)}
      style={toolBtn}
      title={`View: ${label} [${key}]`}
    >{label}</button>
  )

  return (
    <div style={{
      height: 48,
      background: 'rgba(10, 8, 25, 0.95)',
      borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    }}>
      <div style={group}>
        {modeBtn('translate', 'Move', 'G')}
        {modeBtn('rotate', 'Rotate', 'R')}
        {modeBtn('scale', 'Scale', 'S')}
      </div>

      <Divider />

      <div style={group}>
        <button onClick={undo} disabled={!historyLen} style={{ ...toolBtn, opacity: historyLen ? 1 : 0.4 }} title="Undo [Ctrl+Z]">↶ Undo</button>
        <button onClick={redo} disabled={!futureLen} style={{ ...toolBtn, opacity: futureLen ? 1 : 0.4 }} title="Redo [Ctrl+Shift+Z]">↷ Redo</button>
      </div>

      <Divider />

      <div style={group}>
        <button
          onClick={toggleSnap}
          style={{
            ...toolBtn,
            background: snapEnabled ? 'rgba(0, 212, 255, 0.2)' : 'rgba(30, 24, 60, 0.55)',
            borderColor: snapEnabled ? '#00d4ff' : 'rgba(168, 85, 247, 0.2)',
          }}
          title="Snap to grid"
        >Snap: {snapEnabled ? 'ON' : 'OFF'}</button>
        <select
          value={snapValue}
          onChange={e => setSnapValue(parseFloat(e.target.value))}
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            color: '#e5e5f0',
            padding: '5px 8px',
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          <option value={0.01}>0.01</option>
          <option value={0.05}>0.05</option>
          <option value={0.1}>0.1</option>
          <option value={0.25}>0.25</option>
          <option value={0.5}>0.5</option>
          <option value={1}>1.0</option>
        </select>
      </div>

      <Divider />

      <div style={group}>
        {presetBtn('top', 'Top', '1')}
        {presetBtn('front', 'Front', '2')}
        {presetBtn('side', 'Side', '3')}
        {presetBtn('pilot', 'Pilot', '4')}
      </div>

      <Divider />

      <button
        onClick={onQuickCockpit}
        style={{
          ...toolBtn,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(0,212,255,0.25))',
          borderColor: '#a855f7',
          color: '#e5e5f0',
        }}
        title="Pre-populate a cockpit assembly"
      >+ Cockpit Assembly</button>
    </div>
  )
}

const group: React.CSSProperties = { display: 'flex', gap: 4, alignItems: 'center' }
const toolBtn: React.CSSProperties = {
  background: 'rgba(30, 24, 60, 0.55)',
  border: '1px solid rgba(168, 85, 247, 0.2)',
  color: '#e5e5f0',
  padding: '6px 11px',
  borderRadius: 5,
  fontSize: 13,
  cursor: 'pointer',
}

function Divider() {
  return <div style={{ width: 1, height: 22, background: 'rgba(168,85,247,0.25)', margin: '0 4px' }} />
}
