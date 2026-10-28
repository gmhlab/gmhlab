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
 * The UNICEF-MMAP and EQUIP records (added 2026-10-28) are transcribed from
 * the Center's project summaries in the same Drive folder ("UNICEF-MMAP
 * (Project Summary)", `1mszKp4gDl6KuNq95UPVSp0SJ1nPVx99PosGay25KObI`;
 * "EQUIP (Project Summary)", `19qLeAP6AiL_Y0_Swsfk4fTolT79mRD5hQKPifLDmuKw`),
 * which were compiled from the published papers. Every number in them is a
 * published one — the summaries cite each source — and the `findings` cards
 * name the paper each figure is from. Nothing unpublished (usage dashboards,
 * grant documents) is used. Neither source ranks its objectives, so neither
 * record does.
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
import {
  EQUIP_PROJECT_HERO_IMAGE,
  RECOUP_NY_HERO_IMAGE,
  RESHAPE_HERO_IMAGE,
  UNICEF_MMAP_HERO_IMAGE,
} from "./hero-images";

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
  heroImage: RESHAPE_HERO_IMAGE,
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

  publicationsNote:
    "Peer-reviewed publications from this project and the stigma-reduction program it belongs to.",

  /* SCAPE-U runs the same photo narrative method in Uganda; EQUIP is the
     competency-assessment platform the training rests on. */
  relatedSlugs: ["scape-u", "equip", "equip-su"],
};

/* -------------------------------------------------------------------------- */
/* UNICEF-MMAPP                                                                */
/* -------------------------------------------------------------------------- */

/*
 * The name is the one the project team confirmed (UNICEF-MMAPP, "…Adolescents
 * and Young People…"). The 2021–2024 papers say MMAP, the initiative's name
 * at the time; their titles are left as published.
 *
 * A validation study, not a trial: no arms, no ranked endpoints. The protocol
 * does not rank its objectives, so none carries a `rank` — the page then says
 * nothing about powering. Its own nomenclature is nine numbered steps, so the
 * schedule codes are step numbers, on the data-collection steps only.
 */
