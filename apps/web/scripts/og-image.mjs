/* Renders the site's Open Graph / Twitter share card (1200x630) to
 * src/app/opengraph-image.png and src/app/twitter-image.png, which Next serves
 * through its file conventions — no route, no metadata wiring.
 *
 * The card is the real @gmhlab/ui pieces, not a redrawing: the crest lockup,
 * ContourGlobe with the GMH mark in its clearing, and the FigureBand, server-
 * rendered with react-dom and painted by the built tokens + ui CSS, so the
 * colours are the token values and nothing here names one. Headless Chrome
 * takes the screenshot; it renders on macOS, where Baskerville and Avenir Next
 * are the system faces the brand stacks put first.
 *
 * Run after `pnpm build` (it reads the packages' dist/):
 *   pnpm --filter web og-image
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContourGlobe, FigureBand, GmhCrestLogo } from "@gmhlab/ui";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTH = 1200;
const HEIGHT = 630;

const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// ui's dist/index.css opens with a bare `@import "@gmhlab/tokens/tokens.css"`,
// which a file:// page cannot resolve, so the tokens are linked first.
const tokensCss = import.meta.resolve("@gmhlab/tokens/tokens.css");
const uiCss = import.meta.resolve("@gmhlab/ui/styles.css");

const card = renderToStaticMarkup(
  h(
    "div",
    { className: "section section-variant-brand og-card" },
    h(ContourGlobe, {
      centerpiece: "mark",
      backdrop: true,
      className: "graphic-fade-start",
    }),
    h(
      "div",
      { className: "og-copy" },
      h(GmhCrestLogo, { href: undefined }),
      h(
        "h1",
        { className: "og-title" },
        "Supporting ",
        h("em", null, "wellbeing"),
        h("br"),
        "worldwide.",
      ),
      h("span", { className: "og-rule" }),
      h(
        "p",
        { className: "og-pillars" },
        "Research · Capacity building · Consultation",
      ),
    ),
    h(FigureBand, { className: "og-figures" }),
  ),
);

const html = `<!doctype html>
<html lang="en" class="light">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${tokensCss}">
<link rel="stylesheet" href="${uiCss}">
<style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  .og-card {
    box-sizing: border-box;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    position: relative;
    overflow: hidden;
    padding: 72px 80px 0;
  }
  /* ContourGlobe brings its own contours; the band's texture would double them. */
  .og-card::before { content: none; }
  /* Pull the centrepiece clear of the copy and give it room to read. */
  .og-card .graphic-contour-globe { transform: translateX(40px); }
  .og-copy { position: relative; display: flex; flex-direction: column; gap: 28px; width: 620px; }
  .og-copy .logo-gmh-crest > svg { --logo-gmh-crest-height: 5.5rem; }
  .og-title {
    margin: 12px 0 0;
    font-family: var(--gmh-typescale-display-large-font);
    font-weight: var(--gmh-typescale-display-large-weight);
    font-size: 84px;
    line-height: 1.04;
    letter-spacing: -0.01em;
    color: var(--gmh-color-on-brand-band);
  }
  .og-title em { font-style: italic; color: var(--gmh-color-brand-band-accent); }
  .og-rule { display: block; width: 96px; height: 4px; border-radius: 2px; background: var(--gmh-color-tertiary-container); }
  .og-pillars {
    margin: 0;
    font-family: var(--gmh-typescale-title-large-font);
    font-size: 24px;
    font-weight: var(--gmh-ref-typeface-weight-medium);
    letter-spacing: 0.02em;
    color: color-mix(in srgb, var(--gmh-color-on-brand-band) 82%, transparent);
  }
  .og-figures { position: absolute; left: 0; right: 0; bottom: 0; }
</style>
</head>
<body>${card}</body>
</html>`;

const work = mkdtempSync(path.join(tmpdir(), "gmh-og-"));
try {
  const page = path.join(work, "og.html");
  const shot = path.join(work, "og.png");
  writeFileSync(page, html);
  execFileSync(CHROME, [
    "--headless=new",
    "--hide-scrollbars",
    "--force-prefers-reduced-motion",
    "--blink-settings=preferredColorScheme=1",
    "--force-device-scale-factor=1",
    `--window-size=${WIDTH},${HEIGHT}`,
    "--virtual-time-budget=5000",
    `--screenshot=${shot}`,
    pathToFileURL(page).href,
  ], { stdio: "ignore" });
  for (const name of ["opengraph-image.png", "twitter-image.png"]) {
    copyFileSync(shot, path.join(appDir, "src/app", name));
  }
  if (process.argv.includes("--keep-html")) {
    copyFileSync(page, path.join(appDir, "og-preview.html"));
  }
  console.log("Wrote src/app/opengraph-image.png and src/app/twitter-image.png");
} finally {
  rmSync(work, { recursive: true, force: true });
}
