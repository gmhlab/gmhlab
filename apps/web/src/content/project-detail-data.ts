/**
 * Project detail records for the GW Center for Global Mental Health.
 *
 * The shape they are written against — `ProjectDetail` and the resolvers that
 * read it — lives in `@gmhlab/blocks`, which documents why the model looks the
 * way it does. This module is the content.
 *
 * ## Provenance
 *
 * The RESHAPE record is transcribed from the Center's own RESHAPE project
 * specification (Google Doc `1WXn0VBFaiDH0r1621TGrIpIg1865LkosrAPn6eKYxJA`,
 * read 2026-08-13), which supersedes the shorter abstract on the live
 * `/projects/reshape` page. The funder (NIMH / R01), the enrollment targets,
 * the eligibility criteria, the assessment schedule and all four objectives
 * with their instruments come from that document. Partner and resource links
 * come from the live page, which is the only source for them.
 *
 * Two things are deliberately *not* stored here:
 *
 *   - **Publications.** `publications` holds slugs into `PUBLICATIONS`
 *     (`./publications-data`), so the evidence section renders real journals,
 *     DOIs, citation counts and open-access status from the Center's actual
 *     bibliography instead of a restated list that drifts. The optional `note`
 *     records what a work *is* to this project (its trial protocol, its pilot,
 *     its primary outcomes) — a relationship the bibliography does not carry.
 *   - **Related projects.** `relatedSlugs` indexes `PROJECTS`
 *     (`./projects-data`), so a related card's name and tagline stay in step
 *     with the portfolio.
 *
 * Both resolve at render time and both fail soft: an unknown slug is skipped,
 * never rendered as a broken row.
 */

import type { ProjectDetail } from "@gmhlab/blocks";

/* -------------------------------------------------------------------------- */
/* RESHAPE                                                                     */
/* -------------------------------------------------------------------------- */

