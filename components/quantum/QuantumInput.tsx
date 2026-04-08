'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'

interface QuantumInputProps {
  onSubmit: (question: string) => void
  disabled?: boolean
  loading?: boolean
}

export default function QuantumInput({ onSubmit, disabled = false, loading = false }: QuantumInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q || disabled) return
    onSubmit(q)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask Quantum a question..."
        disabled={disabled}
        className="flex-1 rounded-lg px-4 py-3 outline-none"
        style={{
          fontSize: 15,
          color: '#e2e8f0',
          background: 'rgba(8,8,18,0.7)',
          border: '1px solid rgba(119,119,187,0.25)',
          backdropFilter: 'blur(8px)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(119,119,187,0.5)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(119,119,187,0.25)'
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition-all"
        style={{
          fontSize: 14,
          color: '#fff',
          background: disabled
            ? 'rgba(119,119,187,0.2)'
            : 'linear-gradient(135deg, #7777bb, #6366f1)',
          border: '1px solid rgba(119,119,187,0.3)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {loading ? (
          <span
            className="inline-block rounded-full border-2 border-t-transparent"
            style={{ width: 16, height: 16, borderColor: '#fff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
          />
        ) : (
          <Zap size={16} />
        )}
        Ask Quantum
      </button>
    </form>
  )
}
