import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
  outDir: "dist",
  clean: true,
  esbuildOptions(options) {
    options.loader = {
      ".css": "copy"
    }
  }
})
