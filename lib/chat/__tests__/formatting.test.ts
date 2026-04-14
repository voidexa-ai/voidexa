import { describe, it, expect } from "vitest";
import { Rank } from "../../game/ranks";
import { ChatChannel, type ChatMessage } from "../types";
import {
  RANK_COLORS,
  RANK_CLASSES,
  formatPlayerName,
  formatMessage,
} from "../formatting";

// ── rank palette ───────────────────────────────────────────────────────────

describe("RANK_COLORS", () => {
  it("matches phase-5 spec hex values", () => {
    expect(RANK_COLORS[Rank.Bronze]).toBe("#cd7f32");
    expect(RANK_COLORS[Rank.Silver]).toBe("#c0c0c0");
    expect(RANK_COLORS[Rank.Gold]).toBe("#ffd700");
    expect(RANK_COLORS[Rank.Platinum]).toBe("#e5e4e2");
    expect(RANK_COLORS[Rank.Diamond]).toBe("#b9f2ff");
    expect(RANK_COLORS[Rank.Legendary]).toBe("#9b59b6");
  });

  it("has one color per rank", () => {
    expect(Object.keys(RANK_COLORS)).toHaveLength(6);
    expect(Object.keys(RANK_CLASSES)).toHaveLength(6);
  });
});

// ── formatPlayerName ───────────────────────────────────────────────────────

describe("formatPlayerName", () => {
  it("returns name + rank metadata", () => {
    const r = formatPlayerName("Alice", Rank.Gold);
    expect(r.name).toBe("Alice");
    expect(r.rank).toBe(Rank.Gold);
    expect(r.color).toBe("#ffd700");
    expect(r.className).toBe("rank-gold");
  });

  it("works for Legendary (purple)", () => {
    const r = formatPlayerName("Zara", Rank.Legendary);
    expect(r.color).toBe("#9b59b6");
    expect(r.className).toBe("rank-legendary");
  });
});

// ── formatMessage ──────────────────────────────────────────────────────────

const baseMsg: ChatMessage = {
  id: "m1",
  channel: ChatChannel.Universe,
  senderId: "u1",
  senderName: "Alice",
  senderRank: Rank.Gold,
  content: "hello universe",
  timestamp: Date.UTC(2026, 3, 15, 14, 30), // 2026-04-15 14:30 UTC
  isSystem: false,
};

describe("formatMessage", () => {
  it("returns sender + channel tag + time", () => {
    const r = formatMessage(baseMsg);
    expect(r.sender.name).toBe("Alice");
    expect(r.sender.color).toBe("#ffd700");
    expect(r.channelTag).toBe("[Universe]");
    expect(r.time).toMatch(/^\d{2}:\d{2}$/);
  });

  it("defaults to UTC for determinism across environments", () => {
    expect(formatMessage(baseMsg).time).toBe("14:30");
  });

  it("supports custom time zone", () => {
    const r = formatMessage(baseMsg, { timeZone: "UTC", locale: "en-GB" });
    expect(r.time).toBe("14:30");
  });

  it("plain rendering embeds time, channel, sender, and content", () => {
    const r = formatMessage(baseMsg);
    expect(r.plain).toBe("[14:30] [Universe] Alice: hello universe");
  });

  it("system messages drop the sender prefix", () => {
    const sys: ChatMessage = {
      ...baseMsg,
      id: "m2",
      senderId: "system",
      senderName: "System",
      isSystem: true,
      content: "Welcome to voidexa.",
    };
    const r = formatMessage(sys);
    expect(r.isSystem).toBe(true);
    expect(r.plain).toBe("[14:30] [Universe] Welcome to voidexa.");
  });

  it("System channel renders [System]", () => {
    const r = formatMessage({ ...baseMsg, channel: ChatChannel.System });
    expect(r.channelTag).toBe("[System]");
  });

  it("Whisper channel renders [PM→peer] using whisperPeerName", () => {
    const r = formatMessage(
      { ...baseMsg, channel: ChatChannel.Whisper },
      { whisperPeerName: "Bob" },
    );
    expect(r.channelTag).toBe("[PM→Bob]");
  });

  it("Whisper falls back to senderName when peer name absent", () => {
    const r = formatMessage({ ...baseMsg, channel: ChatChannel.Whisper });
    expect(r.channelTag).toBe("[PM→Alice]");
  });
});
