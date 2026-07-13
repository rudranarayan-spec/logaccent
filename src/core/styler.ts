import {
  ANSI_STYLES,
  ansiClose,
  ansiOpen,
  backgroundRgbStyle,
  rgbStyle,
  type AnsiStyle
} from "./ansi";
import { detectColorLevel } from "./color-support";
import { joinValues } from "./formatter";
import type { AccentOptions, Styler } from "./types";

function assertRgbChannel(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new RangeError(
      `${name} must be an integer between 0 and 255. Received: ${value}`
    );
  }
}

function parseHex(value: string): [number, number, number] {
  const normalized = value.trim().replace(/^#/, "");

  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized;

  if (!/^[\da-fA-F]{6}$/.test(expanded)) {
    throw new TypeError(
      `Invalid hex color "${value}". Expected #RGB or #RRGGBB.`
    );
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16)
  ];
}

function applyStyles(
  text: string,
  styles: readonly AnsiStyle[],
  enabled: boolean
): string {
  if (!enabled || styles.length === 0 || text.length === 0) {
    return text;
  }

  let output = text;

  for (let index = styles.length - 1; index >= 0; index -= 1) {
    const style = styles[index];

    if (!style) {
      continue;
    }

    const opening = ansiOpen(style.open);
    const closing = ansiClose(style.close);

    // Reopen the outer style after an inner matching close sequence.
    output =
      opening +
      output.replaceAll(closing, opening) +
      closing;
  }

  return output;
}

function createStyler(
  styles: readonly AnsiStyle[],
  options: Required<AccentOptions>
): Styler {
  const callable = (...values: readonly unknown[]): string => {
    return applyStyles(
      joinValues(values),
      styles,
      options.enabled && options.colorLevel > 0
    );
  };

  const styler = callable as Styler;

  for (const [name, style] of Object.entries(ANSI_STYLES)) {
    Object.defineProperty(styler, name, {
      enumerable: true,
      configurable: false,
      get: () => createStyler([...styles, style], options)
    });
  }

  styler.rgb = (
    red: number,
    green: number,
    blue: number
  ): Styler => {
    assertRgbChannel(red, "red");
    assertRgbChannel(green, "green");
    assertRgbChannel(blue, "blue");

    return createStyler(
      [...styles, rgbStyle(red, green, blue)],
      options
    );
  };

  styler.bgRgb = (
    red: number,
    green: number,
    blue: number
  ): Styler => {
    assertRgbChannel(red, "red");
    assertRgbChannel(green, "green");
    assertRgbChannel(blue, "blue");

    return createStyler(
      [...styles, backgroundRgbStyle(red, green, blue)],
      options
    );
  };

  styler.hex = (value: string): Styler => {
    return styler.rgb(...parseHex(value));
  };

  styler.bgHex = (value: string): Styler => {
    return styler.bgRgb(...parseHex(value));
  };

  return styler;
}

export function createAccent(
  options: AccentOptions = {}
): Styler {
  return createStyler([], {
    enabled: options.enabled ?? true,
    colorLevel: options.colorLevel ?? detectColorLevel()
  });
}

export const accent = createAccent();