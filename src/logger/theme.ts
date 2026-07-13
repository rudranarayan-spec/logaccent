import type { StaticStyleName } from "../core/ansi";
import type { LogLevel } from "./levels";

export interface LogLevelTheme {
  readonly label: string;
  readonly icon: string;
  readonly styles: readonly StaticStyleName[];
}

export type LoggerTheme = Readonly<
  Record<Exclude<LogLevel, "silent">, LogLevelTheme>
>;

export const defaultTheme: LoggerTheme = {
  fatal: {
    label: "FATAL",
    icon: "✖",
    styles: ["bgRed", "white", "bold"]
  },
  error: {
    label: "ERROR",
    icon: "✖",
    styles: ["red", "bold"]
  },
  warn: {
    label: "WARN",
    icon: "⚠",
    styles: ["yellow", "bold"]
  },
  success: {
    label: "SUCCESS",
    icon: "✔",
    styles: ["green", "bold"]
  },
  info: {
    label: "INFO",
    icon: "ℹ",
    styles: ["blue", "bold"]
  },
  debug: {
    label: "DEBUG",
    icon: "◆",
    styles: ["magenta"]
  },
  trace: {
    label: "TRACE",
    icon: "→",
    styles: ["gray"]
  }
};