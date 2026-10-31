import { cn } from "@gmhlab/ui";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { EASE, Item, PageHero, Panel, SectionTitle, Stagger } from "./kit";

/* ── colour maths ─────────────────────────────────────────────────────── */

type Rgb = [number, number, number];

/** Resolve any CSS colour (a token, a color-mix) to sRGB via the browser. */
function resolve(cssColor: string): Rgb | null {
  const probe = document.createElement("span");
  probe.style.color = cssColor;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  const m = value.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  // color(srgb r g b) reports 0–1; rgb() reports 0–255.
  const nums = m.slice(0, 3).map(Number);
  const scale = value.startsWith("color(") ? 255 : 1;
  return nums.map((n) => Math.round(n * scale)) as Rgb;
}

export const toHex = ([r, g, b]: Rgb) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;

function luminance([r, g, b]: Rgb) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG 2 contrast ratio. */
export function contrast(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The tokens' current values in this theme, read from the page — so the
 * studio can never disagree with the CSS. Re-reads when the theme flips.
 */
export function useTokenColors(tokens: string[]): Record<string, Rgb | null> {
  const [values, setValues] = useState<Record<string, Rgb | null>>({});
  const key = tokens.join("|");
  useEffect(() => {
    const read = () =>
      setValues(Object.fromEntries(tokens.map((t) => [t, resolve(`var(${t})`)])));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return values;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1400);
    } catch {
      // Clipboard blocked: nothing to do.
    }
  };
  return { copied, copy };
}

/* ── records ──────────────────────────────────────────────────────────── */

type Swatch = { token: string; name: string; role: string; ink: string };

const CORE: Swatch[] = [
  { token: "--gmh-color-navy", name: "GW Navy", role: "The brand. Bands, the sidebar, headings on paper.", ink: "--gmh-color-on-brand-band" },
  { token: "--gmh-color-tertiary-container", name: "GW Gold", role: "A fill and an accent — never text on paper.", ink: "--gmh-color-on-tertiary-container" },
  { token: "--gmh-color-brand-band-accent", name: "Light gold", role: "Gold text and rules, on navy only.", ink: "--gmh-color-navy" },
  { token: "--gmh-color-surface", name: "Paper", role: "The page.", ink: "--gmh-color-on-surface" },
];

const ROLES: Swatch[] = [
  { token: "--gmh-color-primary", name: "Primary", role: "Filled buttons, links, focus.", ink: "--gmh-color-on-primary" },
  { token: "--gmh-color-primary-container", name: "Primary container", role: "Tinted panels.", ink: "--gmh-color-on-primary-container" },
  { token: "--gmh-color-secondary-container", name: "Secondary container", role: "Tonal buttons, selected rows.", ink: "--gmh-color-on-secondary-container" },
  { token: "--gmh-color-tertiary", name: "Tertiary", role: "Gold as text, where gold text is needed.", ink: "--gmh-color-on-tertiary" },
  { token: "--gmh-color-surface-container", name: "Surface container", role: "Cards and wells.", ink: "--gmh-color-on-surface" },
  { token: "--gmh-color-success-container", name: "Success", role: "Done, approved.", ink: "--gmh-color-on-success-container" },
  { token: "--gmh-color-warning-container", name: "Warning", role: "Check this.", ink: "--gmh-color-on-warning-container" },
  { token: "--gmh-color-error-container", name: "Error", role: "Something failed.", ink: "--gmh-color-on-error-container" },
];

const CHECKABLE = [...CORE, ...ROLES, { token: "--gmh-color-on-surface", name: "Ink", role: "", ink: "" }];

const RULES = [
  {
    good: true,
    title: "Gold as a fill",
    body: "Buttons, chips, rules and graphic accents in GW gold, with navy on top.",
    sample: (
      <span className="rounded-full bg-tertiary-container px-4 py-2 text-sm font-bold text-on-tertiary-container">Register</span>
    ),
  },
  {
    good: false,
    title: "Gold text on paper",
    body: "GW gold on white is about 2.7:1 — below the 4.5:1 body text needs.",
    sample: <span className="text-lg font-semibold" style={{ color: "var(--gmh-color-tertiary-container)" }}>Read our report</span>,
  },
  {
    good: true,
    title: "Light gold on navy",
    body: "On navy, the light gold reads clearly for eyebrows and highlights.",
    sample: (
      <span className="rounded-xl bg-brand-band px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-band-accent">Our work</span>
    ),
  },
  {
    good: false,
    title: "Retinting the brand",
    body: "No new blues or golds. Tint from a token instead: navy at 9% over paper.",
    sample: <span className="rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: "color-mix(in srgb, var(--gmh-color-navy) 55%, var(--gmh-color-error))" }}>Off-brand</span>,
  },
];

const TYPE = [
  { label: "Display", className: "font-serif text-5xl", sample: "Supporting wellbeing worldwide." },
  { label: "Headline", className: "font-serif text-3xl", sample: "Training helpers to a safe standard" },
  { label: "Title", className: "text-xl font-semibold", sample: "Competency-based assessment" },
  { label: "Body", className: "text-base", sample: "Helpers are trained non-specialists, and what makes them effective is mostly skill, not credentials." },
  { label: "Label", className: "text-xs font-bold uppercase tracking-[0.18em]", sample: "Eyebrow · label · chip" },
];

/* ── page ─────────────────────────────────────────────────────────────── */

export type BrandStudioProps = {
  title?: string;
  description?: string;
};

