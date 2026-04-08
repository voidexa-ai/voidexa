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
  type: 'thinking' | 'token' | 'message_complete' | 'consensus_update' | 'session_complete' | 'error'
  characterId?: string
  token?: string
  message?: QuantumMessage
  consensus?: number
  error?: string
}
