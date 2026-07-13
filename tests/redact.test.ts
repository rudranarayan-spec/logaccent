import { describe, expect, it } from "vitest";
import { redact } from "../src/formatters/redact";

describe("redact", () => {
  it("masks sensitive fields", () => {
    const result = redact({
      email: "developer@example.com",
      password: "secret",
      accessToken: "abc123",
    });

    expect(result).toEqual({
      email: "developer@example.com",
      password: "[REDACTED]",
      accessToken: "[REDACTED]",
    });
  });

  it("handles nested objects", () => {
    const result = redact({
      user: {
        profile: {
          token: "hidden-token",
        },
      },
    });

    expect(result).toEqual({
      user: {
        profile: {
          token: "[REDACTED]",
        },
      },
    });
  });
});