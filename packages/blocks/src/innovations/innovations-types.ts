/**
 * The *contract* for innovation records — the types the innovations index
 * block renders.
 *
 * The records themselves are **content, not library code**, and live in the
 * consuming app (`apps/web/src/content/innovations-data.ts`).
 *
 * `slug` rather than a full URL: the page builds hrefs from a `basePath` prop
 * so the block is portable across whatever site hosts it.
 */

/** Maps onto Badge's status variants. */
export type InnovationStatus = "info" | "warning" | "success";

export type Innovation = {
  /** Identity; also the last segment of the detail-page href. */
  slug: string;
  icon: string;
  /** The status line as published, e.g. "WHO/UNICEF Partnership". */
  status: string;
  statusTone: InnovationStatus;
  heading: string;
  body: string;
  /** Where it runs, as a phrase: "25+ countries", "Nepal". */
  reach: string;
  /** Publication count as a phrase: "12 publications". */
  publications: string;
};
