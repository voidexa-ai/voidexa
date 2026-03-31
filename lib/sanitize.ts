// lib/sanitize.ts
// Input sanitization utilities — used in all API routes that accept user input.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_ALLOWED_RE = /[^a-zA-Z0-9 \-']/g;
const HTML_TAG_RE = /<[^>]*>/g;
const HTML_ENTITY_RE = /&(?:#\d+|#x[\da-fA-F]+|[a-zA-Z]{2,8});/g;

/** Strip all HTML tags and decode-then-strip HTML entities. */
export function sanitizeHtml(input: string): string {
  return input
    .replace(HTML_TAG_RE, '')
    .replace(HTML_ENTITY_RE, '');
}

/** Return true when the input looks like a valid email address. */
export function isValidEmail(input: string): boolean {
  return EMAIL_RE.test(input.trim());
}

/**
 * Validate and normalise an email address.
 * Throws when the format is invalid.
 */
export function sanitizeEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!isValidEmail(trimmed)) {
    throw new Error('Invalid email format');
  }
  return trimmed;
}

/**
 * Strip characters that aren't letters, digits, spaces, hyphens or apostrophes.
 * Also collapses multiple consecutive spaces and trims.
 */
export function sanitizeName(input: string): string {
  return input
    .replace(NAME_ALLOWED_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Strip HTML tags and truncate to `maxLength` characters (default 5 000).
 * Used for chat messages and user-supplied free-text fields.
 */
export function sanitizeMessage(input: string, maxLength = 5_000): string {
  const stripped = sanitizeHtml(input);
  return stripped.slice(0, maxLength);
}

/**
 * Validate that a string is a non-empty UUID v4.
 * Throws when invalid.
 */
export function sanitizeUuid(input: string): string {
  const trimmed = input.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)) {
    throw new Error('Invalid UUID');
  }
  return trimmed;
}

/**
 * Clamp a number to a safe range and reject NaN / Infinity.
 * Throws when the value is not a finite number.
 */
export function sanitizeNumber(input: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const n = Number(input);
  if (!Number.isFinite(n)) throw new Error('Invalid number');
  if (n < min || n > max) throw new Error(`Number out of range [${min}, ${max}]`);
  return n;
}
