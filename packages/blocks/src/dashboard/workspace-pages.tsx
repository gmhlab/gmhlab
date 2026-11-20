import {
  type Account,
  canPostToRoom,
  FEATURED_PUBLICATION_LIMIT,
  type Photo,
  type PhotoUpload,
  type RoomMessage,
  tierAtLeast,
} from "@gmhlab/core";
import { Button, cn } from "@gmhlab/ui";
import {
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  Globe,
  FlaskConical,
  ImagePlus,
  Lock,
  Mail,
  Megaphone,
  PlayCircle,
  Ruler,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, type ReactNode, useId, useMemo, useRef, useState } from "react";
import type { HandbookSection, ProjectRoom, RoomPublication, RoomResource } from "./dashboard-types";
import { Cover, PhotoFrame } from "../shared/ornaments";
import { ArtTile, Chip, DemoNote, EASE, Item, PageHero, Panel, SectionTitle, Stagger, toneAt } from "./kit";

/* ── Project rooms ────────────────────────────────────────────────────── */

const KIND_ICON: Record<RoomResource["kind"], typeof FileText> = {
  Summary: FileText,
  Protocol: ClipboardList,
  Measure: Ruler,
  Training: FlaskConical,
  Template: FileText,
  Report: FileText,
  Video: PlayCircle,
};

export type ProjectRoomsProps = {
  account: Account;
  rooms: ProjectRoom[];
  /** Ask to join a room; resolves when the request is filed. */
  onRequestAccess: (project: string, note: string) => Promise<unknown>;
  /** Project slugs with a pending request from this account. */
  pendingProjects?: string[];
  note?: ReactNode | null;
  /** Every message the account can see; each room shows its own. */
  messages?: RoomMessage[];
  /** Post to a room's board. Shown only where `canPostToRoom` allows. */
  onPostMessage?: (project: string, body: string) => Promise<unknown>;
  onRemoveMessage?: (id: string) => Promise<unknown>;
  /** Room slug → the project's works, for choosing what its page features. */
  roomPublications?: Record<string, RoomPublication[]>;
  /** Room slug → the slugs its page features now (chosen, or the default). */
  featuredPublications?: Record<string, string[]>;
  /** Room slug → whether its admins chose them (false: the record's default). */
  featuredChosen?: Record<string, boolean>;
  /** Save a room's featured works; an empty list restores the default. */
  onSaveFeatured?: (project: string, slugs: string[]) => Promise<unknown>;
};

/**
 * One room per project. Partners see the rooms they were approved for; staff
 * see them all; everyone else sees each room's outline and can ask to join.
 */
