import type { Metadata } from "next";
import { Libre_Baskerville, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { AllProviders } from "@gmhlab/blocks";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader, SiteUtilityBar } from "../components/site-header";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "GW Global Mental Health",
  description:
    "Supporting Wellbeing Worldwide.",
  // Pre-launch. Drop this alongside app/robots.ts to open the site to indexing.
  robots: { index: false, follow: false },
};

/* Web fallbacks for the GW faces. Baskerville and Avenir Next are macOS system
   fonts and win on a Mac; everyone else gets these, self-hosted by next/font.
   The `variable`s feed the optional hooks in @gmhlab/tokens' family stacks
   (--mfy-typography-family-{serif,sans}-web), which is how a hashed next/font
   family name reaches a token without the token knowing about Next. */
const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--mfy-typography-family-serif-web",
  display: "swap",
});
const sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--mfy-typography-family-sans-web",
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
          {/* AllProviders renders no DOM, so the header, <main> and footer are
              the body's own flex children — that is what lets Footer's
              `margin-top: auto` pin it to the bottom on short pages. */}
          <AllProviders>
            <SiteUtilityBar />
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </AllProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
