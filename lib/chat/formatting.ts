/**
 * lib/chat/formatting.ts
 *
 * Rendering helpers for chat messages. Pure data transforms — no React here.
 * Caller components consume `FormattedName` / `FormattedMessage` to render.
 *
 * Master plan Part 5 (line 286): "Player names show rank color
 * (Bronze=bronze, Gold=gold, Legendary=purple glow)."
 */

import { Rank } from "../game/ranks";
import { ChatChannel, type ChatMessage } from "./types";

// ── rank colors ────────────────────────────────────────────────────────────

/**
 * Hex color per rank. Values locked to the phase-5 spec so the UI can drive
 * inline styles or CSS variables from one source of truth.
 */
export const RANK_COLORS: Readonly<Record<Rank, string>> = {
  [Rank.Bronze]:    "#cd7f32",
  [Rank.Silver]:    "#c0c0c0",
  [Rank.Gold]:      "#ffd700",
  [Rank.Platinum]:  "#e5e4e2",
  [Rank.Diamond]:   "#b9f2ff",
  [Rank.Legendary]: "#9b59b6",
};

/**
 * Tailwind/BEM-style class name per rank. Projects that prefer classes over
 * inline color can import these directly. Class semantics are left to the
 * consumer (global CSS or tailwind arbitrary value).
 */
export const RANK_CLASSES: Readonly<Record<Rank, string>> = {
  [Rank.Bronze]:    "rank-bronze",
  [Rank.Silver]:    "rank-silver",
  [Rank.Gold]:      "rank-gold",
  [Rank.Platinum]:  "rank-platinum",
  [Rank.Diamond]:   "rank-diamond",
  [Rank.Legendary]: "rank-legendary",
};

// ── player name ────────────────────────────────────────────────────────────

export interface FormattedName {
  name: string;
  rank: Rank;
  /** Hex color for inline styles. */
  color: string;
  /** Class name — for projects that prefer stylesheets. */
  className: string;
}

/**
 * Returns the player's display name plus its rank-colored style metadata.
 * Does NOT return markup — the UI layer is responsible for rendering, which
 * keeps this file free of React/HTML concerns and safely reusable server-side.
 */
export function formatPlayerName(name: string, rank: Rank): FormattedName {
  return {
    name,
    rank,
    color: RANK_COLORS[rank],
    className: RANK_CLASSES[rank],
  };
}

// ── message ────────────────────────────────────────────────────────────────

export interface FormattedMessage {
  /** Unix ms copied from the message. */
  timestamp: number;
  /** HH:MM in the provided locale/timezone. Defaults to UTC. */
  time: string;
  /** Channel tag string (e.g. "[Universe]", "[System]", "[PM→Alice]"). */
  channelTag: string;
  sender: FormattedName;
  content: string;
  isSystem: boolean;
  /**
   * Single-line plain-text rendering: "[HH:MM] [Channel] Name: content".
   * Safe to log, paste, or pipe into toast notifications.
   */
  plain: string;
}

export interface FormatOptions {
  /**
   * Timezone for the timestamp. Defaults to "UTC" so server and client agree.
   * Use an IANA name like "Europe/Copenhagen" to localize client-side.
   */
  timeZone?: string;
  /** Locale for time formatting. Default "en-GB" → 24-hour clock. */
  locale?: string;
  /**
   * When the message is a whisper, the rendered channel tag needs the other
   * party's display name. Supply it here — defaults to senderName if missing.
   */
  whisperPeerName?: string;
}

/**
 * Turns a raw ChatMessage into a renderable bundle.
 * Caller components can use the `FormattedMessage` shape directly (inline
 * style or className) or fall back to `plain` for text-only contexts.
 */
export function formatMessage(
  message: ChatMessage,
  options: FormatOptions = {},
): FormattedMessage {
  const sender = formatPlayerName(message.senderName, message.senderRank);
  const time = formatTime(message.timestamp, options.timeZone, options.locale);
  const channelTag = renderChannelTag(message, options.whisperPeerName);
  const plain = message.isSystem
    ? `[${time}] ${channelTag} ${message.content}`
    : `[${time}] ${channelTag} ${message.senderName}: ${message.content}`;

  return {
    timestamp: message.timestamp,
    time,
    channelTag,
    sender,
    content: message.content,
    isSystem: message.isSystem,
    plain,
  };
}

// ── internals ──────────────────────────────────────────────────────────────

function formatTime(
  timestamp: number,
  timeZone: string = "UTC",
  locale: string = "en-GB",
): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date(timestamp));
  } catch {
    // Fallback if the runtime's ICU build lacks the requested locale/tz.
    const d = new Date(timestamp);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
}

function renderChannelTag(msg: ChatMessage, whisperPeerName?: string): string {
  switch (msg.channel) {
    case ChatChannel.Universe:
      return "[Universe]";
    case ChatChannel.System:
      return "[System]";
    case ChatChannel.Whisper:
      return `[PM→${whisperPeerName ?? msg.senderName}]`;
    default:
      return "[Chat]";
  }
}
