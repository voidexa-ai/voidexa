'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Minimize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RESPONSES: Record<string, { text: string; nav?: string }> = {
  hello:    { text: "Hello. I'm JARVIS — voidexa's onboard intelligence. What are you looking for?" },
  hi:       { text: "Hey there. JARVIS online. Ask me about trading bots, apps, AI tools, or services." },
  help:     { text: "I can help you navigate voidexa. Try asking: 'Tell me about trading bots', 'What apps do you have?', 'How can voidexa help?', or 'Take me to contact'." },
  trading:  { text: "The All-Season Bot is our flagship — a fully autonomous crypto rebalancer with market regime detection. 4 phases, 5-stage pipeline, +306% backtested. Want me to take you there?", nav: '/trading' },
  bot:      { text: "The trading bot classifies market conditions (BTC/ETH/ALTCOIN phases + RISK_OFF), generates allocation proposals, passes them through a risk gate, then executes. Backtested +306% over 12 months vs buy-and-hold -6%.", nav: '/trading' },
  node:     { text: "The Node is a shared trading pool powered by the All-Season Bot. Early entrants get the best price. Currently on waitlist — join at the Trading page.", nav: '/trading#node' },
  comlink:  { text: "Comlink is an encrypted P2P messaging app. End-to-end encryption, zero server storage, ephemeral channels, QR invite only. Built for real privacy. Currently in beta.", nav: '/apps' },
  apps:     { text: "Our apps: Comlink (encrypted messenger, beta), AI Book Creator (in dev), Website Builder (coming soon). All built on voidexa's privacy-first architecture.", nav: '/apps' },
  book:     { text: "The AI Book Creator interviews you about your story, structures it, and writes the full manuscript. Any genre — autobiography, sci-fi, romance, children's. Coming soon.", nav: '/ai-tools' },
  website:  { text: "The AI Website Builder turns a conversation into a production Next.js site. No code needed — describe what you want, the AI builds it, you deploy. Coming soon.", nav: '/ai-tools' },
  tools:    { text: "AI Tools: AI Book Creator (tell your story, AI writes the book), AI Website Builder (talk it, build it, launch it), AI Idea Chatbot (brainstorm partner). All coming soon.", nav: '/ai-tools' },
  services: { text: "voidexa offers: Custom AI Development, Data Intelligence (pipelines, dashboards, predictive models), and AI Consulting. All project-based. Contact us to scope.", nav: '/services' },
  data:     { text: "Data Intelligence: web scraping, custom indexing, AI analysis, and automated pipelines. We turn raw data into decisions that run themselves.", nav: '/services' },
  consult:  { text: "AI Consulting helps you adopt AI tools — setup, workflow design, training. Whether you're a beginner or technical, we build the right strategy.", nav: '/services' },
  contact:  { text: "Reach us at hello@voidexa.com — or use the Contact page. We respond within 24 hours.", nav: '/contact' },
  about:    { text: "voidexa was born from the void — the space between what technology can do and what it actually does for people. We build autonomous intelligent systems.", nav: '/about' },
  voidexa:  { text: "voidexa builds AI-powered trading systems, encrypted communication apps, and intelligent automation tools. Technology that thinks, adapts, and executes." },
  price:    { text: "Project pricing varies by scope. Book a consultation via the Contact page — no canned packages. We build what you actually need.", nav: '/contact' },
  default:  { text: "Not sure I have a perfect answer for that. Try asking about 'trading bots', 'apps', 'AI tools', 'services', or 'contact'. Or use the contact form for a human reply." },
}

function getResponse(input: string): { text: string; nav?: string } {
  const lower = input.toLowerCase()
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val
  }
  return RESPONSES.default
}

interface Message {
  role: 'user' | 'assistant'
  text: string
  nav?: string
}

export default function JarvisAssistant() {
  const [open, setOpen]       = useState(false)
  const [minimized, setMin]   = useState(false)
  const [input, setInput]     = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "JARVIS online. What are you looking for? Ask about trading bots, apps, AI tools, or services." },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTimeout(() => {
      const { text: responseText, nav } = getResponse(text)
      const assistantMsg: Message = { role: 'assistant', text: responseText, nav }
      setMessages(m => [...m, assistantMsg])
    }, 500)
  }

  function handleNav(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Floating orb — living breathing design */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Outer breathing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
            width: 56, height: 56,
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            width: 56, height: 56,
          }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
        {/* Orbiting sparks */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: '50%', left: '50%',
              marginTop: -3, marginLeft: -3,
              background: i === 1 ? '#8b5cf6' : '#00d4ff',
              boxShadow: i === 1 ? '0 0 6px #8b5cf6' : '0 0 6px #00d4ff',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
            // Inline translateX via CSS for orbit
          >
            <motion.div
              style={{
                position: 'absolute',
                top: -3, left: -3,
                transformOrigin: `3px 3px`,
              }}
              animate={{ rotate: [deg, deg + 360] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        ))}

        <motion.button
          onClick={() => { setOpen(true); setMin(false) }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(139,92,246,0.18))',
            border: '1px solid rgba(0,212,255,0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 15px rgba(0,212,255,0.3), 0 0 40px rgba(139,92,246,0.1), inset 0 1px 0 rgba(0,212,255,0.2)',
              '0 0 30px rgba(0,212,255,0.55), 0 0 70px rgba(139,92,246,0.25), inset 0 1px 0 rgba(0,212,255,0.3)',
              '0 0 15px rgba(0,212,255,0.3), 0 0 40px rgba(139,92,246,0.1), inset 0 1px 0 rgba(0,212,255,0.2)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.12, borderColor: 'rgba(0,212,255,0.8)' }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open JARVIS assistant"
        >
          {/* Inner core glow */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3), transparent)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="relative text-[11px] font-bold tracking-widest"
            style={{
              fontFamily: 'var(--font-space)',
              background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI
          </span>
        </motion.button>
      </div>

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
              background: 'rgba(7,4,18,0.97)',
              border: '1px solid rgba(0,212,255,0.22)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.08), inset 0 1px 0 rgba(0,212,255,0.1)',
              backdropFilter: 'blur(24px)',
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
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      m.role === 'user' ? 'text-[#e2e8f0]' : 'text-[#94a3b8]'
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
                  {m.nav && (
                    <button
                      onClick={() => handleNav(m.nav!)}
                      className="mt-1.5 text-[10px] font-medium px-3 py-1 rounded-full transition-colors"
                      style={{
                        background: 'rgba(0,212,255,0.08)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        color: '#00d4ff',
                      }}
                    >
                      Take me there →
                    </button>
                  )}
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
