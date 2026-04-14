import { describe, it, expect } from "vitest";
import {
  parseCommand,
  isCommand,
  COMMAND_HELP,
  renderHelp,
} from "../commands";

describe("isCommand", () => {
  it("true for strings starting with '/' (after trim)", () => {
    expect(isCommand("/help")).toBe(true);
    expect(isCommand("   /rank   ")).toBe(true);
  });

  it("false for plain messages or empty input", () => {
    expect(isCommand("hello")).toBe(false);
    expect(isCommand("")).toBe(false);
    // Typed loose call for defensive test — parseCommand handles non-strings.
    expect(isCommand(null as unknown as string)).toBe(false);
  });
});

describe("parseCommand — no-arg commands", () => {
  it.each(["stats", "rank", "who", "help"])("/%s → { type: %s }", (cmd) => {
    const r = parseCommand(`/${cmd}`);
    expect(r).toEqual({ type: cmd });
  });

  it("extra args on no-arg commands → null (malformed)", () => {
    expect(parseCommand("/stats foo")).toBeNull();
    expect(parseCommand("/help me")).toBeNull();
  });
});

describe("parseCommand — /pm", () => {
  it("parses player + multi-word message", () => {
    const r = parseCommand("/pm Alice hey how are you");
    expect(r).toEqual({ type: "pm", player: "Alice", message: "hey how are you" });
  });

  it("returns null when message missing", () => {
    expect(parseCommand("/pm Alice")).toBeNull();
  });

  it("returns null when player missing", () => {
    expect(parseCommand("/pm")).toBeNull();
  });

  it("trims extra whitespace around the message", () => {
    const r = parseCommand("/pm  Alice    hello   ");
    expect(r).toEqual({ type: "pm", player: "Alice", message: "hello" });
  });
});

describe("parseCommand — /trade", () => {
  it("parses multi-word item names", () => {
    expect(parseCommand("/trade Void Lance")).toEqual({
      type: "trade",
      item: "Void Lance",
    });
  });

  it("null when item missing", () => {
    expect(parseCommand("/trade")).toBeNull();
  });
});

describe("parseCommand — /duel and /mute", () => {
  it("/duel Bob → duel request for Bob", () => {
    expect(parseCommand("/duel Bob")).toEqual({ type: "duel", player: "Bob" });
  });

  it("/mute Bob → mute target Bob", () => {
    expect(parseCommand("/mute Bob")).toEqual({ type: "mute", player: "Bob" });
  });

  it("null when too few or too many args", () => {
    expect(parseCommand("/duel")).toBeNull();
    expect(parseCommand("/duel Alice Bob")).toBeNull();
    expect(parseCommand("/mute Alice Bob")).toBeNull();
  });
});

describe("parseCommand — malformed input", () => {
  it("returns null for non-command strings", () => {
    expect(parseCommand("hello")).toBeNull();
    expect(parseCommand("")).toBeNull();
    expect(parseCommand("   ")).toBeNull();
    expect(parseCommand("/")).toBeNull();
  });

  it("returns null for unknown commands", () => {
    expect(parseCommand("/nope Alice")).toBeNull();
    expect(parseCommand("/kick Alice")).toBeNull();
  });

  it("is case-insensitive on the command name", () => {
    expect(parseCommand("/HELP")).toEqual({ type: "help" });
    expect(parseCommand("/Pm Alice hi")).toEqual({
      type: "pm",
      player: "Alice",
      message: "hi",
    });
  });
});

describe("COMMAND_HELP + renderHelp", () => {
  it("contains one entry per command type", () => {
    const names = COMMAND_HELP.map((h) => h.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(
      expect.arrayContaining([
        "pm", "trade", "duel", "stats", "rank", "who", "help", "mute",
      ]),
    );
  });

  it("renderHelp produces a multi-line string with every command", () => {
    const out = renderHelp();
    for (const h of COMMAND_HELP) expect(out).toContain(h.usage);
  });
});
