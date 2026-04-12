'use client'

import { useState } from 'react'
import { Zap, ChevronDown } from 'lucide-react'
import type { QuantumMode } from '@/types/quantum'

interface QuantumInputProps {
  onSubmit: (question: string, mode: QuantumMode) => void
  disabled?: boolean
  loading?: boolean
  scaffoldMode?: boolean
  onScaffoldToggle?: (next: boolean) => void
}

const SCAFFOLD_TOOLTIP =
  'Quantum builds a complete project scaffold with CLAUDE.md, SKILL.md, file structure, and build commands — ready to paste into Claude Code. Describe what you want to build.'

interface ModeOption {
  value: QuantumMode
  label: string
  hint: string
}

const MODE_OPTIONS: ModeOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    hint: '2 rounds · Perplexity & Gemini web search',
  },
  {
    value: 'deep',
    label: 'Deep',
    hint: '3 rounds · full KCP-90 · all providers',
  },
]

export default function QuantumInput({
  onSubmit,
  disabled = false,
  loading = false,
  scaffoldMode = false,
  onScaffoldToggle,
}: QuantumInputProps) {
  const [value, setValue] = useState('')
  const [mode, setMode] = useState<QuantumMode>('standard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scaffoldHover, setScaffoldHover] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q || disabled) return
    onSubmit(q, mode)
    setValue('')
  }

  const currentMode = MODE_OPTIONS.find(m => m.value === mode)!

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={scaffoldMode ? 'Describe what you want to build...' : 'Ask Quantum a question...'}
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

      {/* Scaffold mode toggle — always visible */}
      {onScaffoldToggle && (
        <div
          className="relative"
          onMouseEnter={() => setScaffoldHover(true)}
          onMouseLeave={() => setScaffoldHover(false)}
        >
          <button
            type="button"
            onClick={() => onScaffoldToggle(!scaffoldMode)}
            disabled={disabled}
            aria-pressed={scaffoldMode}
            className="rounded-lg px-3 py-3 flex items-center gap-1.5 transition-all"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: scaffoldMode ? '#fff' : '#cbd5e1',
              background: scaffoldMode
                ? 'linear-gradient(135deg, rgba(127,119,221,0.4), rgba(99,102,241,0.35))'
                : 'rgba(8,8,18,0.7)',
              border: scaffoldMode
                ? '1px solid rgba(127,119,221,0.7)'
                : '1px solid rgba(119,119,187,0.25)',
              boxShadow: scaffoldMode ? '0 0 14px rgba(127,119,221,0.45)' : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: 14 }}>▣</span>
            Scaffold
          </button>
          {scaffoldHover && (
            <div
              className="absolute rounded-lg"
              style={{
                bottom: 'calc(100% + 8px)',
                right: 0,
                width: 280,
                background: 'rgba(8,8,18,0.97)',
                border: '1px solid rgba(127,119,221,0.35)',
                padding: '10px 12px',
                fontSize: 14,
                color: '#e2e8f0',
                lineHeight: 1.5,
                zIndex: 60,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              {SCAFFOLD_TOOLTIP}
            </div>
          )}
        </div>
      )}

      {/* Mode dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 120)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          className="flex items-center gap-1.5 rounded-lg px-3 py-3 transition-all"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#cbd5e1',
            background: 'rgba(8,8,18,0.7)',
            border: '1px solid rgba(119,119,187,0.25)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {currentMode.label}
          <ChevronDown
            size={14}
            style={{
              transition: 'transform 0.15s ease',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
        {menuOpen && (
          <ul
            role="listbox"
            className="absolute right-0 bottom-full mb-2 rounded-lg overflow-hidden"
            style={{
              minWidth: 260,
              background: 'rgba(8,8,18,0.96)',
              border: '1px solid rgba(119,119,187,0.3)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 50,
            }}
          >
            {MODE_OPTIONS.map(opt => {
              const selected = opt.value === mode
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => {
                    // onMouseDown fires before the button's onBlur — this
                    // lets the click commit the selection instead of being
                    // swallowed by the blur-close handler.
                    e.preventDefault()
                    setMode(opt.value)
                    setMenuOpen(false)
                  }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderLeft: selected
                      ? '2px solid #7777bb'
                      : '2px solid transparent',
                    background: selected
                      ? 'rgba(119,119,187,0.12)'
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.background = 'rgba(119,119,187,0.06)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
                    {opt.hint}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition-all ${!disabled && !loading ? 'quantum-btn-glow' : ''}`}
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
            style={{
              width: 16,
              height: 16,
              borderColor: '#fff',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : (
          <Zap size={16} />
        )}
        {scaffoldMode ? 'Build Scaffold' : 'Ask Quantum'}
      </button>
    </form>
  )
}
