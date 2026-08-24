/**
 * The *contract* for project records: the types the projects block renders,
 * plus the pure helper that builds its search haystack.
 *
 * The portfolio itself is **content, not library code**, and lives in the
 * consuming app (`apps/web/src/content/projects-data.ts`), which is where its
 * provenance is documented.
 *
 * `slug` rather than a full URL: the pages build hrefs from a `basePath` prop
 * so the block is portable across whatever site hosts it.
 */

/** The three states the Center publishes, normalised for filtering. */
export type ProjectStatus = "active" | "ongoing" | "closed";

/** Coarse geography, grouped from the countries each abstract names. */
export type ProjectRegion =
  | "Global"
  | "Sub-Saharan Africa"
  | "South Asia"
  | "Latin America"
  | "North America";

export type Project = {
  /** URL segment under the projects base path. */
  slug: string;
  name: string;
  /** The one-line descriptor used on the index. */
  tagline: string;
  /** Condensed from the project page's abstract. */
  summary: string;
  status: ProjectStatus;
  /** Study design or vehicle, as the project page describes it. */
  design: string;
  /** The named intervention delivered, where the page names one. */
  method?: string;
  /** Only set where the project page names the funder. */
  funder?: string;
  /** Only set where the abstract names a place. */
  locations?: string[];
  /** Absent where no country is named (EQUIP-SU). */
  regions?: ProjectRegion[];
  /** Set where the project lists another project in its Resources panel. */
  buildsOn?: string;
  /** Peer-reviewed publications listed on the project page. */
  publications: number;
};

/** The free-text fields search runs against, lower-cased once per project. */
export function projectSearchText(project: Project): string {
  return [
    project.name,
    project.tagline,
    project.summary,
    project.design,
    project.method,
    project.funder,
    ...(project.locations ?? []),
    ...(project.regions ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
