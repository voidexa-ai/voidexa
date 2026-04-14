import { describe, it, expect } from "vitest";
import { Rank } from "../../game/ranks";
import {
  ChatChannel,
  MAX_MESSAGE_LENGTH,
  isWhisper,
  trimMessage,
  type ChatMessage,
} from "../types";

describe("chat/types constants", () => {
  it("MAX_MESSAGE_LENGTH is 200 (Part 5 spec)", () => {
    expect(MAX_MESSAGE_LENGTH).toBe(200);
  });

  it("ChatChannel has exactly 3 values: Universe / System / Whisper", () => {
    expect(Object.values(ChatChannel)).toEqual(["Universe", "System", "Whisper"]);
  });
});

describe("isWhisper", () => {
  const base: Omit<ChatMessage, "channel"> = {
    id: "m1",
    senderId: "u1",
    senderName: "Alice",
    senderRank: Rank.Gold,
    content: "hi",
    timestamp: 1_700_000_000_000,
    isSystem: false,
  };

  it("true for Whisper channel", () => {
    expect(isWhisper({ ...base, channel: ChatChannel.Whisper })).toBe(true);
  });

  it("false for Universe / System", () => {
    expect(isWhisper({ ...base, channel: ChatChannel.Universe })).toBe(false);
    expect(isWhisper({ ...base, channel: ChatChannel.System })).toBe(false);
  });
});

describe("trimMessage", () => {
  it("trims leading/trailing whitespace", () => {
    expect(trimMessage("   hello world   ")).toBe("hello world");
  });

  it("leaves inner whitespace intact", () => {
    expect(trimMessage("a  b  c")).toBe("a  b  c");
  });
});
