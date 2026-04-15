'use client'

import { create } from 'zustand'
import type { ModelEntry, PlacedModel, TransformMode, AssemblyConfig } from '../lib/editorTypes'

const HISTORY_LIMIT = 50

function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function clone(models: PlacedModel[]): PlacedModel[] {
  return models.map(m => ({
    ...m,
    position: [...m.position] as [number, number, number],
    rotation: [...m.rotation] as [number, number, number],
    scale: [...m.scale] as [number, number, number],
  }))
}

interface EditorState {
  placedModels: PlacedModel[]
  selectedId: string | null

  transformMode: TransformMode
  snapEnabled: boolean
  snapValue: number

  history: PlacedModel[][]
  future: PlacedModel[][]

  modelCatalog: ModelEntry[]
  catalogLoading: boolean
  catalogError: string | null

  cameraPreset: 'top' | 'front' | 'side' | 'pilot' | null
  presetTick: number

  addModel: (entry: ModelEntry) => void
  removeModel: (id: string) => void
  selectModel: (id: string | null) => void
  updateTransform: (id: string, patch: Partial<Pick<PlacedModel, 'position' | 'rotation' | 'scale' | 'opacity'>>, commit?: boolean) => void
  commitHistory: () => void
  duplicateModel: (id: string) => void
  toggleVisibility: (id: string) => void

  undo: () => void
  redo: () => void
  clearScene: () => void

  setTransformMode: (mode: TransformMode) => void
  toggleSnap: () => void
  setSnapValue: (v: number) => void

  setCatalog: (entries: ModelEntry[]) => void
  setCatalogLoading: (b: boolean) => void
  setCatalogError: (e: string | null) => void

  setCameraPreset: (p: 'top' | 'front' | 'side' | 'pilot') => void

  importConfig: (config: AssemblyConfig) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  placedModels: [],
  selectedId: null,
  transformMode: 'translate',
  snapEnabled: true,
  snapValue: 0.1,
  history: [],
  future: [],
  modelCatalog: [],
  catalogLoading: false,
  catalogError: null,
  cameraPreset: null,
  presetTick: 0,

  addModel: (entry) => {
    const prev = get().placedModels
    const model: PlacedModel = {
      id: uuid(),
      modelUrl: entry.url,
      modelName: entry.name,
      category: entry.category,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      opacity: 1,
    }
    set({
      placedModels: [...prev, model],
      selectedId: model.id,
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  removeModel: (id) => {
    const prev = get().placedModels
    set({
      placedModels: prev.filter(m => m.id !== id),
      selectedId: get().selectedId === id ? null : get().selectedId,
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  selectModel: (id) => set({ selectedId: id }),

  updateTransform: (id, patch, commit = false) => {
    const prev = get().placedModels
    const next = prev.map(m => m.id === id ? { ...m, ...patch } : m)
    if (commit) {
      set({
        placedModels: next,
        history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
        future: [],
      })
    } else {
      set({ placedModels: next })
    }
  },

  commitHistory: () => {
    const prev = get().placedModels
    set({
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  duplicateModel: (id) => {
    const prev = get().placedModels
    const src = prev.find(m => m.id === id)
    if (!src) return
    const copy: PlacedModel = {
      ...src,
      id: uuid(),
      position: [src.position[0] + 0.5, src.position[1], src.position[2] + 0.5],
      rotation: [...src.rotation] as [number, number, number],
      scale: [...src.scale] as [number, number, number],
    }
    set({
      placedModels: [...prev, copy],
      selectedId: copy.id,
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  toggleVisibility: (id) => {
    const prev = get().placedModels
    set({
      placedModels: prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m),
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  undo: () => {
    const { history, placedModels, future } = get()
    if (!history.length) return
    const prev = history[history.length - 1]
    set({
      placedModels: prev,
      history: history.slice(0, -1),
      future: [...future, clone(placedModels)],
    })
  },

  redo: () => {
    const { future, placedModels, history } = get()
    if (!future.length) return
    const next = future[future.length - 1]
    set({
      placedModels: next,
      future: future.slice(0, -1),
      history: [...history, clone(placedModels)],
    })
  },

  clearScene: () => {
    const prev = get().placedModels
    set({
      placedModels: [],
      selectedId: null,
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },

  setTransformMode: (mode) => set({ transformMode: mode }),
  toggleSnap: () => set({ snapEnabled: !get().snapEnabled }),
  setSnapValue: (v) => set({ snapValue: v }),

  setCatalog: (entries) => set({ modelCatalog: entries }),
  setCatalogLoading: (b) => set({ catalogLoading: b }),
  setCatalogError: (e) => set({ catalogError: e }),

  setCameraPreset: (p) => set({ cameraPreset: p, presetTick: get().presetTick + 1 }),

  importConfig: (config) => {
    const prev = get().placedModels
    set({
      placedModels: clone(config.models || []),
      selectedId: null,
      history: [...get().history.slice(-HISTORY_LIMIT + 1), clone(prev)],
      future: [],
    })
  },
}))
