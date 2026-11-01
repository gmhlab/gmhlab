/**
 * The member workspace (the dashboard behind sign-in): accounts and their
 * tiers, profile review, access requests, course progress, the photo library
 * and storefront orders — the records, and the services a backend provides.
 *
 * Access rules are pure helpers here (`canAccess`), so the UI that greys out a
 * locked tile and the route that refuses to render it agree by construction.
 */

/* ── Accounts ─────────────────────────────────────────────────────────── */

/**
 * What an account is, in increasing order of reach. Sign-up is open and
 * always yields a `member`; every other tier is granted, never self-selected.
 */
export type Tier = "member" | "partner" | "staff" | "admin";

export const TIERS: Tier[] = ["member", "partner", "staff", "admin"];

/** The fields a person edits about themselves. */
export type Profile = {
  name: string;
  /** Public: goes through review. */
  title: string;
  location: string;
  /** Public: goes through review. */
  bio: string;
  /** Optional and never inferred. */
  pronouns?: string;
};

/** The public part of a profile — what review guards. */
export type PublicProfile = Pick<Profile, "title" | "bio">;

export type Account = Profile & {
  id: string;
  email: string;
  tier: Tier;
  /** Project slugs a partner has been approved for. */
  projects: string[];
  /** The storefront plan, if one was bought (a `PlanSku`). */
  plan?: PlanSku;
  /** Ids of modules bought one at a time. */
  owned: string[];
  /** ISO date. */
  joined: string;
  /** The public profile as last approved — what the public site shows. */
  published?: PublicProfile;
  /** Headshot URL. Omit for an initials monogram. */
  photo?: string;
  /**
   * The public profile this account owns (a team page slug). Set for people
   * listed on the site; a plain sign-up has none and appears nowhere public.
   */
  profileSlug?: string;
};

/** An approved profile as the public site shows it. */
export type PublishedProfile = {
  profileSlug: string;
  name: string;
  title: string;
  /** Paragraphs separated by a blank line. */
  bio: string;
  location: string;
  photo?: string;
};

/** Open sign-up. */
export type Registration = {
  name: string;
  email: string;
  password: string;
};

export type ReviewStatus = "pending" | "approved" | "declined";

/** A request to be granted more reach than a member has. */
export type AccessRequest = {
  id: string;
  accountId: string;
  kind: "staff" | "project";
  /** The project slug, for `kind: "project"`. */
  project?: string;
  note: string;
  status: ReviewStatus;
  at: string;
  decidedAt?: string;
};

/** A proposed change to public profile copy; nothing is public until approved. */
export type ProfileSubmission = {
  id: string;
  accountId: string;
  before: PublicProfile;
  after: PublicProfile;
  status: ReviewStatus;
  at: string;
  decidedAt?: string;
  reviewNote?: string;
};

/** The admin queue, with the people it refers to. */
export type ReviewQueue = {
  submissions: ProfileSubmission[];
  requests: AccessRequest[];
  people: Pick<Account, "id" | "name" | "email" | "tier" | "projects" | "photo">[];
};

/** One account's own requests and submissions, newest first. */
export type AccountActivity = {
  requests: AccessRequest[];
  submissions: ProfileSubmission[];
};

/**
 * What an account backend must provide, for the signed-in account. Sign-in
 * itself is the `AuthService`'s job; this service reads the same session.
 */
export interface AccountService {
  /** The signed-in account, or null. */
  getAccount(): Promise<Account | null>;
  getActivity(): Promise<AccountActivity>;
  /**
   * Save private fields at once; file changed public fields (`title`, `bio`)
   * for review. Resolves with the submission when one was filed.
   */
  saveProfile(profile: Profile): Promise<ProfileSubmission | null>;
  requestAccess(input: Pick<AccessRequest, "kind" | "project" | "note">): Promise<AccessRequest>;
  /** Admins only; rejects for anyone else. */
  getReviewQueue(): Promise<ReviewQueue>;
  decideSubmission(id: string, approve: boolean, note?: string): Promise<void>;
  decideRequest(id: string, approve: boolean): Promise<void>;
  /**
   * Every approved profile owned by an account — public, no session needed.
   * The public site overlays these on its own people records.
   */
  getPublishedProfiles(): Promise<PublishedProfile[]>;
}

