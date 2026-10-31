import type { AuthService, User } from "../auth";
import type {
  AccessRequest,
  Account,
  AccountService,
  CheckoutService,
  CourseProgress,
  LearningService,
  MediaService,
  Order,
  Photo,
  ProfileSubmission,
} from "../workspace";
import { delay } from "./delay";

/**
 * The member workspace's demo backend: one JSON document in localStorage,
 * shared by five services (auth, accounts, learning, media, checkout) so the
 * whole flow — sign up, request access, edit a bio, approve it from the admin
 * account, finish a course, buy a module — works end to end in one browser.
 *
 * Nothing is secure and nothing leaves the browser: each visitor gets their
 * own copy of the seed. The four seeded accounts share `DEMO_PASSWORD`, which
 * is how a demo "view as" switch signs between them. Every storage access is
 * guarded, so these are safe to construct during server rendering.
 */

export const DEMO_PASSWORD = "demo";

const KEY = "gmh-workspace-v1";

type StoredAccount = Account & { password: string };

type Db = {
  version: 1;
  accounts: StoredAccount[];
  sessionId: string | null;
  requests: AccessRequest[];
  submissions: ProfileSubmission[];
  progress: Record<string, Record<string, CourseProgress>>;
  photos: Photo[];
  orders: Order[];
};

/** The seeded demo people. Invented — never real lab members. */
export const MOCK_WORKSPACE_ACCOUNTS: Account[] = [
  {
    id: "acc-member",
    name: "Maya Okafor",
    email: "member@demo.gmhlab.org",
    tier: "member",
    title: "Community health worker trainer",
    location: "Lagos, Nigeria",
    bio: "Maya trains community health workers in psychosocial support and joined to use the training courses with her cohort.",
    projects: [],
    owned: [],
    joined: "2026-09-02",
  },
  {
    id: "acc-partner",
    name: "Rajan Thapa",
    email: "partner@demo.gmhlab.org",
    tier: "partner",
    title: "Field supervisor",
    location: "Kathmandu, Nepal",
    bio: "Rajan supervises helpers at partner field sites and runs role-play assessments with new trainees.",
    projects: ["equip"],
    plan: "practitioner",
    owned: [],
    joined: "2026-06-14",
  },
  {
    id: "acc-staff",
    name: "Ana Lucía Torres",
    email: "staff@demo.gmhlab.org",
    tier: "staff",
    title: "Research coordinator",
    location: "Washington, DC",
    bio: "Ana Lucía coordinates study operations across the lab's projects.",
    projects: ["equip", "reshape"],
    owned: [],
    joined: "2025-11-03",
    published: {
      title: "Research coordinator",
      bio: "Ana Lucía coordinates study operations across the lab's projects.",
    },
  },
  {
    id: "acc-admin",
    name: "Dana Whitfield",
    email: "admin@demo.gmhlab.org",
    tier: "admin",
    title: "Lab manager",
    location: "Washington, DC",
    bio: "Dana runs the lab's operations, accounts and approvals.",
    projects: [],
    owned: [],
    joined: "2025-01-10",
  },
];

function seed(): Db {
  return {
    version: 1,
    accounts: MOCK_WORKSPACE_ACCOUNTS.map((a) => ({ ...a, password: DEMO_PASSWORD })),
    sessionId: null,
    requests: [
      {
        id: "req-seed-1",
        accountId: "acc-member",
        kind: "project",
        project: "equip",
        note: "I run a 30-person helper cohort and would like the partner toolkit.",
        status: "pending",
        at: "2026-10-28T14:12:00Z",
      },
    ],
    submissions: [
      {
        id: "sub-seed-1",
        accountId: "acc-staff",
        before: {
          title: "Research coordinator",
          bio: "Ana Lucía coordinates study operations across the lab's projects.",
        },
        after: {
          title: "Senior research coordinator",
          bio: "Ana Lucía coordinates study operations across the lab's projects, leads one study's data team and mentors the lab's student research assistants.",
        },
        status: "pending",
        at: "2026-10-30T09:40:00Z",
      },
    ],
    progress: {
      "acc-partner": {
        "helping-skills": { completed: ["hs-1", "hs-2", "hs-3"], quizScore: 0.8 },
        "competency-assessment": { completed: ["ca-1"] },
      },
      "acc-member": { "helping-skills": { completed: ["hs-1"] } },
    },
    photos: [],
    orders: [],
  };
}

/* ── storage ──────────────────────────────────────────────────────────── */

let cache: Db | null = null;

