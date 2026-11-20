import type { Access, Tier } from "@gmhlab/core";
import type { ResearchGlyphName } from "@gmhlab/ui";
import type { LitArt } from "../shared/lit";
import type { ComponentType, ReactNode } from "react";

/**
 * The *contract* for the member workspace (the dashboard): the records its
 * blocks render. The account, progress, photos and review queue are core
 * types (`@gmhlab/core` `workspace.ts`) delivered by `@gmhlab/data`'s
 * workspace hooks; the records below are **content** — the module catalogue,
 * courses, project rooms — and live in the consuming app
 * (`apps/web/src/content/`).
 *
 * Unlike the public page blocks, dashboard blocks are interactive and take
 * callbacks (`onSave`, `onCheckout`, …). They are only ever rendered by
 * client route wrappers, which bind them to the data hooks.
 */

/* ── Links ────────────────────────────────────────────────────────────── */

/**
 * The element every dashboard link renders through — pass the router's link
 * (`next/link`) for client navigation. Defaults to a plain `<a>`.
 */
export type DashboardLinkComponent = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  "aria-current"?: "page";
  "aria-label"?: string;
}>;

/* ── Modules ──────────────────────────────────────────────────────────── */

/** A module's art — the lit language's graphics-kit drawing. */
export type ModuleArt = LitArt;

export type ModuleNavGroup = "Learn" | "Create" | "Workspace" | "Lab";

/** Icon keys the shell knows how to draw (lucide icons, mapped internally). */
export type ModuleIcon =
  | "training"
  | "palette"
  | "shapes"
  | "slides"
  | "mail"
  | "folder"
  | "images"
  | "book"
  | "shield"
  | "chart"
  | "layout"
  | "users";

export type DashboardModule = {
  id: string;
  title: string;
  /** One line, on the tile. */
  tagline: string;
  /** Two or three sentences, on the product card. */
  description: string;
  href: string;
  category: string;
  art: ModuleArt;
  icon: ModuleIcon;
  access: Access;
  /** Buyable on its own, in dollars. Only meaningful for `plan` access. */
  price?: number;
  /** What a buyer gets, as product-card bullets. */
  includes: string[];
  /** Listed but not built: never linked. */
  soon?: boolean;
  /** Sidebar group. Omit to keep a module out of the sidebar. */
  nav?: ModuleNavGroup;
};

export const TIER_LABEL: Record<Tier, string> = {
  member: "Member",
  partner: "Project partner",
  staff: "Staff",
  admin: "Admin",
};

/** Why a module is locked, phrased as what unlocks it. */
export function unlockHint(module: Pick<DashboardModule, "access" | "price">): string {
  const rule = module.access;
  switch (rule.kind) {
    case "open":
      return "";
    case "plan": {
      const plan = rule.plan === "practitioner" ? "Practitioner" : "Institution";
      return module.price !== undefined
        ? `In ${plan}, or $${module.price} on its own`
        : `Included in ${plan}`;
    }
    case "project":
      return "For approved project partners";
    case "tier":
      return rule.min === "admin" ? "Admins only" : "For staff";
  }
}

/* ── Home ─────────────────────────────────────────────────────────────── */

export type DashboardAnnouncement = {
  id: string;
  label: string;
  title: string;
  body: string;
  href?: string;
};

export type DashboardEvent = {
  id: string;
  /** ISO date. */
  date: string;
  title: string;
  detail: string;
};

/* ── Courses ──────────────────────────────────────────────────────────── */

export type LessonSection = { heading: string; body: string };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  sections: LessonSection[];
  keyPoints: string[];
  /** A short exercise before moving on. */
  tryIt?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
};

export type Course = {
  id: string;
  title: string;
  tagline: string;
  level: string;
  /** Gate, checked with core's `canAccess` (the course id is the resource id). */
  access: Access;
  glyph: ResearchGlyphName;
  /** A photograph the course card is built around; the glyph becomes its badge. */
  image?: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

/** Share of quiz answers needed to certify. */
export const COURSE_PASS_MARK = 0.7;

/* ── Practice studio ──────────────────────────────────────────────────── */

export type Competency = { id: string; name: string; short: string; look: string };

export type CompetencyLevel = { value: number; name: string; hint: string };

export type ScenarioLine = { speaker: string; line: string; note?: string };

export type PracticeScenario = {
  id: string;
  title: string;
  setting: string;
  lines: ScenarioLine[];
  /** Expert consensus rating per competency id. */
  expert: Record<string, number>;
  /** Why the experts rated as they did, per competency id. */
  rationale: Record<string, string>;
};

/* ── Project rooms ────────────────────────────────────────────────────── */

export type RoomResource = {
  title: string;
  kind: "Summary" | "Protocol" | "Measure" | "Training" | "Template" | "Report" | "Video";
  detail: string;
  href?: string;
};

export type ProjectRoom = {
  /** The project slug — the `project` an approved partner holds. */
  slug: string;
  name: string;
  summary: string;
  logo?: string;
  art: ModuleArt;
  resources: RoomResource[];
  contact?: { name: string; role: string; email?: string };
  /** The project's shared folder (Google Drive, Docs, …). Omit until one is linked. */
  folder?: { href: string; label?: string };
  /** The project's page on the public site. */
  siteHref?: string;
};

/** A work a room's admins can feature on the project's public page. */
export type RoomPublication = {
  slug: string;
  title: string;
  journal: string;
  year: number;
};

/* ── Handbook ─────────────────────────────────────────────────────────── */

export type HandbookSection = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};
