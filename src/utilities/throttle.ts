const lastEmittedAt = new Map<string, number>();

export function shouldLogThrottled(
  key: string,
  intervalMs: number,
  now = Date.now()
): boolean {
  if (!Number.isFinite(intervalMs) || intervalMs < 0) {
    throw new RangeError(
      "Throttle interval must be a non-negative number."
    );
  }

  const previousTimestamp = lastEmittedAt.get(key);

  if (
    previousTimestamp !== undefined &&
    now - previousTimestamp < intervalMs
  ) {
    return false;
  }

  lastEmittedAt.set(key, now);
  return true;
}

export function clearThrottleRegistry(): void {
  lastEmittedAt.clear();
}