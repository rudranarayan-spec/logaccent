import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    node: "src/node.ts",
    browser: "src/browser.ts",
    noop: "src/noop.ts",
  },

  format: ["esm", "cjs"],

  // Bundle public declarations and emit ESM/CJS declaration variants.
  dts: true,

  sourcemap: true,
  clean: false,
  minify: false,
  splitting: false,
  treeshake: true,
  target: "node18",
  outDir: "dist",
  cjsInterop: true,

  outExtension({ format }) {
    return format === "cjs"
      ? {
          js: ".cjs",
          dts: ".d.cts",
        }
      : {
          js: ".js",
          dts: ".d.ts",
        };
  },
});