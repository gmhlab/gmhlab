/**
 * A synthetic corpus for the `@gmhlab/blocks` page blocks.
 *
 * The page blocks (`ProjectsPage`, `PublicationsPage`, `InnovationsPage` and
 * the two detail pages) are **record-driven renderers**: they take their
 * records as props and name no organization. `apps/web` feeds them the GW
 * Center's real content; this file feeds them an invented one, which is the
 * point — if a block could not render this corpus, it would not be a library
 * component.
 *
 * Everything below is fiction. The institute, the studies, the journals, the
 * DOIs and the people do not exist. It is sized to exercise the blocks rather
 * than to look full: every facet has at least two populated options and at
 * least one option that empties the list, so the faceted-count convention
 * (counts computed against the *other* active facets, zero-count options
 * `disabled`) is visible rather than asserted.
 *
 * Keep the cross-references intact when editing:
 *   - `ProjectDetail.relatedSlugs` index `PROJECTS` by `slug`
 *   - `ProjectDetail.publications[].slug` and `InnovationDetail.publications[].slug`
 *     index `PUBLICATIONS` by `slug`
 * Both resolve at render time and fail soft — a typo shortens a list instead of
 * breaking a row, so a broken reference here is silent.
 */

import type {
  Innovation,
  InnovationDetail,
  Project,
  ProjectDetail,
  ProjectRegion,
  Publication,
  PublicationTheme,
} from "@gmhlab/blocks";

/** Deterministic placeholder imagery — the hero variants require a `src`. */
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PROJECTS_HERO_IMAGE = img("gmhlab-projects", 1600, 900);
export const PUBLICATIONS_HERO_IMAGE = img("gmhlab-publications", 1600, 900);
export const INNOVATIONS_HERO_IMAGE = img("gmhlab-innovations", 1600, 900);

/* -- Projects ------------------------------------------------------------- */

export const PROJECT_PARTNERS = [
  "Meridian Institute",
  "Northgate Foundation",
  "Cassava Trust",
  "Delta Health Authority",
  "Open Evidence Fund",
];

/** Facet order. The block renders these as chips in exactly this order. */
export const PROJECT_REGIONS: ProjectRegion[] = [
  "Global",
  "Sub-Saharan Africa",
  "South Asia",
  "Latin America",
  "North America",
];

export const FEATURED_SLUG = "harbour";

export const PROJECTS: Project[] = [
  {
    slug: "harbour",
    name: "HARBOUR",
    tagline: "Stepped-care counselling in coastal primary care",
    summary:
      "A cluster-randomized trial testing whether a two-step counselling package delivered by primary-care nurses improves twelve-month recovery over enhanced usual care, across eighteen coastal clinics.",
    status: "active",
    design: "Cluster-randomized controlled trial",
    method: "Stepped-care counselling",
    funder: "Northgate Foundation",
    locations: ["Fictional Republic of Vantu", "Karsa Province"],
    regions: ["Sub-Saharan Africa"],
    publications: 4,
  },
  {
    slug: "lantern",
    name: "LANTERN",
    tagline: "Adolescent group support in secondary schools",
    summary:
      "A pragmatic trial of a peer-facilitated group programme for adolescents, run inside the school day and evaluated against a waitlist on symptom, attendance and retention outcomes.",
    status: "active",
    design: "Pragmatic randomized trial",
    method: "Peer-facilitated group support",
    funder: "Cassava Trust",
    locations: ["Meridian City"],
    regions: ["South Asia"],
    buildsOn: "HARBOUR",
    publications: 2,
  },
  {
    slug: "compass",
    name: "COMPASS",
    tagline: "Measuring counselling competency across four languages",
    summary:
      "A measurement-validation study establishing whether a structured competency rating scale performs equivalently once translated, and what training dose moves a rater from novice to reliable.",
    status: "ongoing",
    design: "Measurement validation",
    funder: "Open Evidence Fund",
    locations: ["Vantu", "Meridian", "Puerto Alba"],
    regions: ["Global"],
    publications: 5,
  },
  {
    slug: "riverbend",
    name: "RIVERBEND",
    tagline: "Perinatal support delivered by community health workers",
    summary:
      "A stepped-wedge evaluation of a perinatal support package added to routine antenatal visits, measuring maternal outcomes at six and twelve months postpartum.",
    status: "ongoing",
    design: "Stepped-wedge trial",
    method: "Community health worker home visits",
    funder: "Delta Health Authority",
    locations: ["Puerto Alba"],
    regions: ["Latin America"],
    buildsOn: "HARBOUR",
    publications: 3,
  },
  {
    slug: "quarry",
    name: "QUARRY",
    tagline: "Reducing stigma in workplace health services",
    summary:
      "A closed pilot testing whether contact-based sessions with people who have used services shift the attitudes of occupational health staff, and whether that shift survives six months.",
    status: "closed",
    design: "Pilot study",
    method: "Contact-based education",
    locations: ["Northgate"],
    regions: ["North America"],
    publications: 2,
  },
  {
    slug: "atlas",
    name: "ATLAS",
    tagline: "A shared training platform for the collaborative's studies",
    summary:
      "Not a study but the vehicle several of them run on: a hosted curriculum, rater-certification workflow and reporting layer used by the collaborative's trials.",
    status: "ongoing",
    design: "Platform",
    publications: 1,
  },
];

