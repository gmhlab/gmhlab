/**
 * Journal covers for the publications list — `Publication.cover`.
 *
 * The Center's own /publications page shows one image per work: the venue's
 * cover or masthead (its alt text is "Journal logo for respective
 * publication"). Those 13 images are the source. The untouched uploads, where
 * each came from and how each was cropped are in
 * `apps/web/assets/gw-site/publications/README.md`; the shipped 192px squares
 * are `public/publications/<file>.jpg`.
 *
 * A cover belongs to the **venue, not the work**, so it is matched on
 * `journal` and reaches all 343 records rather than the Center's 19. Two of
 * the images are publisher marks rather than one title's cover, and the live
 * site already uses them that way — BMC's for *Global Health Research and
 * Policy* and *Child and Adolescent Psychiatry and Mental Health*, The
 * Lancet's for *The Lancet Psychiatry* and *The Lancet Child & Adolescent
 * Health* — so the publisher families below follow its lead. Every other image
 * is one title's own, matched exactly: *BJPsych Open*'s cover is not *The
 * British Journal of Psychiatry*'s.
 *
 * Venues with no image here get the theme glyph instead; that is the block's
 * fallback, not a gap to paper over with an invented masthead.
 */

const PATH = "/publications";

/** BioMed Central titles in the bibliography that do not start with "BMC". */
const BMC_TITLES = new Set([
  "Child and Adolescent Psychiatry and Mental Health",
  "Conflict and Health",
  "Global Health Research and Policy",
  "Globalization and Health",
  "Implementation Science",
  "International Journal of Mental Health Systems",
  "Pilot and Feasibility Studies",
  "Systematic Reviews",
  "Trials",
]);

const EXACT: Record<string, string> = {
  "BJPsych Open": "bjpsych-open",
  "JAACAP Open": "jaacap",
  "Journal of Adolescent Health": "journal-of-adolescent-health",
  "Journal of Affective Disorders": "journal-of-affective-disorders",
  "Journal of the American Academy of Child & Adolescent Psychiatry": "jaacap",
  "SSM - Mental Health": "ssm-mental-health",
  "Scientific Reports": "scientific-reports",
  "Tasman’s Psychiatry": "tasmans-psychiatry",
  "Translational Psychiatry": "translational-psychiatry",
  "Trends in Psychiatry and Psychotherapy":
    "trends-in-psychiatry-and-psychotherapy",
};

function coverFile(journal: string): string | undefined {
  if (EXACT[journal]) return EXACT[journal];
  if (journal === "The Lancet" || journal.startsWith("The Lancet ")) {
    return "lancet";
  }
  if (journal.startsWith("BMC ") || BMC_TITLES.has(journal)) return "bmc";
  if (journal.startsWith("Frontiers in ")) return "frontiers";
  if (journal.startsWith("Cambridge Prisms")) return "cambridge-prisms";
  return undefined;
}

/** The venue's cover URL, or `undefined` when the Center has no image of it. */
export function journalCover(journal: string): string | undefined {
  const file = coverFile(journal);
  return file && `${PATH}/${file}.jpg`;
}