export const RESHAPE_DETAIL: ProjectDetail = {
  slug: "reshape",
  name: "RESHAPE",
  expandedName: "Reducing Stigma Among Healthcare Providers",
  tagline:
    "Bringing people with lived experience of mental illness into WHO mhGAP training, and testing whether that changes how primary care providers diagnose",
  status: "closed",
  statusLabel: "Enrollment closed",
  lede:
    "RESHAPE is a cluster-randomized clinical trial in Nepal. It tests an implementation strategy that adds people with lived experience of mental illness to standard WHO mhGAP training for primary care providers, and measures whether reducing provider stigma improves how accurately those providers detect mental illness in their patients.",

  facts: [
    { term: "Design", detail: "Cluster-randomized clinical trial" },
    { term: "Funder", detail: "National Institute of Mental Health (R01)" },
    { term: "Location", detail: "Rural and peri-urban Nepal" },
    { term: "Implementing partner", detail: "TPO Nepal" },
  ],

  /* From the specification's power statement. Labeled as targets throughout:
     these are the numbers the trial was designed to enrol, not results. */
  figures: [
    {
      value: "215",
      label: "Primary care providers",
      note: "Enrollment target",
    },
    { value: "1,100", label: "Patients", note: "Enrollment target" },
    { value: "24", label: "Municipalities", note: "Randomized clusters" },
    { value: "12", label: "Months", note: "Provider follow-up" },
  ],

  rationale: [
    "In low- and middle-income countries, far more people live with mental illness than ever receive treatment for it. That gap is not only a shortage of specialists — it also reflects what happens at the first point of contact.",
    "Stigma toward mental illness among primary care providers is itself a barrier to accurate diagnosis, and an inaccurate diagnosis forecloses quality treatment before any specialist is involved. RESHAPE treats provider stigma as an implementation problem: something a training strategy can be designed against, and measured.",
  ],

  arms: [
    {
      name: "Implementation as usual",
      abbr: "IAU",
      body: "Standard mhGAP-IG training, delivered as the Mental Health Gap Action Programme is ordinarily run.",
    },
    {
      name: "RESHAPE",
      body: "The same mhGAP-IG curriculum, delivered with people with lived experience of mental illness and aspirational healthcare providers embedded in the training.",
      isIntervention: true,
    },
  ],

  strategy: {
    heading: "What RESHAPE adds to mhGAP",
    body: [
      "The Mental Health Gap Action Programme Intervention Guide (mhGAP-IG) is the World Health Organization's curriculum for training non-specialist providers to detect common mental illnesses — depression, anxiety, alcohol use disorder and psychosis. RESHAPE does not replace it.",
      "Instead, RESHAPE changes how that training is delivered. It brings people with lived experience of mental illness and aspirational healthcare providers into the room as co-facilitators, working through a visual narrative method called PhotoVoice. The mechanism it targets is social: promoting empathy and reducing intergroup discrimination between providers and the patients they are learning to recognize.",
    ],
    elements: [
      {
        term: "People with lived experience",
        body: "Participants who have themselves recovered from mental illness join the training as facilitators rather than case studies, giving in-person testimony about their recovery.",
      },
      {
        term: "Aspirational figures",
        body: "Healthcare providers the trainees regard as models of good practice take part alongside them, so the new norm is demonstrated by a respected peer rather than asserted by a curriculum.",
      },
      {
        term: "PhotoVoice",
        body: "A visual narrative method that structures both the testimony and the myth-busting discussion that follows, so recovery is shown through participants' own images rather than described in the abstract.",
      },
    ],
  },

  objectives: [
    {
      rank: "primary",
      title: "Stigma reduction and attitudinal change among providers",
      measures: [
        { abbr: "SDS", name: "Social Distance Scale" },
        { abbr: "RIBS", name: "Reported and Intended Behaviour Scale" },
        { abbr: "IAT", name: "Implicit Association Test" },
        { name: "mhGAP knowledge and mhGAP clinical efficacy" },
        {
          abbr: "ENACT",
          name: "Enhancing Assessment of Common Therapeutic Factors",
          detail:
            "An observed structured clinical exam that evaluates foundational provider competencies.",
        },
      ],
    },
    {
      rank: "primary",
      title: "Reach, operationalized as diagnostic accuracy",
      measures: [
        {
          abbr: "SCID",
          name: "Structured Clinical Interview for DSM-5",
          detail:
            "A psychiatrist-conducted interview in which a formal diagnosis, or the absence of one, is made. Set against the provider's own diagnosis it yields true and false positives, and true and false negatives.",
        },
      ],
    },
    {
      rank: "secondary",
      title: "Clinical effectiveness",
      note: "Tested as non-inferiority: the trial hypothesizes that clinical effectiveness outcomes in the RESHAPE arm are statistically non-inferior to implementation as usual, not that they are better.",
      measures: [
        { abbr: "PHQ-9", name: "Patient Health Questionnaire-9" },
        { abbr: "GAD-7", name: "Generalized Anxiety Disorder-7" },
        { abbr: "PANSS", name: "Positive and Negative Syndrome Scale" },
        { abbr: "AUDIT", name: "Alcohol Use Disorders Identification Test" },
        {
          abbr: "WHODAS-II",
          name: "WHO Disability Assessment Schedule",
          detail: "Day-to-day functioning.",
        },
        {
          abbr: "EQ-5D-5L",
          name: "EuroQol five-dimension scale",
          detail: "Perceived quality of life, yielding quality-adjusted life years.",
        },
      ],
    },
    {
      rank: "secondary",
      title: "Cost effectiveness",
      measures: [
        { abbr: "CSRI", name: "Client Service Receipt Inventory" },
      ],
    },
  ],

  hypotheses: [
    "Providers trained through RESHAPE show a significant reduction in stigma toward mental illness, relative to implementation as usual.",
    "Their patients see a significant increase in reach — that is, in diagnostic accuracy.",
    "Clinical effectiveness outcomes among those patients are non-inferior to implementation as usual.",
    "The strategy achieves this in a cost-effective, scalable way.",
  ],

  tracks: [
    {
      id: "provider",
      label: "Providers",
      population: "215 primary care providers across 24 randomized municipalities",
    },
    {
      id: "patient",
      label: "Patients",
      population: "1,100 patients seen by those providers",
    },
  ],

  /* Chronological across both tracks, which is what makes the interlock
     legible: patient enrollment opens at month 3, while providers are still
     being reassessed and are only then beginning to detect and diagnose. */
  timeline: [
    {
      kind: "point",
      track: "provider",
      code: "T0",
      when: "Month 0 · Day 1",
      title: "Screening, enrollment and pre-training assessment",
    },
    {
      kind: "phase",
      track: "provider",
      when: "Month 0 · Days 1–6",
      title: "Training — implementation as usual or RESHAPE",
      detail:
        "The randomized contrast. Municipalities are assigned to one arm or the other; every provider receives mhGAP-IG training either way.",
    },
    {
      kind: "point",
      track: "provider",
      code: "T1",
      when: "Month 0 · Day 6",
      title: "Post-training assessment",
    },
    {
      kind: "phase",
      track: "provider",
      when: "Months 0–3",
      title: "Supervised practice",
    },
    {
      kind: "point",
      track: "provider",
      code: "T2",
      when: "Month 3",
      title: "Post-training assessment",
    },
    {
      kind: "point",
      track: "patient",
      code: "T0",
      when: "Months 3–6",
      title: "Screening, enrollment and baseline interview",
      detail:
        "Baseline psychiatric symptom severity and clinical effectiveness outcomes, taken alongside the patient's initial visit with an enrolled provider.",
    },
    {
      kind: "phase",
      track: "provider",
      when: "Months 4–6",
      title: "Patient detection and diagnosis",
    },
    {
      kind: "point",
      track: "provider",
      code: "T3",
      when: "Month 6",
      title: "Post-training assessment",
    },
    {
      kind: "point",
      track: "patient",
      code: "T1",
      when: "Months 7–9",
      title: "Diagnostic interview with a psychiatrist",
      detail:
        "Three months after enrollment. The SCID interview that establishes whether the provider's diagnosis was correct — this is where diagnostic accuracy is actually measured.",
      cohorts: [
        "Every patient the provider diagnosed",
        "Every patient the provider did not diagnose, but who scored above cutoff on at least one psychiatric symptom tool",
        "A random 10% of patients with neither a provider diagnosis nor an above-cutoff score",
      ],
    },
    {
      kind: "point",
      track: "patient",
      code: "T2",
      when: "Months 10–12",
      title: "Follow-up interview",
      detail:
        "Six months after enrollment. Repeats the baseline measures of symptom severity and clinical effectiveness.",
      cohorts: [
        "Every patient whose diagnosis the psychiatrist confirmed — the true positives",
      ],
    },
    {
      kind: "point",
      track: "provider",
      code: "T4",
      when: "Month 12",
      title: "Qualitative interviews",
    },
    {
      kind: "point",
      track: "patient",
      code: "T3",
      when: "Month 12",
      title: "Qualitative interviews",
    },
  ],

  eligibility: [
    {
      group: "Primary care providers",
      criteria: [
        "Aged 21 to 65",
        "Hold a valid certificate of practice from the Ministry of Health, with no prior citations on that licensure",
        "Fluent in Nepali",
      ],
    },
    {
      group: "Patients",
      criteria: [
        "Aged 16 or older",
        "Competent in Nepali",
        "Not presenting with an emergency medical need",
        "Not presenting with an acute psychiatric need",
      ],
    },
  ],

  /* Slugs into PUBLICATIONS. `note` records the work's role in this project,
     which the bibliography does not carry. */
  publications: [
    {
      slug: "implementation-strategy-in-collaboration-with-people-with-lived-experi",
      note: "Trial protocol",
    },
    {
      slug: "mechanisms-of-action-for-stigma-reduction-among-primary-care-providers",
      note: "Mechanism",
    },
    {
      slug: "collaboration-with-people-with-lived-experience-of-mental-illness-to-r",
      note: "Pilot outcomes",
    },
    {
      slug: "impact-of-service-user-video-presentations-on-explicit-and-implicit-st",
    },
    {
      slug: "reducing-mental-illness-stigma-in-healthcare-settings-proof-of-concept",
      note: "Proof of concept",
    },
    {
      slug: "reducing-stigma-among-healthcare-providers-to-improve-mental-health-se",
      note: "Pilot protocol",
    },
    {
      slug: "establishing-partnerships-with-people-with-lived-experience-of-mental",
    },
    {
      slug: "feasibility-acceptability-and-pilot-effectiveness-of-a-social-contact",
    },
  ],

  partners: ["TPO Nepal"],

  resources: [
    {
      label: "RESHAPE manual",
      href: "https://d5c560b7-d51a-4d20-8a3c-68b61b9fc2c7.usrfiles.com/ugd/d5c560_f8618b6f1a064e3f9472f05393df6ef4.pdf",
      kind: "document",
    },
    {
      label: "RESHAPE at TPO Nepal",
      href: "https://www.tponepal.org/reducing-barriers-to-mental-health-task-sharing-stigma-reduction-in-primary-care-reshape/",
      kind: "site",
    },
  ],

  contact: {
    name: "Sauharda Rai, PhD",
    email: "sauharda@gwu.edu",
  },

  /* SCAPE-U runs the same photo narrative method in Uganda; EQUIP is the
     competency-assessment platform the training rests on. */
  relatedSlugs: ["scape-u", "equip", "equip-su"],
};

/** Every project with a detail record, keyed by slug. */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  [RESHAPE_DETAIL.slug]: RESHAPE_DETAIL,
};

/**
 * The slugs that have a detail page, passed to the blocks so a related-project
 * card links only where a route exists. The portfolio lists eleven projects and
 * only some have records yet; as records are added the links appear on their
 * own.
 */
export const PROJECT_DETAIL_SLUGS = Object.keys(PROJECT_DETAILS);

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS[slug];
}
