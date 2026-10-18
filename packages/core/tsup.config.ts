import { defineConfig } from "tsup";

// Two entries, so demo data is opt-in: `@gmhlab/core` carries types, service
// interfaces and pure helpers only; the mock services and their records ship
// in `@gmhlab/core/mocks` and never reach a consumer that doesn't import them.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    mocks: "src/mocks/index.ts",
  },
  dts: true,
  format: ["esm"],
  outDir: "dist",
  clean: true,
})
