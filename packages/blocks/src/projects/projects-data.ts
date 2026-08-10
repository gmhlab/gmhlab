/**
 * The GW Center for Global Mental Health project portfolio.
 *
 * Every field here is taken from the Center's own project pages — the status
 * line, the abstract, the named funder, the countries the abstract names, and
 * the publication list. Nothing is invented: where a page does not name a
 * funder (ALIVE, EQUIP-SU, SCAPE-U) or a country (EQUIP-SU), the field is
 * simply absent and the card omits that row rather than guessing.
 *
 * Three fields go beyond what the source index shows, and each is derived from
 * the project pages rather than authored:
 *
 *   - `regions` groups the named countries so the portfolio can be filtered
 *     geographically, which the source page cannot do.
 *   - `method` is the named intervention the project delivers. It surfaces
 *     that Problem Management Plus runs through two projects and photo
 *     narrative stigma reduction through two more — invisible on the source
 *     index, where every project is an unrelated tile.
 *   - `buildsOn` records that a project lists EQUIP in its own Resources
 *     panel, which is how the portfolio's shared spine becomes visible.
 *
 * `slug` rather than a full URL: the page builds hrefs from a `basePath` prop
 * so the block is portable across the site that hosts it.
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

/** The platform the portfolio's other work hangs off; featured on its own. */
export const FEATURED_SLUG = "equip";

