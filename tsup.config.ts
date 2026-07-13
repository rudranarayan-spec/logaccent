import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    node: "src/node.ts",
    browser: "src/browser.ts",
    noop: "src/noop.ts",
  },

  format: ["esm", "cjs"],

  // Generate declarations separately with TypeScript.
  dts: false,

  sourcemap: true,
  clean: false,
  minify: false,
  splitting: false,
  treeshake: true,
  target: "node18",
  outDir: "dist",
  cjsInterop: true,
});