/** Only these have a detail record; a related card links only when the slug is here. */
export const PROJECT_DETAIL_SLUGS = ["harbour"];

/* -- Publications --------------------------------------------------------- */

/** Facet order for the theme chips. */
export const PUBLICATION_THEMES: PublicationTheme[] = [
  "Training & competency",
  "Adolescent & child",
  "Stigma & discrimination",
  "Measurement & validation",
  "Maternal & perinatal",
  "Care delivery & systems",
];

export const PUBLICATIONS: Publication[] = [
  {
    slug: "harbour-trial-protocol-stepped-care-counselling-in-coastal-primary",
    title:
      "HARBOUR trial protocol: stepped-care counselling in coastal primary care",
    authors: ["Adeyemi F", "Okonkwo B", "Vance R", "Serrano L"],
    authorCount: 9,
    journal: "Journal of Invented Trials",
    date: "2025-11-04",
    year: 2025,
    doi: "https://doi.org/10.0000/invented.2025.1104",
    citations: 6,
    openAccess: true,
    kind: "Article",
    center: true,
    projects: ["HARBOUR"],
    summary:
      "The registered protocol: eighteen clusters, a two-step counselling package, and a twelve-month primary endpoint.",
    theme: "Care delivery & systems",
  },
  {
    slug: "competency-rating-across-four-languages-a-validation-study",
    title: "Competency rating across four languages: a validation study",
    authors: ["Serrano L", "Adeyemi F", "Idris M"],
    authorCount: 6,
    journal: "Measurement in Health Services",
    date: "2025-06-18",
    year: 2025,
    doi: "https://doi.org/10.0000/invented.2025.0618",
    citations: 24,
    openAccess: true,
    kind: "Article",
    center: true,
    projects: ["COMPASS", "HARBOUR"],
    summary:
      "Establishes measurement invariance for the rating scale and reports the training dose at which raters become reliable.",
    theme: "Measurement & validation",
  },
  {
    slug: "what-training-dose-produces-a-reliable-rater-a-systematic-review",
    title: "What training dose produces a reliable rater? A systematic review",
    authors: ["Idris M", "Vance R"],
    authorCount: 4,
    journal: "Review of Applied Practice",
    date: "2024-09-30",
    year: 2024,
    doi: "https://doi.org/10.0000/invented.2024.0930",
    citations: 41,
    openAccess: false,
    kind: "Review",
    center: false,
    theme: "Training & competency",
  },
  {
    slug: "peer-facilitated-group-support-in-schools-twelve-month-outcomes",
    title: "Peer-facilitated group support in schools: twelve-month outcomes",
    authors: ["Okonkwo B", "Nakamura H", "Serrano L", "Adeyemi F", "Vance R"],
    authorCount: 11,
    journal: "Adolescent Health Reports",
    date: "2024-04-12",
    year: 2024,
    doi: "https://doi.org/10.0000/invented.2024.0412",
    citations: 58,
    openAccess: true,
    kind: "Article",
    center: true,
    projects: ["LANTERN"],
    summary:
      "Primary outcomes for the school programme, including the attendance effect that was not hypothesised.",
    theme: "Adolescent & child",
  },
  {
    slug: "contact-based-education-and-occupational-health-staff-a-pilot",
    title: "Contact-based education and occupational health staff: a pilot",
    authors: ["Vance R", "Idris M"],
    authorCount: 3,
    journal: "Occupational Health Letters",
    date: "2023-10-02",
    year: 2023,
    doi: "https://doi.org/10.0000/invented.2023.1002",
    citations: 12,
    openAccess: false,
    kind: "Article",
    center: true,
    projects: ["QUARRY"],
    summary: "The pilot that closed: attitude shift at three months, attenuated by six.",
    theme: "Stigma & discrimination",
  },
  {
    slug: "perinatal-home-visiting-as-an-addition-to-routine-antenatal-care",
    title: "Perinatal home visiting as an addition to routine antenatal care",
    authors: ["Nakamura H", "Serrano L", "Okonkwo B"],
    authorCount: 7,
    journal: "Maternal Services Quarterly",
    date: "2023-03-21",
    year: 2023,
    doi: "https://doi.org/10.0000/invented.2023.0321",
    citations: 33,
    openAccess: true,
    kind: "Article",
    center: true,
    projects: ["RIVERBEND"],
    summary: "Six-month maternal outcomes from the stepped-wedge evaluation.",
    theme: "Maternal & perinatal",
  },
  {
    slug: "supervision-at-scale-a-chapter-on-platform-supported-training",
    title: "Supervision at scale: a chapter on platform-supported training",
    authors: ["Adeyemi F"],
    authorCount: 2,
    journal: "Handbook of Invented Practice",
    date: "2022-08-15",
    year: 2022,
    citations: 9,
    openAccess: false,
    kind: "Chapter",
    center: false,
    theme: "Training & competency",
  },
  {
    slug: "the-competency-gap-nobody-measures",
    title: "The competency gap nobody measures",
    authors: ["Serrano L", "Adeyemi F"],
    authorCount: 2,
    journal: "Journal of Invented Trials",
    date: "2022-01-19",
    year: 2022,
    doi: "https://doi.org/10.0000/invented.2022.0119",
    citations: 77,
    openAccess: true,
    kind: "Editorial",
    center: false,
    theme: "Training & competency",
  },
];

