import type { Metadata } from "next";
import { Libre_Baskerville, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { DataProviders } from "../components/data-providers";
import { ThemeProvider } from "../components/theme-provider";
import { SITE_ORIGIN } from "../site-origin";
import "./globals.css";

export const metadata: Metadata = {
  title: "GW Global Mental Health",
  description:
    "Supporting Wellbeing Worldwide.",
  // Absolute URLs (Open Graph images and the like) point at the real domain
  // whichever host served the page. Indexing is decided per host in
  // next.config.ts and app/robots.ts, not here: a <meta> tag that varied by
  // host would make every page render dynamically.
  metadataBase: new URL(SITE_ORIGIN),
};

/* Web fallbacks for the GW faces. Baskerville and Avenir Next are macOS system
   fonts and win on a Mac; everyone else gets these, self-hosted by next/font.
   The `variable`s feed the optional hooks in @gmhlab/tokens' typeface stacks
   (--gmh-ref-typeface-{brand,plain}-web), which is how a hashed next/font
   family name reaches a token without the token knowing about Next. */
const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--gmh-ref-typeface-brand-web",
  display: "swap",
});
const sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--gmh-ref-typeface-plain-web",
  display: "swap",
});

// Applies the stored theme class before first paint so there is no flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.add(d?"dark":"light")}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          {/* DataProviders renders no DOM, so each route group's chrome is the
              body's own flex children. The public site's header, <main> and
              footer live in (site)/layout.tsx; the dashboard has its own shell
              in (dashboard)/layout.tsx. */}
          <DataProviders>{children}</DataProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
