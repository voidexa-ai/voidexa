// lib/quantum/client.ts — API client for Quantum backend (SSE + REST)

import type { QuantumMode, QuantumSSEEvent } from '@/types/quantum'

const API_BASE = process.env.NEXT_PUBLIC_QUANTUM_API_URL || 'https://quantum-production-dd9d.up.railway.app'

/** Rounds baked into each UX mode. Deep is slower but runs a third
 *  round of delta evaluation and uses full KCP-90 compression. */
const MODE_ROUNDS: Record<QuantumMode, number> = {
  standard: 2,
  deep: 3,
}

export async function createQuantumSession(
  question: string,
  token: string | null,
  mode: QuantumMode = 'standard'
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
      body: JSON.stringify({
        task: question,
        mode,
        rounds: MODE_ROUNDS[mode],
      }),
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

/** AFS-4: fire-and-forget compression-event log to /api/quantum/log-session. */
function logQuantumSessionComplete(sessionId: string, event: QuantumSSEEvent): void {
  try {
    const totalTokens = typeof event.tokens === 'number' ? event.tokens : 0
    const mode = typeof event.mode === 'string' ? event.mode : 'unknown'
    void fetch('/api/quantum/log-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        tokensIn: totalTokens,
        tokensOut: 0,
        layerUsed: mode === 'deep' ? 'kcp90-full' : 'none',
        success: true,
        meta: {
          mode,
          rounds: event.rounds ?? null,
          providersUsed: event.providers_used ?? null,
          kcpSavings: event.kcp_savings ?? null,
          cost: event.cost ?? null,
        },
      }),
    }).catch((err) => console.error('[quantum/log-session]', err))
  } catch (err) {
    console.error('[quantum/log-session]', err)
  }
}

/** Deep mode runs 3 rounds × 4 providers — allow up to 10 minutes. */
const STREAM_TIMEOUT_MS = 600_000
/** Max reconnect attempts before giving up. */
const MAX_RECONNECTS = 5
/** Delay between reconnect attempts (ms). */
const RECONNECT_DELAY_MS = 2_000

export function streamQuantumSession(
  sessionId: string,
  token: string | null,
  onEvent: (event: QuantumSSEEvent) => void,
  onError: (err: string) => void
): () => void {
  let cancelled = false
  let sessionComplete = false
  let reconnects = 0
  let abortController: AbortController | null = null

  async function connect() {
    if (cancelled || sessionComplete) return

    abortController = new AbortController()
    const timeout = setTimeout(() => abortController?.abort(), STREAM_TIMEOUT_MS)

    try {
      const res = await fetch(
        `${API_BASE}/api/sessions/${sessionId}/stream`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: abortController.signal,
        }
      )
      if (!res.ok || !res.body) {
        clearTimeout(timeout)
        onError(`Stream failed: ${res.status}`)
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      // Reset reconnect counter on successful connection
      reconnects = 0

      while (!cancelled && !sessionComplete) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: QuantumSSEEvent = JSON.parse(line.slice(6))
              if (event.type === 'session_complete') {
                sessionComplete = true
                logQuantumSessionComplete(sessionId, event)
              }
              onEvent(event)
            } catch {
              // skip malformed events
            }
          }
        }
      }

      clearTimeout(timeout)

      // Stream ended without session_complete — try reconnecting
      if (!cancelled && !sessionComplete) {
        tryReconnect()
      }
    } catch {
      clearTimeout(timeout)
      if (cancelled || sessionComplete) return

      // Connection dropped — try reconnecting
      tryReconnect()
    }
  }

  function tryReconnect() {
    if (cancelled || sessionComplete) return
    reconnects++
    if (reconnects > MAX_RECONNECTS) {
      onError('Connection to Quantum API lost. Please try again.')
      return
    }
    setTimeout(() => connect(), RECONNECT_DELAY_MS)
  }

  connect()
  return () => {
    cancelled = true
    abortController?.abort()
  }
}

export async function askFollowUp(
  sessionId: string,
  question: string,
  token: string | null
): Promise<{ answer: string; followup_count: number } | { error: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/followup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { error: `API returned ${res.status}: ${text}` }
    }
    return await res.json()
  } catch {
    return { error: 'Failed to send follow-up question' }
  }
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
