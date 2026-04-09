// types/quantum.ts — TypeScript types for Quantum debate sessions

export interface QuantumCharacter {
  id: string
  name: string
  role: string
  tagline: string
  image: string
  color: string
  glow: string
}

export interface QuantumMessage {
  id: string
  characterId: string
  text: string
  timestamp: number
  /** When an AI changes position, the old text gets struck through */
  strikethrough?: boolean
  /** When an AI shifts to agree with another */
  agreement?: boolean
}

export interface QuantumSession {
  id: string
  question: string
  status: 'pending' | 'debating' | 'consensus' | 'error'
  consensus: number
  messages: QuantumMessage[]
  startedAt: number
  cost: number
}

export interface QuantumSSEEvent {
  type:
    | 'thinking'
    | 'token'
    | 'message_complete'
    | 'consensus_update'
    | 'session_complete'
    | 'error'
    | 'round_start'
    | 'round_complete'
    | 'provider_unavailable'
  characterId?: string
  token?: string
  message?: QuantumMessage
  consensus?: number
  error?: string
  /** Round number (1-based). Present on round_start, round_complete, and
   *  token/message_complete events for rounds 2+ so the UI can distinguish
   *  multi-round debate bubbles. */
  round?: number
  /** Backend-supplied reason for provider_unavailable events. */
  reason?: string
  /** Raw provider name (pre-mapping) for provider_unavailable events. */
  provider?: string
}
