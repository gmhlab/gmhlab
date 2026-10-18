import { defineConfig } from "tsup";

// `@gmhlab/core` must stay external: blocks and the apps import its types and
// mocks too, and one copy per bundle keeps the service contract single-sourced.
// The contexts defined here must likewise never be bundled into a consumer —
// blocks externals `@gmhlab/data` so its hooks and the app's providers share
// one context identity.
export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm"],
  outDir: "dist",
  clean: true,
  external: ["react", "react-dom", "@gmhlab/core"],
  banner: {
    js: '"use client";'
  },
})
