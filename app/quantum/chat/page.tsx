'use client'

import QuantumDebatePanel from '@/components/quantum/QuantumDebatePanel'

export default function QuantumChatPage() {
  return (
    <div
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6"
      style={{ minHeight: '85vh' }}
    >
      <style>{`
        @keyframes quantum-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes quantum-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <QuantumDebatePanel />
    </div>
  )
}
