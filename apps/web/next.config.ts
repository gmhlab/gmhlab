import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { PRIVATE_PATHS, SITE_HOST, SITE_ORIGIN } from "./src/site-origin";

const NOINDEX = { key: "X-Robots-Tag", value: "noindex, nofollow" };
// `has`/`missing` host values are regexes.
const SITE_HOST_PATTERN = SITE_HOST.replaceAll(".", "\\.");

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

  // Indexing is decided by host (see src/site-origin.ts). A response header
  // covers everything, including responses with no <meta> tag (images, JSON,
  // RSC payloads), and keeps pages static.
  async headers() {
    return [
      // Every host but the real domain: keep out of search.
      {
        source: "/:path*",
        missing: [{ type: "host", value: SITE_HOST_PATTERN }],
        headers: [NOINDEX],
      },
      // Private routes: keep out of search on the real domain too.
      ...PRIVATE_PATHS.flatMap((p) => [
        { source: p, headers: [NOINDEX] },
        { source: `${p}/:rest*`, headers: [NOINDEX] },
      ]),
      // Public pages name their address on the real domain as canonical,
      // whichever host served them, so the .vercel.app copy never competes.
      {
        // Pages only: no build assets, private routes or files with an extension.
        source: `/:path((?!_next/|${PRIVATE_PATHS.map((p) => p.slice(1)).join("|")})(?!.*\\.).*)`,
        headers: [
          { key: "Link", value: `<${SITE_ORIGIN}/:path>; rel="canonical"` },
        ],
      },
    ];
  },
};

export default nextConfig;
