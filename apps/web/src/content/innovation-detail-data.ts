/**
 * Innovation detail records for the GW Center for Global Mental Health.
 *
 * The shape they are written against (`InnovationDetail`) lives in
 * `@gmhlab/blocks`, which documents why the model looks the way it does.
 *
 * ## Provenance
 *
 * The EQUIP record is transcribed from the Center's EQUIP platform page (the
 * `gw-innovation-detail-wireframe.html` mock rebuilt in this repo). Stats,
 * process stages, components and deployment sites come from that source.
 *
 * The publication list is the one thing that is **not** transcribed. It holds
 * slugs into `PUBLICATIONS` (`./publications-data`), so the evidence section
 * renders real journals, DOIs and citation counts. The three citations that
 * were previously hardcoded had all silently drifted from the records they
 * duplicated — every title abbreviated, and `"Frontiers"` (a publisher) given
 * as a journal. Referencing them fixes that permanently.
 *
 * The `href`s below are placeholders (`#`) except where a real route exists.
 */

import type { InnovationDetail } from "@gmhlab/blocks";

export const EQUIP_DETAIL: InnovationDetail = {
  slug: "equip",
  name: "EQUIP Platform",
  expandedName: "Ensuring Quality in Psychological Support",
  badges: [
    { label: "WHO/UNICEF Partnership", tone: "info" },
    { label: "Active", tone: "success" },
  ],
  summary:
    "EQUIP is a competency-based training and supervision system designed to ensure non-specialist providers can deliver high-quality psychological interventions. Developed in partnership with WHO and UNICEF, EQUIP standardizes how we assess, train, and support mental health workers in low-resource settings worldwide.",
  actions: [
    { label: "Request Training →", href: "#" },
    { label: "Download Toolkit", href: "#", variant: "outline" },
  ],
  visualCaption: "[ Platform Screenshot / Demo Video ]",
  stats: [
    { value: "25+", label: "Countries" },
    { value: "5K+", label: "Providers" },
    { value: "12", label: "Publications" },
  ],

  processNote:
    "EQUIP uses a four-stage cycle to build and maintain provider competency",
  process: [
    {
      heading: "Baseline Assessment",
      body: "Evaluate provider skills using standardized role-play scenarios and competency rubrics",
    },
    {
      heading: "Targeted Training",
      body: "Deliver focused skill-building based on identified competency gaps",
    },
    {
      heading: "Supervised Practice",
      body: "Support providers during real-world delivery with structured supervision",
    },
    {
      heading: "Ongoing Evaluation",
      body: "Continuously monitor competency and provide feedback for improvement",
    },
  ],

  componentsNote: "The EQUIP system includes three integrated components",
  components: [
    {
      icon: "📋",
      heading: "Competency Assessment Tools",
      body: "Standardized rubrics and rating scales for evaluating counselor performance across key therapeutic competencies like empathy, collaboration, and behavioral activation techniques.",
    },
    {
      icon: "🎓",
      heading: "Training Curriculum",
      body: "Modular training materials adaptable to different interventions (PM+, IPT, behavioral activation) and cultural contexts. Includes facilitator guides and participant workbooks.",
    },
    {
      icon: "👥",
      heading: "Supervision Framework",
      body: "Structured supervision protocols for ongoing support, including group supervision models and individual feedback mechanisms for continuous quality improvement.",
    },
  ],

  sitesNote:
    "EQUIP has been implemented across 25+ countries in partnership with local organizations",
  mapCaption: "[ Interactive Map Showing Implementation Sites ]",
  sitesListHeading: "Active Implementation Sites",
  sites: [
    { flag: "🇳🇵", name: "Nepal", partner: "TPO Nepal" },
    { flag: "🇺🇬", name: "Uganda", partner: "Makerere University" },
    { flag: "🇵🇰", name: "Pakistan", partner: "Shifa Tameer-e-Millat" },
    { flag: "🇱🇷", name: "Liberia", partner: "Carter Center" },
    { flag: "🇪🇹", name: "Ethiopia", partner: "Addis Ababa University" },
    { flag: "🇿🇦", name: "South Africa", partner: "Wits Health" },
  ],

  publicationsNote:
    "Peer-reviewed publications documenting EQUIP's development and effectiveness",
  publications: [
    {
      slug: "competency-based-training-and-supervision-development-of-the-who-unice",
      note: "Platform description",
    },
    {
      slug: "perspectives-on-competency-based-feedback-for-training-non-specialists",
      note: "Multi-site qualitative study",
    },
    {
      slug: "integrating-equip-competency-based-training-into-a-university-curricul",
      note: "Curriculum integration",
    },
  ],

  relatedNote: "Research initiatives that use or build upon the EQUIP platform",
  related: [
    {
      heading: "EQUIP-SU",
      body: "Extends EQUIP to include service users (people with lived experience) in competency assessment and training.",
    },
    {
      heading: "RESHAPE",
      body: "Uses EQUIP methodology to train healthcare providers in stigma reduction interventions.",
      href: "/projects/reshape",
    },
    {
      heading: "RESTORE",
      body: "World Bank-funded project using EQUIP to evaluate Self-Help Plus (SH+) delivery quality.",
    },
  ],

  cta: {
    heading: "Implement EQUIP in Your Setting",
    body: "We provide training, consultation, and implementation support for organizations looking to use EQUIP to improve mental health service quality.",
    actions: [
      { label: "Request Training", href: "#", variant: "secondary" },
      { label: "Contact Us", href: "#", variant: "outline" },
    ],
  },
};

/** Every innovation with a detail record, keyed by slug. */
export const INNOVATION_DETAILS: Record<string, InnovationDetail> = {
  [EQUIP_DETAIL.slug]: EQUIP_DETAIL,
};

/** Slugs with a detail page, so index cards link only where a route exists. */
export const INNOVATION_DETAIL_SLUGS = Object.keys(INNOVATION_DETAILS);

export function getInnovationDetail(
  slug: string,
): InnovationDetail | undefined {
  return INNOVATION_DETAILS[slug];
}
