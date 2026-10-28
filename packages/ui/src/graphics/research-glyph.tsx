import clsx from "clsx";
import type { ReactNode } from "react";
import { graphicA11y, type GraphicProps } from "./graphic";
import "./graphics.css";

/*
 * The kit's research and practice glyphs: a 48-unit grid, 1.75 stroke, round
 * caps and joins, ink line work with one gold accent per glyph. `maternal` and
 * `sensing` are additions drawn to the same rules — the kit's eight have no
 * glyph for perinatal work or for passive-sensing technology, both of which
 * the Center's records need. `publication` (an open book) is the stand-in for
 * a publication with no journal cover.
 *
 * Inside a glyph, `ink` and `gold` stand for the two graphic roles.
 */
const ink = "var(--graphic-ink)";
const gold = "var(--graphic-gold)";

const GLYPHS = {
  "care-delivery": (
    <>
      <line x1="24" y1="24" x2="10" y2="12" />
      <line x1="24" y1="24" x2="38" y2="12" />
      <line x1="24" y1="24" x2="24" y2="40" />
      <circle cx="10" cy="12" r="4" />
      <circle cx="38" cy="12" r="4" />
      <circle cx="24" cy="40" r="4" />
      <circle cx="24" cy="24" r="5" fill={gold} stroke={gold} />
    </>
  ),
  "young-people": (
    <>
      <circle cx="17" cy="12" r="4.5" />
      <path d="M8 41 C8 25 26 25 26 41" />
      <circle cx="34" cy="22" r="3.5" stroke={gold} />
      <path d="M27 41 C27 30 41 30 41 41" stroke={gold} />
    </>
  ),
  competency: (
    <>
      <path d="M6 40 H16 V31 H26 V22 H36 V12 H42" />
      <path d="M10 15 L14 19 L22 10" stroke={gold} />
    </>
  ),
  measurement: (
    <>
      <path d="M7 34 A17 17 0 0 1 41 34" />
      <line x1="12" y1="22" x2="14.5" y2="24" />
      <line x1="24" y1="17" x2="24" y2="20" />
      <line x1="36" y1="22" x2="33.5" y2="24" />
      <line x1="24" y1="34" x2="32" y2="23" stroke={gold} />
      <circle cx="24" cy="34" r="2.5" fill={gold} stroke={gold} />
      <line x1="7" y1="40" x2="41" y2="40" />
    </>
  ),
  "task-sharing": (
    <>
      <circle cx="12" cy="13" r="4" />
      <path d="M5 33 C5 21 19 21 19 33" />
      <circle cx="36" cy="13" r="4" />
      <path d="M29 33 C29 21 43 21 43 33" />
      <path d="M13 39 Q24 46 35 39" stroke={gold} />
      <path d="M31 36.5 L35 39 L32 42.5" stroke={gold} />
    </>
  ),
  stigma: (
    <>
      <path d="M23 11 H8 V37 H21" />
      <path d="M26 11 H40 V37 H25" />
      <line x1="8" y1="24" x2="18" y2="24" />
      <line x1="30" y1="24" x2="40" y2="24" />
      <path d="M25 8 L21 18 L27 25 L22 40" stroke={gold} />
    </>
  ),
  "lived-experience": (
    <>
      <path d="M7 9 H41 V32 H22 L14 39 V32 H7 Z" />
      <path
        d="M24 27 C17.5 22.5 17.5 15.5 21.5 15.5 C23 15.5 24 17 24 17 C24 17 25 15.5 26.5 15.5 C30.5 15.5 30.5 22.5 24 27 Z"
        stroke={gold}
        fill={gold}
      />
    </>
  ),
  community: (
    <>
      <circle cx="24" cy="24" r="14" strokeDasharray="2 4" />
      <circle cx="24" cy="10" r="3" />
      <circle cx="36.1" cy="17" r="3" />
      <circle cx="36.1" cy="31" r="3" />
      <circle cx="24" cy="38" r="3" />
      <circle cx="11.9" cy="31" r="3" />
      <circle cx="11.9" cy="17" r="3" />
      <circle cx="24" cy="24" r="4" fill={gold} stroke={gold} />
    </>
  ),
  /* A parent's head and cradling arms, the child held in gold. */
  maternal: (
    <>
      <circle cx="24" cy="10" r="4.5" />
      <path d="M9 24 C9 41 39 41 39 24" />
      <path d="M13 20 C17 17 31 17 35 20" />
      <circle cx="24" cy="27" r="3.5" fill={gold} stroke={gold} />
      <path d="M19 35 C19 31 29 31 29 35" stroke={gold} />
    </>
  ),
  /* A phone whose signal is the gold reading. */
  sensing: (
    <>
      <rect x="9" y="8" width="18" height="32" rx="3" />
      <line x1="16" y1="35" x2="20" y2="35" />
      <path d="M32 18 A8 8 0 0 1 32 30" stroke={gold} />
      <path d="M36 13 A15 15 0 0 1 36 35" stroke={gold} />
      <circle cx="18" cy="21" r="2.5" fill={gold} stroke={gold} />
    </>
  ),
  /* An open book, its bookmark in gold. */
  publication: (
    <>
      <path d="M24 14 C19 10 12 10 6 12 V37 C12 35 19 35 24 38" />
      <path d="M24 14 C29 10 36 10 42 12 V37 C36 35 29 35 24 38" />
      <line x1="24" y1="14" x2="24" y2="38" />
      <path d="M31 11.2 V22 L33.5 19.5 L36 22 V10.9" stroke={gold} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type ResearchGlyphName = keyof typeof GLYPHS;

/** Every glyph name, in the kit's order — for galleries and pickers. */
export const RESEARCH_GLYPHS = Object.keys(GLYPHS) as ResearchGlyphName[];

export type ResearchGlyphProps = GraphicProps & {
  name: ResearchGlyphName;
  /** Rendered size in px. The grid is 48; the kit sets them at 64 on cards. */
  size?: number;
};

/**
 * One of the kit's research glyphs. Navy line work with a single gold accent
 * on paper; pale ink after dark or inside a brand band. Decorative unless
 * given a `label` — beside a visible theme name it should not have one.
 */
export function ResearchGlyph({
  name,
  size = 48,
  label,
  className,
  ...props
}: ResearchGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={ink}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("graphic graphic-glyph", className)}
      {...graphicA11y(label)}
      {...props}
    >
      {GLYPHS[name]}
    </svg>
  );
}
