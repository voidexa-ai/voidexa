'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
        // Only surface when we've captured at least one character — avoids
        // flickering an empty string before any content has arrived.
        if (out.length > 0 || closed) {
          improvedAnswer = out
        }
      }
    }
  }

  // Agree: list of provider names. Use a non-greedy match so a still-
  // streaming disagree block doesn't swallow the closing bracket.
  const agree: string[] = []
  const agreeMatch = stripped.match(/"agree"\s*:\s*\[([^\]]*)\]/i)
  if (agreeMatch) {
    const items = agreeMatch[1].match(/"([^"]+)"/g) || []
    for (const item of items) {
      const name = item.slice(1, -1).trim()
      if (name) agree.push(name)
    }
  }

  // Disagree: object with provider-name keys → string reasons. We only
  // need the keys for the badge list.
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

  // Character-by-character typewriter. We track visibleLen rather than a
  // displayed string so new chunks arriving via the text prop don't reset
  // progress — the cursor keeps advancing forward toward the growing target.
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

  // Show "Evaluating..." placeholder while the model has started emitting
  // eval JSON but improved_answer isn't extractable yet. Without this the
  // user stares at an empty bubble for a second or two.
  const showEvaluating =
    isEval && parsed.improvedAnswer === null && streaming
  const stillTyping = streaming && visibleLen < displayTarget.length

  return (
    <div
      className="flex items-start gap-3 py-2.5 px-3 rounded-lg"
      style={{
        background: agreement ? 'rgba(74,222,128,0.06)' : 'transparent',
        borderLeft: `2px solid ${character.color}33`,
      }}
    >
      {/* Avatar */}
      <div
        className="rounded-full overflow-hidden shrink-0"
        style={{ width: 30, height: 30, border: `1.5px solid ${character.color}66` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.image}
          alt={character.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-semibold" style={{ fontSize: 14, color: character.color }}>
          {character.name}
        </span>

        {/* Badges for agree/disagree — only shown for eval-format messages. */}
        {isEval && (parsed.agree.length > 0 || parsed.disagree.length > 0) && (
          <div style={{ marginTop: 4, marginBottom: 2 }}>
            {parsed.agree.map(name => (
              <Badge key={`a-${name}`} name={name} kind="agree" />
            ))}
            {parsed.disagree.map(name => (
              <Badge key={`d-${name}`} name={name} kind="disagree" />
            ))}
          </div>
        )}

        <p
          className="leading-relaxed mt-0.5"
          style={{
            fontSize: 15,
            color: '#cbd5e1',
            textDecoration: strikethrough ? 'line-through' : 'none',
            textDecorationColor: strikethrough ? 'rgba(239,68,68,0.5)' : undefined,
          }}
        >
          {showEvaluating ? (
            <span style={{ color: '#64748b', fontStyle: 'italic' }}>
              Evaluating other responses…
            </span>
          ) : (
            displayed
          )}
          {stillTyping && !showEvaluating && (
            <span
              className="inline-block ml-0.5"
              style={{
                width: 2,
                height: 14,
                background: character.color,
                animation: 'quantum-blink 0.8s ease-in-out infinite',
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </p>
      </div>
    </div>
  )
}
