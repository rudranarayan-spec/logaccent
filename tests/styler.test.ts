import { describe, expect, it } from "vitest";
import { createAccent } from "../src/core/styler";

describe("logAccent styler", () => {
  it("returns plain text when colors are disabled", () => {
    const accent = createAccent({
      enabled: false,
      colorLevel: 0,
    });

    expect(accent.red.bold("Hello")).toBe("Hello");
  });

  it("applies red ANSI styling", () => {
    const accent = createAccent({
      enabled: true,
      colorLevel: 3,
    });

    expect(accent.red("Hello")).toBe(
      "\u001B[31mHello\u001B[39m",
    );
  });

  it("supports chained styles", () => {
    const accent = createAccent({
      enabled: true,
      colorLevel: 3,
    });

    const result = accent.red.bold("Critical");

    expect(result).toContain("\u001B[31m");
    expect(result).toContain("\u001B[1m");
    expect(result).toContain("Critical");
  });

  it("supports hexadecimal colors", () => {
    const accent = createAccent({
      enabled: true,
      colorLevel: 3,
    });

    const result = accent.hex("#7C3AED")("Purple");

    expect(result).toContain("\u001B[38;2;124;58;237m");
    expect(result).toContain("Purple");
  });

  it("rejects invalid RGB values", () => {
    const accent = createAccent({
      enabled: true,
      colorLevel: 3,
    });

    expect(() => accent.rgb(300, 0, 0)).toThrow(
      RangeError,
    );
  });
});