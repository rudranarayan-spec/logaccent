import type {
  FormattedLogRecord,
  LogTransport
} from "./types";

export interface ConsoleLike {
  log(...values: readonly unknown[]): void;
  info(...values: readonly unknown[]): void;
  warn(...values: readonly unknown[]): void;
  error(...values: readonly unknown[]): void;
  debug(...values: readonly unknown[]): void;
}

export class ConsoleTransport implements LogTransport {
  public readonly name = "console";

  public constructor(
    private readonly target: ConsoleLike = console
  ) {}

  public write(record: FormattedLogRecord): void {
    const method =
      record.level === "fatal" || record.level === "error"
        ? "error"
        : record.level === "warn"
          ? "warn"
          : record.level === "debug" ||
              record.level === "trace"
            ? "debug"
            : record.level === "info"
              ? "info"
              : "log";

    this.target[method](record.formattedMessage);
  }
}