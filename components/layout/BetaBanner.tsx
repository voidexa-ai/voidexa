'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'voidexa_beta_banner_dismissed'

export default function BetaBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'true')
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-4 py-2 text-xs"
      style={{
        background: 'rgba(10,10,20,0.97)',
        borderBottom: '1px solid rgba(139,92,246,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-center text-[#94a3b8]">
        Early access — voidexa is in active development.{' '}
        Interested in beta?{' '}
        <Link
          href="/contact"
          className="font-semibold underline underline-offset-2 hover:text-white transition-colors"
          style={{ color: '#00d4ff' }}
        >
          Get in touch.
        </Link>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94a3b8] transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  )
}
