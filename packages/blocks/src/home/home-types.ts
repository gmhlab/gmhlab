/**
 * The contract for `HomePage` — a research centre's landing page.
 *
 * Like the other GW page blocks, the renderer names no organisation: every
 * string, number and link arrives in a `HomeContent` record. Everything except
 * `hero` and `stats` is optional, and each section renders only when its
 * record is present, so a site without partners or a pull quote simply has no
 * such section rather than an empty heading.
 */

import type { ResearchGlyphName } from "@gmhlab/ui";

export type HomeLink = {
  label: string;
  href: string;
};

export type HomeImage = {
  src: string;
  /** Empty string for a purely decorative image. */
  alt: string;
  caption?: string;
};

export type HomeHero = {
  eyebrow?: string;
  /** The headline. */
  title: string;
  /**
   * A substring of `title` to set in gold italic — the one phrase the
   * headline turns on. Must appear verbatim in `title`; if it does not, the
   * title renders plain rather than throwing.
   */
  emphasis?: string;
  lede: string;
  primary: HomeLink;
  secondary?: HomeLink;
  /**
   * A photograph beside the copy, framed by the contour globe. Omit it and
   * the hero draws the contours fading into the GMH mark instead.
   */
  image?: HomeImage;
  /**
   * A photograph behind the whole hero, in the brand duotone under the
   * contours. Decorative (no alt text); independent of `image`.
   */
  background?: string;
};

export type HomeStat = {
  /** Display value. A leading number counts up on scroll ("343", "2,400+"). */
  value: string;
  label: string;
};

/**
 * The signature figure: `total` people drawn as a field, `reached` of them
 * lit gold. Put the citation in `source` — a figure like this is only as
 * honest as the number behind it.
 */
export type HomeGap = {
  eyebrow?: string;
  heading: string;
  body: string;
  total: number;
  reached: number;
  reachedLabel: string;
  unreachedLabel: string;
  source?: string;
};

export type HomeFocusItem = {
  /** Small gold kicker above the heading. */
  tag: string;
  heading: string;
  body: string;
  href: string;
  linkLabel?: string;
  /**
   * The card's art. A photograph when there is a real one; otherwise a
   * graphics-kit glyph, drawn large on a navy contour panel. `image` wins
   * when both are set.
   */
  image?: HomeImage;
  glyph?: ResearchGlyphName;
};

export type HomeSectionHead = {
  eyebrow?: string;
  heading: string;
  lede?: string;
};

export type HomeQuote = {
  /** Kicker above the quote. The quote itself is the heading here. */
  eyebrow?: string;
  quote: string;
  name: string;
  role?: string;
  /** Paragraph under the attribution. */
  body?: string;
  action?: HomeLink;
  image?: HomeImage;
};

export type HomePartner = {
  name: string;
  detail?: string;
};

export type HomeCallToAction = {
  heading: string;
  body: string;
  action: HomeLink;
};

export type HomeContent = {
  hero: HomeHero;
  stats: HomeStat[];
  gap?: HomeGap;
  focus?: HomeSectionHead & { items: HomeFocusItem[] };
  quote?: HomeQuote;
  partners?: HomeSectionHead & { items: HomePartner[] };
  cta?: HomeCallToAction;
};

/**
 * Splits `title` around `emphasis` for rendering. Returns the title whole
 * when there is no emphasis or it does not occur, so a typo degrades to a
 * plain headline.
 */
export function splitEmphasis(
  title: string,
  emphasis?: string,
): [before: string, emphasised: string, after: string] | [whole: string] {
  if (!emphasis) return [title];
  const at = title.indexOf(emphasis);
  if (at === -1) return [title];
  return [
    title.slice(0, at),
    emphasis,
    title.slice(at + emphasis.length),
  ];
}

/**
 * Which cells of the gap field are lit. A deterministic stride scatter rather
 * than a cluster, so the reached minority reads as distributed through the
 * population — and the same on server and client, so it never mismatches on
 * hydration.
 */
export function gapLitCells(total: number, reached: number): Set<number> {
  const lit = new Set<number>();
  const n = Math.max(0, Math.min(reached, total));
  if (n === 0) return lit;
  const stride = Math.max(1, Math.floor(total / n));
  for (let i = 0; i < n; i++) {
    lit.add((i * stride + (i % Math.max(1, stride - 1))) % total);
  }
  // Collisions are only possible when stride is 1; fill any shortfall.
  for (let i = 0; lit.size < n; i++) lit.add(i);
  return lit;
}