function read(): Db {
  if (cache) return cache;
  let db: Db | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Db) : null;
    db = parsed?.version === 1 ? parsed : null;
  } catch {
    // No storage (server render) — fall through to the seed, uncached.
    return seed();
  }
  cache = db ?? seed();
  return cache;
}

function write(next: Db) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Quota (photos are data URLs) or blocked storage: keep the memory copy.
  }
}

function update(fn: (db: Db) => Db) {
  write(fn(read()));
}

if (typeof window !== "undefined") {
  // Another tab signing in or out invalidates this tab's copy.
  window.addEventListener("storage", (event) => {
    if (event.key === KEY) cache = null;
  });
}

const LATENCY = 220;
const now = () => new Date().toISOString();
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const strip = ({ password: _password, ...account }: StoredAccount): Account => account;

function session(): StoredAccount | null {
  const db = read();
  return db.accounts.find((a) => a.id === db.sessionId) ?? null;
}

function requireSession(): StoredAccount {
  const account = session();
  if (!account) throw new Error("You're signed out. Sign in and try again.");
  return account;
}

const toUser = (account: Account): User => ({
  id: account.id,
  name: account.name,
  email: account.email,
  username: account.email.split("@")[0],
});

/** Put the seed back — every account, queue and purchase — keeping the session. */
export function resetMockWorkspace() {
  const sessionId = read().sessionId;
  const fresh = seed();
  write({ ...fresh, sessionId: fresh.accounts.some((a) => a.id === sessionId) ? sessionId : null });
}

/* ── auth ─────────────────────────────────────────────────────────────── */

export const mockWorkspaceAuthService: AuthService = {
  async login({ email, password }) {
    await delay(LATENCY);
    const account = read().accounts.find((a) => sameEmail(a.email, email));
    if (!account || account.password !== password) {
      throw new Error("That email and password don't match an account.");
    }
    update((db) => ({ ...db, sessionId: account.id }));
    return toUser(account);
  },

  async register({ name, email, password }) {
    await delay(LATENCY);
    if (!name.trim()) throw new Error("Tell us your name.");
    if (password.length < 4) throw new Error("Use at least 4 characters for your password.");
    const db = read();
    if (db.accounts.some((a) => sameEmail(a.email, email))) {
      throw new Error("An account with that email already exists. Sign in instead.");
    }
    const account: StoredAccount = {
      id: uid("acc"),
      name: name.trim(),
      email: email.trim(),
      password,
      tier: "member",
      title: "",
      location: "",
      bio: "",
      projects: [],
      owned: [],
      joined: now().slice(0, 10),
    };
    write({ ...db, accounts: [...db.accounts, account], sessionId: account.id });
    return toUser(account);
  },

  async logout() {
    await delay(LATENCY / 2);
    update((db) => ({ ...db, sessionId: null }));
  },

  async getCurrentUser() {
    const account = session();
    return account ? toUser(account) : null;
  },
};

/* ── accounts ─────────────────────────────────────────────────────────── */

export const mockAccountService: AccountService = {
  async getAccount() {
    const account = session();
    return account ? strip(account) : null;
  },

  async getActivity() {
    const account = session();
    const db = read();
    if (!account) return { requests: [], submissions: [] };
    return {
      requests: db.requests.filter((r) => r.accountId === account.id),
      submissions: db.submissions.filter((s) => s.accountId === account.id),
    };
  },

  async saveProfile(profile) {
    await delay(LATENCY);
    const account = requireSession();
    const live = account.published ?? { title: account.title, bio: account.bio };
    const changed = live.title !== profile.title || live.bio !== profile.bio;

    let submission: ProfileSubmission | null = null;
    update((db) => {
      const accounts = db.accounts.map((a) =>
        a.id === account.id
          ? { ...a, name: profile.name, location: profile.location, pronouns: profile.pronouns }
          : a,
      );
      if (!changed) return { ...db, accounts };
      submission = {
        id: uid("sub"),
        accountId: account.id,
        before: live,
        after: { title: profile.title, bio: profile.bio },
        status: "pending",
        at: now(),
      };
      return {
        ...db,
        accounts,
        // One open review per person: a newer edit replaces the pending one.
        submissions: [
          submission,
          ...db.submissions.filter((s) => !(s.accountId === account.id && s.status === "pending")),
        ],
      };
    });
    return submission;
  },

  async requestAccess({ kind, project, note }) {
    await delay(LATENCY);
    const account = requireSession();
    const request: AccessRequest = {
      id: uid("req"),
      accountId: account.id,
      kind,
      project,
      note,
      status: "pending",
      at: now(),
    };
    update((db) => ({ ...db, requests: [request, ...db.requests] }));
    return request;
  },

  async getReviewQueue() {
    const account = requireSession();
    if (account.tier !== "admin") throw new Error("Only admins can review.");
    const db = read();
    return {
      submissions: db.submissions,
      requests: db.requests,
      people: db.accounts.map(({ id, name, email, tier, projects }) => ({ id, name, email, tier, projects })),
    };
  },

  async decideSubmission(id, approve, note) {
    await delay(LATENCY);
    update((db) => {
      const submission = db.submissions.find((s) => s.id === id);
      if (!submission) return db;
      return {
        ...db,
        submissions: db.submissions.map((s) =>
          s.id === id
            ? { ...s, status: approve ? "approved" : "declined", decidedAt: now(), reviewNote: note }
            : s,
        ),
        accounts: approve
          ? db.accounts.map((a) =>
              a.id === submission.accountId
                ? { ...a, ...submission.after, published: submission.after }
                : a,
            )
          : db.accounts,
      };
    });
  },

  async decideRequest(id, approve) {
    await delay(LATENCY);
    update((db) => {
      const request = db.requests.find((r) => r.id === id);
      if (!request) return db;
      return {
        ...db,
        requests: db.requests.map((r) =>
          r.id === id ? { ...r, status: approve ? "approved" : "declined", decidedAt: now() } : r,
        ),
        accounts: !approve
          ? db.accounts
          : db.accounts.map((a) => {
              if (a.id !== request.accountId) return a;
              if (request.kind === "staff") {
                return { ...a, tier: a.tier === "admin" ? "admin" : "staff" };
              }
              return {
                ...a,
                tier: a.tier === "member" ? "partner" : a.tier,
                projects: [...new Set([...a.projects, request.project ?? ""].filter(Boolean))],
              };
            }),
      };
    });
  },
};

