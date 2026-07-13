import type { StaticStyleName } from "./ansi";

export type Styler = {
  (...values: readonly unknown[]): string;

  rgb(red: number, green: number, blue: number): Styler;
  bgRgb(red: number, green: number, blue: number): Styler;
  hex(value: string): Styler;
  bgHex(value: string): Styler;
} & {
  readonly [Key in StaticStyleName]: Styler;
};

export interface AccentOptions {
  readonly enabled?: boolean;
  readonly colorLevel?: 0 | 1 | 2 | 3;
}