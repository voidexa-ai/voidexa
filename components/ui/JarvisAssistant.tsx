'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Minimize2 } from 'lucide-react'

const RESPONSES: Record<string, string> = {
  hello: "Hello. I'm JARVIS — voidexa's onboard intelligence. How can I assist you today?",
  hi: "Hey there. JARVIS online. Ask me anything about voidexa's systems.",
  products: "voidexa builds four core products: AI Trading Bot (live, deployed), Comlink encrypted messenger (beta), AI Book Creator (in dev), and the Website Builder (coming soon). Which interests you?",
  trading: "The AI Trading Bot is our flagship — a fully automated crypto spot rebalancer with futures overlay. It runs a 5-stage pipeline: Market Data → Season Engine → Rebalance → Risk Gate → Execution. Currently live on KuCoin with multi-agent architecture.",
  bot: "The trading bot uses a market regime classifier (BTC/ETH/ALTCOIN phases + RISK_OFF), dynamic rebalancing with momentum weighting, and a futures overlay with adaptive leverage up to 5x. Backtested +313% over 12 months vs buy-and-hold -6%.",
  comlink: "Comlink is an encrypted peer-to-peer messaging app. End-to-end encryption, zero server storage, ephemeral channels. Built for people who value privacy. Currently in private beta.",
  services: "voidexa offers three service lines: Custom AI Development, Data Intelligence (pipelines, dashboards, predictive models), and AI Consulting (strategy, implementation, integration). All project-based, global.",
  contact: "Reach us at hello@voidexa.com — or use the Contact page to send a direct message. We typically respond within 24 hours.",
  about: "voidexa was built to answer one question: what would software look like if intelligence was baked in at every layer? We build autonomous systems that adapt, not just execute.",
  price: "Project pricing varies by scope. Book a consultation via the Contact page and we'll scope it properly. No canned packages — we build what you actually need.",
  default: "Interesting question. I'd point you to the relevant page, but if you want a direct answer — use the contact form and a human will respond. I'm an AI, after all.",
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return val
  }
  return RESPONSES.default
}

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function JarvisAssistant() {
  const [open, setOpen]       = useState(false)
  const [minimized, setMin]   = useState(false)
  const [input, setInput]     = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "JARVIS online. Ask me about voidexa's products, services, or technology." },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    const next: Message[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setInput('')
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: getResponse(text) }])
    }, 500)
  }

  return (
    <>
      {/* Floating orb */}
      <motion.button
        onClick={() => { setOpen(true); setMin(false) }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #00d4ff22, #8b5cf622)',
          border: '1px solid rgba(0,212,255,0.4)',
          boxShadow: '0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(139,92,246,0.15)',
        }}
        animate={{ boxShadow: [
          '0 0 20px rgba(0,212,255,0.25), 0 0 40px rgba(139,92,246,0.1)',
          '0 0 35px rgba(0,212,255,0.45), 0 0 70px rgba(139,92,246,0.2)',
          '0 0 20px rgba(0,212,255,0.25), 0 0 40px rgba(139,92,246,0.1)',
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open JARVIS assistant"
      >
        <span
          className="text-xs font-bold gradient-text"
          style={{ fontFamily: 'var(--font-space)', letterSpacing: '0.05em' }}
        >
          AI
        </span>
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10,10,15,0.97)',
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                <span className="text-sm font-semibold text-[#00d4ff]" style={{ fontFamily: 'var(--font-space)' }}>
                  JARVIS
                </span>
                <span className="text-xs text-[#475569]">voidexa AI</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMin(true)}
                  className="p-1.5 text-[#475569] hover:text-[#94a3b8] transition-colors rounded"
                  aria-label="Minimize"
                >
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-[#475569] hover:text-[#94a3b8] transition-colors rounded"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'text-[#e2e8f0]'
                        : 'text-[#94a3b8]'
                    }`}
                    style={m.role === 'user' ? {
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))',
                      border: '1px solid rgba(0,212,255,0.2)',
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div
              className="flex gap-2 px-4 py-3"
              style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about products, services..."
                className="flex-1 bg-transparent text-xs text-[#e2e8f0] placeholder-[#334155] outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #00d4ff, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                }}
                aria-label="Send"
              >
                <Send size={12} className="text-[#0a0a0f]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
