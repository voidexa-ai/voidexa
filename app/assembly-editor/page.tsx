'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect } from 'react'
import { ModelBrowser } from './components/ModelBrowser'
import { SceneHierarchy } from './components/SceneHierarchy'
import { TransformPanel } from './components/TransformPanel'
import { EditorToolbar } from './components/EditorToolbar'
import { ExportPanel } from './components/ExportPanel'
import { SaveLoadPanel } from './components/SaveLoadPanel'
import { useEditorStore } from './hooks/useEditorStore'

const EditorCanvas = dynamic(
  () => import('./components/EditorCanvas').then(m => m.EditorCanvas),
  { ssr: false, loading: () => <CanvasFallback /> }
)

function CanvasFallback() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#00d4ff', fontSize: 14, letterSpacing: 1,
      background: 'linear-gradient(180deg, #0d0a1f 0%, #060412 100%)',
    }}>Loading 3D viewport…</div>
  )
}

export default function AssemblyEditorPage() {
  const setTransformMode = useEditorStore(s => s.setTransformMode)
  const selectedId = useEditorStore(s => s.selectedId)
  const removeModel = useEditorStore(s => s.removeModel)
  const duplicateModel = useEditorStore(s => s.duplicateModel)
  const toggleVisibility = useEditorStore(s => s.toggleVisibility)
  const undo = useEditorStore(s => s.undo)
  const redo = useEditorStore(s => s.redo)
  const selectModel = useEditorStore(s => s.selectModel)
  const setCameraPreset = useEditorStore(s => s.setCameraPreset)
  const addModel = useEditorStore(s => s.addModel)
  const catalog = useEditorStore(s => s.modelCatalog)

  const quickCockpit = useCallback(() => {
    const frame = catalog.find(e => e.name === 'hirez_cockpit01')
    const interior = catalog.find(e => e.name === 'hirez_cockpit01_interior')
    const equipments = catalog.find(e => /equipment/i.test(e.name))
    const screens = catalog.find(e => /screen/i.test(e.name))
    ;[frame, interior, equipments, screens].forEach(e => { if (e) addModel(e) })
    setCameraPreset('pilot')
  }, [catalog, addModel, setCameraPreset])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo(); else undo()
        return
      }
      switch (e.key.toLowerCase()) {
        case 'g': setTransformMode('translate'); break
        case 'r': setTransformMode('rotate'); break
        case 's':
          if (!e.ctrlKey && !e.metaKey) setTransformMode('scale')
          break
        case 'x':
        case 'delete':
        case 'backspace':
          if (selectedId) { e.preventDefault(); removeModel(selectedId) }
          break
        case 'd':
          if (selectedId && !e.ctrlKey && !e.metaKey) duplicateModel(selectedId)
          break
        case 'h':
          if (selectedId) toggleVisibility(selectedId)
          break
        case 'escape':
          selectModel(null); break
        case '1': setCameraPreset('top'); break
        case '2': setCameraPreset('front'); break
        case '3': setCameraPreset('side'); break
        case '4': setCameraPreset('pilot'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, removeModel, duplicateModel, toggleVisibility, undo, redo, selectModel, setTransformMode, setCameraPreset])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#060412',
      color: '#e5e5f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingTop: 64, // leave room for global nav
    }}>
      <div className="md:hidden" style={{
        background: 'rgba(168, 85, 247, 0.2)',
        color: '#fff',
        padding: '8px 14px',
        fontSize: 13,
        textAlign: 'center',
        borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
      }}>
        Assembly Editor works best on desktop.
      </div>

      <EditorToolbar onQuickCockpit={quickCockpit} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ModelBrowser />

        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <EditorCanvas />
        </div>

        <aside style={{
          width: 290,
          minWidth: 290,
          background: 'rgba(10, 8, 25, 0.95)',
          borderLeft: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <SceneHierarchy />
          <TransformPanel />
          <SaveLoadPanel />
        </aside>
      </div>

      <ExportPanel />
    </div>
  )
}