/* ── learning ─────────────────────────────────────────────────────────── */

function patchProgress(courseId: string, fn: (p: CourseProgress) => CourseProgress): CourseProgress {
  const account = requireSession();
  let result: CourseProgress = { completed: [] };
  update((db) => {
    const mine = db.progress[account.id] ?? {};
    result = fn(mine[courseId] ?? { completed: [] });
    return { ...db, progress: { ...db.progress, [account.id]: { ...mine, [courseId]: result } } };
  });
  return result;
}

export const mockLearningService: LearningService = {
  async getProgress() {
    const account = session();
    return account ? (read().progress[account.id] ?? {}) : {};
  },
  async completeLesson(courseId, lessonId) {
    return patchProgress(courseId, (p) =>
      p.completed.includes(lessonId) ? p : { ...p, completed: [...p.completed, lessonId] },
    );
  },
  async recordQuiz(courseId, score) {
    await delay(LATENCY);
    return patchProgress(courseId, (p) => ({ ...p, quizScore: Math.max(score, p.quizScore ?? 0) }));
  },
  async certify(courseId) {
    return patchProgress(courseId, (p) => ({ ...p, certifiedAt: p.certifiedAt ?? now() }));
  },
};

/* ── media ────────────────────────────────────────────────────────────── */

export const mockMediaService: MediaService = {
  async listPhotos() {
    return read().photos;
  },
  async uploadPhoto(upload) {
    await delay(LATENCY * 2);
    const account = requireSession();
    if (upload.consent !== true) throw new Error("Record consent before uploading.");
    const photo: Photo = { ...upload, id: uid("photo"), at: now(), uploadedBy: account.name };
    update((db) => ({ ...db, photos: [photo, ...db.photos] }));
    return photo;
  },
  async removePhoto(id) {
    update((db) => ({ ...db, photos: db.photos.filter((p) => p.id !== id) }));
  },
};

/* ── checkout ─────────────────────────────────────────────────────────── */

/** Records a demo order and grants what it bought. No payment is taken. */
export const mockCheckoutService: CheckoutService = {
  async checkout(lines, plan) {
    await delay(LATENCY * 3);
    const account = requireSession();
    const order: Order = {
      id: uid("ord"),
      accountId: account.id,
      lines,
      total: lines.reduce((sum, line) => sum + line.price, 0),
      at: now(),
    };
    update((db) => ({
      ...db,
      orders: [order, ...db.orders],
      accounts: db.accounts.map((a) =>
        a.id === account.id
          ? {
              ...a,
              plan: plan ?? a.plan,
              owned: [
                ...new Set([...a.owned, ...lines.filter((l) => !l.id.startsWith("plan:")).map((l) => l.id)]),
              ],
            }
          : a,
      ),
    }));
    return order;
  },
  async getOrders() {
    const account = session();
    return account ? read().orders.filter((o) => o.accountId === account.id) : [];
  },
};
