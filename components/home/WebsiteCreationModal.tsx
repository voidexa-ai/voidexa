'use client'

import { useEffect, useState } from 'react'

type ContactType = 'email' | 'phone'

const BTN_LINK: React.CSSProperties = {
  flex: '1 1 140px',
  textAlign: 'center',
  padding: '12px 18px',
  borderRadius: 10,
  background: 'rgba(20, 40, 70, 0.6)',
  border: '1px solid rgba(150, 200, 255, 0.35)',
  color: '#7fd8ff',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

export default function WebsiteCreationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [contact, setContact] = useState('')
  const [type, setType] = useState<ContactType>('email')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) { setContact(''); setStatus('idle'); setSubmitting(false) }
  }, [open])

  if (!open) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim()) return
    setSubmitting(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/contact/website-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: contact.trim(), type }),
      })
      const data = await res.json()
      setStatus(res.ok && data.success ? 'ok' : 'err')
    } catch {
      setStatus('err')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wc-modal-title"
      data-testid="website-modal"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        background: 'rgba(2, 8, 18, 0.72)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{
        width: 'min(520px, 100%)',
        background: 'rgba(10, 15, 30, 0.85)',
        border: '1px solid rgba(150, 200, 255, 0.3)',
        borderRadius: 16, padding: 28,
        boxShadow: 'inset 0 0 24px rgba(0, 180, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.55)',
        color: 'rgba(255,255,255,0.9)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
          <h2 id="wc-modal-title" style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em',
          }}>Website creation</h2>
          <button type="button" aria-label="Close dialog" onClick={onClose} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)', borderRadius: 999,
            width: 32, height: 32, fontSize: 16, cursor: 'pointer',
          }}>×</button>
        </div>
        <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,0.75)' }}>
          We&rsquo;d love to help you build your website. Our team automates the process with AI so we can deliver fast and affordable. Give us a call, send an email, or leave your contact and we&rsquo;ll reach out.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          <a href="tel:+4500000000" style={BTN_LINK}>Call us</a>
          <a href="mailto:contact@voidexa.com" style={BTN_LINK}>Email</a>
        </div>

        <form onSubmit={submit} style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {(['email', 'phone'] as ContactType[]).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'capitalize',
                background: type === t ? 'rgba(127,216,255,0.2)' : 'transparent',
                border: type === t ? '1px solid rgba(127,216,255,0.7)' : '1px solid rgba(255,255,255,0.2)',
                color: type === t ? '#7fd8ff' : 'rgba(255,255,255,0.75)',
                cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
          <label htmlFor="wc-contact" style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 6 }}>
            Your {type}
          </label>
          <input
            id="wc-contact" value={contact} onChange={(e) => setContact(e.target.value)}
            type={type === 'email' ? 'email' : 'tel'}
            placeholder={type === 'email' ? 'you@example.com' : '+45 00 00 00 00'}
            required
            style={{
              width: '100%', padding: '12px 14px', fontSize: 16,
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(150, 200, 255, 0.3)',
              borderRadius: 10, color: '#ffffff', outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button type="submit" disabled={submitting || !contact.trim()} style={{
            marginTop: 12, width: '100%', padding: '12px 18px',
            fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            borderRadius: 999, border: 'none',
            cursor: submitting ? 'progress' : 'pointer',
            color: '#02101e',
            background: 'linear-gradient(120deg, #7fd8ff, #a78bfa)',
            opacity: !contact.trim() || submitting ? 0.65 : 1,
            boxShadow: '0 0 22px rgba(127,216,255,0.45)',
          }}>{submitting ? 'Sending…' : 'Request a call back'}</button>
          {status === 'ok' && <div style={{ marginTop: 10, fontSize: 14, color: '#7fffb4' }}>Got it — we&rsquo;ll be in touch shortly.</div>}
          {status === 'err' && <div style={{ marginTop: 10, fontSize: 14, color: '#ff9d9d' }}>Something went wrong. Please email contact@voidexa.com.</div>}
        </form>
      </div>
    </div>
  )
}
