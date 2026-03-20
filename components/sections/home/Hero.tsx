'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import ParticleField from '@/components/ui/ParticleField'

const TYPED_WORDS = ['intelligent', 'adaptive', 'autonomous', 'resilient']

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping]     = useState(true)
  const [charIdx, setCharIdx]   = useState(0)

  // Typewriter effect
  useEffect(() => {
    const word = TYPED_WORDS[wordIdx]
    if (typing) {
      if (charIdx < word.length) {
        const t = setTimeout(() => {
          setDisplayed(word.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplayed(word.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, 45)
        return () => clearTimeout(t)
      } else {
        setWordIdx(i => (i + 1) % TYPED_WORDS.length)
        setTyping(true)
      }
    }
  }, [typing, charIdx, wordIdx])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Particle canvas */}
      <ParticleField />

      {/* Radial gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.07) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.25)',
              color: '#00d4ff',
            }}
          >
            AI-native systems
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-space)' }}
        >
          <span className="text-[#e2e8f0]">We build</span>
          <br />
          <span className="gradient-text">{displayed}</span>
          <span
            className="inline-block w-[3px] h-[0.85em] ml-1 align-middle gradient-text animate-pulse"
            style={{ background: 'linear-gradient(180deg, #00d4ff, #8b5cf6)' }}
          />
          <br />
          <span className="text-[#e2e8f0]">software.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg sm:text-xl text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          voidexa builds AI-powered trading systems, encrypted communication apps,
          and intelligent automation tools — technology that thinks, adapts, and executes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#0a0a0f] transition-all hover:opacity-90 glow-cyan-btn"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
          >
            Explore products
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#94a3b8] transition-all hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Our services
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: '+313%', label: 'Backtest return (12mo)' },
            { value: '5-stage', label: 'AI pipeline' },
            { value: '24/7', label: 'Autonomous operation' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl font-bold gradient-text mb-1"
                style={{ fontFamily: 'var(--font-space)' }}
              >
                {value}
              </div>
              <div className="text-xs text-[#475569] tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#334155]"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}
