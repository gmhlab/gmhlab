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
 * The live site only covers 13 venues, so on 2026-10-28 every other venue with
 * two or more works got its own image, from the publisher's cover CDN where
 * one answers (Elsevier, Springer, Cambridge) and otherwise from the masthead
 * PubMed Central shows for the journal (MDPI's own logo for IJERPH). Sources
 * and edits are in `apps/web/assets/publication-covers/README.md`. JAMA's
 * titles share the JAMA Network mark, the way PMC itself shows them.
 *
 * Venues with no image here get the block's book glyph. Before leaving a
 * venue on it, look for a real cover: that is how most of these were found.
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
  "Academic Psychiatry": "academic-psychiatry",
  "American Journal of Public Health": "american-journal-of-public-health",
  "BJPsych Open": "bjpsych-open",
  "BMJ Global Health": "bmj-global-health",
  "BMJ Mental Health": "bmj-mental-health",
  "BMJ Open": "bmj-open",
  "Behaviour Research and Therapy": "behaviour-research-and-therapy",
  "Biological Psychiatry": "biological-psychiatry",
  "Brain Behavior & Immunity - Health": "brain-behavior-and-immunity-health",
  "Brain Behavior and Immunity": "brain-behavior-and-immunity",
  "Brazilian Journal of Psychiatry": "brazilian-journal-of-psychiatry",
  "Clinical Psychology in Europe": "clinical-psychology-in-europe",
  "Community Mental Health Journal": "community-mental-health-journal",
  "Culture Medicine and Psychiatry": "culture-medicine-and-psychiatry",
  "Epidemiology and Psychiatric Sciences":
    "epidemiology-and-psychiatric-sciences",
  "European Child & Adolescent Psychiatry":
    "european-child-and-adolescent-psychiatry",
  "International Journal of Environmental Research and Public Health":
    "ijerph",
  "JMIR Research Protocols": "jmir-research-protocols",
  "JAACAP Open": "jaacap",
  "Journal of Adolescent Health": "journal-of-adolescent-health",
  "Journal of Affective Disorders": "journal-of-affective-disorders",
  "Journal of Psychiatric Research": "journal-of-psychiatric-research",
  "Journal of the American Academy of Child & Adolescent Psychiatry": "jaacap",
  "PLOS Global Public Health": "plos-global-public-health",
  "PLOS mental health.": "plos-mental-health",
  "PLoS Medicine": "plos-medicine",
  "PLoS ONE": "plos-one",
  "Psychoneuroendocrinology": "psychoneuroendocrinology",
  "SSM - Mental Health": "ssm-mental-health",
  "Social Science & Medicine": "social-science-and-medicine",
  "Scientific Reports": "scientific-reports",
  "Tasman’s Psychiatry": "tasmans-psychiatry",
  "The British Journal of Psychiatry": "british-journal-of-psychiatry",
  "Translational Psychiatry": "translational-psychiatry",
  "Trends in Psychiatry and Psychotherapy":
    "trends-in-psychiatry-and-psychotherapy",
  "World Psychiatry": "world-psychiatry",
};

function coverFile(journal: string): string | undefined {
  if (EXACT[journal]) return EXACT[journal];
  if (journal === "The Lancet" || journal.startsWith("The Lancet ")) {
    return "lancet";
  }
  if (journal.startsWith("BMC ") || BMC_TITLES.has(journal)) return "bmc";
  if (journal.startsWith("Frontiers in ")) return "frontiers";
  if (journal.startsWith("Cambridge Prisms")) return "cambridge-prisms";
  if (journal.startsWith("JAMA ")) return "jama-network";
  return undefined;
}

/** The venue's cover URL, or `undefined` when there is no image of it. */
export function journalCover(journal: string): string | undefined {
  const file = coverFile(journal);
  return file && `${PATH}/${file}.jpg`;
}
