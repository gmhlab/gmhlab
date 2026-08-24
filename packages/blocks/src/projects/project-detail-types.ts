/**
 * The content model for a *project detail* page — the contract the
 * `ProjectDetailPage` block renders.
 *
 * The records themselves are **content, not library code**, and live in the
 * consuming app (`apps/web/src/content/project-detail-data.ts`), which is
 * where their provenance is documented.
 *
 * ## Why this shape
 *
 * A typical research-centre project page publishes four things — a status
 * line, an abstract, a partner list and a publication list. That is a
 * *summary* of a study, and it is the same shape whether the project is a
 * clinical trial, a measurement-validation effort or a global training
 * platform.
 *
 * These projects are, almost without exception, **studies with protocols**:
 * they randomize something, enroll a population against written criteria, run
 * a schedule of assessments, and measure named outcomes with named
 * instruments. `ProjectDetail` models that protocol directly, so a detail page
 * can show how a study is designed rather than only asserting that it exists.
 * Every field below is optional except the identity block, and the page omits
 * the whole section when a field is absent — a platform project with no
 * eligibility criteria simply renders no eligibility section rather than an
 * empty heading.
 *
 * ## Two things are deliberately stored as references, not restated
 *
 *   - **Publications.** `publications` holds slugs into a bibliography, so the
 *     evidence section renders real journals, DOIs, citation counts and
 *     open-access status instead of a restated list that drifts. The optional
 *     `note` records what a work *is* to this project (its trial protocol, its
 *     pilot, its primary outcomes) — a relationship the bibliography does not
 *     carry.
 *   - **Related projects.** `relatedSlugs` indexes the portfolio, so a related
 *     card's name and tagline stay in step with it.
 *
 * Both resolve at render time and both fail soft: an unknown slug is skipped,
 * never rendered as a broken row.
 */

import type { Project, ProjectStatus } from "./projects-types";
import {
  resolvePublicationRefs,
  type Publication,
  type PublicationRef,
  type ResolvedPublication,
} from "../publications/publications-types";

/** A headline quantity — enrollment targets, sites, duration. */
export type ProjectFigure = {
  value: string;
  label: string;
  /** Qualifies the number so it is never read as a result. */
  note?: string;
};

/** A term/detail pair in the hero's identity rail. */
export type ProjectFact = { term: string; detail: string };

/** One arm of a randomized comparison. */
export type ProjectArm = {
  name: string;
  abbr?: string;
  body: string;
  /** The arm under test, styled as the emphasis of the pair. */
  isIntervention?: boolean;
};

/** A named component of the implementation strategy. */
export type StrategyElement = { term: string; body: string };

/** An instrument used to assess an objective. */
export type Measure = {
  /** The acronym the field uses, where there is one. */
  abbr?: string;
  name: string;
  detail?: string;
};

/**
 * A study objective. `rank` is the protocol's own primary/secondary
 * designation, not an editorial ordering — it governs statistical power, so it
 * is rendered as a label rather than implied by position.
 */
export type Objective = {
  rank: "primary" | "secondary";
  title: string;
  /** A hypothesis qualifier, e.g. a non-inferiority statement. */
  note?: string;
  measures: Measure[];
};

/** A population followed through the study on its own schedule. */
export type StudyTrack = {
  id: string;
  label: string;
  /** Who is enrolled on this track. */
  population: string;
};

/**
 * One row of the assessment schedule. `point` is an assessment timepoint and
 * carries the protocol's own code (T0, T1, …); `phase` is the interval of
 * activity between two timepoints and has no code because nothing is measured
 * at it.
 */
export type TimelineEntry = {
  kind: "point" | "phase";
  /** Matches a `StudyTrack.id`. */
  track: string;
  /** Present on `point` entries only. */
  code?: string;
  when: string;
  title: string;
  detail?: string;
  /** Sub-populations an assessment is completed with. */
  cohorts?: string[];
};

export type EligibilityGroup = {
  group: string;
  criteria: string[];
};

/**
 * A publication slug plus what that work is to this project. Structurally the
 * shared `PublicationRef`; kept as a named alias because the detail record
 * reads better with it.
 */
export type ProjectPublicationRef = PublicationRef;

export type ProjectResource = {
  label: string;
  href: string;
  /** Distinguishes a PDF download from an outbound page. */
  kind?: "document" | "site";
};

export type ProjectContact = {
  name: string;
  role?: string;
  email: string;
};

export type ProjectDetail = {
  /** Matches a `Project.slug` in `PROJECTS`. */
  slug: string;
  name: string;
  /** Expansion of the acronym, where the name is one. */
  expandedName?: string;
  tagline: string;
  status: ProjectStatus;
  /** The Center's own wording, e.g. "Enrollment closed". */
  statusLabel: string;
  /** The opening paragraph: what the study is, in one breath. */
  lede: string;
  facts: ProjectFact[];
  figures?: ProjectFigure[];
  /** Paragraphs establishing the problem the study addresses. */
  rationale?: string[];
  arms?: ProjectArm[];
  strategy?: {
    heading: string;
    body: string[];
    elements?: StrategyElement[];
  };
  objectives?: Objective[];
  hypotheses?: string[];
  tracks?: StudyTrack[];
  timeline?: TimelineEntry[];
  eligibility?: EligibilityGroup[];
  publications?: ProjectPublicationRef[];
  partners?: string[];
  resources?: ProjectResource[];
  contact?: ProjectContact;
  relatedSlugs?: string[];
};

/* -- Resolving references ------------------------------------------------- */

export type ResolvedProjectPublication = ResolvedPublication;

/**
 * Resolve a detail record's publication slugs against a bibliography, newest
 * first. The bibliography is passed in rather than imported: the records are
 * the consuming app's content, not this package's.
 */
export function resolveProjectPublications(
  detail: ProjectDetail,
  publications: Publication[],
): ResolvedProjectPublication[] {
  return resolvePublicationRefs(detail.publications, publications);
}

/** Resolve related project slugs against a portfolio, preserving order. */
export function resolveRelatedProjects(
  detail: ProjectDetail,
  projects: Project[],
): Project[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return (detail.relatedSlugs ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
}
