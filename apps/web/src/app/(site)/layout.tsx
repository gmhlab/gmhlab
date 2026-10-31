import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, SiteUtilityBar } from "@/components/site-header";

/**
 * The public site's chrome. These are the body's own flex children (the root
 * layout's providers render no DOM), which is what lets Footer's
 * `margin-top: auto` pin it to the bottom on short pages.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteUtilityBar />
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </>
  );
}
