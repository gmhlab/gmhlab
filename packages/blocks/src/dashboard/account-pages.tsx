import {
  type AccessRequest,
  type Account,
  type AccountActivity,
  type Order,
  type Profile,
  type ProfileSubmission,
  type ReviewQueue,
  publicProfileChanged,
  tierAtLeast,
} from "@gmhlab/core";
import { Button, cn } from "@gmhlab/ui";
import { Check, Clock, Eye, Send, ShieldCheck, UserPlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Monogram } from "./dashboard-shell";
import { TIER_LABEL } from "./dashboard-types";
import { Chip, EASE, Item, PageHero, Panel, SectionTitle, Stagger } from "./kit";

const STATUS_TONE = { pending: "warning", approved: "success", declined: "neutral" } as const;

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** A word-level diff: removed words struck, added words highlighted. */
export function WordDiff({ before, after }: { before: string; after: string }) {
  const parts = useMemo(() => {
    const a = before.split(/(\s+)/);
    const b = after.split(/(\s+)/);
    // LCS over tokens — bios are short, so O(n·m) is fine.
    const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    const out: { text: string; kind: "same" | "add" | "del" }[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        out.push({ text: a[i]!, kind: "same" });
        i++;
        j++;
      } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) out.push({ text: a[i++]!, kind: "del" });
      else out.push({ text: b[j++]!, kind: "add" });
    }
    while (i < a.length) out.push({ text: a[i++]!, kind: "del" });
    while (j < b.length) out.push({ text: b[j++]!, kind: "add" });
    return out;
  }, [before, after]);
  return (
    <p className="leading-relaxed">
      {parts.map((p, k) =>
        p.kind === "same" ? (
          <span key={k}>{p.text}</span>
        ) : p.kind === "add" ? (
          <ins key={k} className="rounded bg-success-container px-0.5 text-on-success-container no-underline">
            {p.text}
          </ins>
        ) : (
          <del key={k} className="rounded bg-error-container/70 px-0.5 text-on-error-container">
            {p.text}
          </del>
        ),
      )}
    </p>
  );
}

/** How a profile will read on the public team page. */
function PublicCard({ name, title, location, bio }: Pick<Profile, "name" | "title" | "location" | "bio">) {
  return (
    <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-level1 ring-1 ring-outline-variant/60">
      <div className="flex items-center gap-4">
        <Monogram name={name || "?"} className="size-16 text-lg" />
        <div>
          <div className="font-serif text-xl">{name || "Your name"}</div>
          <div className="text-sm font-semibold text-primary">{title || "Your role"}</div>
          {location && <div className="text-sm text-on-surface-variant">{location}</div>}
        </div>
      </div>
      {bio && <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{bio}</p>}
    </div>
  );
}

/* ── Account ──────────────────────────────────────────────────────────── */

export type AccountProfilePageProps = {
  account: Account;
  activity: AccountActivity;
  orders?: Order[];
  /** Projects a member can ask to join: slug → name. */
  projects: { slug: string; name: string }[];
  onSave: (profile: Profile) => Promise<ProfileSubmission | null>;
  onRequestAccess: (input: Pick<AccessRequest, "kind" | "project" | "note">) => Promise<unknown>;
  /** Whether this account's profile appears on the public team page. */
  publicOnSite?: boolean;
};

/**
 * Your profile: private fields save at once; title and bio go to review,
 * with a live preview of the public card and the review status beside it.
 * Below: access (request a project or staff role), and order history.
 */