/** Whether public profile copy changed against what is live. */
export function publicProfileChanged(account: Account, next: PublicProfile): boolean {
  const live = account.published ?? { title: account.title, bio: account.bio };
  return live.title !== next.title || live.bio !== next.bio;
}

/* ── Entitlements ─────────────────────────────────────────────────────── */

export type PlanSku = "member" | "practitioner" | "institution";

export const PLAN_SKUS: PlanSku[] = ["member", "practitioner", "institution"];

/** How a module (or any gated resource) is opened. */
export type Access =
  | { kind: "open" }
  /** Included in a plan; buyable on its own when the resource has a price. */
  | { kind: "plan"; plan: Exclude<PlanSku, "member"> }
  /** For approved partners — any project unless one is named. */
  | { kind: "project"; project?: string }
  | { kind: "tier"; min: Exclude<Tier, "member"> };

export const tierAtLeast = (account: Pick<Account, "tier">, tier: Tier) =>
  TIERS.indexOf(account.tier) >= TIERS.indexOf(tier);

export const planAtLeast = (account: Pick<Account, "plan">, plan: PlanSku) =>
  PLAN_SKUS.indexOf(account.plan ?? "member") >= PLAN_SKUS.indexOf(plan);

/**
 * Whether an account may open a gated resource. Admins open everything;
 * staff everything but admin-only. `id` is checked against `owned` for
 * one-off purchases.
 */
export function canAccess(
  account: Pick<Account, "tier" | "plan" | "owned" | "projects">,
  resource: { id: string; access: Access },
): boolean {
  if (account.tier === "admin") return true;
  const rule = resource.access;
  switch (rule.kind) {
    case "open":
      return true;
    case "plan":
      return (
        tierAtLeast(account, "staff") ||
        account.owned.includes(resource.id) ||
        planAtLeast(account, rule.plan)
      );
    case "project":
      return (
        tierAtLeast(account, "staff") ||
        (rule.project ? account.projects.includes(rule.project) : account.projects.length > 0)
      );
    case "tier":
      return tierAtLeast(account, rule.min);
  }
}

/* ── Learning ─────────────────────────────────────────────────────────── */

/** One account's progress through one course. */
export type CourseProgress = {
  completed: string[];
  /** Best quiz score, 0–1. */
  quizScore?: number;
  certifiedAt?: string;
};

/** Course id → progress, for the signed-in account. */
export type LearningProgress = Record<string, CourseProgress>;

export interface LearningService {
  getProgress(): Promise<LearningProgress>;
  completeLesson(courseId: string, lessonId: string): Promise<CourseProgress>;
  recordQuiz(courseId: string, score: number): Promise<CourseProgress>;
  certify(courseId: string): Promise<CourseProgress>;
}

/** Share of a course's lessons done, 0–1. */
export function courseCompletion(progress: CourseProgress | undefined, lessonCount: number): number {
  if (!progress || lessonCount === 0) return 0;
  return Math.min(1, progress.completed.length / lessonCount);
}

/* ── Media ────────────────────────────────────────────────────────────── */

export type Photo = {
  id: string;
  /** Image URL (a data URL in the demo backend). */
  src: string;
  caption: string;
  credit: string;
  tags: string[];
  /** Consent from every identifiable person was recorded. Uploads require it. */
  consent: true;
  uploadedBy: string;
  at: string;
};

export type PhotoUpload = Omit<Photo, "id" | "at" | "uploadedBy">;

export interface MediaService {
  listPhotos(): Promise<Photo[]>;
  /** Rejects without consent. */
  uploadPhoto(upload: PhotoUpload): Promise<Photo>;
  removePhoto(id: string): Promise<void>;
}

/* ── Storefront ───────────────────────────────────────────────────────── */

export type OrderLine = {
  /** A module id, or `plan:<sku>` for a plan. */
  id: string;
  name: string;
  price: number;
};

export type Order = {
  id: string;
  accountId: string;
  lines: OrderLine[];
  total: number;
  at: string;
};

/** Plans and add-ons; grants what was bought to the signed-in account. */
export interface CheckoutService {
  checkout(lines: OrderLine[], plan?: PlanSku): Promise<Order>;
  getOrders(): Promise<Order[]>;
}

export const planLineId = (sku: PlanSku) => `plan:${sku}`;