/* -- Innovations ---------------------------------------------------------- */

export const INNOVATION_PARTNERS = [
  "Meridian Institute",
  "Northgate Foundation",
  "Delta Health Authority",
];

export const INNOVATIONS: Innovation[] = [
  {
    slug: "atlas",
    icon: "🧭",
    status: "Multi-site deployment",
    statusTone: "success",
    heading: "ATLAS Platform",
    body: "The hosted curriculum, rater-certification workflow and reporting layer the collaborative's trials run their training on.",
    reach: "9 countries",
    publications: "5 publications",
  },
  {
    slug: "compass-scale",
    icon: "📐",
    status: "Validated in four languages",
    statusTone: "info",
    heading: "COMPASS Rating Scale",
    body: "A structured competency scale for counselling sessions, with a translation protocol and a published reliability threshold.",
    reach: "4 languages",
    publications: "3 publications",
  },
  {
    slug: "harbour-toolkit",
    icon: "🧰",
    status: "In field testing",
    statusTone: "warning",
    heading: "HARBOUR Toolkit",
    body: "The session guides, supervision checklists and fidelity forms the stepped-care package is delivered from.",
    reach: "18 clinics",
    publications: "2 publications",
  },
];

export const INNOVATION_DETAIL_SLUGS = ["atlas"];

/* -- Project detail ------------------------------------------------------- */

/**
 * Exercises every optional section of `ProjectDetail`. A record that omits a
 * section renders no heading for it — `apps/web`'s own records are sparser
 * than this one, which is the behaviour worth seeing here.
 */
