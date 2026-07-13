export function safeStringify(
  value: unknown,
  spacing = 2
): string {
  const seen = new WeakSet<object>();

  try {
    return JSON.stringify(
      value,
      (_key, currentValue: unknown) => {
        if (
          typeof currentValue === "object" &&
          currentValue !== null
        ) {
          if (seen.has(currentValue)) {
            return "[Circular]";
          }

          seen.add(currentValue);
        }

        if (typeof currentValue === "bigint") {
          return `${currentValue.toString()}n`;
        }

        return currentValue;
      },
      spacing
    );
  } catch {
    return String(value);
  }
}

export function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return value.stack ?? `${value.name}: ${value.message}`;
  }

  if (typeof value === "symbol") {
    return value.toString();
  }

  if (typeof value === "bigint") {
    return `${value.toString()}n`;
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return safeStringify(value);
  }

  return String(value);
}

export function joinValues(values: readonly unknown[]): string {
  return values.map(formatValue).join(" ");
}