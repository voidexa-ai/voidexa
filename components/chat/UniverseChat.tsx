'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Rank } from '@/lib/game/ranks'
import {
  ChatChannel,
  MAX_MESSAGE_LENGTH,
  type ChatMessage,
} from '@/lib/chat/types'
import { parseCommand, isCommand, renderHelp } from '@/lib/chat/commands'
import { formatPlayerName, RANK_COLORS } from '@/lib/chat/formatting'

// ─────────────────────────────────────────────────────────────────────────────
// Mock seed data — used until Supabase Realtime is wired up.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = Date.now()

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    channel: ChatChannel.Universe,
    senderId: 'u-zara',
    senderName: 'Zara',
    senderRank: Rank.Legendary,
    content: 'Just hit Legendary rank. Thanks for the duels, everyone.',
    timestamp: NOW - 1000 * 60 * 22,
    isSystem: false,
  },
  {
    id: 'm2',
    channel: ChatChannel.Universe,
    senderId: 'u-kai',
    senderName: 'Kai',
    senderRank: Rank.Diamond,
    content: 'gg. that cloak timing was unreal',
    timestamp: NOW - 1000 * 60 * 21,
    isSystem: false,
  },
  {
    id: 'm3',
    channel: ChatChannel.Universe,
    senderId: 'system',
    senderName: 'System',
    senderRank: Rank.Platinum,
    content: 'Daily Challenge rotated — today: Nebula Dash, 180s time limit.',
    timestamp: NOW - 1000 * 60 * 15,
    isSystem: true,
  },
  {
    id: 'm4',
    channel: ChatChannel.Universe,
    senderId: 'u-rin',
    senderName: 'Rin',
    senderRank: Rank.Gold,
    content: 'Anyone racing Nebula Dash tonight? LFG.',
    timestamp: NOW - 1000 * 60 * 12,
    isSystem: false,
  },
  {
    id: 'm5',
    channel: ChatChannel.Universe,
    senderId: 'u-mira',
    senderName: 'Mira',
    senderRank: Rank.Silver,
    content: "I'm in. Already warmed up on Asteroid Alley.",
    timestamp: NOW - 1000 * 60 * 11,
    isSystem: false,
  },
  {
    id: 'm6',
    channel: ChatChannel.Universe,
    senderId: 'u-oz',
    senderName: 'Oz',
    senderRank: Rank.Bronze,
    content: 'New pilot — any tips for Void Corridor?',
    timestamp: NOW - 1000 * 60 * 6,
    isSystem: false,
  },
  {
    id: 'm7',
    channel: ChatChannel.Universe,
    senderId: 'u-zara',
    senderName: 'Zara',
    senderRank: Rank.Legendary,
    content: 'Oz — Racer ship, save your Nitro for the last two checkpoints.',
    timestamp: NOW - 1000 * 60 * 5,
    isSystem: false,
  },
  {
    id: 'm8',
    channel: ChatChannel.System,
    senderId: 'system',
    senderName: 'System',
    senderRank: Rank.Platinum,
    content: 'Planet Kreos claimed by Pioneer — welcome to the galaxy.',
    timestamp: NOW - 1000 * 60 * 3,
    isSystem: true,
  },
  {
    id: 'm9',
    channel: ChatChannel.System,
    senderId: 'u-kai',
    senderName: 'Kai',
    senderRank: Rank.Diamond,
    content: 'Congrats Pioneer. Crewing up at Voidexa Hub if anyone wants to trade.',
    timestamp: NOW - 1000 * 60 * 2,
    isSystem: false,
  },
  {
    id: 'm10',
    channel: ChatChannel.Whisper,
    senderId: 'u-mira',
    senderName: 'Mira',
    senderRank: Rank.Silver,
    content: 'Up for a private duel after the race?',
    timestamp: NOW - 1000 * 60 * 1,
    isSystem: false,
    recipientId: 'u-me',
  },
]

