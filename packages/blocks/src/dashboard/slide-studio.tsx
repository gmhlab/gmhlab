import { Button, CareRings, ContourGlobe, GmhLogo, ResearchGlyph, cn } from "@gmhlab/ui";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, Reorder, motion } from "motion/react";
import { type ReactNode, useMemo, useRef, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import { toHex, useTokenColors } from "./brand-studio";
import type { DashboardLinkComponent } from "./dashboard-types";
import { bakeSvg } from "./graphics-gallery";
import { Chip, EASE, Item, PageHero, Panel, SectionTitle, Stagger } from "./kit";

/* ── deck model ───────────────────────────────────────────────────────── */

export type SlideLayout = "title" | "section" | "statement" | "stat" | "closing";

export type DeckSlide = {
  id: string;
  layout: SlideLayout;
  heading: string;
  body?: string;
  /** The big number, for `stat`. */
  stat?: string;
};

export type Deck = {
  title: string;
  presenter: string;
  date: string;
  slides: DeckSlide[];
};

const LAYOUTS: { id: SlideLayout; name: string; hint: string }[] = [
  { id: "title", name: "Title", hint: "Opens the deck on navy" },
  { id: "section", name: "Section", hint: "A gold divider between parts" },
  { id: "statement", name: "Statement", hint: "One idea, large" },
  { id: "stat", name: "Big number", hint: "A figure and what it means" },
  { id: "closing", name: "Closing", hint: "Thanks and contact" },
];

let seq = 0;
const nextId = () => `s${Date.now().toString(36)}${seq++}`;

const DEFAULT_DECK = (presenter: string): Deck => ({
  title: "Training helpers to a safe standard",
  presenter,
  date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  slides: [
    { id: nextId(), layout: "title", heading: "Training helpers to a safe standard", body: "Competency-based training in practice" },
    { id: nextId(), layout: "section", heading: "Why competence matters" },
    { id: nextId(), layout: "statement", heading: "Attendance tells you who was in the room. Competence tells you who can help.", body: "" },
    { id: nextId(), layout: "stat", heading: "of helpers reached a safe level after one structured role-play cycle", stat: "00%", body: "Replace with your own figure and its source." },
    { id: nextId(), layout: "closing", heading: "Thank you", body: "" },
  ],
});

/* ── palette ──────────────────────────────────────────────────────────── */

/**
 * Slides are always printed paper, whatever the UI theme: white with navy
 * ink. Navy, gold and light gold are GW pins — the same in light and dark —
 * so reading them live is safe in either mode.
 */
const PALETTE_TOKENS = [
  "--gmh-color-navy",
  "--gmh-color-tertiary-container",
  "--gmh-color-brand-band-accent",
];

export type DeckPalette = {
  navy: string;
  gold: string;
  goldLight: string;
  /** White paper; navy is the ink on it. */
  paper: string;
};

/* ── preview ──────────────────────────────────────────────────────────── */

/** One slide at 16:9, drawn in HTML with the same geometry the export uses. */
export function SlidePreview({ slide, deck, index }: { slide: DeckSlide; deck: Deck; index: number }) {
  const navy = slide.layout === "title" || slide.layout === "closing" || slide.layout === "stat";
  const gold = slide.layout === "section";
  return (
    <div
      className={cn(
        "dash-slide rounded-xl text-left shadow-level2 ring-1 ring-outline-variant/60",
        navy && "dash-hero !rounded-xl",
      )}
      style={
        gold
          ? { background: "linear-gradient(150deg, var(--dash-gold-light), var(--dash-gold))", color: "var(--dash-navy)" }
          : !navy
            ? { background: "white", color: "var(--gmh-color-navy)" }
            : undefined
      }
    >
      {navy && (
        <div className="pointer-events-none absolute -right-[18%] -top-[25%] w-[70%] opacity-50" aria-hidden>
          <ContourGlobe centerpiece="none" />
        </div>
      )}
      {slide.layout === "statement" && (
        <div className="pointer-events-none absolute -bottom-[30%] -right-[10%] w-[45%] opacity-25" aria-hidden>
          <CareRings />
        </div>
      )}
      <div className="absolute inset-0 flex flex-col p-[6%]">
        <div className="flex items-center justify-between text-[1.6cqw] font-bold uppercase tracking-[0.2em] opacity-80">
          <span className={navy ? "text-brand-band-accent" : undefined}>{GMH_DASHBOARD_COPY.organisation}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          {slide.layout === "stat" ? (
            <div className="grid grid-cols-[auto_1fr] items-center gap-[5%]">
              <div className="dash-gold-text font-serif text-[16cqw] leading-none">{slide.stat || "0"}</div>
              <div>
                <div className="font-serif text-[3.4cqw] leading-tight">{slide.heading}</div>
                {slide.body && <div className="mt-[3%] text-[1.8cqw] opacity-75">{slide.body}</div>}
              </div>
            </div>
          ) : (
            <>
              {slide.layout === "section" && <div className="mb-[2%] h-[0.6cqw] w-[12%] rounded-full bg-[var(--dash-navy)]" />}
              <div
                className={cn(
                  "font-serif leading-[1.1]",
                  slide.layout === "title" ? "text-[6cqw]" : slide.layout === "statement" ? "text-[4.6cqw] max-w-[85%]" : "text-[5.4cqw]",
                )}
              >
                {slide.heading || "Untitled"}
              </div>
              {slide.body && <div className="mt-[3%] max-w-[75%] text-[2.2cqw] opacity-80">{slide.body}</div>}
              {slide.layout === "closing" && (
                <div className="mt-[4%] text-[2cqw] text-brand-band-accent">{deck.presenter}</div>
              )}
            </>
          )}
        </div>
        <div className="flex items-end justify-between text-[1.5cqw] opacity-70">
          <span>{slide.layout === "title" ? `${deck.presenter} · ${deck.date}` : deck.title}</span>
          <span className={cn("dash-slide-mark", navy && "dash-slide-mark-reversed")}>
            <GmhLogo href={undefined} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── export ───────────────────────────────────────────────────────────── */

/** The parts of pptxgenjs the exporter uses — so blocks needn't depend on it. */
// biome-ignore lint: structural stand-in for an untyped peer
export type PptxConstructor = new () => any;

/**
 * Write a deck to .pptx with pptxgenjs (passed in, so it is only loaded when
 * someone exports). Colours are the live token values; the logo is the
 * on-screen mark, baked to SVG.
 */
export async function exportDeckToPptx(
  PptxGenJS: PptxConstructor,
  deck: Deck,
  palette: DeckPalette,
  logos: { onNavy?: string; onPaper?: string },
): Promise<void> {
  const strip = (hex: string) => hex.replace("#", "");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 in
  pptx.title = deck.title;
  pptx.author = deck.presenter;
  const W = 13.333;
  const serif = "Baskerville";
  const sans = "Avenir Next";

  deck.slides.forEach((s, i) => {
    const slide = pptx.addSlide();
    const navy = s.layout === "title" || s.layout === "closing" || s.layout === "stat";
    const gold = s.layout === "section";
    const bg = navy ? palette.navy : gold ? palette.gold : palette.paper;
    const ink = navy ? "FFFFFF" : strip(palette.navy);
    slide.background = { color: strip(bg) };

    slide.addText(GMH_DASHBOARD_COPY.organisation.toUpperCase(), {
      x: 0.6, y: 0.35, w: 8, h: 0.4, fontFace: sans, fontSize: 10, bold: true, charSpacing: 3,
      color: navy ? strip(palette.goldLight) : ink,
    });
    slide.addText(String(i + 1).padStart(2, "0"), {
      x: W - 1.6, y: 0.35, w: 1, h: 0.4, align: "right", fontFace: sans, fontSize: 10, bold: true, color: ink,
    });

    if (s.layout === "stat") {
      slide.addText(s.stat || "0", { x: 0.6, y: 1.9, w: 5.4, h: 3.2, fontFace: serif, fontSize: 132, color: strip(palette.goldLight) });
      slide.addText(s.heading, { x: 6.3, y: 2.2, w: 6.4, h: 1.8, fontFace: serif, fontSize: 30, color: ink, valign: "top" });
      if (s.body) slide.addText(s.body, { x: 6.3, y: 4.1, w: 6.4, h: 1, fontFace: sans, fontSize: 16, color: ink, transparency: 25 });
    } else {
      if (s.layout === "section") {
        slide.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 2.75, w: 1.6, h: 0.08, fill: { color: strip(palette.navy) }, rectRadius: 0.04, line: { type: "none" } });
      }
      const size = s.layout === "title" ? 54 : s.layout === "statement" ? 40 : 48;
      slide.addText(s.heading || "Untitled", {
        x: 0.6, y: 2.9, w: s.layout === "statement" ? 11 : 12, h: 2, fontFace: serif, fontSize: size, color: ink, valign: "top",
      });
      if (s.body) slide.addText(s.body, { x: 0.6, y: 5, w: 10, h: 0.8, fontFace: sans, fontSize: 20, color: ink, transparency: 20 });
      if (s.layout === "closing") slide.addText(deck.presenter, { x: 0.6, y: 5.8, w: 8, h: 0.5, fontFace: sans, fontSize: 18, color: strip(palette.goldLight) });
    }

    slide.addText(s.layout === "title" ? `${deck.presenter} · ${deck.date}` : deck.title, {
      x: 0.6, y: 6.75, w: 9, h: 0.4, fontFace: sans, fontSize: 11, color: ink, transparency: 30,
    });
    const logo = navy ? logos.onNavy : logos.onPaper;
    if (logo) slide.addImage({ data: logo, x: W - 1.3, y: 6.45, w: 0.73, h: 0.6 });
  });

  await pptx.writeFile({ fileName: `${deck.title.replace(/[^\w\- ]+/g, "").trim() || "deck"}.pptx` });
}

/* ── page ─────────────────────────────────────────────────────────────── */

const TUTORIAL = [
  { title: "Install the brand fonts", body: "Headlines are Baskerville, everything else Avenir Next. Both ship with macOS; on Windows, install Libre Baskerville and Nunito Sans (free) and PowerPoint will use them." },
  { title: "Start from an export", body: "Build your outline here and download it. Every slide has the right margins, the footer and the mark already placed — duplicate slides rather than drawing new ones." },
  { title: "Add the brand colours", body: "Design → Variants → Colours → Customise. Set Dark 1 to navy, Accent 1 to gold and Accent 2 to light gold, using the hex values on the right." },
  { title: "Keep gold off white text", body: "Gold is a fill. On a white slide, write in navy; use gold for rules, shapes and chart highlights. Light gold text belongs on navy." },
  { title: "Bring in graphics, not clip art", body: "Download glyphs and shapes from the graphics kit on the matching ground and drop the SVG in. They stay sharp at any size." },
  { title: "Make it accessible", body: "Give every image alt text (right-click → View alt text), check the reading order in the Selection Pane, and keep body text at 18pt or larger." },
  { title: "Share as PDF", body: "File → Export → PDF keeps your fonts for people who don't have them, and keeps the file small enough to email." },
];

const TEMPLATES = [
  { id: "poster", name: "Conference poster", format: "A0 and 48×36", art: "community" as const },
  { id: "one-pager", name: "Project one-pager", format: "Letter and A4", art: "task-sharing" as const },
  { id: "report", name: "Report cover", format: "Letter and A4", art: "publication" as const },
];

export type SlideStudioProps = {
  presenter: string;
  /** Called with everything needed to write the file; the app loads pptxgenjs. */
  onExport: (deck: Deck, palette: DeckPalette, logos: { onNavy?: string; onPaper?: string }) => Promise<void>;
  /** Whether the templates add-on is unlocked. */
  templatesUnlocked?: boolean;
  /** Where locked templates send people. */
  templatesHref?: string;
  linkComponent?: DashboardLinkComponent;
  title?: string;
  description?: string;
};

const PlainLink: DashboardLinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

/**
 * Build a deck from a form — reorder, retype, re-layout — preview it live at
 * 16:9, and export a real PowerPoint file. Below: the PowerPoint tutorial,
 * with the brand hex values read from the tokens, and the templates.
 */
export function SlideStudio({
  presenter,
  onExport,
  templatesUnlocked = false,
  templatesHref = "/dashboard#store",
  linkComponent: Link = PlainLink,
  title = "Slide studio",
  description = "Outline your talk, pick a layout per slide, and download a PowerPoint deck in the lab's colours, type and grid.",
}: SlideStudioProps) {
  const [deck, setDeck] = useState<Deck>(() => DEFAULT_DECK(presenter));
  const [selected, setSelected] = useState(deck.slides[0]!.id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const marks = useRef<HTMLDivElement>(null);
  const colors = useTokenColors(PALETTE_TOKENS);

  const palette: DeckPalette | null = useMemo(() => {
    const hex = (t: string) => (colors[t] ? toHex(colors[t]!) : null);
    const [navy, gold, goldLight] = PALETTE_TOKENS.map(hex);
    return navy && gold && goldLight ? { navy, gold, goldLight, paper: "#FFFFFF" } : null;
  }, [colors]);

  const index = deck.slides.findIndex((s) => s.id === selected);
  const current = deck.slides[index] ?? deck.slides[0]!;
  const update = (patch: Partial<DeckSlide>) =>
    setDeck((d) => ({ ...d, slides: d.slides.map((s) => (s.id === current.id ? { ...s, ...patch } : s)) }));
  const move = (dir: -1 | 1) =>
    setDeck((d) => {
      const i = d.slides.findIndex((s) => s.id === current.id);
      const j = i + dir;
      if (j < 0 || j >= d.slides.length) return d;
      const slides = [...d.slides];
      [slides[i], slides[j]] = [slides[j]!, slides[i]!];
      return { ...d, slides };
    });

  const exportDeck = async () => {
    if (!palette) return;
    setBusy(true);
    setError(null);
    try {
      const svgs = marks.current?.querySelectorAll("svg");
      const toData = (svg?: SVGSVGElement) =>
        svg ? `image/svg+xml;base64,${btoa(unescape(encodeURIComponent(bakeSvg(svg))))}` : undefined;
      await onExport(deck, palette, { onNavy: toData(svgs?.[0]), onPaper: toData(svgs?.[1]) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The export failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Create"
        title={title}
        description={description}
        art={{ kind: "shape", name: "arch" }}
        actions={
          <Button size="lg" variant="accent" className="dash-shine" disabled={busy || !palette} onClick={exportDeck}>
            <Download aria-hidden /> {busy ? "Building your deck…" : "Download .pptx"}
          </Button>
        }
      />
      {error && <p className="text-sm text-error">{error}</p>}

      {/* Off-screen marks, baked into the export: reversed and on paper. */}
      <div ref={marks} className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <span className="dash-slide-mark dash-slide-mark-reversed">
          <GmhLogo href={undefined} />
        </span>
        <span className="dash-slide-mark">
          <GmhLogo href={undefined} />
        </span>
      </div>

      <Panel className="p-3">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-sm font-bold">
            {deck.slides.length} slides <span className="font-normal text-on-surface-variant">· drag to reorder</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const s: DeckSlide = { id: nextId(), layout: "statement", heading: "A new idea" };
              setDeck((d) => ({ ...d, slides: [...d.slides.slice(0, index + 1), s, ...d.slides.slice(index + 1)] }));
              setSelected(s.id);
            }}
          >
            <Plus aria-hidden /> Add slide
          </Button>
        </div>
        <Reorder.Group
          axis="x"
          values={deck.slides}
          onReorder={(slides) => setDeck((d) => ({ ...d, slides }))}
          className="flex gap-3 overflow-x-auto p-1 pb-2"
        >
          {deck.slides.map((s, i) => (
            <Reorder.Item key={s.id} value={s} className="w-44 shrink-0 cursor-grab active:cursor-grabbing">
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                className={cn("block w-full rounded-xl p-1 transition", s.id === current.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-outline")}
                aria-label={`Slide ${i + 1}: ${s.heading}`}
                aria-current={s.id === current.id}
              >
                <SlidePreview slide={s} deck={deck} index={i} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Stage */}
        <div className="min-w-0 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + current.layout}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <SlidePreview slide={current} deck={deck} index={index} />
            </motion.div>
          </AnimatePresence>
          <p className="text-center text-xs text-on-surface-variant">The download matches this preview.</p>
        </div>

        {/* Inspector */}
        <Panel className="space-y-5 p-5 xl:sticky xl:top-24 xl:self-start">
          <div>
            <div className="mb-2 text-sm font-bold">Layout</div>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => update({ layout: l.id })}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-left text-sm transition",
                    current.layout === l.id ? "border-primary bg-primary text-on-primary" : "border-outline-variant hover:bg-surface-container",
                  )}
                >
                  <span className="block font-semibold">{l.name}</span>
                  <span className="block text-[11px] opacity-75">{l.hint}</span>
                </button>
              ))}
            </div>
          </div>
          {current.layout === "stat" && (
            <TextField label="Number" value={current.stat ?? ""} onChange={(stat) => update({ stat })} />
          )}
          <TextField label="Heading" value={current.heading} onChange={(heading) => update({ heading })} multiline />
          {current.layout !== "section" && (
            <TextField label="Supporting line" value={current.body ?? ""} onChange={(body) => update({ body })} multiline />
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => move(-1)} aria-label="Move slide up">
              <ArrowUp aria-hidden />
            </Button>
            <Button size="sm" variant="outline" onClick={() => move(1)} aria-label="Move slide down">
              <ArrowDown aria-hidden />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-error"
              disabled={deck.slides.length < 2}
              onClick={() => {
                const rest = deck.slides.filter((s) => s.id !== current.id);
                setDeck((d) => ({ ...d, slides: rest }));
                setSelected(rest[Math.max(0, index - 1)]!.id);
              }}
            >
              <Trash2 aria-hidden /> Remove
            </Button>
          </div>
          <hr className="border-outline-variant" />
          <TextField label="Deck title (footer)" value={deck.title} onChange={(t) => setDeck((d) => ({ ...d, title: t }))} />
          <TextField label="Presenter" value={deck.presenter} onChange={(p) => setDeck((d) => ({ ...d, presenter: p }))} />
          <TextField label="Date" value={deck.date} onChange={(date) => setDeck((d) => ({ ...d, date }))} />
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <SectionTitle title="PowerPoint, step by step" description="From a blank file to a deck the lab would be proud of." />
          <Stagger className="space-y-3">
            {TUTORIAL.map((step, i) => (
              <Item key={step.title}>
                <Panel className="flex gap-5 p-5">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-band font-serif text-xl text-brand-band-accent">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{step.body}</p>
                  </div>
                </Panel>
              </Item>
            ))}
          </Stagger>
        </div>
        <div>
          <SectionTitle title="Theme colours" />
          <Panel className="space-y-3 p-5 lg:sticky lg:top-24">
            {palette &&
              (
                [
                  ["Dark 1", "Navy", palette.navy],
                  ["Accent 1", "Gold", palette.gold],
                  ["Accent 2", "Light gold", palette.goldLight],
                  ["Light 1", "Paper", palette.paper],
                ] as const
              ).map(([slot, name, hex]) => (
                <div key={slot} className="flex items-center gap-3">
                  <span className="size-10 rounded-xl ring-1 ring-outline-variant" style={{ background: hex }} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-on-surface-variant">{slot}</div>
                  </div>
                  <code className="font-mono text-sm">{hex}</code>
                </div>
              ))}
          </Panel>
        </div>
      </section>

      <section id="templates" className="scroll-mt-24">
        <SectionTitle
          title="Posters & one-pagers"
          description="Layouts in the lab's grid for print."
          action={!templatesUnlocked && <Chip tone="gold">Practitioner add-on</Chip>}
        />
        <Stagger className="grid gap-5 md:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <Item key={t.id}>
              <Panel className="overflow-hidden p-0">
                <div className={cn("relative grid aspect-[3/4] place-items-center p-6", i === 1 ? "dash-art" : "dash-hero !rounded-none")} data-tone={i === 1 ? "gold" : undefined}>
                  {i !== 1 && (
                    <div className="dash-aurora" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                  <div className="relative w-full space-y-3">
                    <div className="h-2 w-1/3 rounded-full bg-current opacity-50" />
                    <div className="font-serif text-2xl leading-tight">{t.name}</div>
                    <div className="h-1.5 w-full rounded-full bg-current opacity-20" />
                    <div className="h-1.5 w-5/6 rounded-full bg-current opacity-20" />
                    <div className="grid grid-cols-3 gap-2 pt-4">
                      {[0, 1, 2].map((k) => (
                        <div key={k} className="aspect-square rounded-lg bg-current opacity-10" />
                      ))}
                    </div>
                    <div className="flex justify-end pt-6">
                      <ResearchGlyph name={t.art} size={56} />
                    </div>
                  </div>
                  {!templatesUnlocked && (
                    <div className="absolute inset-0 grid place-items-center bg-scrim/30 backdrop-blur-[2px]">
                      <Lock className="size-8 text-white" aria-label="Locked" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-on-surface-variant">{t.format}</div>
                  </div>
                  {templatesUnlocked ? (
                    <Chip tone="info">Files coming soon</Chip>
                  ) : (
                    <Link href={templatesHref} className="text-sm font-semibold text-primary hover:underline">
                      Unlock
                    </Link>
                  )}
                </div>
              </Panel>
            </Item>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}): ReactNode {
  const cls =
    "w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}