export const PROJECTS: Project[] = [
  {
    slug: "alive",
    name: "ALIVE",
    tagline: "Improving Adolescent Mental Health by Reducing the Impact of Poverty",
    summary:
      "Develops and pilot-tests an intervention that equips adolescents with the skills to deal with the difficulties of living in poverty and strengthens self-regulation, to prevent depression and anxiety in urban settings.",
    status: "closed",
    design: "Prevention trial",
    locations: ["Colombia", "Nepal", "South Africa"],
    regions: ["Latin America", "South Asia", "Sub-Saharan Africa"],
    publications: 3,
  },
  {
    slug: "equip",
    name: "EQUIP",
    tagline: "Ensuring Quality in Psychosocial and Mental Healthcare",
    summary:
      "A worldwide platform that improves the quality and consistency of mental health training, supervision, and service delivery among specialists and non-specialists alike. Offers competency assessment tools, foundational helping-skills resources, and e-learning courses.",
    status: "ongoing",
    design: "Global platform",
    method: "Competency-based training & supervision",
    funder: "WHO · UNICEF",
    locations: ["Worldwide"],
    regions: ["Global"],
    publications: 3,
  },
  {
    slug: "recoup-ny",
    name: "RECOUP-NY",
    tagline: "Community-Based Psychological Services in NYC",
    summary:
      "Evaluates the efficacy and implementation of Problem Management Plus — a task-sharing intervention for mild-to-moderate distress — as delivered by community workers in New York City community-based organizations.",
    status: "active",
    design: "R01 cluster-randomized trial",
    method: "Problem Management Plus",
    locations: ["United States"],
    regions: ["North America"],
    buildsOn: "EQUIP",
    publications: 2,
  },
  {
    slug: "unicef-mmapp",
    name: "UNICEF-MMAPP",
    tagline: "Measuring Mental Health Among Adolescents and Young People",
    summary:
      "A multi-organization research project developing a transculturally adapted, validated measure of adolescent anxiety and depression for low- and middle-income country settings.",
    status: "ongoing",
    design: "Measurement validation",
    funder: "UNICEF",
    locations: ["Multi-country"],
    regions: ["Global"],
    publications: 3,
  },
  {
    slug: "reshape",
    name: "RESHAPE",
    tagline: "Reducing Stigma Among Healthcare Providers",
    summary:
      "Built in collaboration with people with lived experience of mental illness, RESHAPE evaluates a photo narrative-based stigma reduction intervention among Nepali primary health care workers, measuring both stigma reduction and diagnostic accuracy.",
    status: "closed",
    design: "R01 cluster-randomized trial",
    method: "Photo narrative stigma reduction",
    locations: ["Nepal"],
    regions: ["South Asia"],
    publications: 3,
  },
  {
    slug: "restore",
    name: "RESTORE",
    tagline: "Evaluating Self-Help Plus (SH+) in Senegal",
    summary:
      "Evaluates the implementation and effectiveness of Self-Help Plus (SH+), a scalable psychological intervention for individuals experiencing distress. Culturally adapts SH+ and delivers it through non-specialist providers to cash transfer beneficiaries.",
    status: "active",
    design: "Implementation study",
    method: "Self-Help Plus (SH+)",
    funder: "World Bank",
    locations: ["Senegal"],
    regions: ["Sub-Saharan Africa"],
    buildsOn: "EQUIP",
    publications: 1,
  },
  {
    slug: "standstrong",
    name: "StandStrong",
    tagline: "Sensing Technology to Personalize Adolescent Maternal Depression Treatment",
    summary:
      "Assesses a passive sensing technology-informed adaptation of Problem Management Plus, a task-sharing intervention for mild-to-moderate distress, among postpartum mothers in rural Nepal.",
    status: "active",
    design: "R33 pilot trial",
    method: "Problem Management Plus",
    locations: ["Nepal"],
    regions: ["South Asia"],
    publications: 3,
  },
  {
    slug: "idea",
    name: "IDEA",
    tagline: "Identifying Depression Early in Adolescents",
    summary:
      "Brings together researchers, clinicians, and data scientists across countries to detect depression in adolescents before symptoms become severe — often before clinical signs are evident — so that support can begin earlier.",
    status: "closed",
    design: "Risk-stratified cohort",
    funder: "MQ Mental Health Research",
    locations: ["Brazil", "Nepal"],
    regions: ["Latin America", "South Asia"],
    publications: 3,
  },
  {
    slug: "equip-su",
    name: "EQUIP-SU",
    tagline: "Ensuring Quality in Psychosocial and Mental Healthcare with Service Users",
    summary:
      "Develops a quality assessment tool that people with lived experience of mental health conditions can use to rate the services they receive, co-created with service users alongside the health system managers and policy makers who act on that feedback.",
    status: "active",
    design: "Co-created assessment tool",
    buildsOn: "EQUIP",
    publications: 1,
  },
  {
    slug: "hope",
    name: "HOPE",
    tagline: "NIHR Group on Homelessness and Mental Health in Africa",
    summary:
      "A Global Health Research Group addressing severe mental illness among people experiencing homelessness, building evidence-based strategies that can be applied across the continent in support of vulnerable communities.",
    status: "active",
    design: "Global health research group",
    funder: "NIHR",
    locations: ["Africa"],
    regions: ["Sub-Saharan Africa"],
    publications: 1,
  },
  {
    slug: "scape-u",
    name: "SCAPE-U",
    tagline: "Strengthening Care in Collaboration with People",
    summary:
      "Built in collaboration with people with lived experience of mental illness, SCAPE-U assesses a photo narrative-based stigma reduction intervention at the health facility, community, and home levels in rural Uganda.",
    status: "active",
    design: "Pilot trial",
    method: "Photo narrative stigma reduction",
    locations: ["Uganda"],
    regions: ["Sub-Saharan Africa"],
    publications: 0,
  },
];

/**
 * Funders and implementing partners named across the project pages. Rendered
 * as a plain word mark strip — the Center's logos are not ours to ship.
 */
export const PROJECT_PARTNERS = [
  "WHO",
  "UNICEF",
  "World Bank",
  "NIHR",
  "MQ Mental Health Research",
  "TPO Nepal",
  "NYC Mayor's Office of Community Mental Health",
  "ALIVE Consortium",
];

/** Region facet order. Global first, then by portfolio weight. */
export const PROJECT_REGIONS: ProjectRegion[] = [
  "Global",
  "Sub-Saharan Africa",
  "South Asia",
  "Latin America",
  "North America",
];

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
