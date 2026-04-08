'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import QuantumDebatePanel from '@/components/quantum/QuantumDebatePanel'

export default function QuantumChatPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth/login?redirect=/quantum/chat')
      } else {
        setAuthed(true)
      }
      setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div
          className="rounded-full border-2 border-t-transparent"
          style={{
            width: 32,
            height: 32,
            borderColor: '#7777bb',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    )
  }

  if (!authed) return null

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
