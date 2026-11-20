/**
 * The site's one public address. Search engines index this host only: every
 * other host serving the same deployment (gwglobalmentalhealth.vercel.app,
 * preview URLs, localhost) gets noindex and a robots.txt that disallows
 * everything. So the site opens to crawlers when this domain is attached in
 * Vercel, with no code change at launch.
 *
 * Read by next.config.ts (X-Robots-Tag and canonical headers), app/robots.ts
 * and app/layout.tsx (metadataBase).
 */
export const SITE_HOST = "gwglobalmentalhealth.com";
export const SITE_ORIGIN = `https://${SITE_HOST}`;

/** Routes that stay out of search on every host: the member workspace,
 *  sign-in, the static demo and the API. */
export const PRIVATE_PATHS = ["/dashboard", "/login", "/demo", "/api"];
