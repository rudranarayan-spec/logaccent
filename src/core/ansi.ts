export interface AnsiStyle {
  readonly open: number | string;
  readonly close: number | string;
}

export const ANSI_STYLES = {
  reset: { open: 0, close: 0 },

  bold: { open: 1, close: 22 },
  dim: { open: 2, close: 22 },
  italic: { open: 3, close: 23 },
  underline: { open: 4, close: 24 },
  overline: { open: 53, close: 55 },
  inverse: { open: 7, close: 27 },
  hidden: { open: 8, close: 28 },
  strikethrough: { open: 9, close: 29 },

  black: { open: 30, close: 39 },
  red: { open: 31, close: 39 },
  green: { open: 32, close: 39 },
  yellow: { open: 33, close: 39 },
  blue: { open: 34, close: 39 },
  magenta: { open: 35, close: 39 },
  cyan: { open: 36, close: 39 },
  white: { open: 37, close: 39 },
  gray: { open: 90, close: 39 },

  redBright: { open: 91, close: 39 },
  greenBright: { open: 92, close: 39 },
  yellowBright: { open: 93, close: 39 },
  blueBright: { open: 94, close: 39 },
  magentaBright: { open: 95, close: 39 },
  cyanBright: { open: 96, close: 39 },
  whiteBright: { open: 97, close: 39 },

  bgBlack: { open: 40, close: 49 },
  bgRed: { open: 41, close: 49 },
  bgGreen: { open: 42, close: 49 },
  bgYellow: { open: 43, close: 49 },
  bgBlue: { open: 44, close: 49 },
  bgMagenta: { open: 45, close: 49 },
  bgCyan: { open: 46, close: 49 },
  bgWhite: { open: 47, close: 49 }
} as const satisfies Record<string, AnsiStyle>;

export type StaticStyleName = keyof typeof ANSI_STYLES;

export function ansiOpen(code: number | string): string {
  return `\u001B[${code}m`;
}

export function ansiClose(code: number | string): string {
  return `\u001B[${code}m`;
}

export function rgbStyle(
  red: number,
  green: number,
  blue: number
): AnsiStyle {
  return {
    open: `38;2;${red};${green};${blue}`,
    close: 39
  };
}

export function backgroundRgbStyle(
  red: number,
  green: number,
  blue: number
): AnsiStyle {
  return {
    open: `48;2;${red};${green};${blue}`,
    close: 49
  };
}