export const HARBOUR_DETAIL: ProjectDetail = {
  slug: "harbour",
  name: "HARBOUR",
  expandedName:
    "Harbour: Adding Recovery-oriented Brief Counselling to Usual Routine care",
  tagline: "Stepped-care counselling in coastal primary care",
  status: "active",
  statusLabel: "Active enrollment",
  lede: "HARBOUR asks whether primary-care nurses, given two days of training and weekly group supervision, can deliver a two-step counselling package that beats enhanced usual care at twelve months — and whether the effect survives once the trial team stops visiting.",
  facts: [
    { term: "Design", detail: "Cluster-randomized controlled trial" },
    { term: "Registration", detail: "INVENTED-2025-0114" },
    { term: "Funder", detail: "Northgate Foundation" },
    { term: "Setting", detail: "18 coastal primary-care clinics, Karsa Province" },
    { term: "Duration", detail: "2025 – 2028" },
  ],
  figures: [
    { value: "18", label: "Clinics randomized", note: "9 per arm" },
    { value: "1,440", label: "Participants", note: "Target enrollment" },
    { value: "12", label: "Months of follow-up", note: "Primary endpoint" },
    { value: "120", label: "Nurses trained", note: "Intervention arm only" },
  ],
  rationale: [
    "Brief counselling works in trials and rarely survives contact with a real clinic. The usual explanation is training: a two-day workshop produces people who can describe the method and cannot deliver it, and nobody measures the difference until the outcomes come back flat.",
    "HARBOUR treats delivery quality as the thing under test rather than an assumption. Every session is rated on the COMPASS scale, supervision is dosed rather than offered, and the trial reports competency alongside outcome so a null result can be read as either the package failing or the delivery failing.",
  ],
  arms: [
    {
      name: "Stepped-care counselling",
      abbr: "SCC",
      body: "Three structured sessions delivered by a trained clinic nurse, stepping up to six sessions with supervisor review for participants who do not respond by week four.",
      isIntervention: true,
    },
    {
      name: "Enhanced usual care",
      abbr: "EUC",
      body: "Routine clinic care plus a printed self-help guide and a single orientation call — the ceiling of what these clinics can offer today.",
    },
  ],
  strategy: {
    heading: "How delivery quality is held up",
    body: [
      "The implementation strategy is deliberately small enough to be copied by a clinic that has no trial attached to it. Each element below is something a district health office could fund on its own.",
    ],
    elements: [
      {
        term: "Certification, not attendance",
        body: "A nurse delivers unsupervised only after two consecutive rated sessions clear the COMPASS reliability threshold.",
      },
      {
        term: "Weekly group supervision",
        body: "Ninety minutes, six to eight nurses, one recorded session reviewed against the fidelity checklist.",
      },
      {
        term: "Fidelity sampling",
        body: "One session in ten is rated by a second rater blind to arm, which is what makes the competency data interpretable.",
      },
    ],
  },
  objectives: [
    {
      rank: "primary",
      title:
        "Does stepped-care counselling improve recovery at twelve months over enhanced usual care?",
      measures: [
        {
          abbr: "IRS-20",
          name: "Invented Recovery Scale",
          detail: "Self-reported, 20 items, administered at every timepoint.",
        },
      ],
    },
    {
      rank: "secondary",
      title: "Is the effect explained by delivery competency rather than dose?",
      note: "Pre-specified mediation analysis; the trial is not powered to detect a small mediated effect.",
      measures: [
        { abbr: "COMPASS", name: "Counselling competency rating scale" },
        { name: "Session count", detail: "From the clinic register, not self-report." },
      ],
    },
    {
      rank: "secondary",
      title: "What does the package cost per participant to run without a trial team?",
      measures: [
        { name: "Micro-costing questionnaire", detail: "Clinic-level, quarterly." },
      ],
    },
  ],
  hypotheses: [
    "Participants in the SCC arm will show a greater twelve-month improvement in IRS-20 than those in the EUC arm.",
    "The between-arm difference will be larger in clinics whose nurses cleared certification on the first attempt.",
  ],
  tracks: [
    {
      id: "participants",
      label: "Participants",
      population: "Adults attending a study clinic who screen positive and consent.",
    },
    {
      id: "nurses",
      label: "Nurses",
      population: "Primary-care nurses at the nine intervention clinics.",
    },
  ],
  timeline: [
    {
      kind: "point",
      track: "nurses",
      code: "N0",
      when: "Month 0",
      title: "Baseline competency rating",
      detail: "Two role-played sessions rated before any training.",
    },
    {
      kind: "phase",
      track: "nurses",
      when: "Months 0 – 2",
      title: "Training and certification",
      detail: "Two-day workshop, then rated sessions until the threshold clears.",
    },
    {
      kind: "point",
      track: "participants",
      code: "T0",
      when: "Month 2",
      title: "Enrollment and baseline",
      cohorts: ["Both arms"],
    },
    {
      kind: "point",
      track: "nurses",
      code: "N1",
      when: "Month 3",
      title: "Post-certification rating",
      detail: "Live session, blind second rater.",
    },
    {
      kind: "phase",
      track: "participants",
      when: "Months 2 – 8",
      title: "Delivery window",
      detail: "Three sessions, stepping to six for non-responders at week four.",
    },
    {
      kind: "point",
      track: "participants",
      code: "T1",
      when: "Month 8",
      title: "Post-intervention assessment",
      cohorts: ["Both arms", "Non-responder subgroup"],
    },
    {
      kind: "point",
      track: "nurses",
      code: "N2",
      when: "Month 10",
      title: "Sustainment rating",
      detail: "After supervision steps down to monthly.",
    },
    {
      kind: "point",
      track: "participants",
      code: "T2",
      when: "Month 14",
      title: "Twelve-month primary endpoint",
      cohorts: ["Both arms"],
    },
  ],
  eligibility: [
    {
      group: "Participants — included",
      criteria: [
        "Aged 18 or over",
        "Attending a study clinic for any reason",
        "Screens positive on the two-item clinic screener",
        "Able to consent in Karsa or the national language",
      ],
    },
    {
      group: "Participants — excluded",
      criteria: [
        "Currently receiving counselling elsewhere",
        "Acute risk requiring same-day referral",
        "Planning to move out of the province within twelve months",
      ],
    },
    {
      group: "Nurses — included",
      criteria: [
        "Employed at an intervention clinic at randomization",
        "Expected to remain in post for at least twelve months",
      ],
    },
  ],
  publications: [
    {
      slug: "harbour-trial-protocol-stepped-care-counselling-in-coastal-primary",
      note: "Trial protocol",
    },
    {
      slug: "competency-rating-across-four-languages-a-validation-study",
      note: "The rating scale used for the mediation analysis",
    },
    { slug: "the-competency-gap-nobody-measures", note: "The argument the trial tests" },
    { slug: "not-a-real-slug", note: "Deliberately unresolvable — this row is dropped" },
  ],
  partners: [
    "Meridian Institute",
    "Karsa Provincial Health Office",
    "Northgate Foundation",
    "Open Evidence Fund",
  ],
  resources: [
    { label: "Trial protocol (PDF)", href: "#", kind: "document" },
    { label: "Statistical analysis plan (PDF)", href: "#", kind: "document" },
    { label: "Registration record", href: "#", kind: "site" },
  ],
  contact: {
    name: "Dr Femi Adeyemi",
    role: "Principal investigator",
    email: "harbour@example.invalid",
  },
  relatedSlugs: ["lantern", "compass", "riverbend", "atlas"],
};

