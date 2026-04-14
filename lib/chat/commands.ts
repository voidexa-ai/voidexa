/**
 * lib/chat/commands.ts
 *
 * Parser for in-chat slash commands.
 * Master plan Part 5, "Chat Commands" section. The 8 v1 commands are:
 *
 *   /pm [player] [msg]   — private message
 *   /trade [item]        — post trade offer
 *   /duel [player]       — send duel request
 *   /stats               — show your stats
 *   /rank                — show rank and points
 *   /who                 — nearby players (Free Flight)
 *   /help                — list commands
 *   /mute [player]       — hide their messages
 *
 * `parseCommand(input)` returns a typed discriminated union so callers can
 * `switch (result.type)` safely. Returns null if the input isn't a command or
 * is malformed (no recovery — caller should render an error to the user).
 */

/** Every possible command result. Discriminated by `type`. */
export type CommandResult =
  | { type: "pm"; player: string; message: string }
  | { type: "trade"; item: string }
  | { type: "duel"; player: string }
  | { type: "mute"; player: string }
  | { type: "stats" }
  | { type: "rank" }
  | { type: "who" }
  | { type: "help" };

/** Every command name accepted by the parser. */
export type CommandName = CommandResult["type"];

/** Docs shown by /help — kept alongside the parser so they stay in sync. */
export interface CommandHelp {
  name: CommandName;
  usage: string;
  description: string;
}

export const COMMAND_HELP: ReadonlyArray<CommandHelp> = [
  { name: "pm",    usage: "/pm [player] [message]", description: "Send a private message." },
  { name: "trade", usage: "/trade [item]",          description: "Post a trade offer." },
  { name: "duel",  usage: "/duel [player]",         description: "Send a duel request." },
  { name: "stats", usage: "/stats",                 description: "Show your stats." },
  { name: "rank",  usage: "/rank",                  description: "Show your rank and points." },
  { name: "who",   usage: "/who",                   description: "List nearby players (Free Flight)." },
  { name: "help",  usage: "/help",                  description: "List all commands." },
  { name: "mute",  usage: "/mute [player]",         description: "Hide messages from a player." },
];

/**
 * Parses an input string into a typed command.
 * Returns null when:
 *   - input doesn't start with '/'
 *   - command is unknown
 *   - required arguments are missing
 *
 * Whitespace handling: leading/trailing whitespace is trimmed. Multi-word
 * arguments after a player name are treated as a single message (for /pm).
 */
export function parseCommand(input: string): CommandResult | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return null;

  // Strip the leading slash. Split on any run of whitespace.
  const body = trimmed.slice(1);
  if (body.length === 0) return null;

  const parts = body.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "pm": {
      // /pm <player> <message...> — message must be non-empty.
      if (args.length < 2) return null;
      const player = args[0];
      if (!player) return null;
      const message = args.slice(1).join(" ").trim();
      if (!message) return null;
      return { type: "pm", player, message };
    }
    case "trade": {
      if (args.length < 1) return null;
      // Whole remainder is the item name (items may contain spaces).
      const item = args.join(" ").trim();
      if (!item) return null;
      return { type: "trade", item };
    }
    case "duel": {
      if (args.length !== 1) return null;
      return { type: "duel", player: args[0] };
    }
    case "mute": {
      if (args.length !== 1) return null;
      return { type: "mute", player: args[0] };
    }
    case "stats":
    case "rank":
    case "who":
    case "help": {
      // These take no arguments. Extra args → malformed.
      if (args.length !== 0) return null;
      return { type: cmd } as CommandResult;
    }
    default:
      return null;
  }
}

/** Returns true iff `input` looks like a command (starts with /). */
export function isCommand(input: string): boolean {
  return typeof input === "string" && input.trim().startsWith("/");
}

/** Renders the /help text as a plain string. */
export function renderHelp(): string {
  return COMMAND_HELP.map((h) => `${h.usage} — ${h.description}`).join("\n");
}
