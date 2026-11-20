import type { HandbookSection, ModuleArt, ProjectRoom } from "@gmhlab/blocks";
import { PROJECT_DETAIL_SLUGS } from "./project-detail-data";
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
 * - **Links**: `siteHref` is the project's public detail page, set only for
 *   projects that have one (`PROJECT_DETAIL_SLUGS`), so no room links a 404.
 *   `folder` is the project's folder in the Center's shared drive ("Project
 *   folders", https://drive.google.com/drive/folders/1KE1lb6GqOJnfZn-suUeBWwNpGx71dRZ9),
 *   and `summary` the "Project Summary" document inside it (2026-11-20). IDEA,
 *   EQUIP-SU, HOPE and SCAPE-U have no folder yet; their rooms say "Folder
 *   not linked yet". Opening a link needs access to the shared drive.
 *   Summaries open as a read-only preview; who may edit is still the
 *   drive's sharing, not this link.
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

const folder = (id: string) => `https://drive.google.com/drive/folders/${id}`;
/** Read-only preview: no editing toolbar, even for people who can edit the file. */
const doc = (id: string) => `https://docs.google.com/document/d/${id}/preview`;

/** Project slug → its shared-drive folder and the Project Summary inside it. */
const ROOM_DRIVE: Record<string, { folder: string; summary: string }> = {
  alive: { folder: folder("1-UHdrKfkWuMxZoOHB0sNToVLfCW7XjbZ"), summary: doc("1Dkk-cMOvOohEyqSnNH_xMhyL_Jk7fWtx1PxlsU9G358") },
  equip: { folder: folder("1_d8DyCnvNoEkEs7-3zCsvFoxvRdZn0qX"), summary: doc("19qLeAP6AiL_Y0_Swsfk4fTolT79mRD5hQKPifLDmuKw") },
  "recoup-ny": { folder: folder("147ZXVrpNOl0R3QnsSEffQr1_ui1mtaSL"), summary: doc("1AG79Rp3TA4hTK9R3V6h8zxdFaJX8zTVSkEZ-3kYjNpk") },
  "unicef-mmapp": { folder: folder("1Ld0i9OGfFVkO6rnYHo0lp1WmpIq9Rlwn"), summary: doc("1mszKp4gDl6KuNq95UPVSp0SJ1nPVx99PosGay25KObI") },
  reshape: { folder: folder("1J1CgtiU-jHISY8V60VwvisvQk-D7QAtO"), summary: doc("1WXn0VBFaiDH0r1621TGrIpIg1865LkosrAPn6eKYxJA") },
  restore: { folder: folder("1atmFbjNRBfPjjvfDXnwjIp8A7WuOHDlA"), summary: doc("16KScVdXn8pqMxkaTQf_4fyBalH0mbI3ah02TL6ZwE88") },
  standstrong: { folder: folder("1oEKuqsuYuYD6gO4lQr-AyEyyjhF36YQZ"), summary: doc("16BmwRlU5kt--0jGw28b4hHAsuuaoExRf8Lwy36drXng") },
};

export const PROJECT_ROOMS: ProjectRoom[] = PROJECTS.map((project, i) => ({
  slug: project.slug,
  name: project.name,
  summary: project.tagline,
  logo: project.logo,
  art: ART[i % ART.length]!,
  folder: ROOM_DRIVE[project.slug] && { href: ROOM_DRIVE[project.slug]!.folder },
  siteHref: PROJECT_DETAIL_SLUGS.includes(project.slug) ? `/projects/${project.slug}` : undefined,
  resources: [
    {
      title: "Project summary",
      kind: "Summary",
      detail: "The project at a glance: aims, sites, team and timeline.",
      href: ROOM_DRIVE[project.slug]?.summary,
    },
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
  "Rooms are generated from the project portfolio. Folders and summaries open in the Center's shared drive; the other files haven't been uploaded yet, and the message board is stored in this browser only.";
