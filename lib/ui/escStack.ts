'use client'

import { create } from 'zustand'

export type EscLayerPriority = 'hud-call' | 'lore' | 'map' | 'menu' | 'popup'

interface EscLayer {
  id: string
  priority: EscLayerPriority
  onEscape: () => void
}

interface EscStackState {
  layers: EscLayer[]
  lastPopAt: number
  register: (layer: EscLayer) => void
  unregister: (id: string) => void
  pop: () => boolean
}

const PRIORITY_ORDER: Record<EscLayerPriority, number> = {
  'hud-call': 50,
  popup: 40,
  map: 30,
  lore: 20,
  menu: 10,
}

export const DEBOUNCE_MS = 150

export const useEscStack = create<EscStackState>((set, get) => ({
  layers: [],
  lastPopAt: 0,
  register: (layer) => {
    set((s) => {
      if (s.layers.some((l) => l.id === layer.id)) return s
      return { layers: [...s.layers, layer] }
    })
  },
  unregister: (id) => {
    set((s) => ({ layers: s.layers.filter((l) => l.id !== id) }))
  },
  pop: () => {
    const now = Date.now()
    const { layers, lastPopAt } = get()
    if (now - lastPopAt < DEBOUNCE_MS) return false
    if (layers.length === 0) return false
    let top = layers[0]
    for (const l of layers) {
      if (PRIORITY_ORDER[l.priority] >= PRIORITY_ORDER[top.priority]) top = l
    }
    set({ lastPopAt: now })
    top.onEscape()
    return true
  },
}))

/**
 * Pure resolver used by tests — mirrors the logic inside `pop()` without
 * touching the zustand store, so tests can feed synthetic inputs.
 */
export function resolveTopLayer(layers: EscLayer[]): EscLayer | null {
  if (layers.length === 0) return null
  let top = layers[0]
  for (const l of layers) {
    if (PRIORITY_ORDER[l.priority] >= PRIORITY_ORDER[top.priority]) top = l
  }
  return top
}
