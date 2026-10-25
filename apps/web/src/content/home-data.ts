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
 *   - The hero has no side `image`, so it draws the contours fading into the
 *     GMH mark (the designer's "Contour hero — logo backdrop"), over a
 *     placeholder `background` photo (see `./hero-images`). The research cards
 *     draw their theme's graphics-kit glyph (`PUBLICATION_THEME_GLYPHS`)
 *     rather than photographs.
 *   - The "How we work" section is the live /about page's three pillars —
 *     Areas of Research, Capacity Building, Consultation — with their bullet
 *     lists condensed, and the photo the about page sets beside each. The
 *     photos are the about page's uploads (`/public/home/`, provenance in
 *     `assets/gw-site/about/README.md`); two are Unsplash stock and one is
 *     Wix stock, so they get descriptive alt text and NO caption — the live
 *     alt text names Nepal, which nothing about the photos confirms.
 *   - There is no pull quote. The reference's quote is unattributed design
 *     copy; putting it under a GW role would invent a statement. `HomePage`
 *     renders a `quote` record when there is a real one to give it.
 */

import {
  type HomeContent,
  PUBLICATION_THEME_GLYPHS,
  type PublicationTheme,
} from "@gmhlab/blocks";
import { HOME_HERO_IMAGE } from "./hero-images";
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
  { heading: string; body: string }
> = {
  "Care delivery & systems": {
    heading: "Care delivery & systems",
    body: "How mental health care is organised, staffed and financed where specialists are scarce — and what it takes for a program to outlast its grant.",
  },
  "Adolescent & child": {
    heading: "Adolescents & children",
    body: "School- and community-based work that reaches young people early, before a first episode becomes a lifetime condition.",
  },
  "Training & competency": {
    heading: "Training & competency",
    body: "Measuring and building the skills of non-specialist helpers — the line of work behind the EQUIP platform.",
  },
  "Measurement & validation": {
    heading: "Measurement & validation",
    body: "Instruments adapted and validated across languages and cultures, so that outcomes mean the same thing at every site.",
  },
  "Stigma & discrimination": {
    heading: "Stigma & discrimination",
    body: "Interventions that change how providers and communities respond to people living with mental illness.",
  },
  "Maternal & perinatal": {
    heading: "Maternal & perinatal",
    body: "Support for mothers through pregnancy and the first year, where depression is common and care is rare.",
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
    background: HOME_HERO_IMAGE,
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
  approach: {
    eyebrow: "How we work",
    heading: "Supporting wellbeing worldwide.",
    lede: "A cross-disciplinary research collective studying whether mental health and psychosocial support reaches people in low- and middle-income countries, whether it works when it does, and whether it scales — with the people who will use it at the forefront.",
    items: [
      {
        heading: "Research",
        body: "Community-based, participatory studies of what works and how it is delivered where specialists are scarce.",
        points: [
          "Adapting and validating mental health tools and interventions",
          "Evaluating mental health provider competency",
          "Reducing mental health stigma",
          "Integrating passive sensing technology into care",
        ],
        image: {
          src: "/home/research.jpg",
          alt: "Seen from above, children and adults sit on a woven mat around a carrom board.",
        },
      },
      {
        heading: "Capacity building",
        body: "Training the people who deliver care, and the researchers who will lead the next studies.",
        points: [
          "Competency-assessment trainings on the EQUIP platform, worldwide",
          "Global mental health courses taught in LMIC settings",
          "Networking and professional development for early-career LMIC researchers",
        ],
        image: {
          src: "/home/capacity-building.jpg",
          alt: "A health worker holds hands with children dancing in a circle outdoors.",
        },
      },
      {
        heading: "Consultation",
        body: "Advising teams that are adapting tools and programs for their own settings.",
        points: [
          "Using the EQUIP platform",
          "Cultural adaptation and validation of tools in LMIC settings",
          "Involving people with lived experience in developing interventions",
        ],
        image: {
          src: "/home/consultation.jpg",
          alt: "A facilitator at a flip chart presents to colleagues seated around a table.",
        },
      },
    ],
    action: { label: "Meet the team", href: "/team" },
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
      glyph: PUBLICATION_THEME_GLYPHS[theme],
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
