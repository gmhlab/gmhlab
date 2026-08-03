"use client";

import { Footer } from "@gmhlab/ui";

/**
 * Client boundary for the ui Footer. `layout.tsx` is a server component (it
 * exports `metadata`), and Footer calls `useMediaQuery` — @gmhlab/ui ships
 * without a "use client" banner, so the directive has to live here.
 */
export function SiteFooter() {
  return <Footer />;
}
