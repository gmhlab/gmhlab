import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
  outDir: "dist",
  clean: true,
  external: ["react", "react-dom", "@gmhlab/ui", "@gmhlab/tokens"],
  banner: {
    js: '"use client";'
  },
  esbuildOptions(options) {
    options.loader = {
      ".css": "copy"
    }
  }
})
