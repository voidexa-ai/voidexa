// lib/quantum/client.ts — API client for Quantum backend (SSE + REST)

import type { QuantumSSEEvent } from '@/types/quantum'

const API_BASE = process.env.NEXT_PUBLIC_QUANTUM_API_URL || 'http://localhost:8000'

export async function createQuantumSession(
  question: string,
  token: string
): Promise<{ id: string } | { error: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/quantum/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    })
    if (!res.ok) {
      return { error: `API returned ${res.status}` }
    }
    return await res.json()
  } catch {
    return { error: 'Quantum API is offline' }
  }
}

export function streamQuantumSession(
  sessionId: string,
  token: string,
  onEvent: (event: QuantumSSEEvent) => void,
  onError: (err: string) => void
): () => void {
  let cancelled = false

  async function connect() {
    try {
      const res = await fetch(
        `${API_BASE}/api/quantum/session/${sessionId}/stream`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  token: string
): Promise<{ consensus: number; status: string } | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/quantum/session/${sessionId}/status`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
