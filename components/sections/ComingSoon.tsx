'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ComingSoonProps {
  label: string
  title: string
  subtitle: string
  description: string
  accentColor: string   // hex — the planet emissive color
}

export default function ComingSoon({ label, title, subtitle, description, accentColor }: ComingSoonProps) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#07070d' }}
    >
      {/* Radial glow in planet color */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{
              color: accentColor,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}40`,
            }}
          >
            Coming Soon
          </span>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-xs font-medium uppercase tracking-[0.18em] mb-4"
          style={{ color: `${accentColor}99` }}
        >
          {label}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl font-bold mb-5 leading-none tracking-tight"
          style={{
            fontFamily: 'var(--font-space)',
            color: '#e2e8f0',
            textShadow: `0 0 60px ${accentColor}33`,
          }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-xl sm:text-2xl font-light mb-8"
          style={{ color: `${accentColor}cc` }}
        >
          {subtitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mx-auto mb-8"
          style={{
            width: 40,
            height: 1,
            background: `${accentColor}66`,
          }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base leading-relaxed mb-12 mx-auto max-w-lg"
          style={{ color: '#64748b' }}
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              color: accentColor,
            }}
          >
            Join the waitlist <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
