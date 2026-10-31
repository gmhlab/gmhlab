import type { HandbookSection, ModuleArt, ProjectRoom } from "@gmhlab/blocks";
import { PROJECTS } from "./projects-data";

/**
 * Workspace records beyond the module catalogue: the project rooms and the
 * staff handbook.
 *
 * Provenance:
 * - **Rooms are derived from `PROJECTS`** (name, tagline, logo) — one room per
 *   project, so a new project gets a room for free. The resource list is the
 *   same **placeholder outline** for every room: no file is uploaded yet, so
 *   no resource has an `href` and the UI says "File not uploaded yet". No
 *   contacts are listed until each project names one.
 * - **The handbook is a placeholder outline** written for the 2026-10-31
 *   dashboard build. It states no actual lab policy; the lab manager must
 *   replace it before staff rely on it. The page says so.
 */

const ART: ModuleArt[] = [
  { kind: "glyph", name: "community" },
  { kind: "glyph", name: "competency" },
  { kind: "glyph", name: "care-delivery" },
  { kind: "glyph", name: "maternal" },
  { kind: "glyph", name: "task-sharing" },
  { kind: "glyph", name: "young-people" },
  { kind: "glyph", name: "stigma" },
  { kind: "glyph", name: "measurement" },
];

export const PROJECT_ROOMS: ProjectRoom[] = PROJECTS.map((project, i) => ({
  slug: project.slug,
  name: project.name,
  summary: project.tagline,
  logo: project.logo,
  art: ART[i % ART.length]!,
  resources: [
    { title: "Study protocol", kind: "Protocol", detail: "The current approved protocol and its amendments." },
    { title: "Measures and instruments", kind: "Measure", detail: "Outcome measures, translations and scoring guides." },
    { title: "Training materials", kind: "Training", detail: "Facilitator manuals and session slides for partners." },
    { title: "Partner onboarding", kind: "Template", detail: "Agreements, data-sharing forms and contact sheet." },
  ],
}));

/** Every project, for access requests: slug → name. */
export const PROJECT_OPTIONS = PROJECTS.map(({ slug, name }) => ({ slug, name }));

export const HANDBOOK_SECTIONS: HandbookSection[] = [
  {
    id: "data",
    title: "Handling data",
    summary: "Where study data lives and who may see it.",
    points: [
      "Keep identifiable data only in the storage your protocol approves.",
      "Never email identifiable data; share through approved storage.",
      "Report a suspected breach to the lab manager the same day.",
    ],
  },
  {
    id: "authorship",
    title: "Authorship",
    summary: "Agree authorship early and write it down.",
    points: [
      "Discuss authorship when a paper is planned, not when it is submitted.",
      "Follow the ICMJE criteria; acknowledge contributors who don't meet them.",
      "Include partner-country colleagues as authors wherever they qualify.",
    ],
  },
  {
    id: "brand",
    title: "Presenting the lab",
    summary: "Slides, posters and email on-brand.",
    points: [
      "Build decks in the slide studio and keep the mark on every slide.",
      "Use gold as a fill, never as text on white.",
      "Use only photos from the library, with their credit.",
    ],
  },
  {
    id: "travel",
    title: "Travel",
    summary: "Before any field visit.",
    points: [
      "Get travel approved before booking.",
      "Register the trip with the university's travel office.",
      "Share your itinerary and emergency contacts with the lab manager.",
    ],
  },
];

export const HANDBOOK_CHECKLIST = [
  "Complete human subjects research training",
  "Get access to the lab's shared drive",
  "Add your email signature from the workspace",
  "Submit your bio and title for the team page",
  "Meet your project lead",
  "Read the data handling section",
];

export const HANDBOOK_NOTE =
  "Placeholder outline for the workspace prototype — not the lab's actual policy. The lab manager will replace it.";
export const ROOMS_NOTE =
  "Rooms are generated from the project portfolio. Their files haven't been uploaded yet.";