/* -- Innovation detail ---------------------------------------------------- */

export const ATLAS_DETAIL: InnovationDetail = {
  slug: "atlas",
  name: "ATLAS Platform",
  expandedName: "Adaptive Training, Learning And Supervision",
  badges: [
    { label: "Multi-site deployment", tone: "success" },
    { label: "Open licence", tone: "info" },
  ],
  summary:
    "ATLAS is the training infrastructure the collaborative's trials share: a curriculum host, a rater-certification workflow, and a reporting layer that tells a supervisor which of their nurses is drifting before the outcome data does.",
  actions: [
    { label: "Request a demo", href: "#" },
    { label: "Read the documentation", href: "#", variant: "secondary" },
  ],
  visualCaption: "Platform screenshot — supervisor dashboard",
  stats: [
    { value: "9", label: "Countries" },
    { value: "1,200+", label: "Providers certified" },
    { value: "4", label: "Languages" },
    { value: "5", label: "Publications" },
  ],
  process: [
    {
      heading: "Adopt a curriculum",
      body: "Start from a published curriculum or upload your own; the platform only requires that sessions map to rateable competencies.",
    },
    {
      heading: "Train and rate",
      body: "Trainees submit recorded or live-rated sessions. Ratings use the COMPASS scale by default.",
    },
    {
      heading: "Certify against a threshold",
      body: "Certification is a score, not an attendance record — the threshold is configurable and the default is the published one.",
    },
    {
      heading: "Supervise on the data",
      body: "Supervisors see per-item drift across their cohort, which is what turns weekly supervision from a meeting into a decision.",
    },
  ],
  processNote:
    "The cycle repeats: sustainment ratings feed the same dashboard as certification ratings.",
  components: [
    {
      icon: "📚",
      heading: "Curriculum host",
      body: "Versioned session guides, translations, and the fidelity forms that go with them.",
    },
    {
      icon: "📐",
      heading: "Rating workflow",
      body: "Assignment, blinding, second-rater sampling and inter-rater agreement, out of the box.",
    },
    {
      icon: "📊",
      heading: "Supervisor dashboard",
      body: "Per-item competency drift by cohort, with the reliability threshold drawn on the chart.",
    },
    {
      icon: "🔌",
      heading: "Export layer",
      body: "A flat export per study, so trial statisticians never work out of the platform's own database.",
    },
  ],
  componentsNote: "Each part is usable alone; most sites start with the rating workflow.",
  sites: [
    { flag: "🏳️", name: "Vantu", partner: "Karsa Provincial Health Office" },
    { flag: "🏳️", name: "Meridian", partner: "Meridian Institute" },
    { flag: "🏳️", name: "Puerto Alba", partner: "Delta Health Authority" },
    { flag: "🏳️", name: "Northgate", partner: "Northgate Foundation" },
  ],
  sitesNote:
    "Deployments run the platform themselves; the collaborative holds no participant data.",
  mapCaption: "Deployment map — four active sites",
  sitesListHeading: "Active deployments",
  publications: [
    {
      slug: "competency-rating-across-four-languages-a-validation-study",
      note: "The scale the platform certifies against",
    },
    {
      slug: "what-training-dose-produces-a-reliable-rater-a-systematic-review",
      note: "Where the default threshold comes from",
    },
    {
      slug: "supervision-at-scale-a-chapter-on-platform-supported-training",
      note: "Design rationale",
    },
  ],
  publicationsNote:
    "Resolved from the bibliography at render time — the journal, DOI and citation counts below are the records', not this page's.",
  related: [
    {
      heading: "HARBOUR",
      body: "Runs its nurse certification and fidelity sampling on ATLAS.",
      href: "/blocks/projects/harbour",
    },
    {
      heading: "COMPASS",
      body: "The validation study that produced the platform's default rating scale.",
    },
    {
      heading: "Regional training network",
      body: "A non-portfolio collaboration; related entries are free text for exactly this case.",
    },
  ],
  relatedNote: "A related entry links only when it has somewhere to go.",
  cta: {
    heading: "Deploy ATLAS",
    body: "The platform is open-licensed and self-hosted. Deployments usually start with a single cohort and one supervisor.",
    actions: [
      { label: "Start a deployment", href: "#" },
      { label: "Talk to the team", href: "#", variant: "secondary" },
    ],
  },
};


/* -- Detail lookups ------------------------------------------------------- */

/**
 * The detail records by slug, for the docs app's `:slug` routes.
 *
 * `ProjectsPage` has no `detailSlugs` prop — every card links — so five of the
 * six project slugs resolve to nothing here. The demo route says so rather than
 * rendering HARBOUR under another project's name, which is the same gap
 * `detailSlugs` exists to close on the pages that do have it.
 */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  [HARBOUR_DETAIL.slug]: HARBOUR_DETAIL,
};

export const INNOVATION_DETAILS: Record<string, InnovationDetail> = {
  [ATLAS_DETAIL.slug]: ATLAS_DETAIL,
};
