/**
 * The *contract* for publication records: the types the publications block
 * renders, plus the pure helpers that operate on them.
 *
 * The records themselves are **content, not library code**, and live in the
 * consuming app (`apps/web/src/content/publications-data.ts`), which is where
 * their provenance is documented. This module is what a consuming app builds
 * those records against, and it holds nothing organization-specific.
 */

import type { ResearchGlyphName } from "@gmhlab/ui";

/** Coarse, keyword-derived subject buckets. See the note above. */
export type PublicationTheme =
  | "Training & competency"
  | "Adolescent & child"
  | "Stigma & discrimination"
  | "Measurement & validation"
  | "Maternal & perinatal"
  | "Care delivery & systems";

/**
 * The graphics-kit glyph for each theme — on the theme chips, each row's theme
 * line, and anywhere a consuming app shows a theme (the GW landing page's
 * research cards). Part of the contract because the theme set is.
 */
export const PUBLICATION_THEME_GLYPHS: Record<
  PublicationTheme,
  ResearchGlyphName
> = {
  "Training & competency": "competency",
  "Adolescent & child": "young-people",
  "Stigma & discrimination": "stigma",
  "Measurement & validation": "measurement",
  "Maternal & perinatal": "maternal",
  "Care delivery & systems": "care-delivery",
};

export type PublicationKind =
  | "Article"
  | "Review"
  | "Chapter"
  | "Editorial"
  | "Book";

export type Publication = {
  slug: string;
  title: string;
  /** At most six names; see `authorCount` for the true total. */
  authors: string[];
  authorCount: number;
  journal: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  year: number;
  doi?: string;
  /** OpenAlex citation count, captured 2026-08-09. */
  citations: number;
  openAccess: boolean;
  kind: PublicationKind;
  /**
   * Appears on the hosting organisation's own publications listing (as
   * opposed to an author pull). Badged when the page is given `centerBadge`.
   */
  center: boolean;
  /** The organisation's projects this work belongs to, where the listing names them. */
  projects?: string[];
  /** The organisation's curated description; typically only on `center` entries. */
  summary?: string;
  theme: PublicationTheme;
  /**
   * URL of a square image of the venue — the journal's cover or masthead.
   * Rendered decoratively beside the journal name, so it needs no alt text.
   * Omit it and the theme's glyph stands in.
   */
  cover?: string;
};

/* -- Resolving references ------------------------------------------------- */

/**
 * A pointer into a bibliography, plus what the referenced work *is* to the
 * thing pointing at it ("Trial protocol", "Primary outcomes") — a relationship
 * the bibliography itself does not carry.
 *
 * Detail pages store these rather than restating a citation, so journal, DOI,
 * citation count and open-access status stay in step with the real record. A
 * restated citation drifts silently; this cannot.
 */
export type PublicationRef = {
  /** A `Publication.slug`. */
  slug: string;
  note?: string;
};

export type ResolvedPublication = {
  publication: Publication;
  note?: string;
};

/**
 * Resolve refs against a bibliography, newest first. Unknown slugs are dropped
 * rather than rendered as an empty row, so a typo degrades to a shorter list
 * instead of a broken one.
 */
export function resolvePublicationRefs(
  refs: PublicationRef[] | undefined,
  publications: Publication[],
): ResolvedPublication[] {
  const bySlug = new Map(publications.map((p) => [p.slug, p]));
  return (refs ?? [])
    .flatMap<ResolvedPublication>((ref) => {
      const publication = bySlug.get(ref.slug);
      return publication ? [{ publication, note: ref.note }] : [];
    })
    .sort((a, b) => b.publication.date.localeCompare(a.publication.date));
}

/** The free-text fields search runs against, lower-cased once per record. */
export function publicationSearchText(publication: Publication): string {
  return [
    publication.title,
    publication.journal,
    publication.summary,
    publication.theme,
    ...publication.authors,
    ...(publication.projects ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
