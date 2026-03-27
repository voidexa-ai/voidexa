'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Loader, AlertTriangle } from 'lucide-react'

const ACCENT = '#cc9955'

type Step = 'idle' | 'uploading' | 'scanning' | 'analyzing' | 'done' | 'error'

const STEPS = [
  { id: 'scanning',  label: 'AI Safety Scan',             desc: 'Checking for malicious patterns and unsafe operations.' },
  { id: 'analyzing', label: 'Quantum Strategy Analysis',  desc: 'Detecting strategy type, regime fit, and complexity score.' },
  { id: 'done',      label: 'Scorecard Generated',        desc: 'Your bot has been benchmarked and added to the queue.' },
]

export default function UploadBotTab() {
  const [step, setStep]         = useState<Step>('idle')
  const [filename, setFilename] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const runSteps = useCallback(async (name: string) => {
    setFilename(name)
    setStep('uploading')
    await new Promise(r => setTimeout(r, 800))
    setStep('scanning')
    await new Promise(r => setTimeout(r, 1800))
    setStep('analyzing')
    await new Promise(r => setTimeout(r, 2200))
    setStep('done')
  }, [])

  function handleFile(file: File) {
    if (!file.name.endsWith('.py')) {
      setError('Only .py files are accepted.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB.')
      return
    }
    setError('')
    runSteps(file.name)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const stepIndex = ({ uploading: -1, scanning: 0, analyzing: 1, done: 2, idle: -1, error: -1 } as Record<Step, number>)[step] ?? -1

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', fontFamily: 'var(--font-space)', fontWeight: 500, marginBottom: 8 }}>
          Upload Your Bot
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          Drop a Python trading strategy. We&apos;ll scan it, analyse it, and generate a performance scorecard.
        </p>
      </div>

      {/* Drop zone */}
      {(step === 'idle' || step === 'error') && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all"
          style={{
            minHeight: 220,
            border: `2px dashed ${dragging ? ACCENT : 'rgba(255,255,255,0.1)'}`,
            background: dragging ? `${ACCENT}08` : 'rgba(255,255,255,0.02)',
            padding: '48px 32px',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}
          >
            <Upload size={24} style={{ color: ACCENT }} />
          </div>
          <div className="text-center">
            <p style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>
              Drop your .py file here
            </p>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>
              or click to browse · max 5 MB
            </p>
          </div>
          {error && (
            <p className="flex items-center gap-2" style={{ color: '#f87171', fontSize: '0.875rem' }}>
              <AlertTriangle size={14} /> {error}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".py"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </motion.div>
      )}

      {/* Steps progress */}
      <AnimatePresence>
        {step !== 'idle' && step !== 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 space-y-6"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                style={{ background: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}28` }}
              >
                .py
              </div>
              <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '0.9375rem' }}>{filename}</span>
            </div>

            {STEPS.map((s, i) => {
              const done = stepIndex > i
              const active = stepIndex === i
              return (
                <div key={s.id} className="flex gap-4 items-start">
                  <div className="shrink-0 mt-0.5">
                    {done ? (
                      <CheckCircle size={20} style={{ color: '#22c55e' }} />
                    ) : active ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                      >
                        <Loader size={20} style={{ color: ACCENT }} />
                      </motion.div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border"
                        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                      />
                    )}
                  </div>
                  <div>
                    <p style={{
                      color: done ? '#22c55e' : active ? '#e2e8f0' : '#475569',
                      fontWeight: active ? 500 : 400,
                      fontSize: '0.9375rem',
                      marginBottom: 2,
                    }}>
                      {s.label}
                    </p>
                    {(done || active) && (
                      <p style={{ color: '#475569', fontSize: '0.875rem' }}>{s.desc}</p>
                    )}
                  </div>
                </div>
              )
            })}

            {step === 'done' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 mt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p style={{ color: '#22c55e', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 4 }}>
                  Bot submitted successfully
                </p>
                <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                  Our team will review your bot before it appears on the leaderboard.
                </p>
                <button
                  onClick={() => { setStep('idle'); setFilename('') }}
                  className="mt-4 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}30`, color: ACCENT }}
                >
                  Upload another
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info section */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          What we check
        </p>
        <div className="space-y-2">
          {[
            'No network requests, file writes, or system calls',
            'Buy/sell logic must be clearly defined',
            'Strategy must accept OHLCV data as input',
            'Maximum 500 lines of code',
          ].map(rule => (
            <div key={rule} className="flex items-start gap-2">
              <span style={{ color: `${ACCENT}66`, fontSize: '1rem', lineHeight: 1.4 }}>·</span>
              <span style={{ color: '#64748b', fontSize: '0.9375rem' }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
