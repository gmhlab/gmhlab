import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { PRIVATE_PATHS, SITE_HOST } from "../site-origin";

// Crawlable only on the real domain. Everywhere else (the .vercel.app address,
// previews, localhost) the whole site is disallowed, and next.config.ts adds
// a noindex header as well.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");

  if (host !== SITE_HOST) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
  };
}
