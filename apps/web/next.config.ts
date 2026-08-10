import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// The workspace root. Next traces the files a server bundle needs, and the
// @gmhlab/* packages are pnpm symlinks into ../../node_modules — outside this
// app. Without this, tracing is rooted at apps/web and their dist/ files are
// left out of the deployment.
const workspaceRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,

  // Pre-launch: noindex as a response header, so it also covers responses that
  // carry no <meta> tag (images, JSON, RSC payloads). Paired with app/robots.ts
  // and the `robots` metadata in app/layout.tsx — remove all three at launch.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
