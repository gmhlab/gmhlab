import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Section } from "@gmhlab/ui";

import { chime } from "./chime";
import { contrastRatio, parseColor } from "./color-math";
import {
  FAMILY_ORDER,
  backdropFor,
  contentFor,
  useGmhTokens,
  varOf,
  type GmhKind,
  type GmhToken,
  type GmhTokenSet,
} from "./use-gmh-tokens";
import "./token-gallery.css";

/* ------------------------------------------------------------------ */
/* Shared vocabulary                                                   */
/* ------------------------------------------------------------------ */

const FAMILY_META: Record<string, { title: string; blurb: string }> = {
  surface: {
    title: "Surface",
    blurb: "The resting page and its containers, the text on them, the outlines between them, and the inverse slab.",
  },
  primary: { title: "Primary", blurb: "GW navy. Filled buttons, links, headings — the product speaking in its own voice." },
  secondary: { title: "Secondary", blurb: "A quieter navy for tonal buttons, chips and selected states." },
  tertiary: { title: "Tertiary", blurb: "GW gold. The #AA9868 fill is the container; gold text is tertiary itself." },
  error: { title: "Error", blurb: "Destructive actions and errors." },
  success: { title: "Success", blurb: "Confirmation. Something worked. A GMH custom colour in M3's shape." },
  warning: { title: "Warning", blurb: "Caution — attention, not alarm. A GMH custom colour." },
  info: { title: "Info", blurb: "Neutral news. A GMH custom colour." },
  brand: {
    title: "Brand band",
    blurb: "GMH roles M3 lacks: the full-width navy band (primary in light, primary-container after dark), its content, its gold, and navy that never flips.",
  },
};

const SWATCH_CLASS: Record<GmhKind, string> = { fill: "background", on: "text", line: "border" };

const noteDegree = (family: string) => Math.max(0, FAMILY_ORDER.indexOf(family as never));
const noteDepth = (role: string) => (role.includes("fixed") ? 2 : role.includes("container") ? 1 : 0);

/** M3's hover state layer: the content colour over the fill at 8%. */
const stateLayer = (fill: string, content: string) => `color-mix(in srgb, ${fill}, ${content} 8%)`;

/* ------------------------------------------------------------------ */
/* Context: token set + sound + clipboard toast                        */
/* ------------------------------------------------------------------ */

interface TgContextValue {
  set: GmhTokenSet;
  soundOn: boolean;
  toggleSound: () => void;
  copy: (text: string, toast: string, degree?: number) => void;
}

const TgContext = createContext<TgContextValue | null>(null);

const useTg = () => {
  const value = useContext(TgContext);
  if (!value) throw new Error("Token gallery sections must be wrapped in <TokenGallery>");
  return value;
};