export function AccountProfilePage({
  account,
  activity,
  orders = [],
  projects,
  onSave,
  onRequestAccess,
  publicOnSite = tierAtLeast(account, "staff"),
}: AccountProfilePageProps) {
  const pending = activity.submissions.find((s) => s.status === "pending");
  // Edit from the version in review, if there is one — not the live one.
  const [form, setForm] = useState<Profile>({
    name: account.name,
    title: pending?.after.title ?? account.title,
    location: account.location,
    bio: pending?.after.bio ?? account.bio,
    pronouns: account.pronouns ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const changedPublic = pending
    ? form.title !== pending.after.title || form.bio !== pending.after.bio
    : publicProfileChanged(account, { title: form.title, bio: form.bio });
  const dirty =
    changedPublic ||
    form.name !== account.name ||
    form.location !== account.location ||
    (form.pronouns ?? "") !== (account.pronouns ?? "");

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const submission = await onSave(form);
      setMessage(
        submission
          ? "Saved. Your new title and bio are waiting for review — the public site keeps the current version until then."
          : "Saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Profile) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const input =
    "w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow={TIER_LABEL[account.tier]}
        title="Your profile"
        description="Your name and location save straight away. Your public title and bio are reviewed before they go live."
      >
        <div className="mt-6 flex items-center gap-4">
          <Monogram name={account.name} className="size-14 text-base" />
          <div className="text-sm opacity-85">
            {account.email}
            <br />
            Member since {fmt(account.joined)}
          </div>
        </div>
      </PageHero>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel className="p-6">
          <form onSubmit={save} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Name</span>
                <input required value={form.name} onChange={set("name")} className={cn(input, "h-11")} />
              </label>
              <label className="block">
                <span className="mb-1.5 flex justify-between text-sm font-semibold">
                  Pronouns <span className="font-normal text-on-surface-variant">optional</span>
                </span>
                <input value={form.pronouns} onChange={set("pronouns")} className={cn(input, "h-11")} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Where you're based</span>
              <input value={form.location} onChange={set("location")} placeholder="City, country" className={cn(input, "h-11")} />
            </label>
            <div className="rounded-3xl border border-dashed border-outline-variant p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                <Eye className="size-4 text-primary" aria-hidden /> Public — reviewed before it goes live
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Title</span>
                <input value={form.title} onChange={set("title")} className={cn(input, "h-11")} />
              </label>
              <label className="mt-4 block">
                <span className="mb-1.5 flex justify-between text-sm font-semibold">
                  Bio <span className="font-normal tabular-nums text-on-surface-variant">{form.bio.length}/600</span>
                </span>
                <textarea rows={6} maxLength={600} value={form.bio} onChange={set("bio")} className={cn(input, "py-2.5")} />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" disabled={!dirty || saving} className={cn(dirty && "dash-shine")}>
                {saving ? "Saving…" : changedPublic ? (
                  <>
                    <Send aria-hidden /> Save and send for review
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <AnimatePresence>
                {message && (
                  <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-on-surface-variant">
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Panel>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Preview{publicOnSite ? " on the team page" : ""}</h2>
            {pending ? (
              <Chip tone="warning">
                <Clock className="size-3" aria-hidden /> In review since {fmt(pending.at)}
              </Chip>
            ) : (
              account.published && <Chip tone="success">Live</Chip>
            )}
          </div>
          <PublicCard name={form.name} title={form.title} location={form.location} bio={form.bio} />
          {!publicOnSite && (
            <p className="text-sm text-on-surface-variant">
              Members aren't listed on the public team page; your profile shows to other members in the workspace.
            </p>
          )}
          {activity.submissions.length > 0 && (
            <Panel className="p-5">
              <h3 className="mb-3 text-sm font-bold">Review history</h3>
              <ul className="space-y-3">
                {activity.submissions.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-3 text-sm">
                    <span>
                      {s.after.title}
                      <span className="block text-xs text-on-surface-variant">
                        {fmt(s.at)}
                        {s.reviewNote && ` · “${s.reviewNote}”`}
                      </span>
                    </span>
                    <Chip tone={STATUS_TONE[s.status]}>{s.status}</Chip>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </section>

      <AccessSection account={account} requests={activity.requests} projects={projects} onRequestAccess={onRequestAccess} />

      {orders.length > 0 && (
        <section>
          <SectionTitle title="Orders" description="Demo orders — nothing was charged." />
          <Panel className="divide-y divide-outline-variant/60 p-0">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="font-semibold">{o.lines.map((l) => l.name).join(", ")}</div>
                  <div className="text-sm text-on-surface-variant">{fmt(o.at)}</div>
                </div>
                <div className="font-serif text-xl tabular-nums">${o.total.toFixed(2)}</div>
              </div>
            ))}
          </Panel>
        </section>
      )}
    </div>
  );
}

function AccessSection({
  account,
  requests,
  projects,
  onRequestAccess,
}: {
  account: Account;
  requests: AccessRequest[];
  projects: { slug: string; name: string }[];
  onRequestAccess: AccountProfilePageProps["onRequestAccess"];
}) {
  const [kind, setKind] = useState<"project" | "staff">("project");
  const [project, setProject] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const staff = tierAtLeast(account, "staff");
  const pendingFor = (k: string, p?: string) => requests.some((r) => r.status === "pending" && r.kind === k && (k === "staff" || r.project === p));
  const joinable = projects.filter((p) => !account.projects.includes(p.slug));
  const nameOf = (slug?: string) => projects.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div>
        <SectionTitle title="Your access" />
        <Panel className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            <span className="font-semibold">{TIER_LABEL[account.tier]}</span>
          </div>
          <div>
            <div className="mb-2 text-sm text-on-surface-variant">Project rooms</div>
            <div className="flex flex-wrap gap-2">
              {staff ? (
                <Chip tone="info">All projects</Chip>
              ) : account.projects.length ? (
                account.projects.map((p) => (
                  <Chip key={p} tone="success">
                    {nameOf(p)}
                  </Chip>
                ))
              ) : (
                <span className="text-sm text-on-surface-variant">None yet</span>
              )}
            </div>
          </div>
          {requests.length > 0 && (
            <ul className="space-y-2 border-t border-outline-variant/60 pt-4">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{r.kind === "staff" ? "Staff role" : nameOf(r.project)}</span>
                  <Chip tone={STATUS_TONE[r.status]}>{r.status}</Chip>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      {!staff && (
        <div>
          <SectionTitle title="Ask for more" description="An admin reviews every request." />
          <Panel className="p-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  await onRequestAccess({ kind, project: kind === "project" ? project : undefined, note });
                  setNote("");
                } finally {
                  setBusy(false);
                }
              }}
              className="space-y-4"
            >
              <div className="flex rounded-full bg-surface-container-high p-1 text-sm font-semibold">
                {(["project", "staff"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={cn("flex-1 rounded-full py-2", kind === k ? "bg-primary text-on-primary" : "text-on-surface-variant")}
                  >
                    {k === "project" ? "Join a project" : "I'm lab staff"}
                  </button>
                ))}
              </div>
              {kind === "project" && (
                <select required value={project} onChange={(e) => setProject(e.target.value)} className="h-11 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 text-sm">
                  <option value="">Choose a project…</option>
                  {joinable.map((p) => (
                    <option key={p.slug} value={p.slug} disabled={pendingFor("project", p.slug)}>
                      {p.name}
                      {pendingFor("project", p.slug) ? " (pending)" : ""}
                    </option>
                  ))}
                </select>
              )}
              <textarea
                required
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={kind === "project" ? "Your role on the project." : "Your role in the lab, and who you report to."}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <Button type="submit" disabled={busy || (kind === "staff" && pendingFor("staff"))}>
                <UserPlus aria-hidden /> {kind === "staff" && pendingFor("staff") ? "Request pending" : busy ? "Sending…" : "Send request"}
              </Button>
            </form>
          </Panel>
        </div>
      )}
    </section>
  );
}

/* ── Review queue ─────────────────────────────────────────────────────── */

export type ReviewQueuePageProps = {
  queue: ReviewQueue;
  projects: { slug: string; name: string }[];
  onDecideSubmission: (id: string, approve: boolean, note?: string) => Promise<unknown>;
  onDecideRequest: (id: string, approve: boolean) => Promise<unknown>;
  empty?: ReactNode;
};

/**
 * The admin queue: profile changes as word diffs with approve/decline (and a
 * note back), and access requests with who is asking for what.
 */
export function ReviewQueuePage({ queue, projects, onDecideSubmission, onDecideRequest }: ReviewQueuePageProps) {
  const [tab, setTab] = useState<"bios" | "access" | "history">("bios");
  const person = (id: string) => queue.people.find((p) => p.id === id);
  const nameOf = (slug?: string) => projects.find((p) => p.slug === slug)?.name ?? slug;
  const bios = queue.submissions.filter((s) => s.status === "pending");
  const access = queue.requests.filter((r) => r.status === "pending");
  const history = [
    ...queue.submissions.filter((s) => s.status !== "pending").map((s) => ({ id: s.id, at: s.decidedAt ?? s.at, who: s.accountId, what: "Profile change", status: s.status })),
    ...queue.requests.filter((r) => r.status !== "pending").map((r) => ({ id: r.id, at: r.decidedAt ?? r.at, who: r.accountId, what: r.kind === "staff" ? "Staff role" : `Join ${nameOf(r.project)}`, status: r.status })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const tabs = [
    { id: "bios" as const, label: "Profile changes", count: bios.length },
    { id: "access" as const, label: "Access requests", count: access.length },
    { id: "history" as const, label: "Decided", count: history.length },
  ];

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Lab"
        title="Reviews"
        description="Nothing public changes until it's approved here. Approving a project request makes the member a partner on that project."
        art={{ kind: "shape", name: "held" }}
      />
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("relative isolate rounded-full px-4 py-2 text-sm font-semibold", tab === t.id ? "text-on-primary" : "bg-surface-container-high")}
          >
            {tab === t.id && <motion.span layoutId="dash-review-tab" className="absolute inset-0 -z-10 rounded-full bg-primary" />}
            {t.label}
            {t.count > 0 && <span className="ml-2 rounded-full bg-tertiary-container px-1.5 text-xs text-on-tertiary-container">{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          {tab === "bios" &&
            (bios.length === 0 ? (
              <Empty text="No profile changes waiting." />
            ) : (
              <Stagger className="space-y-4">
                {bios.map((s) => (
                  <Item key={s.id}>
                    <SubmissionCard submission={s} name={person(s.accountId)?.name ?? "Unknown"} onDecide={onDecideSubmission} />
                  </Item>
                ))}
              </Stagger>
            ))}
          {tab === "access" &&
            (access.length === 0 ? (
              <Empty text="No access requests waiting." />
            ) : (
              <Stagger className="grid gap-4 md:grid-cols-2">
                {access.map((r) => {
                  const p = person(r.accountId);
                  return (
                    <Item key={r.id}>
                      <Panel className="flex h-full flex-col p-5">
                        <div className="flex items-center gap-3">
                          <Monogram name={p?.name ?? "?"} />
                          <div>
                            <div className="font-semibold">{p?.name}</div>
                            <div className="text-xs text-on-surface-variant">
                              {p?.email} · {p && TIER_LABEL[p.tier]}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm">
                          Wants: <strong>{r.kind === "staff" ? "the staff role" : `to join ${nameOf(r.project)}`}</strong>
                        </div>
                        <blockquote className="mt-2 rounded-2xl bg-surface-container p-3 text-sm italic">{r.note}</blockquote>
                        <div className="mt-auto flex gap-2 pt-4">
                          <Button size="sm" onClick={() => onDecideRequest(r.id, true)}>
                            <Check aria-hidden /> Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onDecideRequest(r.id, false)}>
                            <X aria-hidden /> Decline
                          </Button>
                        </div>
                      </Panel>
                    </Item>
                  );
                })}
              </Stagger>
            ))}
          {tab === "history" &&
            (history.length === 0 ? (
              <Empty text="Nothing decided yet." />
            ) : (
              <Panel className="divide-y divide-outline-variant/60 p-0">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                    <span>
                      <strong>{person(h.who)?.name}</strong> · {h.what}
                      <span className="block text-xs text-on-surface-variant">{fmt(h.at)}</span>
                    </span>
                    <Chip tone={STATUS_TONE[h.status]}>{h.status}</Chip>
                  </div>
                ))}
              </Panel>
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <Panel className="grid place-items-center py-16 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-success-container">
          <Check className="size-8 text-on-success-container" aria-hidden />
        </div>
        <p className="font-semibold">All clear</p>
        <p className="text-sm text-on-surface-variant">{text}</p>
      </motion.div>
    </Panel>
  );
}

function SubmissionCard({
  submission,
  name,
  onDecide,
}: {
  submission: ProfileSubmission;
  name: string;
  onDecide: (id: string, approve: boolean, note?: string) => Promise<unknown>;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const decide = async (approve: boolean) => {
    setBusy(true);
    try {
      await onDecide(submission.id, approve, note || undefined);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Monogram name={name} />
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-on-surface-variant">Submitted {fmt(submission.at)}</div>
          </div>
        </div>
        <Chip tone="warning">Waiting</Chip>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface-container p-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Title</div>
          <WordDiff before={submission.before.title} after={submission.after.title} />
        </div>
        <div className="rounded-2xl bg-surface-container p-4 lg:row-span-2">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Bio</div>
          <WordDiff before={submission.before.bio} after={submission.after.bio} />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Note to {name.split(" ")[0]} (optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-10 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>
      <div className="mt-5 flex gap-2">
        <Button disabled={busy} onClick={() => decide(true)} className="dash-shine">
          <Check aria-hidden /> Approve and publish
        </Button>
        <Button disabled={busy} variant="outline" onClick={() => decide(false)}>
          <X aria-hidden /> Decline
        </Button>
      </div>
    </Panel>
  );
}
