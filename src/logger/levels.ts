export const LOG_LEVEL_VALUES = {
  silent: 0,
  fatal: 10,
  error: 20,
  warn: 30,
  success: 35,
  info: 40,
  debug: 50,
  trace: 60
} as const;

export type LogLevel = keyof typeof LOG_LEVEL_VALUES;

export function isLogLevelEnabled(
  messageLevel: LogLevel,
  configuredLevel: LogLevel
): boolean {
  if (configuredLevel === "silent") {
    return false;
  }

  return (
    LOG_LEVEL_VALUES[messageLevel] <=
    LOG_LEVEL_VALUES[configuredLevel]
  );
}