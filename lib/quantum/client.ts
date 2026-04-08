// lib/quantum/client.ts — API client for Quantum backend (SSE + REST)

import type { QuantumSSEEvent } from '@/types/quantum'

const API_BASE = process.env.NEXT_PUBLIC_QUANTUM_API_URL || 'http://localhost:8000'

export async function createQuantumSession(
  question: string,
  token: string | null
): Promise<{ id: string } | { error: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ task: question }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { error: `API returned ${res.status}: ${text}` }
    }
    return await res.json()
  } catch {
    return { error: 'Quantum API is offline' }
  }
}

export function streamQuantumSession(
  sessionId: string,
  token: string | null,
  onEvent: (event: QuantumSSEEvent) => void,
  onError: (err: string) => void
): () => void {
  let cancelled = false

  async function connect() {
    try {
      const res = await fetch(
        `${API_BASE}/api/sessions/${sessionId}/stream`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      if (!res.ok || !res.body) {
        onError(`Stream failed: ${res.status}`)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (!cancelled) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: QuantumSSEEvent = JSON.parse(line.slice(6))
              onEvent(event)
            } catch {
              // skip malformed events
            }
          }
        }
      }
    } catch {
      if (!cancelled) onError('Connection lost')
    }
  }

  connect()
  return () => { cancelled = true }
}

export async function getSessionStatus(
  sessionId: string,
  token: string | null
): Promise<{ consensus: number; status: string } | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/status`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
