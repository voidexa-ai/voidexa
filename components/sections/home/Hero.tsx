'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const word = TYPED_WORDS[wordIdx]
    if (typing) {
      if (charIdx < word.length) {
        const t = setTimeout(() => {
          setDisplayed(word.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, 75)
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
        }, 40)
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

      {/* Deep space gradient base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(0,212,255,0.09) 0%, transparent 55%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 80% 70%, rgba(139,92,246,0.07) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 20% 80%, rgba(244,113,181,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Faint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.018,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(7,7,13,0.7) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,212,255,0.06)',
              border: '1px solid rgba(0,212,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#00d4ff',
                boxShadow: '0 0 8px #00d4ff',
                animation: 'breathe 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#00d4ff', fontFamily: 'var(--font-space)' }}
            >
              AI-native systems
            </span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-[88px] font-bold leading-[1.02] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-space)' }}
        >
          <span className="block text-[#e2e8f0]">We build</span>
          <span className="block">
            <span
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #a78bfa 55%, #f471b5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.3))',
              }}
            >
              {displayed}
            </span>
            {/* Cursor */}
            <motion.span
              className="inline-block ml-1 w-[3px] align-middle"
              style={{
                height: '0.82em',
                background: 'linear-gradient(180deg, #00d4ff, #8b5cf6)',
                borderRadius: 2,
              }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </span>
          <span className="block text-[#e2e8f0]">software.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          We build autonomous systems that trade, communicate, and create —
          without waiting for instructions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#what-we-build"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#07070d] transition-all glow-cyan-btn"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}
          >
            Explore
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <Link
            href="/services"
            className="btn-ghost inline-flex items-center justify-center gap-2"
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
            { value: '+306%', label: 'Backtest return (12mo)' },
            { value: '5-stage', label: 'AI pipeline' },
            { value: '24/7', label: 'Autonomous operation' },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-space)',
                  background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.2))',
                }}
              >
                {value}
              </div>
              <div className="text-xs text-[#8899af] tracking-wide uppercase font-medium">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #07070d)' }}
      />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: '#2a3a4a' }}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-medium">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}