export function TokenGallery({ children }: { children: ReactNode }) {
  const set = useGmhTokens();
  const [soundOn, setSoundOn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      chime.setEnabled(!on);
      if (!on) chime.confirm(2);
      return !on;
    });
  }, []);

  const copy = useCallback((text: string, message: string, degree = 0) => {
    void navigator.clipboard?.writeText(text).catch(() => {});
    chime.confirm(degree);
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  // Scroll-reveal: sections fade up as they enter. Skipped entirely when
  // the user prefers reduced motion (CSS keeps everything visible too).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [set.tokens.length]);

  const value = useMemo(
    () => ({ set, soundOn, toggleSound, copy }),
    [set, soundOn, toggleSound, copy],
  );

  return (
    <TgContext.Provider value={value}>
      <div className="tg" ref={rootRef}>
        {children}
        <div className="tg-toast" role="status" aria-live="polite" data-open={toast ? "" : undefined}>
          {toast}
        </div>
      </div>
    </TgContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function Glyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
    </svg>
  );
}

/**
 * Older WebKit (Safari ≤16) is unreliable at resolving inline-style custom
 * properties whose value is itself a var() chain, so inline styles carry the
 * *resolved* color instead. Components re-render on theme flip (the token
 * set's themeVersion bumps), so the values stay correct in both themes.
 */
const useResolvedVar = (set: GmhTokenSet) =>
  useCallback((role: string) => set.resolve(role) || `var(${varOf(role)})`, [set]);

/** One role, one chip. Hover hears it, click copies its var(). */
function Swatch({ token }: { token: GmhToken }) {
  const { set, copy } = useTg();
  const v = useResolvedVar(set);
  const degree = noteDegree(token.family);
  const depth = noteDepth(token.role);
  const content = token.kind === "fill" ? contentFor(token.role, set.has) : null;
  const backdrop = token.kind === "on" ? backdropFor(token.role) : null;
  const resolved = set.resolve(token.role);

  const style = {
    "--sw": v(token.role),
    "--sw-hover": content ? stateLayer(v(token.role), v(content)) : v(token.role),
    "--sw-backdrop": backdrop && set.has(backdrop) ? v(backdrop) : "transparent",
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`tg-swatch tg-swatch-${SWATCH_CLASS[token.kind]}${backdrop ? " is-on" : ""}${content ? " has-hover" : ""}`}
      style={style}
      title={`${token.name} · ${resolved}`}
      onMouseEnter={() => chime.pluck(degree, depth)}
      onFocus={() => chime.pluck(degree, depth)}
      onClick={() => copy(`var(${token.name})`, `var(${token.name}) → clipboard`, degree)}
    >
      <span className="tg-swatch-block" aria-hidden="true">
        {token.kind === "on" && <span className="tg-swatch-specimen">Ag</span>}
      </span>
      <span className="tg-swatch-variant">
        {token.role}
        {content ? " ⇢ hover" : ""}
      </span>
      <span className="tg-swatch-value">{resolved}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Recipes: one family, three prominences                              */
/* ------------------------------------------------------------------ */

interface Recipe {
  bg: string;
  /** A CSS colour (not a role): the state layer, or a wash */
  bgHover: string;
  text: string;
  border: string;
  icon: string;
}

type Prominence = "loud" | "supporting" | "whisper";

/** The M3 pairings for a family, resolved to CSS colours. */
function recipeFor(family: string, prominence: Prominence, set: GmhTokenSet): Recipe | null {
  const r = (role: string) => set.resolve(role) || `var(${varOf(role)})`;
  if (family === "surface") {
    const bg = { loud: "inverse-surface", supporting: "surface-container-high", whisper: "surface" }[prominence];
    const text = prominence === "loud" ? "inverse-on-surface" : "on-surface";
    return {
      bg: r(bg),
      bgHover: stateLayer(r(bg), r(text)),
      text: r(text),
      border: r(prominence === "loud" ? "inverse-surface" : "outline-variant"),
      icon: r(prominence === "loud" ? "inverse-primary" : "primary"),
    };
  }
  if (family === "brand") {
    if (prominence !== "loud") return null;
    return {
      bg: r("brand-band"),
      bgHover: stateLayer(r("brand-band"), r("on-brand-band")),
      text: r("on-brand-band"),
      border: r("brand-band-accent"),
      icon: r("brand-band-accent"),
    };
  }
  if (!set.has(family)) return null;
  if (prominence === "loud") {
    return {
      bg: r(family),
      bgHover: stateLayer(r(family), r(`on-${family}`)),
      text: r(`on-${family}`),
      border: r(family),
      icon: r(`on-${family}`),
    };
  }
  if (prominence === "supporting") {
    return {
      bg: r(`${family}-container`),
      bgHover: stateLayer(r(`${family}-container`), r(`on-${family}-container`)),
      text: r(`on-${family}-container`),
      border: r(`${family}-container`),
      icon: r(family),
    };
  }
  // A wash of the container on the page, with the family colour as text.
  const wash = (p: number) => `color-mix(in srgb, ${r(`${family}-container`)} ${p}%, ${r("surface")})`;
  return { bg: wash(30), bgHover: wash(45), text: r(family), border: r("outline-variant"), icon: r(family) };
}

const recipeRoles = (family: string, prominence: Prominence): string => {
  if (family === "surface")
    return prominence === "loud"
      ? "inverse-surface / inverse-on-surface"
      : prominence === "supporting"
        ? "surface-container-high / on-surface"
        : "surface / on-surface";
  if (family === "brand") return "brand-band / on-brand-band";
  return prominence === "loud"
    ? `${family} / on-${family}`
    : prominence === "supporting"
      ? `${family}-container / on-${family}-container`
      : `${family}-container 30% / ${family}`;
};

/* ------------------------------------------------------------------ */
/* Section 1: hero — anatomy of a surface                              */
/* ------------------------------------------------------------------ */

const HERO_STEPS: { family: string; prominence: Prominence }[] = [
  { family: "brand", prominence: "loud" },
  { family: "tertiary", prominence: "supporting" },
  { family: "success", prominence: "supporting" },
  { family: "warning", prominence: "supporting" },
  { family: "error", prominence: "supporting" },
  { family: "surface", prominence: "loud" },
];

const HERO_LINES: Record<string, { title: string; body: string }> = {
  brand: { title: "New in GMH Lab", body: "The colour atlas below generates itself." },
  tertiary: { title: "Featured", body: "Gold marks the one thing on the page." },
  success: { title: "Build passed", body: "tokens → ui → blocks → apps, all green." },
  warning: { title: "Rebuild required", body: "packages/* changed — dist is stale." },
  error: { title: "Delete workspace?", body: "This removes dist/ everywhere." },
  surface: { title: "Draft saved", body: "Nothing needs your attention." },
};

const LAYER_LABEL = { bg: "what it sits on", border: "where it ends", text: "what it says", icon: "what it points at" };

export function TokenGalleryHero() {
  const { set, soundOn, toggleSound, copy } = useTg();
  const [step, setStep] = useState(0);
  const [focusRole, setFocusRole] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { family, prominence } = HERO_STEPS[step % HERO_STEPS.length];
  const recipe = recipeFor(family, prominence, set);
  const roles = recipeRoles(family, prominence).split(" / ");

  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => s + 1), 3600);
    return () => window.clearInterval(t);
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--tilt-x", `${(-y * 10).toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
  };

  const onPointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    // fall back to the resting tilt declared in CSS
    stage.style.removeProperty("--tilt-x");
    stage.style.removeProperty("--tilt-y");
  };

  const layers = recipe
    ? ([
        { key: "bg", focus: "background", color: recipe.bg, label: roles[0] },
        { key: "border", focus: "border", color: recipe.border, label: "edge" },
        { key: "text", focus: "text", color: recipe.text, label: roles[1] ?? roles[0] },
        { key: "icon", focus: "icon", color: recipe.icon, label: "mark" },
      ] as const)
    : null;

  return (
    <Section padding="1600" paddingBottom="800">
      <div className="tg-hero" data-reveal="">
        <div className="tg-hero-copy">
          <p className="tg-eyebrow">GMH Lab colour system · live atlas</p>
          <h2 className="tg-display">
            Every colour is <em>a pair.</em>
          </h2>
          <p className="tg-lede">
            GMH Lab colour is Material 3. A role like <code>primary-container</code> is a fill,
            and <code>on-primary-container</code> is what goes on it — the pairing is measured
            when the tokens are generated, so it holds in both themes.
          </p>
          <div className="tg-hero-hints">
            <button
              type="button"
              className="tg-hint tg-hint-button"
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              {soundOn ? "◉ sound on — each family is a note" : "○ hear the system"}
            </button>
            <span className="tg-hint">
              press <kbd>d</kbd> — every pair re-answers in dark
            </span>
            <span className="tg-hint">click anything colored to copy its var()</span>
          </div>
          <p className="tg-hero-count">
            {set.tokens.length > 0
              ? `${set.tokens.length} colour roles discovered from the loaded stylesheets — nothing below is hardcoded.`
              : "Reading the loaded stylesheets…"}
          </p>
        </div>

        {recipe && layers && (
          <div className="tg-hero-stage-wrap">
            <div
              ref={stageRef}
              className="tg-stage"
              data-focus={focusRole ?? undefined}
              style={
                {
                  "--st-bg": recipe.bg,
                  "--st-text": recipe.text,
                  "--st-border": recipe.border,
                  "--st-icon": recipe.icon,
                } as CSSProperties
              }
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              onClick={() => setStep((s) => s + 1)}
              role="img"
              aria-label={`A ${family} surface exploded into its layers`}
            >
              <div className="tg-plane tg-plane-background" />
              <div className="tg-plane tg-plane-border" />
              <div className="tg-plane tg-plane-text">
                <strong>{HERO_LINES[family].title}</strong>
                <span>{HERO_LINES[family].body}</span>
              </div>
              <div className="tg-plane tg-plane-icon">
                <Glyph />
              </div>
            </div>
            <ul className="tg-legend">
              {layers.map(({ key, focus, color, label }) => (
                <li key={key}>
                  <button
                    type="button"
                    className="tg-legend-row"
                    onMouseEnter={() => {
                      setFocusRole(focus);
                      chime.pluck(noteDegree(family), key === "bg" ? 0 : 1);
                    }}
                    onMouseLeave={() => setFocusRole(null)}
                    onFocus={() => setFocusRole(focus)}
                    onBlur={() => setFocusRole(null)}
                    onClick={() => copy(color, `${color} → clipboard`, noteDegree(family))}
                  >
                    <span className="tg-legend-dot" style={{ background: color }} />
                    <span className="tg-legend-role">{LAYER_LABEL[key]}</span>
                    <code>{label}</code>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2: the atlas, one group of families at a time               */
/* ------------------------------------------------------------------ */

export function TokenFamilySection({
  title,
  verb,
  blurb,
  families,
  variant,
}: {
  title: string;
  verb: string;
  blurb: string;
  families: string[];
  variant?: "stroke" | "subtle";
}) {
  const { set } = useTg();
  const count = families.reduce((n, f) => n + (set.grouped.get(f)?.length ?? 0), 0);

  return (
    <Section padding="1200" variant={variant}>
      <div className="tg-role" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">--gmh-color-*</p>
          <h3 className="tg-role-title">
            {title} <span className="tg-role-verb">— {verb}</span>
          </h3>
          <p className="tg-role-blurb">{blurb}</p>
          <p className="tg-role-count">{count} roles, discovered live</p>
        </header>

        <div className="tg-matrix">
          {families
            .filter((family) => set.grouped.has(family))
            .map((family) => {
              const tokens = set.grouped.get(family)!;
              const plain = tokens.filter((t) => t.kind !== "on");
              const onTokens = tokens.filter((t) => t.kind === "on");
              return (
                <div className="tg-matrix-row" key={family}>
                  <div className="tg-matrix-label">
                    <span className="tg-intent-name">{FAMILY_META[family]?.title ?? family}</span>
                    <span className="tg-intent-copy">{FAMILY_META[family]?.blurb}</span>
                  </div>
                  <div className="tg-matrix-chips">
                    {plain.map((t) => (
                      <Swatch key={t.name} token={t} />
                    ))}
                    {onTokens.length > 0 && (
                      <div className="tg-on-group">
                        <span className="tg-on-label">on its own fill ⤵</span>
                        {onTokens.map((t) => (
                          <Swatch key={t.name} token={t} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3: recipes — pairings that always work                      */
/* ------------------------------------------------------------------ */

const RECIPE_FAMILIES = ["surface", "brand", "primary", "tertiary", "success", "warning", "error", "info"] as const;
const PROMINENCES: { key: Prominence; label: string }[] = [
  { key: "loud", label: "loud" },
  { key: "supporting", label: "supporting" },
  { key: "whisper", label: "whisper" },
];

const RECIPE_LINES: Record<string, { title: string; body: string }> = {
  surface: { title: "Resting surface", body: "Most of every screen is this quiet." },
  brand: { title: "The navy band", body: "Navy in both themes; gold on it." },
  primary: { title: "New in GMH Lab", body: "One grammar, both themes." },
  tertiary: { title: "Featured platform", body: "The secondary brand colour, same grammar." },
  success: { title: "Build passed", body: "tokens → ui → blocks → apps, all green." },
  warning: { title: "Rebuild required", body: "packages/* changed — dist is stale." },
  error: { title: "Delete workspace?", body: "This removes dist/ everywhere." },
  info: { title: "Heads up", body: "The Figma file follows the tokens." },
};

export function TokenPairingRecipes() {
  const { set, copy } = useTg();

  return (
    <Section padding="1200">
      <div className="tg-recipes" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">pairings</p>
          <h3 className="tg-role-title">
            Recipes <span className="tg-role-verb">— one family, three prominences</span>
          </h3>
          <p className="tg-role-blurb">
            Loud is the solid role and its on-colour; supporting is the container pair; a whisper
            is a wash of the container with the family colour as text. <strong>Hover any card</strong>{" "}
            — the shift is M3&apos;s state layer, the content colour over the fill at 8%. Click to
            copy the roles.
          </p>
        </header>

        <div className="tg-recipe-grid">
          {RECIPE_FAMILIES.map((family) => (
            <div className="tg-recipe-col" key={family}>
              <h4 className="tg-recipe-intent">{family}</h4>
              {PROMINENCES.map(({ key, label }) => {
                const recipe = recipeFor(family, key, set);
                if (!recipe) return null;
                const roles = recipeRoles(family, key);
                return (
                  <button
                    type="button"
                    key={key}
                    className="tg-recipe-card"
                    style={
                      {
                        "--rc-bg": recipe.bg,
                        "--rc-bg-hover": recipe.bgHover,
                        "--rc-text": recipe.text,
                        "--rc-border": recipe.border,
                        "--rc-icon": recipe.icon,
                      } as CSSProperties
                    }
                    onMouseEnter={() => chime.pluck(noteDegree(family), PROMINENCES.findIndex((p) => p.key === key))}
                    onClick={() => copy(roles, `${roles} → clipboard`, noteDegree(family))}
                  >
                    <span className="tg-recipe-top">
                      <Glyph className="tg-recipe-glyph" />
                      <span className="tg-recipe-prominence">{label}</span>
                    </span>
                    <strong className="tg-recipe-title">{RECIPE_LINES[family].title}</strong>
                    <span className="tg-recipe-body">{RECIPE_LINES[family].body}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4: the pairing lab — prove any combination                  */
/* ------------------------------------------------------------------ */

const WHITE: [number, number, number, number] = [255, 255, 255, 1];

type LabSlot = "background" | "text" | "border" | "icon";

export function TokenPairingLab() {
  const { set, copy } = useTg();
  const v = useResolvedVar(set);
  const [bg, setBg] = useState("brand-band");
  const [text, setText] = useState("on-brand-band");
  const [border, setBorder] = useState("brand-band-accent");
  const [icon, setIcon] = useState("brand-band-accent");

  const pickers: { slot: LabSlot; value: string; set: (n: string) => void; kinds: GmhKind[] }[] = [
    { slot: "background", value: bg, set: setBg, kinds: ["fill"] },
    { slot: "text", value: text, set: setText, kinds: ["on", "fill"] },
    { slot: "border", value: border, set: setBorder, kinds: ["line", "fill", "on"] },
    { slot: "icon", value: icon, set: setIcon, kinds: ["on", "fill"] },
  ];

  // Contrast is computed from the *resolved* values, so it re-runs — and can
  // change verdicts — when the theme flips. That is the point.
  const { textRatio, iconRatio } = useMemo(() => {
    const base = parseColor(set.resolve("surface")) ?? WHITE;
    const bgC = parseColor(set.resolve(bg));
    const textC = parseColor(set.resolve(text));
    const iconC = parseColor(set.resolve(icon));
    return {
      textRatio: bgC && textC ? contrastRatio(textC, bgC, base) : null,
      iconRatio: bgC && iconC ? contrastRatio(iconC, bgC, base) : null,
    };
  }, [set, bg, text, icon]);

  const snippet = [
    ".surface {",
    `  background: var(${varOf(bg)});`,
    `  color: var(${varOf(text)});`,
    `  border: 1px solid var(${varOf(border)});`,
    "}",
    `.surface .icon { color: var(${varOf(icon)}); }`,
  ].join("\n");

  const verdict = (ratio: number | null, min: number) =>
    ratio == null ? "–" : ratio >= min ? "pass" : "fail";

  return (
    <Section padding="1200" paddingBottom="1600" variant="stroke">
      <div className="tg-lab" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">pairing lab</p>
          <h3 className="tg-role-title">
            Prove a pairing <span className="tg-role-verb">— any four roles, measured live</span>
          </h3>
          <p className="tg-role-blurb">
            Pick a fill, a text colour, an edge and a mark. The card renders them, the numbers
            judge them — WCAG contrast, recomputed from resolved values, so press <kbd>d</kbd> and
            watch the verdicts hold (or not).
          </p>
        </header>

        <div className="tg-lab-body">
          <div
            className="tg-lab-preview"
            style={
              {
                "--lab-bg": v(bg),
                "--lab-text": v(text),
                "--lab-border": v(border),
                "--lab-icon": v(icon),
              } as CSSProperties
            }
          >
            <div className="tg-lab-card">
              <Glyph className="tg-lab-glyph" />
              <strong>Color is a contract.</strong>
              <span>
                This card is nothing but the four vars you picked. If it reads, ship it.
              </span>
              <span className="tg-lab-ratios">
                <span data-ok={verdict(textRatio, 4.5)}>
                  text {textRatio ? textRatio.toFixed(2) : "–"} · AA {verdict(textRatio, 4.5)} · AAA{" "}
                  {verdict(textRatio, 7)}
                </span>
                <span data-ok={verdict(iconRatio, 3)}>
                  icon {iconRatio ? iconRatio.toFixed(2) : "–"} · AA {verdict(iconRatio, 3)}
                </span>
              </span>
            </div>
            <button
              type="button"
              className="tg-lab-copy"
              onClick={() => copy(snippet, "pairing CSS → clipboard", 4)}
            >
              copy CSS
            </button>
            <pre className="tg-lab-snippet">{snippet}</pre>
          </div>

          <div className="tg-lab-pickers">
            {pickers.map(({ slot, value, set: select, kinds }) => (
              <fieldset className="tg-lab-picker" key={slot}>
                <legend>{slot}</legend>
                <div className="tg-lab-chips">
                  {set.tokens
                    .filter((t) => kinds.includes(t.kind))
                    .map((t) => (
                      <button
                        type="button"
                        key={t.name}
                        className={`tg-lab-chip tg-lab-chip-${slot}`}
                        aria-pressed={t.role === value}
                        title={t.role}
                        style={
                          {
                            "--chip": v(t.role),
                            // on-* colors are minted for a specific fill; show
                            // them on it or dark-resolving ones vanish
                            ...(t.kind === "on" && set.has(backdropFor(t.role))
                              ? { "--chip-bg": v(backdropFor(t.role)) }
                              : null),
                          } as CSSProperties
                        }
                        onMouseEnter={() => chime.pluck(noteDegree(t.family), noteDepth(t.role))}
                        onClick={() => select(t.role)}
                      >
                        {slot === "text" ? "A" : slot === "icon" ? <Glyph /> : null}
                      </button>
                    ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
