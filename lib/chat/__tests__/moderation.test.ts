import { describe, it, expect } from "vitest";
import { MAX_MESSAGE_LENGTH } from "../types";
import {
  RateLimiter,
  SpamDetector,
  RATE_LIMIT_COUNT,
  RATE_LIMIT_WINDOW_MS,
  filterMessage,
  DEFAULT_BANNED_WORDS,
} from "../moderation";

// ── constants ───────────────────────────────────────────────────────────────

describe("constants", () => {
  it("rate limit matches Part 5 spec: 5 / 10s", () => {
    expect(RATE_LIMIT_COUNT).toBe(5);
    expect(RATE_LIMIT_WINDOW_MS).toBe(10_000);
  });
});

// ── RateLimiter ─────────────────────────────────────────────────────────────

describe("RateLimiter", () => {
  it("allows up to `limit` messages inside the window", () => {
    const rl = new RateLimiter(3, 1_000);
    expect(rl.attempt("u1", 0)).toBe(true);
    expect(rl.attempt("u1", 100)).toBe(true);
    expect(rl.attempt("u1", 200)).toBe(true);
    expect(rl.attempt("u1", 300)).toBe(false); // 4th within window
  });

  it("resumes once old attempts fall out of the window", () => {
    const rl = new RateLimiter(2, 1_000);
    expect(rl.attempt("u1", 0)).toBe(true);
    expect(rl.attempt("u1", 500)).toBe(true);
    expect(rl.attempt("u1", 900)).toBe(false);
    // Now roll forward past the window → first attempt ages out.
    expect(rl.attempt("u1", 1_600)).toBe(true);
  });

  it("tracks users independently", () => {
    const rl = new RateLimiter(2, 1_000);
    rl.attempt("u1", 0);
    rl.attempt("u1", 100);
    expect(rl.attempt("u1", 200)).toBe(false);
    // u2 starts fresh.
    expect(rl.attempt("u2", 200)).toBe(true);
  });

  it("reset(userId) clears that user only", () => {
    const rl = new RateLimiter(1, 1_000);
    rl.attempt("u1", 0);
    rl.attempt("u2", 0);
    rl.reset("u1");
    expect(rl.attempt("u1", 100)).toBe(true);
    expect(rl.attempt("u2", 100)).toBe(false);
  });
});

// ── SpamDetector ────────────────────────────────────────────────────────────

describe("SpamDetector", () => {
  it("flags identical consecutive messages within the window", () => {
    const sd = new SpamDetector(1_000);
    expect(sd.isRepeat("u1", "hello", 0)).toBe(false);
    expect(sd.isRepeat("u1", "hello", 500)).toBe(true);
  });

  it("does not flag when message differs", () => {
    const sd = new SpamDetector(1_000);
    expect(sd.isRepeat("u1", "hello", 0)).toBe(false);
    expect(sd.isRepeat("u1", "world", 500)).toBe(false);
  });

  it("ignores case and surrounding whitespace", () => {
    const sd = new SpamDetector(1_000);
    expect(sd.isRepeat("u1", "HELLO", 0)).toBe(false);
    expect(sd.isRepeat("u1", "  hello  ", 500)).toBe(true);
  });

  it("does not flag when repeat arrives outside the window", () => {
    const sd = new SpamDetector(1_000);
    expect(sd.isRepeat("u1", "hello", 0)).toBe(false);
    expect(sd.isRepeat("u1", "hello", 2_000)).toBe(false);
  });
});

// ── filterMessage ───────────────────────────────────────────────────────────

describe("filterMessage — length checks", () => {
  it("rejects empty / whitespace-only content", () => {
    expect(filterMessage("").allowed).toBe(false);
    expect(filterMessage("   ").code).toBe("empty");
  });

  it("rejects content longer than MAX_MESSAGE_LENGTH", () => {
    const long = "a".repeat(MAX_MESSAGE_LENGTH + 1);
    const r = filterMessage(long);
    expect(r.allowed).toBe(false);
    expect(r.code).toBe("too-long");
  });

  it("accepts content exactly at the limit", () => {
    const r = filterMessage("x".repeat(MAX_MESSAGE_LENGTH));
    expect(r.allowed).toBe(true);
  });
});

describe("filterMessage — banned words", () => {
  it("blocks whole-token matches from DEFAULT_BANNED_WORDS", () => {
    const r = filterMessage("check out freecoins today");
    expect(r.allowed).toBe(false);
    expect(r.code).toBe("banned-word");
  });

  it("does not match substrings (word-boundary check)", () => {
    // "slur1" is banned — "slur10" (as a separate token) is NOT the exact word.
    expect(filterMessage("this contains freeco ins test").allowed).toBe(true);
  });

  it("supports custom banned word lists", () => {
    const r = filterMessage("hello world", {
      bannedWords: ["hello"],
    });
    expect(r.allowed).toBe(false);
  });

  it("exposes at least the starter banned list", () => {
    expect(DEFAULT_BANNED_WORDS.length).toBeGreaterThan(0);
  });
});

describe("filterMessage — external links", () => {
  it("blocks http/https URLs by default", () => {
    expect(filterMessage("check https://evil.example/scam").code).toBe(
      "external-link",
    );
    expect(filterMessage("http://a.com").allowed).toBe(false);
  });

  it("allows links when allowLinks=true", () => {
    expect(
      filterMessage("read https://docs.voidexa.com", { allowLinks: true })
        .allowed,
    ).toBe(true);
  });

  it("bare domain without scheme is allowed", () => {
    expect(filterMessage("try voidexa.com").allowed).toBe(true);
  });
});

describe("filterMessage — spam repeat", () => {
  it("rejects identical repeats via SpamDetector", () => {
    const sd = new SpamDetector(1_000);
    const first = filterMessage("hello there", {
      userId: "u1",
      now: 0,
      spamDetector: sd,
    });
    const second = filterMessage("hello there", {
      userId: "u1",
      now: 200,
      spamDetector: sd,
    });
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(false);
    expect(second.code).toBe("spam-repeat");
  });
});

describe("filterMessage — rate limit", () => {
  it("rejects after 5 messages in 10s", () => {
    const rl = new RateLimiter();
    const opts = { userId: "u1", rateLimiter: rl };

    // 5 allowed.
    for (let i = 0; i < 5; i++) {
      expect(
        filterMessage(`msg ${i}`, { ...opts, now: i * 100 }).allowed,
      ).toBe(true);
    }
    // 6th inside the 10s window → rejected.
    const r6 = filterMessage("msg 6", { ...opts, now: 600 });
    expect(r6.allowed).toBe(false);
    expect(r6.code).toBe("rate-limit");
  });

  it("rate-limit does not consume quota for a content-rejected message", () => {
    const rl = new RateLimiter();
    const opts = { userId: "u1", rateLimiter: rl, now: 0 };
    // Too-long message → rejected BEFORE hitting the rate limiter.
    filterMessage("x".repeat(MAX_MESSAGE_LENGTH + 10), opts);
    // All 5 allowed attempts still available.
    for (let i = 0; i < 5; i++) {
      expect(filterMessage(`msg ${i}`, { ...opts, now: i + 1 }).allowed).toBe(
        true,
      );
    }
  });
});