/**
 * The brand guide, live: swatches read from the tokens in the current theme
 * (copy hex or the token name), the gold rules as do/don't pairs, a WCAG
 * contrast checker over any two brand colours, and the type scale.
 */
export function BrandStudio({
  title = "Brand studio",
  description = "Navy and gold, used well. Every value here is read live from the design tokens, so it is always the real one — in light and dark.",
}: BrandStudioProps) {
  const values = useTokenColors(useMemo(() => CHECKABLE.map((s) => s.token), []));
  const { copied, copy } = useCopy();
  const [fg, setFg] = useState("--gmh-color-on-surface");
  const [bg, setBg] = useState("--gmh-color-surface");
  const ratio = values[fg] && values[bg] ? contrast(values[fg]!, values[bg]!) : null;

  const swatch = (s: Swatch, big = false) => {
    const rgb = values[s.token];
    const hex = rgb ? toHex(rgb) : "…";
    return (
      <Item key={s.token}>
        <Panel className="overflow-hidden p-0">
          <button
            type="button"
            onClick={() => copy(hex)}
            className={cn("group relative block w-full text-left", big ? "h-40" : "h-24")}
            style={{ background: `var(${s.token})`, color: `var(${s.ink})` }}
            aria-label={`Copy ${s.name} ${hex}`}
          >
            <span className="absolute left-4 top-4 font-serif text-lg">{big && s.name}</span>
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1 text-xs font-semibold opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {copied === hex ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied === hex ? "Copied" : "Copy hex"}
            </span>
          </button>
          <div className="p-4">
            {!big && <div className="font-semibold">{s.name}</div>}
            <div className="mt-0.5 flex items-center justify-between gap-2 font-mono text-xs text-on-surface-variant">
              <span>{hex}</span>
              <button type="button" onClick={() => copy(`var(${s.token})`)} className="truncate hover:text-primary" title="Copy token">
                {copied === `var(${s.token})` ? "copied" : s.token.replace("--gmh-color-", "")}
              </button>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">{s.role}</p>
          </div>
        </Panel>
      </Item>
    );
  };

  const verdict = ratio === null ? null : ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fail";

  return (
    <div className="space-y-12">
      <PageHero eyebrow="Create" title={title} description={description} art={{ kind: "shape", name: "quarter-sun" }} />

      <section>
        <SectionTitle title="The core four" description="Click a swatch to copy its hex; click the token name to copy the CSS variable." />
        <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{CORE.map((s) => swatch(s, true))}</Stagger>
      </section>

      <section>
        <SectionTitle title="Gold, the rules" description="GW gold is #AA9868 — beautiful, and too light to be text on paper." />
        <Stagger className="grid gap-5 md:grid-cols-2">
          {RULES.map((r) => (
            <Item key={r.title}>
              <Panel className="flex h-full gap-5 p-5">
                <div className="grid h-28 w-40 shrink-0 place-items-center rounded-2xl bg-surface dash-dots">{r.sample}</div>
                <div>
                  <div className={cn("mb-1 inline-flex items-center gap-1.5 text-sm font-bold", r.good ? "text-success" : "text-error")}>
                    {r.good ? <ThumbsUp className="size-4" /> : <ThumbsDown className="size-4" />}
                    {r.good ? "Do" : "Don't"}
                  </div>
                  <div className="font-semibold">{r.title}</div>
                  <p className="mt-1 text-sm text-on-surface-variant">{r.body}</p>
                </div>
              </Panel>
            </Item>
          ))}
        </Stagger>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionTitle title="Contrast checker" description="Any brand colour on any other, scored against WCAG 2." />
          <Panel className="space-y-5 p-6">
            {(
              [
                ["Text", fg, setFg],
                ["Background", bg, setBg],
              ] as const
            ).map(([label, value, set]) => (
              <label key={label} className="block">
                <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-3"
                >
                  {CHECKABLE.map((s) => (
                    <option key={s.token} value={s.token}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <motion.div
              key={`${fg}${bg}`}
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid h-40 place-items-center rounded-3xl text-center ring-1 ring-outline-variant"
              style={{ background: `var(${bg})`, color: `var(${fg})` }}
            >
              <div>
                <div className="font-serif text-3xl">Aa — wellbeing</div>
                <div className="mt-1 text-sm">The quick brown fox, at body size.</div>
              </div>
            </motion.div>
            <div className="flex items-center justify-between">
              <div className="font-serif text-4xl tabular-nums">{ratio ? `${ratio.toFixed(2)}:1` : "…"}</div>
              {verdict && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-bold",
                    verdict === "Fail" ? "bg-error-container text-on-error-container" : verdict === "AA large" ? "bg-warning-container text-on-warning-container" : "bg-success-container text-on-success-container",
                  )}
                >
                  {verdict}
                </span>
              )}
            </div>
          </Panel>
        </div>
        <div>
          <SectionTitle title="Type" description="Baskerville for headlines, Avenir Next for everything else." />
          <Panel className="divide-y divide-outline-variant/60 p-0">
            {TYPE.map((t) => (
              <div key={t.label} className="grid gap-2 p-5 sm:grid-cols-[6rem_1fr] sm:items-baseline">
                <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t.label}</div>
                <div className={t.className}>{t.sample}</div>
              </div>
            ))}
          </Panel>
        </div>
      </section>

      <section>
        <SectionTitle title="All roles" description="The Material 3 roles every component uses. Pair each with its on- colour." />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ROLES.map((s) => swatch(s))}</Stagger>
      </section>
    </div>
  );
}
