import type { Project } from "../projects/projects-types";
import type { Publication } from "../publications/publications-types";

/**
 * The *contract* for people records: the types the team block renders, plus
 * the pure helpers that connect a person to the rest of the site.
 *
 * The people themselves are **content, not library code**, and live in the
 * consuming app (`apps/web/src/content/team-data.ts`), which is where their
 * provenance is documented.
 *
 * A person is one record whatever their group. The groups differ in which
 * fields they *use* (an alum has a graduation year, a student a programme),
 * not in shape, so one card style and one credential format serve everyone.
 */

/** The four sections of the page, in the order they render. */
export type TeamGroup = "core" | "affiliate" | "student" | "alumni";

/** Scholarly and contact links. Every one is optional; none is invented. */
export type PersonLinks = {
  email?: string;
  /** The bare ORCID iD, `0000-0000-0000-0000`. The page builds the URL. */
  orcid?: string;
  scholar?: string;
  /** A public bibliography (NCBI, a lab page) where there is no ORCID. */
  bibliography?: string;
};

export type Person = {
  /** Identity; also the card's anchor id, so `/team#slug` deep-links. */
  slug: string;
  /** The name alone, spelled as the person spells it. Never carries degrees. */
  name: string;
  group: TeamGroup;
  /**
   * Degrees, in display order: `["MD", "PhD"]`. Always rendered inline after
   * the name, joined with commas, in every group.
   */
  credentials?: string[];
  /** Job title or fellowship: "Research Scientist". */
  role?: string;
  /** Home institution where it is not the hosting organisation. */
  affiliation?: string;
  /**
   * Where the person is based — a city or country they work from. **Not**
   * nationality: a staff list that mixes the two reads as both.
   */
  location?: string;
  /**
   * Headshot URL. Omit for an initials monogram: a stock photo standing in
   * for a real person is a misrepresentation, so there is no fallback image.
   * The alt text is always the person's name.
   */
  photo?: string;
  /** Bio paragraphs. Present → the card expands to show them. */
  bio?: string[];
  /** Slugs into the project portfolio. */
  projects?: string[];
  /**
   * The exact spellings under which this person appears in the bibliography's
   * `authors` lists ("Brandon A. Kohrt", "Brandon Kohrt"). Matching is exact
   * on purpose — a surname match ties people to their namesakes.
   */
  authorNames?: string[];
  links?: PersonLinks;
  /** Students: the programme or field ("Public Health"). */
  program?: string;
  /** Students: the degree being pursued ("DrPH"). Alumni use `credentials`. */
  degree?: string;
  /** Alumni: the year they finished at the organisation. */
  year?: number;
  /** Alumni: where they went next ("Assistant Professor, …"). */
  now?: string;
};

/** Display name with credentials inline: "Brandon Kohrt, MD, PhD". */
export function personDisplayName(person: Person): string {
  return [person.name, ...(person.credentials ?? [])].join(", ");
}

/** Initials for the monogram shown when there is no photo. */
export function personInitials(person: Person): string {
  const words = person.name.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * The person's most-cited works in the bibliography, by exact author-name
 * match. Only the first six authors of each work are recorded, so a person
 * deep in a long author list is missed — this is "selected", not complete.
 */
export function personPublications(
  person: Person,
  publications: Publication[],
  limit = 3,
): Publication[] {
  const names = new Set(person.authorNames ?? []);
  if (!names.size) return [];
  return publications
    .filter((work) => work.authors.some((author) => names.has(author)))
    .sort((a, b) => b.citations - a.citations)
    .slice(0, limit);
}

/** The person's projects, resolved against the portfolio. Unknown slugs drop. */
export function personProjects(person: Person, projects: Project[]): Project[] {
  return (person.projects ?? [])
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => project !== undefined);
}

/**
 * Everyone tagged with a project, in group order (core first) — what a
 * project page shows as its team. Alumni are left out: a former member on a
 * current project's team list reads as a current one.
 */
export function projectPeople(projectSlug: string, people: Person[]): Person[] {
  const order: TeamGroup[] = ["core", "affiliate", "student"];
  return people
    .filter(
      (person) =>
        order.includes(person.group) &&
        person.projects?.includes(projectSlug),
    )
    .sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
}