export const UNICEF_MMAP_DETAIL: ProjectDetail = {
  slug: "unicef-mmapp",
  name: "UNICEF-MMAPP",
  expandedName:
    "Measurement of Mental Health Among Adolescents and Young People at the Population Level",
  tagline:
    "Adapting and clinically validating brief measures of adolescent depression and anxiety, so countries can count what they cannot yet see",
  status: "ongoing",
  statusLabel: "Ongoing",
  heroImage: UNICEF_MMAP_HERO_IMAGE,
  lede:
    "UNICEF-MMAPP is a multicountry, mixed-methods study led by UNICEF. It culturally adapts brief, open-access measures of adolescent mental health, then tests them against clinicians' diagnostic interviews, so that national surveys can report how many adolescents live with depression and anxiety — comparably, across countries and over time. The result is UNICEF's open-access MMAPP toolkit.",

  facts: [
    { term: "Design", detail: "Multicountry mixed-methods validation study" },
    { term: "Led by", detail: "UNICEF Data and Analytics Section" },
    {
      term: "Funders",
      detail:
        "UNICEF, the Bill & Melinda Gates Foundation, and the Governments of Italy and Kenya",
    },
    { term: "Initial sites", detail: "Belize, Kenya, Nepal, South Africa" },
    { term: "Ages", detail: "Adolescents aged 10–19" },
  ],

  /* From the protocol: these describe the method and its targets. The
     sample-size figure is a per-site target, labeled as such. */
  figures: [
    { value: "4", label: "Countries", note: "Initial validation sites" },
    {
      value: "6",
      label: "Language versions",
      note: "Belizean English, Kriol, English, Kiswahili, Nepali, isiXhosa",
    },
    { value: "9", label: "Protocol steps", note: "Run at every site" },
    { value: "300+", label: "Adolescents per site", note: "Protocol target" },
  ],

  rationale: [
    "Mental disorders are among the leading causes of disability for adolescents aged 10 to 19, and most adolescents live in low- and middle-income countries. Yet more than 100 countries have no data on child and adolescent mental health, and in sub-Saharan Africa and parts of Asia and Latin America the data that exist describe fewer than 1% of adolescents.",
    "Part of the gap is the instruments. Few brief adolescent measures have been validated in these settings, and a scale translated word for word can miss how adolescents actually describe distress. Without tools that are both culturally adapted and checked against clinical diagnosis, a country cannot measure its adolescents' mental health — or compare it with anyone else's.",
  ],

  strategy: {
    heading: "The MMAPP method",
    body: [
      "MMAPP is a replicable process rather than a single instrument: nine steps in two phases that any team can run to adapt and validate a measure in a new language and setting. Phase one establishes cultural equivalence through qualitative work; phase two tests the adapted tool against a gold-standard clinical interview.",
      "Validated tools are then built into national and subnational surveys, so results can be reported by age, sex, socio-economic status and subnational area, and compared across countries.",
    ],
    elements: [
      {
        term: "Transcultural translation and adaptation",
        body: "Bilingual experts translate for meaning rather than word for word; clinicians, focus groups and cognitive interviews test every item for comprehensibility, acceptability, relevance, completeness and technical equivalence; an independent back-translation closes the loop.",
      },
      {
        term: "An enriched sample",
        body: "Teachers and community leaders use the Community Case Detection Tool, a set of short vignettes, to refer adolescents more and less likely to have depression or anxiety, so each site has enough cases to test a measure against diagnoses.",
      },
      {
        term: "A gold-standard comparison",
        body: "Within two days of completing the adapted tool, each adolescent has a K-SADS-PL diagnostic interview with a trained clinician, who has completed inter-rater reliability training so diagnoses are comparable across sites.",
      },
      {
        term: "Cut-offs fitted to their use",
        body: "Case-finding needs high sensitivity; a population estimate needs a balance that avoids inflating prevalence. Each site reports performance across thresholds so users can choose.",
      },
    ],
  },

  objectives: [
    {
      title: "Clinical validity of the adapted depression and anxiety measures",
      measures: [
        { abbr: "RCADS-25", name: "Revised Child Anxiety and Depression Scale" },
        {
          abbr: "PHQ-9",
          name: "Patient Health Questionnaire-9",
          detail: "The adolescent version, PHQ-A, in Nepal.",
        },
        { abbr: "GAD-7", name: "Generalized Anxiety Disorder-7" },
        {
          abbr: "K-SADS-PL",
          name: "Kiddie Schedule for Affective Disorders and Schizophrenia (DSM-5)",
          detail:
            "The gold standard. At minimum the depression module and the generalized anxiety, panic, separation anxiety and social anxiety sections. Against it: sensitivity, specificity, predictive values, likelihood ratios, diagnostic odds ratio, Youden's index, area under the curve and scale reliability.",
        },
      ],
    },
    {
      title: "Cultural equivalence of each translated item",
      measures: [
        {
          abbr: "TTA",
          name: "Transcultural translation monitoring form",
          detail:
            "Five equivalence domains: comprehensibility, acceptability, relevance, completeness and technical equivalence.",
        },
        {
          name: "Focus group discussions and cognitive interviews",
          detail: "Coded for the same five domains.",
        },
      ],
    },
    {
      title: "Adaptation of further adolescent mental health domains",
      measures: [
        {
          name: "UNICEF-developed measures",
          detail:
            "Functional limitations, suicidal behaviour, mental health care-seeking and connectedness.",
        },
        {
          abbr: "PROMIS",
          name: "Patient-Reported Outcomes Measurement Information System items",
          detail: "Tested at two of the validation sites.",
        },
      ],
    },
    {
      title: "Reliability of caregiver report for younger adolescents",
      measures: [
        {
          name: "Parent version of the questionnaire",
          detail:
            "Given to 100–175 parents or caregivers of 10- to 14-year-olds in at least one setting.",
        },
      ],
    },
    {
      title: "Usefulness of community-based case finding",
      measures: [
        {
          abbr: "CCDT",
          name: "Community Case Detection Tool",
          detail: "Its positive predictive value as a referral route.",
        },
      ],
    },
  ],

  tracks: [
    {
      id: "site",
      label: "Each site",
      population:
        "Adolescents aged 10–14 and 15–19, and caregivers of the younger group — about six months from start to finish",
    },
  ],

  timelineNote:
    "Every site runs the same nine steps. Numbered points are the protocol's data-collection steps; the bands between them are translation, review and analysis. Durations are the protocol's estimates.",
  timeline: [
    {
      kind: "phase",
      track: "site",
      when: "Phase 1 · Months 1–2",
      title: "Steps 1–2 · Translation and expert review",
      detail:
        "Bilingual translators adapt the tools (a group of three is suggested); three or four clinicians fluent in the language review them on the monitoring form.",
    },
    {
      kind: "point",
      track: "site",
      code: "3",
      when: "Phase 1",
      title: "Focus group discussions",
      detail: "Four to eight groups of six to eight people, by age and gender.",
      cohorts: [
        "Younger adolescents, 10–14",
        "Older adolescents, 15–19",
        "Parents and caregivers of younger adolescents",
      ],
    },
    {
      kind: "point",
      track: "site",
      code: "4",
      when: "Phase 1",
      title: "Cognitive interviews",
      detail:
        "Ten to twenty one-on-one interviews using think-aloud and verbal probing, to check how each item and response option is understood.",
    },
    {
      kind: "phase",
      track: "site",
      when: "Phase 1",
      title: "Steps 5–6 · Synthesis and back-translation",
      detail:
        "Findings are integrated through framework analysis; an independent translator back-translates, and the local and international teams reconcile the final wording.",
    },
    {
      kind: "phase",
      track: "site",
      when: "Month 3",
      title: "Logistics and coordination between phases",
    },
    {
      kind: "point",
      track: "site",
      code: "7",
      when: "Phase 2 · Months 4–6",
      title: "Adapted tools administered",
      detail:
        "Face to face, by trained enumerators, in a private setting, with a counsellor and a local referral pathway on hand.",
    },
    {
      kind: "point",
      track: "site",
      code: "8",
      when: "Phase 2 · Within 2 days",
      title: "Diagnostic interview with a clinician",
      detail:
        "The K-SADS-PL, administered by mental health professionals trained for inter-rater reliability.",
    },
    {
      kind: "phase",
      track: "site",
      when: "Phase 2",
      title: "Step 9 · Psychometric analysis and cut-offs",
      detail:
        "Each site analysed on its own, then pooled across sites to look at how items behave in different settings and over time.",
    },
  ],

  eligibilityNote:
    "Recruitment criteria from the multicountry protocol, which publishes no formal exclusion criteria. Every site had a referral pathway for adolescents reporting suicidal ideation and a local emergency protocol.",
  eligibility: [
    {
      group: "Adolescents — validation sample",
      criteria: [
        "Aged 10–14 or 15–19, boys and girls in both age bands",
        "Referred through the Community Case Detection Tool, or recruited through schools, community centres, NGOs or health clinics",
        "Written consent, or written assent with parental consent for minors",
      ],
    },
    {
      group: "Adolescents — focus groups and interviews",
      criteria: [
        "Aged 10–14 or 15–19",
        "Fluent in the language being adapted",
        "Chosen for diversity of education, literacy, ethnicity and socio-economic background",
      ],
    },
    {
      group: "Parents and caregivers",
      criteria: ["Parent or caregiver of an adolescent aged 10–14"],
    },
  ],

  /* Each site's own validation paper, numbers as published. */
  findingsNote:
    "Each site's adapted tool against clinicians' K-SADS diagnostic interviews. AUC is the area under the curve; sensitivity and specificity are at the cut-off each paper recommends.",
  findings: [
    {
      heading: "Belize",
      context: "RCADS-22 · Belizean English and Kriol · 256 adolescents, 10–19",
      stats: [
        { value: "0.82", label: "AUC, ages 15–19" },
        { value: "0.72", label: "AUC, ages 10–14" },
        { value: "0.83", label: "Depression sensitivity" },
        { value: "0.77", label: "Depression specificity" },
      ],
      takeaway:
        "Excellent classification for older adolescents and acceptable for younger ones, so the scale is recommended for 15- to 19-year-olds. Separation-anxiety items performed poorly, and thoughts of death were common even among adolescents without a diagnosis.",
      source:
        "validation-of-the-kriol-and-belizean-english-adaptation-of-the-revised",
    },
    {
      heading: "Kenya",
      context: "PHQ-9 · English and Kiswahili · 250 adolescents, 10–19",
      stats: [
        { value: "0.89", label: "AUC, English" },
        { value: "0.87", label: "AUC, Kiswahili" },
        { value: "95%", label: "Sensitivity, English" },
        { value: "73%", label: "Specificity, English" },
      ],
      takeaway:
        "Both language versions were reliable (Cronbach's α 0.86 and 0.83) and performed comparably in detecting major depressive disorder — usable for early identification in resource-limited settings.",
      source:
        "validation-of-the-english-and-swahili-adaptation-of-the-patient-health",
    },
    {
      heading: "South Africa",
      context: "PHQ-9 and GAD-7 · isiXhosa · 302 adolescents, 10–19",
      stats: [
        { value: "0.88", label: "PHQ-9 AUC" },
        { value: "91%", label: "PHQ-9 sensitivity" },
        { value: "76%", label: "PHQ-9 specificity" },
        { value: "0.78", label: "GAD-7 AUC" },
      ],
      takeaway:
        "The isiXhosa PHQ-9 is a valid depression measure for adolescents. The GAD-7 needed a low cut-off to balance sensitivity (67%) and specificity (75%), and the authors recommend further research on it.",
      source:
        "detecting-depression-and-anxiety-among-adolescents-in-south-africa-val",
    },
    {
      heading: "Nepal",
      context:
        "PHQ-A and GAD-7 · Nepali · 413 adolescents, 12–19, Kathmandu district",
      stats: [
        { value: "0.93", label: "Sensitivity, ages 12–14" },
        { value: "0.80", label: "Specificity, ages 12–14" },
        { value: "0.89", label: "Sensitivity, ages 15–19" },
        { value: "0.70", label: "Specificity, ages 15–19" },
      ],
      takeaway:
        "Fair for depression screening, poor for anxiety. Even at validated cut-offs these tools would inflate population prevalence two- to four-fold, so survey estimates need adjusting — a finding only a clinical validation could surface.",
      source:
        "translation-cultural-adaptation-and-validation-of-patient-health-quest",
    },
  ],

  publications: [
    {
      slug: "measurement-of-mental-health-among-adolescents-at-the-population-level",
      note: "Multicountry protocol",
    },
    {
      slug: "increasing-data-and-understanding-of-adolescent-mental-health-worldwid",
      note: "The initiative",
    },
    {
      slug: "the-path-forward-emerging-lessons-from-validating-a-multicountry-popul",
      note: "Lessons across sites",
    },
    {
      slug: "translation-and-adaptation-of-the-revised-children-s-anxiety-and-depre",
      note: "Belize adaptation",
    },
    {
      slug: "validation-of-the-kriol-and-belizean-english-adaptation-of-the-revised",
      note: "Belize validation",
    },
    {
      slug: "cultural-and-contextual-adaptation-of-mental-health-measures-in-kenya",
      note: "Kenya adaptation",
    },
    {
      slug: "validation-of-the-english-and-swahili-adaptation-of-the-patient-health",
      note: "Kenya validation",
    },
    {
      slug: "detecting-depression-and-anxiety-among-adolescents-in-south-africa-val",
      note: "South Africa validation",
    },
    {
      slug: "translation-cultural-adaptation-and-validation-of-patient-health-quest",
      note: "Nepal adaptation and validation",
    },
    {
      slug: "if-i-tell-you-my-problems-how-will-you-perceive-me-a-qualitative-study",
      note: "Kenya adolescents' perspectives",
    },
  ],
  /* Every work here is co-authored by Liliana Carvajal-Vélez (UNICEF) and
     Brandon Kohrt — the set the project team named as the source — and that
     is all of their joint works in the bibliography. */
  publicationsNote:
    "The protocol, each site's adaptation and validation papers, and the lessons drawn across sites.",

  /* From the protocol's author affiliations and acknowledgments. */
  partners: [
    "UNICEF",
    "Karolinska Institutet",
    "University of Nairobi",
    "TPO Nepal",
    "Stellenbosch University",
    "Hospital de Clínicas de Porto Alegre",
    "War Child",
  ],

  resources: [
    /* The project team's primary reference: the questionnaire, indicators
       and guidance as UNICEF publishes them. */
    {
      label: "The MMAPP toolkit at UNICEF Data",
      href: "https://data.unicef.org/resources/mmapp/",
      kind: "site",
    },
  ],

  contact: {
    name: "Brandon Kohrt, MD, PhD",
    email: "bkohrt@gwu.edu",
  },

  /* The portfolio's other adolescent depression and anxiety work. */
  relatedSlugs: ["idea", "alive"],
};

