import { describe, expect, it, vi } from "vitest";
import { createLogger } from "../src/logger/logger";
import type {
  FormattedLogRecord,
  LogTransport,
} from "../src/transports/types";

class MemoryTransport implements LogTransport {
  readonly name = "memory";

  readonly records: FormattedLogRecord[] = [];

  write(record: FormattedLogRecord): void {
    this.records.push(record);
  }
}

describe("logAccent logger", () => {
  it("writes info logs", () => {
    const transport = new MemoryTransport();

    const logger = createLogger({
      colors: false,
      timestamps: false,
      transports: [transport],
    });

    logger.info("Server started");

    expect(transport.records).toHaveLength(1);
    expect(transport.records[0]?.level).toBe("info");
    expect(
      transport.records[0]?.formattedMessage,
    ).toContain("Server started");
  });

  it("filters logs by level", () => {
    const transport = new MemoryTransport();

    const logger = createLogger({
      level: "warn",
      colors: false,
      timestamps: false,
      transports: [transport],
    });

    logger.debug("Hidden");
    logger.info("Hidden");
    logger.warn("Visible");
    logger.error("Visible");

    expect(transport.records).toHaveLength(2);
    expect(
      transport.records.map((record) => record.level),
    ).toEqual(["warn", "error"]);
  });

  it("supports scoped loggers", () => {
    const transport = new MemoryTransport();

    const logger = createLogger({
      colors: false,
      timestamps: false,
      transports: [transport],
    }).scope("AUTH");

    logger.info("User logged in");

    expect(transport.records[0]?.scope).toBe("AUTH");
    expect(
      transport.records[0]?.formattedMessage,
    ).toContain("[AUTH]");
  });

  it("supports nested scopes", () => {
    const transport = new MemoryTransport();

    const logger = createLogger({
      colors: false,
      timestamps: false,
      transports: [transport],
    })
      .scope("API")
      .scope("PAYMENT");

    logger.info("Payment started");

    expect(transport.records[0]?.scope).toBe(
      "API:PAYMENT",
    );
  });

  it("does not write when disabled", () => {
    const transport = new MemoryTransport();

    const logger = createLogger({
      enabled: false,
      transports: [transport],
    });

    logger.error("Invisible");

    expect(transport.records).toHaveLength(0);
  });

  it("throws when ending a timer twice", () => {
    vi.useFakeTimers();

    const transport = new MemoryTransport();

    const logger = createLogger({
      colors: false,
      timestamps: false,
      transports: [transport],
    });

    const timer = logger.time("Database query");

    timer.end();

    expect(() => timer.end()).toThrow(
      'Timer "Database query" has already ended.',
    );

    vi.useRealTimers();
  });
});