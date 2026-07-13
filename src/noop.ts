import type {
  Logger,
  LoggerOptions,
  LogTimer,
  TimerResult
} from "./logger/logger";
import type {
  AccentOptions,
  Styler
} from "./core/types";

function joinValues(values: readonly unknown[]): string {
  return values.map(String).join(" ");
}

function createNoopStyler(): Styler {
  const callable = (
    ...values: readonly unknown[]
  ): string => joinValues(values);

  return new Proxy(callable, {
    get(_target, property) {
      if (
        property === "rgb" ||
        property === "bgRgb" ||
        property === "hex" ||
        property === "bgHex"
      ) {
        return () => createNoopStyler();
      }

      return createNoopStyler();
    },

    apply(_target, _thisArg, argumentsList) {
      return joinValues(argumentsList);
    }
  }) as Styler;
}

function createNoopTimer(label: string): LogTimer {
  return {
    end(): TimerResult {
      return {
        label,
        durationMs: 0
      };
    }
  };
}

export function createLogger(
  _options: LoggerOptions = {}
): Logger {
  const noop = (): void => {};

  const logger: Logger = {
    fatal: noop,
    error: noop,
    warn: noop,
    success: noop,
    info: noop,
    debug: noop,
    trace: noop,

    scope: () => logger,
    child: () => logger,
    withContext: () => logger,
    time: (label = "operation") => createNoopTimer(label),
    flush: async () => {},
    close: async () => {}
  };

  return Object.freeze(logger);
}

export function createAccent(
  _options: AccentOptions = {}
): Styler {
  return createNoopStyler();
}

export const logger = createLogger();
export const accent = createAccent();