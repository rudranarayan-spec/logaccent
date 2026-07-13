export interface RedactionOptions {
  readonly keys?: readonly string[];
  readonly replacement?: string;
  readonly caseSensitive?: boolean;
  readonly maxDepth?: number;
}

const DEFAULT_SENSITIVE_KEYS = [
  "password",
  "passcode",
  "pin",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "apiKey",
  "secret",
  "clientSecret",
  "privateKey",
  "cookie",
  "session"
] as const;

export function redact<T>(
  value: T,
  options: RedactionOptions = {}
): T {
  const {
    keys = DEFAULT_SENSITIVE_KEYS,
    replacement = "[REDACTED]",
    caseSensitive = false,
    maxDepth = 10
  } = options;

  const normalizedKeys = new Set(
    keys.map((key) =>
      caseSensitive ? key : key.toLowerCase()
    )
  );

  const seen = new WeakMap<object, unknown>();

  function visit(current: unknown, depth: number): unknown {
    if (
      current === null ||
      typeof current !== "object"
    ) {
      return current;
    }

    if (depth > maxDepth) {
      return "[MaxDepth]";
    }

    const existing = seen.get(current);

    if (existing !== undefined) {
      return "[Circular]";
    }

    if (Array.isArray(current)) {
      const copy: unknown[] = [];
      seen.set(current, copy);

      for (const item of current) {
        copy.push(visit(item, depth + 1));
      }

      return copy;
    }

    const copy: Record<string, unknown> = {};
    seen.set(current, copy);

    for (const [key, nestedValue] of Object.entries(current)) {
      const normalizedKey = caseSensitive
        ? key
        : key.toLowerCase();

      copy[key] = normalizedKeys.has(normalizedKey)
        ? replacement
        : visit(nestedValue, depth + 1);
    }

    return copy;
  }

  return visit(value, 0) as T;
}