import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AllProviders } from "@gmhlab/blocks";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonoFly",
  description:
    "Design once, ship everywhere — tokens, components and blocks in one system.",
};

// Applies the stored theme class before first paint so there is no flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          {/* AllProviders renders no DOM, so the header, <main> and footer are
              the body's own flex children — that is what lets Footer's
              `margin-top: auto` pin it to the bottom on short pages. */}
          <AllProviders>
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </AllProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
