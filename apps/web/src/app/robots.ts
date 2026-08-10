import type { MetadataRoute } from "next";

// Pre-launch: the whole site is closed to crawlers. Remove this file (and the
// `robots` key in layout.tsx's metadata, and the X-Robots-Tag header in
// next.config.ts) when the site is ready to be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
