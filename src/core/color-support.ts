export type ColorLevel = 0 | 1 | 2 | 3;

export interface ColorEnvironment {
  readonly FORCE_COLOR?: string;
  readonly NO_COLOR?: string;
  readonly NODE_DISABLE_COLORS?: string;
  readonly TERM?: string;
  readonly CI?: string;
  readonly COLORTERM?: string;
}

export interface ColorStream {
  readonly isTTY?: boolean;
  readonly getColorDepth?: () => number;
}

function parseForceColor(value: string | undefined): ColorLevel | null {
  if (value === undefined) {
    return null;
  }

  if (value === "" || value === "true") {
    return 1;
  }

  if (value === "false") {
    return 0;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(3, Math.max(0, parsed)) as ColorLevel;
}

function depthToColorLevel(depth: number): ColorLevel {
  if (depth >= 24) return 3;
  if (depth >= 8) return 2;
  if (depth >= 4) return 1;

  return 0;
}

export function detectColorLevel(
  stream: ColorStream | undefined =
    typeof process !== "undefined" ? process.stdout : undefined,
  environment: ColorEnvironment =
    typeof process !== "undefined" ? process.env : {}
): ColorLevel {
  const forcedLevel = parseForceColor(environment.FORCE_COLOR);

  if (forcedLevel !== null) {
    return forcedLevel;
  }

  if (
    environment.NO_COLOR !== undefined ||
    environment.NODE_DISABLE_COLORS !== undefined
  ) {
    return 0;
  }

  if (!stream?.isTTY) {
    return 0;
  }

  if (typeof stream.getColorDepth === "function") {
    return depthToColorLevel(stream.getColorDepth());
  }

  if (
    environment.COLORTERM === "truecolor" ||
    environment.COLORTERM === "24bit"
  ) {
    return 3;
  }

  if (environment.TERM === "dumb") {
    return 0;
  }

  return 1;
}