export function ProjectRooms({
  account,
  rooms,
  onRequestAccess,
  pendingProjects = [],
  note,
  messages = [],
  onPostMessage,
  onRemoveMessage,
  roomPublications = {},
  featuredPublications = {},
  featuredChosen = {},
  onSaveFeatured,
}: ProjectRoomsProps) {
  const staff = tierAtLeast(account, "staff");
  const mine = rooms.filter(
    (r) => staff || account.projects.includes(r.slug) || (account.leads ?? []).includes(r.slug),
  );
  const others = rooms.filter((r) => !mine.includes(r));
  const [active, setActive] = useState(mine[0]?.slug);
  const room = mine.find((r) => r.slug === active) ?? mine[0];

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Workspace"
        title="Project rooms"
        description={
          staff
            ? "Every project's protocols, measures and training materials, in one place."
            : "Protocols, measures and training materials for the projects you partner on."
        }
        art={{ kind: "glyph", name: "community" }}
      />

      {room && (
        <section className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <Panel className="space-y-1 p-2 lg:sticky lg:top-24 lg:self-start">
            {mine.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => setActive(r.slug)}
                className={cn(
                  "relative isolate flex w-full items-center gap-3 rounded-2xl p-2 text-left transition",
                  r.slug === room.slug ? "font-semibold" : "hover:bg-surface-container",
                )}
              >
                {r.slug === room.slug && <motion.span layoutId="dash-room-pill" className="absolute inset-0 -z-10 rounded-2xl bg-secondary-container" />}
                {r.logo ? (
                  <img src={r.logo} alt="" className="size-10 rounded-xl bg-white object-contain p-1" />
                ) : (
                  <ArtTile art={r.art} size={22} className="size-10" />
                )}
                <span className="truncate">{r.name}</span>
              </button>
            ))}
          </Panel>

          <AnimatePresence mode="wait">
            <motion.div
              key={room.slug}
              className="min-w-0 space-y-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Panel className="grid gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                {/* Square, as tall as the title, summary and links beside it. Its
                    height is 0 + min 100% so it never sets the row's height, and
                    grid re-sizes the column once the row is known. The art is
                    absolutely placed for the same reason. Stacked on phones. */}
                <div className="relative size-20 sm:aspect-square sm:size-auto sm:h-0 sm:min-h-[max(5rem,100%)]">
                  {room.logo ? (
                    <img
                      src={room.logo}
                      alt=""
                      className="absolute inset-0 size-full rounded-2xl bg-white object-contain p-3 shadow-level1"
                    />
                  ) : (
                    <ArtTile art={room.art} size={56} className="absolute inset-0 size-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl">{room.name}</h2>
                  <p className="mt-1 text-on-surface-variant">{room.summary}</p>
                  <RoomLinks room={room} />
                </div>
                {room.contact && (
                  <div className="self-center rounded-2xl bg-surface-container p-4 text-sm">
                    <div className="font-semibold">{room.contact.name}</div>
                    <div className="text-on-surface-variant">{room.contact.role}</div>
                    {room.contact.email && (
                      <a href={`mailto:${room.contact.email}`} className="mt-1 inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                        <Mail className="size-3.5" aria-hidden /> Email
                      </a>
                    )}
                  </div>
                )}
              </Panel>
              <MessageBoard
                project={room.slug}
                messages={messages.filter((m) => m.project === room.slug)}
                canPost={Boolean(onPostMessage) && canPostToRoom(account, room.slug)}
                onPost={(body) => onPostMessage!(room.slug, body)}
                onRemove={onRemoveMessage}
              />
              <Stagger className="grid gap-4 md:grid-cols-2">
                {room.resources.map((res) => {
                  const Icon = KIND_ICON[res.kind];
                  const body = (
                    <Panel className="flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5">
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-container text-on-primary-container">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{res.title}</span>
                          <Chip>{res.kind}</Chip>
                        </div>
                        <p className="mt-1 text-sm text-on-surface-variant">{res.detail}</p>
                        {!res.href && <p className="mt-2 text-xs text-on-surface-variant">File not uploaded yet</p>}
                      </div>
                    </Panel>
                  );
                  return (
                    <Item key={res.title}>
                      {res.href ? (
                        <a href={res.href} target="_blank" rel="noreferrer" className="block h-full">
                          {body}
                        </a>
                      ) : (
                        body
                      )}
                    </Item>
                  );
                })}
              </Stagger>
              {onSaveFeatured && canPostToRoom(account, room.slug) && (roomPublications[room.slug]?.length ?? 0) > 0 && (
                <FeaturedPicker
                  key={`${room.slug}:${(featuredPublications[room.slug] ?? []).join(",")}`}
                  works={roomPublications[room.slug]!}
                  current={featuredPublications[room.slug] ?? []}
                  chosen={featuredChosen[room.slug] ?? false}
                  pageHref={room.siteHref}
                  onSave={(slugs) => onSaveFeatured(room.slug, slugs)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <SectionTitle
            title={mine.length ? "Other projects" : "Join a project"}
            description="Partners on a project can ask to join its room. An admin approves each request."
          />
          <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {others.map((r, i) => (
              <Item key={r.slug}>
                <JoinCard
                  room={r}
                  tone={toneAt(i)}
                  pending={pendingProjects.includes(r.slug)}
                  onRequest={(noteText) => onRequestAccess(r.slug, noteText)}
                />
              </Item>
            ))}
          </Stagger>
        </section>
      )}
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}

const linkPill =
  "inline-flex h-9 items-center gap-2 rounded-full border border-outline-variant px-4 text-sm font-semibold transition hover:bg-surface-container";

/** The room's shared folder and its page on the public site. */
function RoomLinks({ room }: { room: ProjectRoom }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {room.folder ? (
        <a href={room.folder.href} target="_blank" rel="noreferrer" className={cn(linkPill, "text-primary")}>
          <FolderOpen className="size-4" aria-hidden /> {room.folder.label ?? "Google Drive folder"}
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span className={cn(linkPill, "cursor-default border-dashed text-on-surface-variant hover:bg-transparent")}>
          <FolderOpen className="size-4" aria-hidden /> Folder not linked yet
        </span>
      )}
      {room.siteHref && (
        <a href={room.siteHref} target="_blank" rel="noreferrer" className={cn(linkPill, "text-primary")}>
          <Globe className="size-4" aria-hidden /> Project page
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

const postedAt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

/** A room's notices. Everyone in the room reads it; its admins post. */
function MessageBoard({
  project,
  messages,
  canPost,
  onPost,
  onRemove,
}: {
  project: string;
  messages: RoomMessage[];
  canPost: boolean;
  onPost: (body: string) => Promise<unknown>;
  onRemove?: (id: string) => Promise<unknown>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onPost(text);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't post.");
    } finally {
      setBusy(false);
    }
  };
  const inputId = `room-message-${project}`;

  return (
    <Panel className="p-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-tertiary-container text-on-tertiary-container">
          <Megaphone className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold">Message board</h3>
          <p className="text-sm text-on-surface-variant">
            {canPost ? "You're an admin for this project. Post updates for everyone in the room." : "Updates from the project's admins."}
          </p>
        </div>
      </div>

      {canPost && (
        <form onSubmit={submit} className="mt-5 space-y-2">
          <label htmlFor={inputId} className="sr-only">
            New message
          </label>
          <textarea
            id={inputId}
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share an update, a deadline or a new file."
            className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}
          <Button size="sm" type="submit" disabled={busy || !text.trim()}>
            {busy ? "Posting…" : "Post message"}
          </Button>
        </form>
      )}

      {messages.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">No messages yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex gap-3 rounded-2xl bg-surface-container-low p-4"
              >
                {m.authorPhoto ? (
                  <img src={m.authorPhoto} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container">
                    {initials(m.authorName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold">{m.authorName}</span>
                    <time dateTime={m.at} className="text-xs text-on-surface-variant">
                      {postedAt(m.at)}
                    </time>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm">{m.body}</p>
                </div>
                {canPost && onRemove && (
                  <button
                    type="button"
                    onClick={() => void onRemove(m.id)}
                    aria-label={`Remove message from ${m.authorName}, ${postedAt(m.at)}`}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-on-surface-variant transition hover:bg-surface-container-high hover:text-error"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Panel>
  );
}

/** For a room's admins: pick the works its public page features. */
function FeaturedPicker({
  works,
  current,
  chosen,
  pageHref,
  onSave,
}: {
  works: RoomPublication[];
  current: string[];
  chosen: boolean;
  pageHref?: string;
  onSave: (slugs: string[]) => Promise<unknown>;
}) {
  const [picked, setPicked] = useState<string[]>(current);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const full = picked.length >= FEATURED_PUBLICATION_LIMIT;
  const listId = useId();
  const changed = picked.join(",") !== current.join(",");

  const toggle = (slug: string) =>
    setPicked((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : full ? list : [...list, slug]));

  const save = async (slugs: string[]) => {
    setBusy(true);
    setError(null);
    try {
      await onSave(slugs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel className="p-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-container text-on-primary-container">
          <BookMarked className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">Featured publications</h3>
          <p className="text-sm text-on-surface-variant">
            {chosen ? "Chosen by this project's admins" : "The default: the first works the project record lists"}.{" "}
            {works.length > FEATURED_PUBLICATION_LIMIT
              ? `${FEATURED_PUBLICATION_LIMIT} of its ${works.length} publications lead the project page.`
              : "They lead the project page, in this order."}
          </p>
        </div>
        {pageHref && (
          <a href={pageHref} target="_blank" rel="noreferrer" className={cn(linkPill, "hidden shrink-0 text-primary sm:inline-flex")}>
            View page <ExternalLink className="size-3.5 opacity-70" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>

      {!open && (
        <ol className="mt-5 space-y-2">
          {current.map((slug, i) => {
            const work = works.find((w) => w.slug === slug);
            return work ? (
              <li key={slug} className="flex items-start gap-3 rounded-2xl bg-surface-container-low p-3">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug">{work.title}</span>
                  <span className="mt-0.5 block text-xs text-on-surface-variant">
                    <em>{work.journal}</em> · {work.year}
                  </span>
                </span>
              </li>
            ) : null;
          })}
        </ol>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((o) => !o);
          setPicked(current);
          setError(null);
        }}
        className={cn(linkPill, "mt-4 text-primary")}
      >
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} aria-hidden />
        {open ? "Close" : `Change featured publications (${works.length})`}
      </button>
      {open && (
        <div id={listId}>
          <fieldset className="mt-5">
            <legend className="sr-only">Publications to feature, up to {FEATURED_PUBLICATION_LIMIT}</legend>
            <ul className="space-y-2">
              {works.map((work) => {
                const rank = picked.indexOf(work.slug);
                const on = rank !== -1;
                const id = `feature-${work.slug}`;
                return (
                  <li key={work.slug}>
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition",
                        on ? "bg-secondary-container" : "hover:bg-surface-container",
                        !on && full && "cursor-not-allowed hover:bg-transparent",
                      )}
                    >
                      <input
                        id={id}
                        type="checkbox"
                        checked={on}
                        disabled={!on && full}
                        onChange={() => toggle(work.slug)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                          on ? "bg-primary text-on-primary" : "border border-outline",
                        )}
                      >
                        {on ? rank + 1 : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug">{work.title}</span>
                        <span className="mt-0.5 block text-xs text-on-surface-variant">
                          <em>{work.journal}</em> · {work.year}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {error && (
            <p role="alert" className="mt-3 text-sm text-error">
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button size="sm" disabled={busy || !changed || picked.length === 0} onClick={() => void save(picked)}>
              {busy ? "Saving…" : "Save featured"}
            </Button>
            {chosen && (
              <Button size="sm" variant="ghost" disabled={busy} onClick={() => void save([])}>
                Use the default
              </Button>
            )}
            <span className="text-xs text-on-surface-variant" aria-live="polite">
              {full ? `${FEATURED_PUBLICATION_LIMIT} chosen. Untick one to choose another.` : `${picked.length} of ${FEATURED_PUBLICATION_LIMIT} chosen.`}
            </span>
          </div>
        </div>
      )}
    </Panel>
  );
}

function JoinCard({
  room,
  tone,
  pending,
  onRequest,
}: {
  room: ProjectRoom;
  tone: "navy" | "gold" | "sky";
  pending: boolean;
  onRequest: (note: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onRequest(text);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel className="flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <Cover art={room.art} tone={tone} className="aspect-[2/1] w-full !rounded-none" />
        <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-surface/90 shadow-level1">
          <Lock className="size-4 text-on-surface-variant" aria-label="Locked" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="font-semibold">{room.name}</div>
        <p className="mt-1 text-sm text-on-surface-variant">{room.summary}</p>
        <p className="mt-2 text-xs text-on-surface-variant">{room.resources.length} resources inside</p>
        <div className="mt-auto pt-4">
          {pending ? (
            <Chip tone="warning">Request pending review</Chip>
          ) : open ? (
            <form onSubmit={submit} className="space-y-2">
              <textarea
                required
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your role on the project, and what you need from the room."
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                <Button size="sm" type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Send request"}
                </Button>
                <Button size="sm" variant="ghost" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Request access
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ── Photo library ────────────────────────────────────────────────────── */

/** Downscale an image file to a JPEG data URL no wider than `max`. */
async function downscale(file: File, max = 1400): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("That file isn't an image we can read."));
      el.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type PhotoLibraryProps = {
  photos: Photo[];
  canUpload: boolean;
  /** Delete any photo (admins); others can delete their own. */
  canModerate?: boolean;
  uploaderName: string;
  onUpload: (upload: PhotoUpload) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
  /** Suggested tags (project names, themes). */
  suggestedTags?: string[];
  note?: ReactNode | null;
};

/**
 * The lab's photo library: a masonry wall with search and tag filters, a
 * lightbox with credit and consent, and an upload sheet that won't submit
 * without recorded consent.
 */
export function PhotoLibrary({
  photos,
  canUpload,
  canModerate = false,
  uploaderName,
  onUpload,
  onRemove,
  suggestedTags = [],
  note,
}: PhotoLibraryProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [open, setOpen] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);

  const tags = useMemo(() => [...new Set(photos.flatMap((p) => p.tags))].sort(), [photos]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q || `${p.caption} ${p.credit} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [photos, query, tag]);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Workspace"
        title="Photo library"
        description="Photographs for lab use, each with its credit and recorded consent. Nothing goes in without consent."
        art={{ kind: "glyph", name: "lived-experience" }}
        actions={
          canUpload && (
            <Button size="lg" variant="accent" className="lit-shine" onClick={() => setUploading(true)}>
              <ImagePlus aria-hidden /> Upload photos
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search captions, credits, tags"
            aria-label="Search photos"
            className="h-11 w-full rounded-full border border-outline-variant bg-surface-container-lowest pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(tag === t ? null : t)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                tag === t ? "bg-primary text-on-primary" : "bg-surface-container-high hover:bg-surface-container-highest",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {photos.length === 0 ? (
        <Panel className="grid place-items-center py-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="mx-auto mb-8 flex items-end justify-center gap-4" aria-hidden>
              <PhotoFrame frame="blob" placeholder="" className="size-28" />
              <PhotoFrame frame="arch" placeholder="" className="h-40 w-32" />
              <PhotoFrame frame="pill" placeholder="" className="h-32 w-20" />
            </div>
            <h2 className="font-serif text-2xl">No photos yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-on-surface-variant">
              {canUpload ? "Upload the first ones from your field work — with consent recorded." : "Photos uploaded by staff will appear here."}
            </p>
            {canUpload && (
              <Button className="mt-6" onClick={() => setUploading(true)}>
                <UploadCloud aria-hidden /> Upload photos
              </Button>
            )}
          </motion.div>
        </Panel>
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-on-surface-variant">No photos match.</p>
      ) : (
        <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4">
          <AnimatePresence>
            {shown.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: EASE, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => setOpen(p)}
                className="group relative mb-4 block w-full overflow-hidden rounded-3xl text-left shadow-level1"
              >
                <img src={p.src} alt={p.caption} className="w-full transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <div className="text-sm font-semibold">{p.caption}</div>
                  <div className="text-xs opacity-80">© {p.credit}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-scrim/80 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
          >
            <motion.div
              className="grid max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-surface-container-low md:grid-cols-[1fr_20rem]"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={open.src} alt={open.caption} className="max-h-[90vh] w-full bg-black object-contain" />
              <div className="flex flex-col gap-4 p-6">
                <div className="flex justify-end">
                  <button type="button" onClick={() => setOpen(null)} className="rounded-full p-2 hover:bg-surface-container-high" aria-label="Close">
                    <X className="size-5" />
                  </button>
                </div>
                <h2 className="font-serif text-2xl">{open.caption}</h2>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-on-surface-variant">Credit</dt>
                    <dd className="font-semibold">© {open.credit}</dd>
                  </div>
                  <div>
                    <dt className="text-on-surface-variant">Uploaded by</dt>
                    <dd>{open.uploadedBy} · {new Date(open.at).toLocaleDateString()}</dd>
                  </div>
                </dl>
                <div className="flex items-center gap-2 rounded-2xl bg-success-container px-3 py-2 text-sm text-on-success-container">
                  <ShieldCheck className="size-4" aria-hidden /> Consent recorded
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {open.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <div className="mt-auto flex gap-2">
                  <a href={open.src} download={`${open.caption || "photo"}.jpg`} className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary">
                    Download
                  </a>
                  {(canModerate || open.uploadedBy === uploaderName) && (
                    <Button
                      variant="ghost"
                      className="text-error"
                      onClick={async () => {
                        await onRemove(open.id);
                        setOpen(null);
                      }}
                    >
                      <Trash2 aria-hidden /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UploadSheet open={uploading} onClose={() => setUploading(false)} onUpload={onUpload} suggestedTags={[...new Set([...suggestedTags, ...tags])]} />
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}

function UploadSheet({
  open,
  onClose,
  onUpload,
  suggestedTags,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (upload: PhotoUpload) => Promise<unknown>;
  suggestedTags: string[];
}) {
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [caption, setCaption] = useState("");
  const [credit, setCredit] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const add = (list: FileList | null) => {
    if (!list) return;
    const images = [...list].filter((f) => f.type.startsWith("image/"));
    setFiles((f) => [...f, ...images.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  };
  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setCaption("");
    setCredit("");
    setTags([]);
    setConsent(false);
    setError(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) return setError("Confirm consent before uploading.");
    setBusy(true);
    setError(null);
    try {
      for (const { file } of files) {
        await onUpload({ src: await downscale(file), caption, credit, tags, consent: true });
      }
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-scrim/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.form
            onSubmit={submit}
            role="dialog"
            aria-modal="true"
            aria-label="Upload photos"
            className="fixed inset-y-0 right-0 z-[71] flex w-[min(32rem,100vw)] flex-col overflow-y-auto bg-surface-container-low p-6 shadow-level5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Upload photos</h2>
              <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-surface-container-high" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => input.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                add(e.dataTransfer.files);
              }}
              className={cn(
                "grid place-items-center rounded-3xl border-2 border-dashed p-8 text-center transition",
                over ? "border-primary bg-primary/8 scale-[1.01]" : "border-outline-variant hover:border-outline",
              )}
            >
              <UploadCloud className="mb-2 size-9 text-primary" aria-hidden />
              <span className="font-semibold">Drop images here, or browse</span>
              <span className="text-sm text-on-surface-variant">JPEG or PNG. Large images are resized.</span>
            </button>
            <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {files.map((f, i) => (
                  <div key={f.preview} className="group relative aspect-square overflow-hidden rounded-xl">
                    <img src={f.preview} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFiles((list) => list.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {(
                [
                  ["Caption", caption, setCaption, "What is happening, where"],
                  ["Credit", credit, setCredit, "Photographer or organisation"],
                ] as const
              ).map(([label, value, set, ph]) => (
                <label key={label} className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                  <input
                    required
                    value={value}
                    placeholder={ph}
                    onChange={(e) => set(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 text-sm outline-none focus:border-primary"
                  />
                </label>
              ))}
              <div>
                <span className="mb-1.5 block text-sm font-semibold">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tags.includes(t)}
                      onClick={() => setTags((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]))}
                      className={cn("rounded-full px-3 py-1 text-sm", tags.includes(t) ? "bg-primary text-on-primary" : "bg-surface-container-high")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className={cn("flex gap-3 rounded-2xl p-4 transition", consent ? "bg-success-container text-on-success-container" : "bg-warning-container text-on-warning-container")}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-current" />
                <span className="text-sm">
                  <strong className="block">Consent is recorded</strong>
                  Everyone identifiable in these photos agreed to their use by the lab, and the consent forms are filed with the project.
                </span>
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-error">{error}</p>}
            <div className="mt-auto flex gap-3 pt-6">
              <Button type="submit" size="lg" className="flex-1" disabled={busy || files.length === 0 || !consent}>
                {busy ? "Uploading…" : <><CheckCircle2 aria-hidden /> Upload {files.length || ""} photo{files.length === 1 ? "" : "s"}</>}
              </Button>
            </div>
          </motion.form>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Handbook ─────────────────────────────────────────────────────────── */

export type HandbookPageProps = {
  sections: HandbookSection[];
  /** The new-starter checklist; ticks are kept per browser. */
  checklist: string[];
  note?: ReactNode | null;
};

/** The staff handbook: policy sections as an accordion, and a checklist. */
export function HandbookPage({ sections, checklist, note }: HandbookPageProps) {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null);
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("gmh-handbook-checklist") ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const toggle = (item: string) =>
    setDone((list) => {
      const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
      try {
        localStorage.setItem("gmh-handbook-checklist", JSON.stringify(next));
      } catch {}
      return next;
    });
  return (
    <div className="space-y-10">
      <PageHero eyebrow="Lab" title="Lab handbook" description="How we work: data, authorship, travel, and your first week." art={{ kind: "glyph", name: "publication" }} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-3">
          {sections.map((s) => {
            const isOpen = open === s.id;
            return (
              <Panel key={s.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-on-surface-variant">{s.summary}</span>
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-2xl leading-none text-on-surface-variant">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="space-y-2 px-5 pb-5"
                    >
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-sm">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                          {p}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </Panel>
            );
          })}
        </div>
        <Panel className="p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-serif text-xl">Your first week</h2>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-highest">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary-container"
              animate={{ width: `${(done.length / Math.max(1, checklist.length)) * 100}%` }}
            />
          </div>
          <ul className="mt-5 space-y-2">
            {checklist.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer gap-3 rounded-xl p-2 text-sm hover:bg-surface-container">
                  <input type="checkbox" checked={done.includes(item)} onChange={() => toggle(item)} className="mt-0.5 size-4 accent-[var(--gmh-color-primary)]" />
                  <span className={cn(done.includes(item) && "text-on-surface-variant line-through")}>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}
