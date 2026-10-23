/**
 * The content model for an *innovation detail* page — the contract the
 * `InnovationDetailPage` block renders.
 *
 * The records themselves are **content, not library code**, and live in the
 * consuming app (`apps/web/src/content/innovation-detail-data.ts`).
 *
 * ## Why this shape
 *
 * An innovation is a *thing the centre built and hands to other people* — a
 * platform, a toolkit, an instrument set. That makes its detail page a
 * different document from a project's: a project page argues that a study is
 * well designed, whereas this one has to answer "what is it, how does it work,
 * who is already running it, what is the evidence, and how do I adopt it".
 * The sections below are those questions in that order.
 *
 * Every field except the identity block is optional and each section is
 * conditional on its data, so an innovation with no deployment sites renders
 * no deployment section rather than an empty heading. That is what lets one
 * component serve a platform, a toolkit and a validated instrument set.
 *
 * ## Section subheadings live in the record, headings do not
 *
 * The headings are generic and belong to the component ("How It Works",
 * "Evidence Base"). The subheadings name the innovation ("EQUIP uses a
 * four-stage cycle…"), so they are content and sit on the record beside the
 * data they introduce.
 *
 * ## Publications are references, not restated citations
 *
 * `publications` holds slugs into a bibliography, so the evidence section
 * renders real journals, DOIs and citation counts. Restating them here is what
 * this replaced: the three EQUIP citations that were hardcoded in this
 * component had all silently drifted from the records they duplicated —
 * abbreviated titles, and a publisher ("Frontiers") in place of a journal.
 */

import type { ResearchGlyphName } from "@gmhlab/ui";
import type { InnovationStatus } from "./innovations-types";
import type { PublicationRef } from "../publications/publications-types";
import type { PageAction, PageCta } from "../shared/page-copy";

/** A headline quantity in the hero — countries, providers, publications. */
export type InnovationStat = { value: string; label: string };

/** A pill beside the title: the partnership, the lifecycle state. */
export type InnovationBadge = { label: string; tone: InnovationStatus };

/** A call to action. `href` is passed through untouched. */
/** Kept as a named alias of the shared {@link PageAction}. */
export type InnovationAction = PageAction;

/**
 * The illustration under a process step. Rendered as a square white tile, so
 * supply a square image on a pure white ground (it is the tile's ground too).
 */
export type InnovationProcessImage = {
  src: string;
  /** What the picture shows. */
  alt: string;
};

/** One stage of the "how it works" cycle. Numbered by position. */
export type InnovationProcessStep = {
  heading: string;
  body: string;
  image?: InnovationProcessImage;
};

/** One of the parts the innovation ships as. */
export type InnovationComponent = {
  /** The graphics-kit glyph on the component's card. */
  glyph: ResearchGlyphName;
  heading: string;
  body: string;
};

/** A deployment site and the organization running it. */
export type InnovationSite = {
  /** Emoji flag, rendered `aria-hidden` beside the name. */
  flag: string;
  name: string;
  partner: string;
};

/** A related project, by name. Free text rather than a portfolio slug: these
 *  may name work that is not in the portfolio. */
export type RelatedInnovationProject = {
  heading: string;
  body: string;
  /** Rendered as a link only when set. */
  href?: string;
};

export type InnovationDetail = {
  /* -- Identity ----------------------------------------------------------- */
  slug: string;
  /** Display name, e.g. "EQUIP Platform". */
  name: string;
  /** What the acronym stands for, shown as the subheading. */
  expandedName?: string;
  /** The innovation's own logo, as a URL, shown on a paper tile beside the
   *  title. */
  logo?: string;
  badges?: InnovationBadge[];
  /** The hero paragraph. */
  summary: string;
  /**
   * Hero background photograph, shown in the brand duotone under the hero's
   * contour lines. Omit for the contours alone.
   */
  heroImage?: string;
  actions?: InnovationAction[];
  /**
   * The hero media slot's art: this graphics-kit glyph, large on a navy
   * contour panel. Usually the same glyph as the innovation's index card.
   */
  glyph?: ResearchGlyphName;
  /** Caption under the media slot, e.g. what a screenshot will show. */
  visualCaption?: string;
  stats?: InnovationStat[];

  /* -- How it works ------------------------------------------------------- */
  process?: InnovationProcessStep[];
  processNote?: string;

  /* -- Core components ---------------------------------------------------- */
  components?: InnovationComponent[];
  componentsNote?: string;

  /* -- Where it's used ---------------------------------------------------- */
  sites?: InnovationSite[];
  sitesNote?: string;
  /** Placeholder copy for the map slot. */
  mapCaption?: string;
  /** Heading above the site list. */
  sitesListHeading?: string;

  /* -- Evidence ----------------------------------------------------------- */
  publications?: PublicationRef[];
  publicationsNote?: string;

  /* -- Related work ------------------------------------------------------- */
  related?: RelatedInnovationProject[];
  relatedNote?: string;

  /* -- Closing CTA -------------------------------------------------------- */
  cta?: PageCta;
};
