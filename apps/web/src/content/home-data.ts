/**
 * The GW Center for Global Mental Health landing page.
 *
 * Provenance — read before editing:
 *
 *   - Every figure on this page is DERIVED from the other content modules, not
 *     typed in. The stat band counts `PROJECTS`, `PUBLICATIONS` and the
 *     countries the project pages name; the research cards are the four
 *     largest `theme` buckets of the bibliography, each carrying its live
 *     count; the partner wall is the `funder` field of the portfolio. Add a
 *     publication or a project and the home page follows. The reference
 *     design's own numbers ("41 active studies", "2,400+ workers trained")
 *     were placeholders and are deliberately not reproduced.
 *   - The care-gap figure is the one sourced number, and it is cited on the
 *     page: WHO's Mental Health Action Plan reports that 76–85% of people with
 *     severe mental disorders in low- and middle-income countries receive no
 *     treatment. The field lights 24 of 100 — the most generous reading of
 *     that range.
 *   - Photographs are PLACEHOLDERS (picsum, the same seeds as the reference
 *     design), shown through the duotone treatment. Their `alt` is empty on
 *     purpose: describing a scene that is not in the random image would be a
 *     false statement to a screen-reader user. Give real program photography
 *     real alt text.
 *   - There is no pull quote. The reference's quote is unattributed design
 *     copy; putting it under a GW role would invent a statement. `HomePage`
 *     renders a `quote` record when there is a real one to give it.
 */

import type { HomeContent, PublicationTheme } from "@gmhlab/blocks";
import { PROJECTS } from "./projects-data";
import { PUBLICATIONS } from "./publications-data";

/** Location labels on project pages that are not a single country. */
const NOT_A_COUNTRY = new Set(["Worldwide", "Multi-country", "Africa"]);

const COUNTRIES = new Set(
  PROJECTS.flatMap((project) => project.locations ?? []).filter(
    (location) => !NOT_A_COUNTRY.has(location),
  ),
);

const FIRST_YEAR = Math.min(...PUBLICATIONS.map((p) => p.year));
const OPEN_ACCESS_SHARE = Math.round(
  (PUBLICATIONS.filter((p) => p.openAccess).length / PUBLICATIONS.length) * 100,
);

/** Copy for each bibliography theme; the count beside it is computed. */
const THEME_COPY: Record<
  PublicationTheme,
  { heading: string; body: string; seed: string }
> = {
  "Care delivery & systems": {
    heading: "Care delivery & systems",
    body: "How mental health care is organised, staffed and financed where specialists are scarce — and what it takes for a program to outlast its grant.",
    seed: "gw-policy",
  },
  "Adolescent & child": {
    heading: "Adolescents & children",
    body: "School- and community-based work that reaches young people early, before a first episode becomes a lifetime condition.",
    seed: "gw-adolescent",
  },
  "Training & competency": {
    heading: "Training & competency",
    body: "Measuring and building the skills of non-specialist helpers — the line of work behind the EQUIP platform.",
    seed: "gw-task-sharing",
  },
  "Measurement & validation": {
    heading: "Measurement & validation",
    body: "Instruments adapted and validated across languages and cultures, so that outcomes mean the same thing at every site.",
    seed: "gw-humanitarian",
  },
  "Stigma & discrimination": {
    heading: "Stigma & discrimination",
    body: "Interventions that change how providers and communities respond to people living with mental illness.",
    seed: "gw-stigma",
  },
  "Maternal & perinatal": {
    heading: "Maternal & perinatal",
    body: "Support for mothers through pregnancy and the first year, where depression is common and care is rare.",
    seed: "gw-maternal",
  },
};

const THEME_COUNTS = Object.entries(
  PUBLICATIONS.reduce<Record<string, number>>((counts, p) => {
    counts[p.theme] = (counts[p.theme] ?? 0) + 1;
    return counts;
  }, {}),
)
  .map(([theme, count]) => ({ theme: theme as PublicationTheme, count }))
  .sort((a, b) => b.count - a.count);

/** Funder → the projects it is named on, in portfolio order. */
const FUNDERS = PROJECTS.reduce<Map<string, string[]>>((funders, project) => {
  for (const funder of project.funder?.split(" · ") ?? []) {
    funders.set(funder, [...(funders.get(funder) ?? []), project.name]);
  }
  return funders;
}, new Map());

export const HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: "GW Center for Global Mental Health",
    title: "Care that reaches the people already waiting for it.",
    emphasis: "already waiting",
    lede: "We study why effective mental health care fails to reach most of the world — and we build, test, and hand over the systems that close that distance.",
    primary: { label: "Explore our research", href: "/projects" },
    secondary: { label: "Browse publications", href: "/publications" },
    image: {
      src: "https://picsum.photos/seed/gw-community-health/1000/1250",
      alt: "",
    },
  },
  stats: [
    { value: String(PROJECTS.length), label: "Studies and platforms in the portfolio" },
    { value: String(COUNTRIES.size), label: "Countries named across active and past projects" },
    { value: String(PUBLICATIONS.length), label: `Peer-reviewed works since ${FIRST_YEAR}` },
    { value: `${OPEN_ACCESS_SHARE}%`, label: "Of those publications are open access" },
  ],
  gap: {
    eyebrow: "The problem we work on",
    heading: "Most people never get care at all.",
    body: "Across low- and middle-income countries, most people living with a severe mental disorder receive no treatment in a given year. The barrier is rarely knowledge of what works — it is delivery, workforce, and cost.",
    total: 100,
    reached: 24,
    reachedLabel: "Receives treatment",
    unreachedLabel: "Receives none",
    source:
      "Source: WHO Mental Health Action Plan — 76–85% of people with severe mental disorders in low- and middle-income countries receive no treatment. Shown at the most generous end of that range.",
  },
  focus: {
    eyebrow: "What we work on",
    heading: "Four lines of research",
    lede: `The largest themes across ${PUBLICATIONS.length} publications, counted from the bibliography itself.`,
    items: THEME_COUNTS.slice(0, 4).map(({ theme, count }) => ({
      tag: `${count} publications`,
      heading: THEME_COPY[theme].heading,
      body: THEME_COPY[theme].body,
      href: "/publications",
      linkLabel: "Read the work",
      image: {
        src: `https://picsum.photos/seed/${THEME_COPY[theme].seed}/900/560`,
        alt: "",
      },
    })),
  },
  partners: {
    eyebrow: "Who we work with",
    heading: "Funded and partnered across the portfolio",
    lede: "The organisations named on the Center's own project pages.",
    items: [...FUNDERS].map(([name, projects]) => ({
      name,
      detail: projects.join(" · "),
    })),
  },
  cta: {
    heading: "Research designed to be handed over.",
    body: "Tools like EQUIP move from a single study site to ministries and implementing organisations worldwide. See where the work is running now.",
    action: { label: "Explore the portfolio", href: "/projects" },
  },
};
