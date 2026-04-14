/**
 * lib/chat/moderation.ts
 *
 * Client- and edge-side moderation pipeline for Universe Chat.
 * Master plan Part 5, "Moderation" (adult platform — strict on slurs/spam/links,
 * permissive on casual language):
 *
 *   - Auto-filter: slurs, spam, external links
 *   - Rate limit: 5 msgs / 10 sec per user
 *   - Player report flow lives elsewhere (UI action → server endpoint)
 *
 * The banned-words list is intentionally short and generic. Real deployment
 * should swap this with a maintained list (and probably a server-side variant
 * that isn't exposed to clients). Kept here as a working stub that the UI/API
 * can both consume.
 */

import { MAX_MESSAGE_LENGTH } from "./types";

// ── banned word list ───────────────────────────────────────────────────────

/**
 * Starter list of blocked tokens. Deliberately minimal — extend via
 * `createFilter({ bannedWords: [...] })` in production, or load from a
 * Supabase table so ops can edit without a deploy.
 */
export const DEFAULT_BANNED_WORDS: readonly string[] = [
  // Scam/phishing lures
  "freecoins",
  "clickhere",
  "viagra",
  // Slur placeholders — stand-ins for the real maintained list.
  "slur1",
  "slur2",
];

/** External-link detector. Blocks explicit URLs; allows bare domain mentions like "voidexa.com" at the server's discretion (not here). */
const URL_REGEX = /\bhttps?:\/\/\S+/i;

// ── rate limiter ────────────────────────────────────────────────────────────

export const RATE_LIMIT_COUNT = 5;
export const RATE_LIMIT_WINDOW_MS = 10_000;

/**
 * Minimal per-user sliding-window tracker.
 * Holds timestamps of each user's recent sends in-memory.
 * Instantiate one per server process (or per client tab) and pass it into
 * `filterMessage` via `options.rateLimiter`.
 */
export class RateLimiter {
  private readonly windows = new Map<string, number[]>();

  constructor(
    private readonly limit: number = RATE_LIMIT_COUNT,
    private readonly windowMs: number = RATE_LIMIT_WINDOW_MS,
  ) {}

  /**
   * Records an attempt from `userId` at `now` and returns whether it fits
   * inside the sliding window. Does NOT record the attempt when rejected,
   * so a spammer stays blocked until older attempts age out of the window.
   */
  attempt(userId: string, now: number): boolean {
    const cutoff = now - this.windowMs;
    const recent = (this.windows.get(userId) ?? []).filter((t) => t > cutoff);
    if (recent.length >= this.limit) {
      // Persist the pruned list so future attempts don't see stale data.
      this.windows.set(userId, recent);
      return false;
    }
    recent.push(now);
    this.windows.set(userId, recent);
    return true;
  }

  /** Manually clear a user's history — useful for tests or admin reset. */
  reset(userId?: string): void {
    if (userId === undefined) this.windows.clear();
    else this.windows.delete(userId);
  }

  /** For debugging/telemetry — how many sends are inside the window for this user. */
  currentCount(userId: string, now: number): number {
    const cutoff = now - this.windowMs;
    return (this.windows.get(userId) ?? []).filter((t) => t > cutoff).length;
  }
}

// ── spam detector ──────────────────────────────────────────────────────────

/**
 * In-memory tracker of a user's last-seen message. Flags identical repeats
 * within `windowMs`. The production system should also consider near-duplicates
 * (edit distance) — out of scope for v1.
 */
export class SpamDetector {
  private readonly last = new Map<string, { content: string; time: number }>();

  constructor(private readonly windowMs: number = 10_000) {}

  /**
   * Returns true iff `content` is the same as the user's previous message
   * AND that previous message arrived within `windowMs` of `now`.
   * Always updates the stored last-message — duplicate-then-different is ok.
   */
  isRepeat(userId: string, content: string, now: number): boolean {
    const prev = this.last.get(userId);
    const normalised = content.trim().toLowerCase();
    const repeat =
      prev !== undefined &&
      prev.content === normalised &&
      now - prev.time <= this.windowMs;
    this.last.set(userId, { content: normalised, time: now });
    return repeat;
  }

  reset(userId?: string): void {
    if (userId === undefined) this.last.clear();
    else this.last.delete(userId);
  }
}

// ── public API ──────────────────────────────────────────────────────────────

export interface FilterResult {
  allowed: boolean;
  /** Human-readable reason. Present iff `allowed === false`. */
  reason?: string;
  /** Machine-readable reason code for localization / analytics. */
  code?:
    | "empty"
    | "too-long"
    | "banned-word"
    | "external-link"
    | "rate-limit"
    | "spam-repeat";
}

export interface FilterOptions {
  /** User id for rate-limit / spam tracking. Required when a limiter is supplied. */
  userId?: string;
  /** Current time in ms. Defaults to Date.now(). Injectable for tests. */
  now?: number;
  /** Persistent rate limiter — usually a module-level singleton. */
  rateLimiter?: RateLimiter;
  /** Persistent spam detector — same note as above. */
  spamDetector?: SpamDetector;
  /** Override banned words (defaults to DEFAULT_BANNED_WORDS). */
  bannedWords?: ReadonlyArray<string>;
  /** Allow external links (for trusted channels / admin messages). Default false. */
  allowLinks?: boolean;
}

/**
 * Runs `content` through every guard in order. Returns on first rejection
 * so the UI can surface the most actionable message.
 *
 * Order: length → banned words → external links → spam repeat → rate limit.
 * Rate limit is evaluated LAST so a rejected-for-content message doesn't
 * consume the sender's send quota.
 */
export function filterMessage(
  content: string,
  options: FilterOptions = {},
): FilterResult {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { allowed: false, reason: "Message is empty.", code: "empty" };
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      allowed: false,
      reason: `Message exceeds ${MAX_MESSAGE_LENGTH} characters.`,
      code: "too-long",
    };
  }

  const lowered = trimmed.toLowerCase();
  const banned = options.bannedWords ?? DEFAULT_BANNED_WORDS;
  for (const word of banned) {
    if (!word) continue;
    // Whole-token match so legit words don't get false-positived.
    const pattern = new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`);
    if (pattern.test(lowered)) {
      return {
        allowed: false,
        reason: "Message contains blocked language.",
        code: "banned-word",
      };
    }
  }

  if (!options.allowLinks && URL_REGEX.test(trimmed)) {
    return {
      allowed: false,
      reason: "External links are not allowed in chat.",
      code: "external-link",
    };
  }

  const now = options.now ?? Date.now();

  if (options.spamDetector && options.userId) {
    if (options.spamDetector.isRepeat(options.userId, trimmed, now)) {
      return {
        allowed: false,
        reason: "You just sent that same message — please vary your messages.",
        code: "spam-repeat",
      };
    }
  }

  if (options.rateLimiter && options.userId) {
    if (!options.rateLimiter.attempt(options.userId, now)) {
      return {
        allowed: false,
        reason: `Slow down — max ${RATE_LIMIT_COUNT} messages per ${RATE_LIMIT_WINDOW_MS / 1000}s.`,
        code: "rate-limit",
      };
    }
  }

  return { allowed: true };
}

// ── helpers ────────────────────────────────────────────────────────────────

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