/* -------------------------------------------------------------------------- */
/* EQUIP                                                                       */
/* -------------------------------------------------------------------------- */

/*
 * The *project* page: the research that built and tested EQUIP. The platform
 * as a product — the four-stage cycle, the toolkit, requesting training — is
 * the innovation page (`EQUIP_DETAIL` in `./innovation-detail-data`), which
 * this page links to rather than repeats.
 *
 * The development paper frames its aims as phase objectives, not ranked
 * endpoints, so no objective carries a `rank`. Its timeline is a history, so
 * the milestones are codeless points rather than invented T-numbers.
 */
export const EQUIP_PROJECT_DETAIL: ProjectDetail = {
  slug: "equip",
  name: "EQUIP",
  expandedName: "Ensuring Quality in Psychosocial and Mental Health Care",
  tagline:
    "Building and testing the WHO–UNICEF tools that show whether a helper can deliver psychological support safely",
  status: "ongoing",
  statusLabel: "Ongoing",
  heroImage: EQUIP_PROJECT_HERO_IMAGE,
  lede:
    "EQUIP is a WHO–UNICEF initiative, begun in 2018, to make competency assessment standard for anyone delivering psychological and psychosocial support — specialist or not. This is the research behind it: five phases of development, pilots in six countries, two head-to-head comparisons with standard training, and the record of how the platform has been used since its launch.",

  facts: [
    { term: "Developed by", detail: "WHO and UNICEF" },
    {
      term: "Funder",
      detail:
        "USAID, to WHO and UNICEF; and the US National Institute of Mental Health (NIMH), to Brandon Kohrt as principal investigator (R01MH120649)",
    },
    { term: "Design", detail: "Five-phase development programme with multi-site pilots" },
    { term: "Pilot sites", detail: "Ethiopia, Kenya, Lebanon, Peru, Uganda, Zambia" },
    { term: "Public launch", detail: "31 March 2022" },
  ],

  /* Platform use since launch, cumulative, from the EQUIP team's usage
     tracker ("Monthly data" tab) — the figures the team asked the site to
     use. Dated so they are never read as live. The tracker carries no
     country count; the published one (36, March 2024) is in the timeline.
     The March 2024 rows of the tracker match the Lancet Psychiatry paper. */
  figures: [
    { value: "7,122", label: "Platform registrations", note: "Mar 2022 – Oct 2026" },
    { value: "2,518", label: "Trainings", note: "Same period" },
    { value: "12,706", label: "Trainees assessed", note: "Same period" },
    { value: "26,364", label: "Competency assessments", note: "Same period" },
  ],

  rationale: [
    "Most people with mental health conditions receive no effective care. Among people living with depression, 1 in 5 in high-income countries and 1 in 27 in lower-middle-income countries receive minimally adequate treatment, and most countries have about one trained mental health provider per 10,000 people.",
    "Closing that gap depends on people who are not licensed clinicians: primary care and community health workers, psychosocial workers, teachers, peers. Licensed professionals have bodies that set and check standards. Non-specialists, usually trained in courses of a week or two, have nothing comparable — and globally there has been no standard way to know whether a helper has reached the competency to deliver care safely.",
  ],

  armsLabel: "What two of the pilots compared",
  arms: [
    {
      name: "Training as usual",
      body: "The intervention's standard training. In Lebanon the trainers were masked to trainees' competency results.",
    },
    {
      name: "Competency-based training",
      abbr: "EQUIP",
      body: "The same training, time-matched, with trainers using pre-training and in-training competency assessments to adapt what they taught and to give each trainee competency-based feedback.",
      isIntervention: true,
    },
  ],

  strategy: {
    heading: "How competency-based training works",
    body: [
      "Trainers assess trainees in brief, standardised role plays before training, after it and after supervision. Trainers use the results to adapt the training to the gaps they find, and to give trainees specific feedback rather than a pass or fail.",
      "EQUIP is not tied to one intervention, framework or sector. It assesses common factors — the foundational helping skills every intervention depends on — and the techniques specific to classes of treatment, so it can sit inside a course of a few days or a multi-year degree.",
    ],
    elements: [
      {
        term: "One prompt per competency",
        body: "A person playing a client delivers a scripted line — \"sometimes I go to sleep at night and wish that I wouldn't wake up in the morning\" — that should elicit a specific skill, here screening for self-harm and suicide risk.",
      },
      {
        term: "Harm, not only skill",
        body: "Each competency lists potentially harmful behaviours — being dismissive of suicidal thoughts, criticising a client's coping — alongside basic and advanced helpful ones, so trainers can see red flags as well as gaps.",
      },
      {
        term: "Four levels",
        body: "Level 1 is any harmful or unhelpful behaviour; 2, none but not every basic skill; 3, every basic skill; 4, every basic skill plus an advanced one.",
      },
      {
        term: "Eleven tools",
        body: "ENACT for adults (refined from 18 items to 15) and its remote version, WeACT for children and adolescents, GroupACT for groups, tools for Problem Management Plus and the Thinking Healthy Programme, and six treatment-class tools.",
      },
    ],
  },

  objectives: [
    {
      title: "Change in trainee competency over training and supervision",
      measures: [
        {
          abbr: "ENACT",
          name: "Enhancing Assessment of Common Therapeutic Factors",
          detail:
            "15 items. Reported as the number of competencies a trainee shows at level 1 (harmful) and at levels 3–4 (helpful).",
        },
        {
          abbr: "WeACT",
          name: "Working with Children – Assessment of Competencies Tool",
          detail: "13 items.",
        },
        {
          abbr: "GroupACT",
          name: "Group Facilitation Competency Assessment Tool",
        },
        { name: "Intervention-specific tools for PM+ and the Thinking Healthy Programme" },
      ],
    },
    {
      title: "Competency-based training against training as usual",
      measures: [
        {
          name: "WeACT, ENACT and GroupACT",
          detail: "Randomised, time-matched comparison in Lebanon (EASE).",
        },
        { name: "ENACT", detail: "Standard against EQUIP training in Peru (Thinking Healthy Programme)." },
      ],
    },
    {
      title: "Reliability and feasibility of assessment across settings",
      measures: [
        { abbr: "ICC", name: "Intraclass correlation coefficients for inter-rater agreement" },
        {
          name: "Cognitive interviewing and the transcultural translation monitoring form",
        },
      ],
    },
    {
      title: "Acceptability of competency-based feedback",
      measures: [
        {
          name: "Key informant interviews and focus groups",
          detail: "With supervisors, trainers and trainees at five sites.",
        },
      ],
    },
    {
      title: "Cost of competency-based training",
      measures: [{ name: "Incremental time and cost of EQUIP-based against standard PM+ training" }],
    },
    {
      title: "Global uptake",
      measures: [
        {
          name: "Platform usage data",
          detail:
            "Registrations, training programmes, countries, trainees, assessments and harmful behaviours identified. Paper-based use is not captured.",
        },
      ],
    },
  ],

  timelineHeading: "Development timeline",
  timelineNote:
    "The five phases from the Lancet Psychiatry development paper, with the milestones since launch. Phases overlap because tool development, adaptation and piloting ran in parallel.",
  tracks: [
    {
      id: "programme",
      label: "EQUIP",
      population: "WHO, UNICEF and a consortium of partners in seven countries",
    },
  ],
  timeline: [
    {
      kind: "phase",
      track: "programme",
      when: "2018–2019",
      title: "Phase 1 · A framework for competency-based training",
      detail:
        "Theory-of-change and human-centred design workshops with intervention developers, researchers and trainers based in low- and middle-income countries.",
    },
    {
      kind: "phase",
      track: "programme",
      when: "2018–2020",
      title: "Phase 2 · Competency assessment tools",
      detail:
        "Literature reviews — 56 tools with 1,081 competency items; 17 intervention manuals with 973 competencies — free-listing and expert consultation, distilled into eleven tools.",
    },
    {
      kind: "phase",
      track: "programme",
      when: "July 2019 – December 2020",
      title: "Phase 3 · Adaptation across settings",
      detail:
        "Consortium partners in Ethiopia, Jordan, Kenya, Lebanon, Peru, Uganda and Zambia translated the tools and role plays and tested them with cognitive interviews and inter-rater reliability checks.",
    },
    {
      kind: "phase",
      track: "programme",
      when: "2019–2021",
      title: "Phase 4 · Pilots in six countries",
      detail:
        "Trainees assessed before training, after it and after supervision, with a qualitative study at every site. A comparison with standard training was planned for each country; COVID-19 limited it to Lebanon and Peru.",
    },
    {
      kind: "point",
      track: "programme",
      when: "31 March 2022",
      title: "Public launch",
      detail: "The digital platform opens to anyone, with online and offline use.",
    },
    {
      kind: "phase",
      track: "programme",
      when: "2022 – ongoing",
      title: "Phase 5 · Dissemination and monitoring",
      detail:
        "Simplified role plays, the Foundational Helping Skills curriculum, WHO competency-based training manuals for PM+ and Self-Help Plus, and usage monitoring.",
    },
    {
      kind: "point",
      track: "programme",
      when: "2023",
      title: "Global training courses",
      detail:
        "Two four-day courses for 74 participants from 48 organisations, and 12.5 hours of online training for 21 faculty from universities in 11 low- and middle-income countries.",
    },
    {
      kind: "point",
      track: "programme",
      when: "March 2024",
      title: "Two years of use",
      detail:
        "3,212 registrations; 794 training programmes in 36 countries; 3,760 trainees; 10,001 competency assessments identifying 9,810 unhelpful or potentially harmful behaviours. ENACT is available in 14 languages.",
    },
  ],

  findingsNote:
    "Pilot figures are the mean number of ENACT competencies per trainee rated harmful or unhelpful (level 1) or helpful (levels 3–4). Each card cites its source.",
  findings: [
    {
      heading: "Ethiopia",
      context: "Problem Management Plus · refugee facilitators · 24 trainees",
      stats: [
        { value: "4.06", label: "Harmful, before" },
        { value: "0.04", label: "Harmful, after supervision" },
        { value: "10.54", label: "Helpful, after supervision" },
      ],
      takeaway:
        "Two weeks of training and observed supervision of each facilitator's first client took helpful competencies from 1.48 to 10.54 — face validity that the tool tracks change.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
    {
      heading: "Lebanon",
      context: "Early Adolescent Skills for Emotions · 24 trainees, randomised 12:12",
      stats: [
        { value: "17%", label: "Greater WeACT competency" },
        { value: "18%", label: "Greater GroupACT competency" },
      ],
      takeaway:
        "Against time-matched training as usual, competency-based training raised child-focused and group-facilitation skills more without lengthening training. Both arms eliminated harmful behaviours equally; the ENACT difference was not significant.",
      source: "evaluation-of-competency-driven-training-for-facilitators-delivering-a",
    },
    {
      heading: "Peru",
      context: "Thinking Healthy Programme · community health workers",
      stats: [
        { value: "1.22", label: "Harmful, EQUIP arm" },
        { value: "1.71", label: "Harmful, usual training" },
      ],
      takeaway:
        "Harmful behaviours fell from 2.66 to 1.22 with EQUIP training (14 workers) and from 2.00 to 1.71 with training as usual (17). COVID-19 disrupted supervision and services in between.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
    {
      heading: "Kenya",
      context: "Adolescent TF-CBT-derived therapy · community health workers · 16 trainees",
      stats: [
        { value: "0.80", label: "Harmful, after supervision" },
        { value: "3.83", label: "Helpful, after supervision" },
      ],
      takeaway:
        "Harmful behaviours did not fall during training itself, then dropped from 1.53 to 0.80 once supervisors aimed online supervision at each trainee's weakest competencies.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
    {
      heading: "Uganda",
      context: "Group Interpersonal Therapy · community health workers · 25 trainees",
      stats: [
        { value: "−1.56", label: "Harmful competencies" },
        { value: "+3.21", label: "Helpful competencies" },
      ],
      takeaway:
        "Change from before training to after supervision, across a literate, experienced cohort and a low-literacy remote one. Trainers reviewed the results but did not feed them back to trainees.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
    {
      heading: "Zambia",
      context: "Telephone-delivered CETA refresher · 18 trainees",
      stats: [
        { value: "0.33", label: "Harmful, after supervision" },
        { value: "0.71–0.89", label: "Inter-rater ICC" },
      ],
      takeaway:
        "Harmful behaviours fell from 1.30, with EQUIP used for evaluation only. After practice with demonstration videos, raters reached good agreement on every ENACT item.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
    {
      heading: "Foundational Helping Skills",
      context: "Nepal, Peru and Uganda · pre-service and in-service workers",
      stats: [
        { value: "150", label: "Trainees" },
        { value: "13", label: "Trainings" },
        { value: "20 h", label: "Average length" },
      ],
      takeaway:
        "A brief competency-based curriculum significantly reduced harmful behaviours and increased helpful ones, across and within all three sites.",
      source: "a-mixed-methods-evaluation-of-a-world-health-organization-competency-b",
    },
    {
      heading: "Feedback",
      context: "Ethiopia, Kenya, Lebanon, Peru, Uganda · 18 interviews, 5 focus groups",
      stats: [{ value: "41", label: "Participants" }],
      takeaway:
        "Competency-based feedback was personal and goal-specific, sustained a feedback loop, felt more objective and comfortable, and made training and supervision more flexible.",
      source: "perspectives-on-competency-based-feedback-for-training-non-specialists",
    },
    {
      heading: "Cost",
      context: "PM+ training of trainers, EQUIP-based against standard",
      stats: [
        { value: "85 h", label: "EQUIP-based" },
        { value: "50 h", label: "Standard" },
      ],
      takeaway:
        "About 70% more time and cost to train PM+ trainers the EQUIP way — with no added time once those trainers go on to train helpers.",
      source: "competency-based-training-and-supervision-development-of-the-who-unice",
    },
  ],

  publications: [
    {
      slug: "competency-based-training-and-supervision-development-of-the-who-unice",
      note: "Development paper",
    },
    {
      slug: "ensuring-quality-in-psychological-support-who-equip-developing-a-compe",
      note: "Rationale",
    },
    {
      slug: "evaluation-of-competency-driven-training-for-facilitators-delivering-a",
      note: "Lebanon comparison",
    },
    {
      slug: "a-mixed-methods-evaluation-of-a-world-health-organization-competency-b",
      note: "Foundational Helping Skills evaluation",
    },
    {
      slug: "perspectives-on-competency-based-feedback-for-training-non-specialists",
      note: "Feedback study",
    },
    {
      slug: "the-who-equip-foundational-helping-skills-trainer-s-curriculum",
      note: "Curriculum",
    },
    {
      slug: "assessment-of-service-provider-competency-for-child-and-adolescent-psy",
      note: "WeACT",
    },
    {
      slug: "sustainable-partnerships-to-ensure-quality-in-psychological-support-eq",
      note: "EQUIP-Nairobi",
    },
    {
      slug: "competency-based-pre-service-education-for-clinical-psychology-trainin",
      note: "Pre-service education",
    },
    {
      slug: "integrating-equip-competency-based-training-into-a-university-curricul",
      note: "Pre-service evaluation",
    },
    {
      slug: "piloting-competency-assessments-for-an-evidence-based-brief-psychologi",
      note: "Switzerland pilot",
    },
    {
      slug: "pretraining-skills-as-predictors-of-competence-of-nonspecialists-in-de",
      note: "Trainee selection",
    },
    {
      slug: "use-of-role-plays-to-assess-therapist-competency-and-its-association-w",
      note: "Role-play review",
    },
    {
      slug: "common-factors-in-psychological-treatments-delivered-by-non-specialist",
      note: "Common-factors review",
    },
    {
      slug: "identifying-core-competencies-for-remote-delivery-of-psychological-int",
      note: "Remote-delivery review",
    },
    {
      slug: "therapist-competence-in-global-mental-health-development-of-the-enhanc",
      note: "ENACT",
    },
  ],
  publicationsNote:
    "The development paper, the pilot and evaluation studies, and the reviews the tools were built from.",

  /* From the publications' author affiliations and acknowledgments. */
  partners: [
    "WHO",
    "UNICEF",
    "War Child",
    "Center for Victims of Torture",
    "University of Nairobi",
    "Socios En Salud",
    "HealthRight",
    "Makerere University",
    "Centre for Infectious Disease Research in Zambia",
    "TPO Nepal",
    "SystemSeed",
  ],

  resources: [
    { label: "EQUIP platform", href: "https://equipcompetency.org", kind: "site" },
    {
      label: "Using EQUIP: the platform, its tools and training",
      href: "/innovations/equip",
      kind: "page",
    },
  ],

  contact: {
    name: "Ruta Rangel, MPH",
    email: "rbraz@gwu.edu",
  },

  /* Projects that build on EQUIP, per the portfolio's `buildsOn`, plus
     RESHAPE, which assesses its providers with ENACT. */
  relatedSlugs: ["equip-su", "recoup-ny", "restore", "reshape"],
};

/* -------------------------------------------------------------------------- */
/* RECOUP-NY                                                                   */
/* -------------------------------------------------------------------------- */

/*
 * Two sources in one Drive file ("RECOUP-NY R01 (Final).docx",
 * `1PY6N4BANc4reOat5UAfpjTfOdDHphxqF`, revised 2026-10-28):
 *
 *   - The R01 summary table: the objectives and their ranks, the measures,
 *     the hypothesis and the assessment schedule.
 *   - An excerpt of the results manuscript (abstract, introduction, methods,
 *     participant characteristics), added by the project team for the page.
 *     It describes the trial **as run**, so it wins wherever it and the grant
 *     table differ: five *sessions* (not weeks), the participant and helper
 *     eligibility, the 42 sites from 28 organizations, 95 staff trained, and
 *     the national and NYC access figures. The excerpt ends before the
 *     effect estimates, so the page reports no outcomes — add a `findings`
 *     block when the results paper is out.
 *
 * The team named the protocol (PMID 40932843) as the main publication. The
 * grant number and the collaborators are from ClinicalTrials.gov
 * (NCT04913766).
 *
 * Each track's weeks count from that person's own enrollment, so the two
 * clocks are not one calendar; the timeline note says so.
 */
export const RECOUP_NY_DETAIL: ProjectDetail = {
  slug: "recoup-ny",
  name: "RECOUP-NY",
  expandedName:
    "Restoring Mental Health after COVID-19 Through Community-Based Psychological Services in New York City",
  tagline:
    "Training staff at New York City community organizations to deliver WHO's Problem Management Plus, and testing whether it reduces their clients' distress",
  status: "closed",
  statusLabel: "Completed",
  heroImage: RECOUP_NY_HERO_IMAGE,
  lede:
    "RECOUP-NY is a cluster-randomized trial of community-initiated care in New York City, run with the Mayor's Office of Community Mental Health and a community advisory group. Staff at community-based organizations who are not clinicians — case managers, financial counselors, immigration aides — were trained to deliver Problem Management Plus, the World Health Organization's five-session psychological intervention, and their clients' outcomes were compared with usual services. Its 1,206 participants were 74% women; 58% were Latino, 22% Black and 11% Asian.",

  facts: [
    {
      term: "Design",
      detail: "Two-group cluster-randomized superiority trial",
    },
    {
      term: "Funder",
      detail: "National Institute of Mental Health (R01 MH127767)",
    },
    { term: "Location", detail: "New York City" },
    { term: "Intervention", detail: "Problem Management Plus (WHO)" },
    { term: "Enrollment", detail: "October 2022 – August 2025" },
    { term: "Final follow-up", detail: "9 February 2026" },
    { term: "Registration", detail: "ClinicalTrials.gov NCT04913766" },
  ],

  figures: [
    { value: "1,206", label: "Adults enrolled", note: "Of 2,189 screened" },
    {
      value: "42",
      label: "Community sites",
      note: "From 28 organizations, randomized 1:1",
    },
    { value: "95", label: "Staff trained in PM+", note: "Nonclinicians at PM+ sites" },
    { value: "74%", label: "Completed 20-week follow-up", note: "892 of 1,206" },
  ],

  rationale: [
    "Of the 60 million people in the United States living with a mental health condition, only half received treatment in the past year — and the gap is widest for racial and ethnic minoritized communities. 58% of non-Latino White adults with a condition receive care, against 44% of Latino, 39% of Black and 33% of Asian Americans.",
    "New York City shows that more clinicians alone do not close it. The city has one mental health provider for every 250 residents, against a national average of one per 320, and still a million New Yorkers a year cannot access mental health services. COVID-19 widened the gap: in a 2020 poll, Latinx and Asian American New Yorkers reported job loss, reduced hours and financial stress at rates about 15–20% higher than White Americans.",
    "Community-initiated care is one answer. Community-based organizations — the nonprofits that provide food, housing, employment and family support — already employ people from the communities they serve, who share their clients' cultures and languages. Trained, those staff can identify clients in distress and deliver a brief psychological intervention themselves, outside the health care system.",
  ],

  arms: [
    {
      name: "Usual services",
      body: "Routine social services and, when indicated, referral to public-sector mental health services or the organization's contracted specialists — so the trial measures what PM+ adds to existing services.",
    },
    {
      name: "Problem Management Plus",
      abbr: "PM+",
      body: "Nonclinical staff at the organization, trained and supervised, deliver five individual PM+ sessions to clients in distress, building on service relationships they already have.",
      isIntervention: true,
    },
  ],

  strategy: {
    heading: "What Problem Management Plus is",
    body: [
      "Problem Management Plus (PM+) is a five-session, manualized, transdiagnostic intervention designed by the World Health Organization for delivery by nonclinicians. It combines stress management, problem solving, behavioural activation and strengthening social support, and it works on the problems clients themselves rank as most pressing rather than on clinical symptoms alone.",
      "PM+ has shown benefit in 12 randomized controlled trials in 10 countries, including Jordan, Kenya, Nepal, Pakistan and Turkey. RECOUP-NY is the first trial of individually delivered PM+ with the general population in the United States.",
    ],
    elements: [
      {
        term: "Nonclinician helpers",
        body: "Staff aged 20 or older who provide nonclinical services at a PM+ site. Licensed clinicians are excluded, because the point is to grow the nonclinical workforce. Of the 95 trained, 48% were Latino, 27% Black, 10% Asian and 6% White.",
      },
      {
        term: "Remote training, weekly supervision",
        body: "Twelve remote 2.5-hour sessions, one or two a week, plus two hours a week of asynchronous work, then an hour of supervision every week for the rest of the study. Training and supervision were also offered in Spanish.",
      },
      {
        term: "Competency checked with EQUIP",
        body: "The WHO–UNICEF EQUIP platform monitored each helper's competency and flagged potentially harmful behaviours.",
      },
      {
        term: "Case-finding by staff",
        body: "Staff refer clients they think may be in distress using the Community Informant Detection Tool — short descriptions of how distress, depression and anxiety commonly show up, tailored to the local population.",
      },
    ],
  },

  objectives: [
    {
      rank: "primary",
      title: "Competency of PM+ helpers",
      measures: [
        {
          abbr: "ENACT",
          name: "Enhancing Assessment of Common Therapeutic Factors",
        },
        { abbr: "CASES-G", name: "Counselor Activity Self-Efficacy Scale" },
        { abbr: "RTC", name: "Reducing Tension Checklist" },
        { abbr: "CHS", name: "Cultural Humility Scale" },
      ],
    },
    {
      rank: "primary",
      title: "Clinical effectiveness of PM+ for participants",
      measures: [
        {
          abbr: "PSYCHLOPS",
          name: "Psychological Outcomes Profile",
          detail:
            "The primary outcome, at 20 weeks: a personalized measure in which participants name the problems that trouble them most and rate how much they are affected, scored 0–20. It was registered as primary on 6 October 2022, before recruitment began, replacing the PHQ-9.",
        },
        {
          abbr: "PHQ-9",
          name: "Patient Health Questionnaire-9",
          detail: "Depression, 0–27. Also scored for treatment response and remission.",
        },
        {
          abbr: "GAD-7",
          name: "Generalized Anxiety Disorder-7",
          detail: "Anxiety, 0–21. Also scored for treatment response and remission.",
        },
        { abbr: "PCL-5", name: "PTSD Checklist for DSM-5", detail: "The 4-item version, 0–16." },
        { abbr: "EQ-5D-5L", name: "EuroQol five-dimension scale" },
        { abbr: "RTC", name: "Reducing Tension Checklist" },
        { abbr: "IUS", name: "Intolerance of Uncertainty Scale" },
      ],
    },
    {
      rank: "secondary",
      title: "Cost effectiveness of PM+",
      measures: [
        { abbr: "EQ-5D-5L", name: "EuroQol five-dimension scale" },
        {
          abbr: "CSRI",
          name: "Client Service Receipt Inventory",
          detail:
            "Service use: outpatient care, emergency department visits, psychiatric hospitalization, insurance coverage.",
        },
      ],
    },
    {
      rank: "secondary",
      title: "Implementation of PM+ in community-based organizations",
      measures: [
        { name: "Qualitative interviews" },
        {
          abbr: "Be-FITS-MH",
          name: "Barriers and Facilitators in Implementation of Task-Sharing in Mental Health",
        },
      ],
    },
  ],

  hypotheses: [
    "PM+ delivered by non-specialists significantly reduces distress — problem severity and symptoms of depression, anxiety and PTSD — compared with usual services, through psychosocial behavioural change.",
  ],

  tracks: [
    {
      id: "helper",
      label: "PM+ helpers",
      population: "95 nonclinical staff at organizations in the PM+ arm",
    },
    {
      id: "participant",
      label: "Participants",
      population: "1,206 adult clients of 39 community sites",
    },
  ],

  timelineNote:
    "Each track's weeks count from that person's own enrollment. Participants were assessed by phone, video or in person, in their preferred language, with the baseline within two weeks of enrollment.",
  timeline: [
    {
      kind: "point",
      track: "helper",
      code: "T0",
      when: "Week 1",
      title: "Screening, enrollment and pre-training assessment",
    },
    {
      kind: "point",
      track: "participant",
      code: "T0",
      when: "Week 1",
      title: "Screening, enrollment and baseline assessment",
    },
    {
      kind: "phase",
      track: "participant",
      when: "Weeks 1–10",
      title: "Usual services or PM+",
      detail:
        "The randomized contrast: each site was assigned to one arm before any client was recruited, and every client follows their site's arm.",
    },
    {
      kind: "point",
      track: "participant",
      code: "T1",
      when: "Week 10",
      title: "Midline assessment",
    },
    {
      kind: "phase",
      track: "helper",
      when: "Weeks 1–12",
      title: "PM+ training",
      detail: "Twelve remote 2.5-hour sessions.",
    },
    {
      kind: "point",
      track: "helper",
      code: "T1",
      when: "Week 12",
      title: "Post-training assessment",
    },
    {
      kind: "point",
      track: "participant",
      code: "T2",
      when: "Week 20",
      title: "Endline assessment",
      detail: "The primary outcome timepoint.",
    },
    {
      kind: "phase",
      track: "helper",
      when: "Weeks 12–24",
      title: "Closely supervised PM+ delivery",
    },
    {
      kind: "point",
      track: "helper",
      code: "T2",
      when: "Week 24",
      title: "Post-training assessment",
    },
    {
      kind: "phase",
      track: "helper",
      when: "Weeks 24–52",
      title: "Continued PM+ delivery",
    },
    {
      kind: "point",
      track: "helper",
      code: "T3",
      when: "Week 52",
      title: "Post-training assessment and qualitative interviews",
    },
    {
      kind: "point",
      track: "participant",
      code: "T3",
      when: "Week 52",
      title: "Qualitative interviews",
    },
  ],

  eligibilityNote:
    "The criteria the trial ran on. Clients were referred by organization staff and screened by researchers; anyone excluded for higher-acuity needs was referred to specialized services.",
  eligibility: [
    {
      group: "Community-based organizations",
      criteria: [
        "Nonprofit, reachable by public transportation, serving 50 or more clients a month",
        "Mental health services are not its primary mission",
        "Each site a single location; an organization's sites count separately only if they serve different neighbourhoods and clients",
      ],
    },
    {
      group: "PM+ helpers",
      criteria: [
        "Aged 20 or older",
        "Provides nonclinical services to clients at a PM+ site",
        "Not a licensed clinical professional",
      ],
    },
    {
      group: "Participants — inclusion",
      criteria: [
        "Aged 18 or older and living in New York City",
        "Fluent in English, Spanish, Mandarin, Cantonese or French",
        "Psychological distress: PHQ-4 score of 3 or more",
        "Functional impairment: self-reported Global Assessment of Functioning of 90 or below",
      ],
    },
    {
      group: "Participants — exclusion",
      criteria: [
        "A psychiatric emergency department visit or hospitalization in the past 6 months",
        "A suicide attempt in the past 2 weeks, or current suicidal ideation",
        "Diagnosed cognitive impairment",
        "Ongoing substance use treatment, or other acute clinical risk found at screening",
      ],
    },
  ],

  publications: [
    {
      slug: "expanding-the-non-clinical-mental-health-workforce-protocol-for-a-rand",
      note: "Trial protocol",
    },
    {
      slug: "remote-delivered-psychosocial-support-to-improve-the-wellbeing-and-fun",
      note: "Pilot study",
    },
  ],
  publicationsNote:
    "The trial protocol, and the pilot that established remote PM+ training and delivery in New York City.",

  /* The registry's collaborators, and the city office the trial was run
     with. */
  partners: [
    "NYC Mayor's Office of Community Mental Health",
    "The New School",
    "Duke University",
    "Human Sciences Research Council",
  ],

  resources: [
    {
      label: "Trial registration (NCT04913766)",
      href: "https://clinicaltrials.gov/study/NCT04913766",
      kind: "site",
    },
  ],

  contact: {
    name: "Brandon Kohrt, MD, PhD",
    role: "Principal investigator",
    email: "bkohrt@gwu.edu",
  },

  /* PM+ in Nepal, EQUIP for helper competency, and the portfolio's other
     WHO psychological intervention. */
  relatedSlugs: ["standstrong", "equip", "restore"],
};

/** Every project with a detail record, keyed by slug. */
export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  [RESHAPE_DETAIL.slug]: RESHAPE_DETAIL,
  [UNICEF_MMAP_DETAIL.slug]: UNICEF_MMAP_DETAIL,
  [EQUIP_PROJECT_DETAIL.slug]: EQUIP_PROJECT_DETAIL,
  [RECOUP_NY_DETAIL.slug]: RECOUP_NY_DETAIL,
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
