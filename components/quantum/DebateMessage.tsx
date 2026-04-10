'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { QuantumCharacter } from '@/types/quantum'

interface DebateMessageProps {
  character: QuantumCharacter
  text: string
  streaming?: boolean
  strikethrough?: boolean
  agreement?: boolean
}

interface ParsedEval {
  isEvalFormat: boolean
  improvedAnswer: string | null
  agree: string[]
  disagree: string[]
}

// Provider role labels — pulled from the static cast metadata in the
// constellation, kept here so the message card header doesn't need to
// reach back into QuantumDebatePanel for the role string.
const PROVIDER_ROLE: Record<string, string> = {
  claude: 'Chief Architect',
  gpt: 'Lead Developer',
  perplexity: 'Fact Checker',
  gemini: 'Senior Reviewer',
}

// Convert a 6-digit hex color to "r, g, b" so we can drop it into
// rgba() expressions for the card background and border tints.
function hexToRgb(hex: string): string {
  const m = hex.replace('#', '')
  if (m.length !== 6) return '127,119,221'
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return `${r},${g},${b}`
}

// Progressive extractor for the fast-eval JSON shape the engine emits in
// round 2+: {"agree":[…],"disagree":{…},"improved_answer":"…"}. Works on
// partial JSON so we can animate improved_answer as it streams in, and
// falls back to raw text for non-eval messages (round 1 prose).
function parseEvalJson(raw: string): ParsedEval {
  // Strip a leading ```json fence if the model wrapped the payload.
  const stripped = raw.replace(/^\s*```(?:json)?\s*/i, '')
  const isEvalFormat =
    /"improved_answer"\s*:/i.test(stripped) ||
    /^\s*\{\s*"(?:agree|disagree|consensus|improved_answer)"/i.test(stripped)

  if (!isEvalFormat) {
    return { isEvalFormat: false, improvedAnswer: null, agree: [], disagree: [] }
  }

  // Progressive extraction of improved_answer: find the opening quote and
  // walk forward, honoring \" and \\ escapes, until we hit an unescaped
  // closing quote OR run out of input (streaming, still coming).
  let improvedAnswer: string | null = null
  const keyIdx = stripped.search(/"improved_answer"\s*:/i)
  if (keyIdx !== -1) {
    const afterKey = stripped.slice(keyIdx)
    const colonIdx = afterKey.indexOf(':')
    if (colonIdx !== -1) {
      const openQuoteIdx = afterKey.indexOf('"', colonIdx + 1)
      if (openQuoteIdx !== -1) {
        let out = ''
        let i = openQuoteIdx + 1
        let closed = false
        while (i < afterKey.length) {
          const c = afterKey[i]
          if (c === '\\' && i + 1 < afterKey.length) {
            const next = afterKey[i + 1]
            if (next === 'n') out += '\n'
            else if (next === 't') out += '  '
            else if (next === 'r') out += ''
            else if (next === '"') out += '"'
            else if (next === '\\') out += '\\'
            else if (next === '/') out += '/'
            else out += next
            i += 2
            continue
          }
          if (c === '"') {
            closed = true
            break
          }
          out += c
          i++
        }
        if (out.length > 0 || closed) {
          improvedAnswer = out
        }
      }
    }
  }

  const agree: string[] = []
  const agreeMatch = stripped.match(/"agree"\s*:\s*\[([^\]]*)\]/i)
  if (agreeMatch) {
    const items = agreeMatch[1].match(/"([^"]+)"/g) || []
    for (const item of items) {
      const name = item.slice(1, -1).trim()
      if (name) agree.push(name)
    }
  }

  const disagree: string[] = []
  const disagreeKeyMatches = stripped.matchAll(
    /"disagree"\s*:\s*\{([\s\S]*?)(?:\}|$)/gi
  )
  for (const m of disagreeKeyMatches) {
    const body = m[1]
    const keyMatches = body.matchAll(/"([A-Za-z][A-Za-z0-9_-]*)"\s*:/g)
    for (const km of keyMatches) {
      if (!disagree.includes(km[1])) disagree.push(km[1])
    }
  }

  return { isEvalFormat: true, improvedAnswer, agree, disagree }
}

function badgeColor(kind: 'agree' | 'disagree'): {
  bg: string
  border: string
  text: string
} {
  if (kind === 'agree') {
    return {
      bg: 'rgba(74,222,128,0.12)',
      border: 'rgba(74,222,128,0.4)',
      text: '#4ade80',
    }
  }
  return {
    bg: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.4)',
    text: '#fb923c',
  }
}

function Badge({ name, kind }: { name: string; kind: 'agree' | 'disagree' }) {
  const c = badgeColor(kind)
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        marginRight: 4,
        marginBottom: 2,
      }}
    >
      {kind === 'agree' ? '✓ ' : '✕ '}
      {name}
    </span>
  )
}

export default function DebateMessage({
  character,
  text,
  streaming = false,
  strikethrough = false,
  agreement = false,
}: DebateMessageProps) {
  const parsed = useMemo(() => parseEvalJson(text), [text])
  const isEval = parsed.isEvalFormat

  // Pick what the typewriter animates. For eval JSON we hide the raw
  // braces and animate the extracted improved_answer instead; for round-1
  // prose we keep the existing behavior (animate the raw text).
  const displayTarget = isEval ? parsed.improvedAnswer ?? '' : text

  const [visibleLen, setVisibleLen] = useState<number>(() =>
    streaming ? 0 : displayTarget.length
  )
  const targetLenRef = useRef<number>(displayTarget.length)
  targetLenRef.current = displayTarget.length

  useEffect(() => {
    if (!streaming) {
      setVisibleLen(displayTarget.length)
      return
    }
    const iv = setInterval(() => {
      setVisibleLen(prev =>
        prev >= targetLenRef.current ? prev : prev + 1
      )
    }, 18)
    return () => clearInterval(iv)
  }, [streaming, displayTarget])

  const displayed = displayTarget.slice(
    0,
    Math.min(visibleLen, displayTarget.length)
  )

  const showEvaluating =
    isEval && parsed.improvedAnswer === null && streaming
  const stillTyping = streaming && visibleLen < displayTarget.length

  const rgb = hexToRgb(character.color)
  const role = PROVIDER_ROLE[character.id] ?? character.role

  // Card colour tints — subtle backround + slightly stronger border so
  // each provider gets its own visual lane in the chat without becoming
  // garish. Numbers match the spec table (0.06 bg / 0.18 border).
  const cardBg = agreement
    ? `rgba(${rgb}, 0.10)`
    : `rgba(${rgb}, 0.06)`
  const cardBorder = `rgba(${rgb}, 0.22)`
  const accent = `rgba(${rgb}, 0.55)`

  return (
    <div
      className="rounded-xl"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        padding: '14px 18px',
        marginBottom: 14,
      }}
    >
      {/* Header — avatar + name + role */}
      <div
        className="flex items-center gap-3"
        style={{ marginBottom: 10 }}
      >
        <div
          className="rounded-full overflow-hidden shrink-0"
          style={{
            width: 32,
            height: 32,
            border: `1.5px solid ${accent}`,
            boxShadow: `0 0 0 2px rgba(${rgb}, 0.08)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={character.image}
            alt={character.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span
            className="font-semibold"
            style={{ fontSize: 14, color: character.color }}
          >
            {character.name}
          </span>
          <span style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.04em' }}>
            {role}
          </span>
        </div>
      </div>

      {/* Badges for agree/disagree — only shown for eval-format messages. */}
      {isEval && (parsed.agree.length > 0 || parsed.disagree.length > 0) && (
        <div style={{ marginBottom: 8 }}>
          {parsed.agree.map(name => (
            <Badge key={`a-${name}`} name={name} kind="agree" />
          ))}
          {parsed.disagree.map(name => (
            <Badge key={`d-${name}`} name={name} kind="disagree" />
          ))}
        </div>
      )}

      {/* Body — markdown rendered (or evaluating placeholder during early stream). */}
      <div
        style={{
          textDecoration: strikethrough ? 'line-through' : 'none',
          textDecorationColor: strikethrough ? 'rgba(239,68,68,0.5)' : undefined,
        }}
      >
        {showEvaluating ? (
          <p
            style={{
              color: '#94a3b8',
              fontStyle: 'italic',
              fontSize: 15,
              margin: 0,
            }}
          >
            Evaluating other responses…
          </p>
        ) : (
          <div className="quantum-markdown">
            <ReactMarkdown>{displayed}</ReactMarkdown>
            {stillTyping && (
              <span
                className="inline-block ml-0.5"
                style={{
                  width: 2,
                  height: 14,
                  background: character.color,
                  animation: 'quantum-blink 0.8s ease-in-out infinite',
                  verticalAlign: 'text-bottom',
                  marginTop: -4,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