// The "current player" stub. Replace with Supabase auth later.
const SELF = {
  id: 'u-me',
  name: 'You',
  rank: Rank.Gold,
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function UniverseChat() {
  const pathname = usePathname()
  const inFreeFlight = pathname?.startsWith('/freeflight') ?? false

  const [open, setOpen] = useState(false)
  const [activeChannel, setActiveChannel] = useState<ChatChannel>(ChatChannel.Universe)
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [draft, setDraft] = useState('')
  const [unread, setUnread] = useState(0)
  const [inlineError, setInlineError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom whenever a new message lands AND the panel is open.
  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, activeChannel, open])

  // Reset unread whenever the user opens the chat.
  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  const channelMessages = useMemo(
    () => messages.filter((m) => m.channel === activeChannel),
    [messages, activeChannel],
  )

  const sendMessage = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text) return
      setInlineError(null)

      // Handle commands locally — they don't emit a visible message from "You"
      // but do produce a system echo so the UX matches the spec.
      if (isCommand(text)) {
        const cmd = parseCommand(text)
        if (!cmd) {
          setInlineError(`Unknown or malformed command: ${text.split(/\s+/)[0]}`)
          return
        }
        const ack = commandAck(cmd)
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            channel: activeChannel,
            senderId: 'system',
            senderName: 'System',
            senderRank: Rank.Platinum,
            content: ack,
            timestamp: Date.now(),
            isSystem: true,
          },
        ])
        return
      }

      if (text.length > MAX_MESSAGE_LENGTH) {
        setInlineError(`Message exceeds ${MAX_MESSAGE_LENGTH} characters.`)
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `me-${Date.now()}`,
          channel: activeChannel,
          senderId: SELF.id,
          senderName: SELF.name,
          senderRank: SELF.rank,
          content: text,
          timestamp: Date.now(),
          isSystem: false,
        },
      ])
    },
    [activeChannel],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(draft)
    setDraft('')
  }

  // ─── compact Free-Flight overlay ─────────────────────────────────────────
  if (inFreeFlight && !open) {
    return (
      <FreeFlightOverlay
        messages={channelMessages}
        selfId={SELF.id}
        onOpen={() => setOpen(true)}
      />
    )
  }

  // ─── default bubble + window ─────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Collapsed bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            aria-label="Open Universe Chat"
            className="relative h-14 w-14 rounded-full bg-[#0a0a0f]/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,255,255,0.25)] backdrop-blur-md flex items-center justify-center hover:border-cyan-300 transition-colors"
            style={{ color: '#67e8f9' }}
          >
            <MessageCircle size={24} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-fuchsia-500 text-white text-xs font-bold flex items-center justify-center">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: 350,
              height: 450,
              background: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(34, 211, 238, 0.55)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 0 40px rgba(34, 211, 238, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(34, 211, 238, 0.25)' }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={18} style={{ color: '#67e8f9' }} />
                <span
                  className="text-[16px] font-semibold"
                  style={{ color: '#e5f7fa', letterSpacing: '0.02em' }}
                >
                  Universe Chat
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-[#67e8f9] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(34, 211, 238, 0.2)' }}>
              {(
                [
                  { id: ChatChannel.Universe, label: 'Universe' },
                  { id: ChatChannel.System, label: 'System' },
                  { id: ChatChannel.Whisper, label: 'Whisper' },
                ] as const
              ).map((tab) => {
                const active = activeChannel === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChannel(tab.id)}
                    className="flex-1 py-2 text-[14px] transition-colors"
                    style={{
                      color: active ? '#67e8f9' : 'rgba(229, 247, 250, 0.55)',
                      background: active ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                      borderBottom: active ? '2px solid #22d3ee' : '2px solid transparent',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Message list */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
              style={{ scrollbarColor: '#22d3ee rgba(0,0,0,0.3)', scrollbarWidth: 'thin' }}
            >
              {channelMessages.length === 0 ? (
                <div
                  className="text-center py-10 text-[14px]"
                  style={{ color: 'rgba(229, 247, 250, 0.45)' }}
                >
                  No messages in this channel yet.
                </div>
              ) : (
                channelMessages.map((m) => (
                  <MessageRow key={m.id} message={m} selfId={SELF.id} />
                ))
              )}
            </div>

            {/* Inline error */}
            {inlineError && (
              <div
                className="px-3 py-1 text-[14px]"
                style={{ color: '#f87171', background: 'rgba(248, 113, 113, 0.1)' }}
              >
                {inlineError}
              </div>
            )}

            {/* Input */}
            <form onSubmit={onSubmit} className="p-3" style={{ borderTop: '1px solid rgba(34, 211, 238, 0.25)' }}>
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value)
                    if (inlineError) setInlineError(null)
                  }}
                  placeholder="Message or /help"
                  maxLength={MAX_MESSAGE_LENGTH + 20 /* let /help fit, filter rejects real overflow */}
                  className="flex-1 px-3 py-2 rounded-lg text-[16px] outline-none"
                  style={{
                    background: 'rgba(10, 10, 15, 0.8)',
                    color: '#e5f7fa',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                  }}
                  autoComplete="off"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className="h-10 w-10 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                  style={{
                    background: 'rgba(34, 211, 238, 0.15)',
                    color: '#67e8f9',
                    border: '1px solid rgba(34, 211, 238, 0.55)',
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
              <div
                className="flex justify-between mt-1 text-[14px]"
                style={{ color: 'rgba(229, 247, 250, 0.5)' }}
              >
                <span>Enter to send · / for commands</span>
                <span>{draft.length}/{MAX_MESSAGE_LENGTH}</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Message row
// ─────────────────────────────────────────────────────────────────────────────

function MessageRow({
  message,
  selfId,
}: {
  message: ChatMessage
  selfId: string
}) {
  const senderMeta = formatPlayerName(message.senderName, message.senderRank)
  const time = formatTimeShort(message.timestamp)
  const isSelf = message.senderId === selfId

  return (
    <div
      className="text-[14px] leading-relaxed"
      style={{
        color: 'rgba(229, 247, 250, 0.9)',
        opacity: message.isSystem ? 0.8 : 1,
      }}
    >
      <span
        className="mr-2 text-[14px]"
        style={{ color: 'rgba(229, 247, 250, 0.5)' }}
      >
        {time}
      </span>
      {message.isSystem ? (
        <span style={{ color: '#a7f3d0', fontStyle: 'italic' }}>
          * {message.content}
        </span>
      ) : (
        <>
          <span
            style={{
              color: senderMeta.color,
              fontWeight: 600,
              textShadow:
                message.senderRank === Rank.Legendary
                  ? `0 0 8px ${RANK_COLORS[Rank.Legendary]}`
                  : undefined,
            }}
          >
            {isSelf ? 'You' : senderMeta.name}
          </span>
          <span style={{ color: 'rgba(229, 247, 250, 0.55)' }}>: </span>
          <span>{message.content}</span>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Free Flight compact overlay — 10s fade, clickable to expand
// ─────────────────────────────────────────────────────────────────────────────

const FADE_MS = 10_000

function FreeFlightOverlay({
  messages,
  selfId,
  onOpen,
}: {
  messages: ChatMessage[]
  selfId: string
  onOpen: () => void
}) {
  const [now, setNow] = useState<number>(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  // Show only messages newer than FADE_MS.
  const visible = messages.filter((m) => now - m.timestamp < FADE_MS).slice(-4)

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {visible.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-3 py-1 rounded-lg text-[14px] max-w-[420px]"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: 'rgba(229, 247, 250, 0.9)',
            }}
          >
            <MessageRow message={m} selfId={selfId} />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open Universe Chat"
        className="pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(34, 211, 238, 0.55)',
          color: '#67e8f9',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <MessageCircle size={20} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatTimeShort(ts: number): string {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

type CommandResult = NonNullable<ReturnType<typeof parseCommand>>

function commandAck(cmd: CommandResult): string {
  switch (cmd.type) {
    case 'pm':    return `→ to ${cmd.player}: ${cmd.message}`
    case 'trade': return `Posted trade offer: ${cmd.item}`
    case 'duel':  return `Duel request sent to ${cmd.player}.`
    case 'mute':  return `${cmd.player} muted.`
    case 'stats': return 'Stats panel is not yet wired up.'
    case 'rank':  return `You are ${SELF.rank}.`
    case 'who':   return 'Nearby player list is only populated in Free Flight.'
    case 'help':  return renderHelp()
    default:      return 'Unknown command.'
  }
}
