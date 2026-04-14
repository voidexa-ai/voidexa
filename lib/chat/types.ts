/**
 * lib/chat/types.ts
 *
 * Core chat types used across channels, moderation, and formatting.
 * Anchored to master plan Part 5 (Universe Chat):
 *   - 3 channels: Universe / System / Whisper
 *   - 200 char message limit
 *   - 7-day history (storage concern — not enforced in this module)
 *   - Rank color on player names (see formatting.ts)
 */

import type { Rank } from "../game/ranks";

/** Hard ceiling on a single message's content length (master plan line 282). */
export const MAX_MESSAGE_LENGTH = 200;

export enum ChatChannel {
  /** Global, visible on every page. */
  Universe = "Universe",
  /** Scoped to a planet system (Level 2). */
  System = "System",
  /** Private message between two players. */
  Whisper = "Whisper",
}

export interface ChatMessage {
  /** Stable unique id (UUID, ulid, or `<ts>:<sender>:<nonce>` — caller's choice). */
  id: string;
  channel: ChatChannel;
  /** User id of the sender — "system" for `isSystem=true` messages. */
  senderId: string;
  /** Display name at send time. Copied onto the message so renames don't rewrite history. */
  senderName: string;
  /** Rank at send time. Drives name color in the UI (see formatting.ts). */
  senderRank: Rank;
  content: string;
  /** Unix ms timestamp. */
  timestamp: number;
  /** True for server-emitted notices (rank up, someone joined, duel results, etc.). */
  isSystem: boolean;
  /** For Whisper only: target user id. Non-whisper messages should leave this undefined. */
  recipientId?: string;
}

/** Convenience predicate — useful for rendering filters. */
export function isWhisper(msg: ChatMessage): boolean {
  return msg.channel === ChatChannel.Whisper;
}

/** Returns a shallow-trimmed message — handy before passing to moderation. */
export function trimMessage(content: string): string {
  return content.trim();
}
