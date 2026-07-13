const emittedKeys = new Set<string>();

export function shouldLogOnce(key: string): boolean {
  if (emittedKeys.has(key)) {
    return false;
  }

  emittedKeys.add(key);
  return true;
}

export function clearOnceRegistry(): void {
  emittedKeys.clear();
}