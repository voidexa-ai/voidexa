'use client'

import { create } from 'zustand'

export interface MissedCallRecord {
  id: string
  type: 'exploration' | 'npc' | 'hostile' | 'mission' | 'system'
  title: string
  subtitle?: string
  missedAt: number
}

interface MissedCallsState {
  calls: MissedCallRecord[]
  push: (record: Omit<MissedCallRecord, 'missedAt'>) => void
  clear: () => void
  remove: (id: string) => void
}

const MAX_LOG = 20

export const useMissedCalls = create<MissedCallsState>((set) => ({
  calls: [],
  push: (record) => {
    set((s) => {
      const filtered = s.calls.filter((c) => c.id !== record.id)
      const next = [{ ...record, missedAt: Date.now() }, ...filtered]
      return { calls: next.slice(0, MAX_LOG) }
    })
  },
  remove: (id) => {
    set((s) => ({ calls: s.calls.filter((c) => c.id !== id) }))
  },
  clear: () => set({ calls: [] }),
}))
