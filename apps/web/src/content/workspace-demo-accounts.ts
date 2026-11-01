import type { DemoAccountOption, Person } from "@gmhlab/blocks";
import type { Account, Tier } from "@gmhlab/core";
import type { MockWorkspaceSeed } from "@gmhlab/core/mocks";
import { TEAM } from "./team-data";

/**
 * The workspace's accounts: **one per person on the team page**, each owning
 * that person's public profile (`profileSlug` = their `TEAM` slug). This is
 * how the team will have profiles — edit in the dashboard, approve in the
 * review queue, and `/team` shows the approved version.
 *
 * - Profile fields (name, role, location, bio, headshot) start as the
 *   person's `TEAM` record; credentials, group, projects and links stay on
 *   the record, which a profile can't edit.
 * - Tiers follow the team group: core → staff (Brandon Kohrt → admin),
 *   affiliates with a project → project partners on it, students and
 *   alumni → members.
 * - Emails are `demo.gmhlab.org` addresses; every account signs in with
 *   `DEMO_PASSWORD` until the real backend replaces the demo store.
 * - The demo sign-ins are Farhana Alam (member), Laure Experton (partner),
 *   Ruta Rangel (staff) and Brandon Kohrt (admin).
 *
 * Changing the seed? Bump `SEED_ID`, or browsers keep their stored copy.
 */

const SEED_ID = "gmh-team-profiles-2026-10-31";

const ADMIN = "brandon-kohrt";

const bioOf = (p: Person) => (p.bio ?? []).join("\n\n");
const titleOf = (p: Person) => p.role ?? (p.program ? `Student, ${p.program}` : "");
const demoEmail = (slug: string) => `${slug.replace(/-/g, ".")}@demo.gmhlab.org`;
const accountId = (slug: string) => `acc-${slug}`;

function tierOf(p: Person): Tier {
  if (p.slug === ADMIN) return "admin";
  if (p.group === "core") return "staff";
  if (p.group === "affiliate" && p.projects?.length) return "partner";
  return "member";
}

function account(p: Person): Account {
  const title = titleOf(p);
  const bio = bioOf(p);
  return {
    id: accountId(p.slug),
    profileSlug: p.slug,
    name: p.name,
    email: demoEmail(p.slug),
    tier: tierOf(p),
    title,
    location: p.location ?? "",
    bio,
    photo: p.photo,
    projects: p.group === "core" || p.group === "affiliate" ? (p.projects ?? []) : [],
    owned: [],
    joined: "2026-10-31",
    // Everyone here is already on the team page: their profile is live.
    published: { title, bio },
    // Demo storefront state for the partner sign-in.
    ...(p.slug === "laure-experton" ? { plan: "practitioner" as const } : {}),
  };
}

export const WORKSPACE_DEMO_SEED: MockWorkspaceSeed = {
  id: SEED_ID,
  accounts: TEAM.map(account),
  requests: [
    {
      id: "req-seed-1",
      accountId: accountId("farhana-alam"),
      kind: "project",
      project: "equip",
      note: "Requesting access to the EQUIP project room.",
      status: "pending",
      at: "2026-10-30T14:12:00Z",
    },
  ],
  progress: {
    [accountId("laure-experton")]: {
      "helping-skills": { completed: ["hs-1", "hs-2", "hs-3"], quizScore: 0.8 },
      "competency-assessment": { completed: ["ca-1"] },
    },
    [accountId("farhana-alam")]: { "helping-skills": { completed: ["hs-1"] } },
  },
};

/** The one-click sign-ins on the login screen and the shell's "view as" menu. */
export const WORKSPACE_DEMO_ACCOUNTS: DemoAccountOption[] = [
  { email: demoEmail("farhana-alam"), label: "Farhana Alam", role: "Member" },
  { email: demoEmail("laure-experton"), label: "Laure Experton", role: "Project partner" },
  { email: demoEmail("ruta-rangel"), label: "Ruta Rangel", role: "Staff" },
  { email: demoEmail(ADMIN), label: "Brandon Kohrt", role: "Admin" },
];
