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
import { useMfyTokens, type MfyRole, type MfyToken, type MfyTokenSet } from "./use-mfy-tokens";
import "./token-gallery.css";

/* ------------------------------------------------------------------ */
/* Shared vocabulary                                                   */
/* ------------------------------------------------------------------ */

const INTENT_ORDER = [
  "default",
  "neutral",
  "brand",
  "positive",
  "warning",
  "danger",
  "disabled",
  "utilities",
] as const;

const INTENT_COPY: Record<string, string> = {
  default: "The resting surface. Most of every screen is this quiet.",
  neutral: "De-emphasis without meaning — slate, not signal.",
  brand: "The product speaking in its own voice.",
  positive: "Confirmation. Something worked.",
  warning: "Caution — attention, not alarm.",
  danger: "Destructive actions and errors.",
  disabled: "Interactive, but not right now.",
  utilities: "Tooling colors: measurement, overlays, scrims, swatch hairlines.",
};

const ROLE_META: Record<MfyRole, { title: string; verb: string; blurb: string }> = {
  background: {
    title: "Background",
    verb: "what it sits on",
    blurb:
      "Backgrounds set the floor of a surface. Hover any filled swatch — the color you see next is its real -hover token, not a filter.",
  },
  text: {
    title: "Text",
    verb: "what it says",
    blurb:
      "Text carries the message. Plain variants sit on the resting surface; on-* variants are shown on the exact background they were minted for.",
  },
  border: {
    title: "Border",
    verb: "where it ends",
    blurb:
      "Borders draw the edge of a decision. Three weights of certainty per intent: default, secondary, tertiary.",
  },
  icon: {
    title: "Icon",
    verb: "what it points at",
    blurb:
      "Icons point. They follow the same grammar as text — including on-* variants tuned to their matching fills.",
  },
};

const noteDegree = (intent: string) => Math.max(0, INTENT_ORDER.indexOf(intent as never));
const noteDepth = (variant: string) =>
  variant.includes("tertiary") ? 2 : variant.includes("secondary") ? 1 : 0;

const isHoverVariant = (variant: string) => variant === "hover" || variant.endsWith("-hover");

function hoverTokenFor(name: string, has: (n: string) => boolean): string | null {
  if (has(`${name}-hover`)) return `${name}-hover`;
  if (name.endsWith("-default")) {
    const swapped = name.replace(/-default$/, "-hover");
    if (has(swapped)) return swapped;
  }
  return null;
}

/** For an on-* token, find the background it was minted for. */
function backdropFor(token: MfyToken, has: (n: string) => boolean): string {
  const onIndex = token.variant.indexOf("on-");
  const rest = onIndex >= 0 ? token.variant.slice(onIndex + 3) : "";
  const candidates = [
    `--mfy-color-background-${rest}`,
    `--mfy-color-background-${rest}-default`,
    `--mfy-color-background-${token.intent}-${rest}`,
    `--mfy-color-background-${token.intent}-default`,
  ];
  return candidates.find(has) ?? "--mfy-color-background-neutral-default";
}

/* ------------------------------------------------------------------ */
/* Context: token set + sound + clipboard toast                        */
/* ------------------------------------------------------------------ */

interface TgContextValue {
  set: MfyTokenSet;
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
  const set = useMfyTokens();
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

const cssVar = (name: string) => `var(${name})`;

/**
 * Older WebKit (Safari ≤16) is unreliable at resolving inline-style custom
 * properties whose value is itself a var() chain, so inline styles carry the
 * *resolved* color instead. Components re-render on theme flip (the token
 * set's themeVersion bumps), so the values stay correct in both themes.
 */
const useResolvedVar = (set: MfyTokenSet) =>
  useCallback((name: string) => set.resolve(name) || cssVar(name), [set]);

interface SwatchProps {
  token: MfyToken;
}

/** One token, one chip. Hover hears it, click copies its var(). */
function Swatch({ token }: SwatchProps) {
  const { set, copy } = useTg();
  const v = useResolvedVar(set);
  const degree = noteDegree(token.intent);
  const depth = noteDepth(token.variant);
  const hover = token.role === "background" ? hoverTokenFor(token.name, set.has) : null;
  const isOn = token.variant.includes("on-");
  const backdrop = isOn ? backdropFor(token, set.has) : null;
  const resolved = set.resolve(token.name);

  const style = {
    "--sw": v(token.name),
    "--sw-hover": hover ? v(hover) : v(token.name),
    "--sw-backdrop": backdrop ? v(backdrop) : "transparent",
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`tg-swatch tg-swatch-${token.role}${isOn ? " is-on" : ""}${hover ? " has-hover" : ""}`}
      style={style}
      title={`${token.name} · ${resolved}`}
      onMouseEnter={() => chime.pluck(degree, depth)}
      onFocus={() => chime.pluck(degree, depth)}
      onClick={() => copy(cssVar(token.name), `var(${token.name}) → clipboard`, degree)}
    >
      <span className="tg-swatch-block" aria-hidden="true">
        {token.role === "text" && <span className="tg-swatch-specimen">Ag</span>}
        {token.role === "icon" && <Glyph className="tg-swatch-glyph" />}
      </span>
      <span className="tg-swatch-variant">
        {token.variant}
        {hover ? " ⇢ hover" : ""}
      </span>
      <span className="tg-swatch-value">{resolved}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Recipes: same intent, matched prominence                            */
/* ------------------------------------------------------------------ */

interface Recipe {
  bg: string;
  bgHover: string | null;
  text: string;
  border: string;
  icon: string;
}

function recipeFor(intent: string, prominence: string, has: (n: string) => boolean): Recipe | null {
  const p = prominence === "default" ? "default" : prominence;
  const pick = (candidates: string[]) => candidates.find(has) ?? null;
  const bg = pick([`--mfy-color-background-${intent}-${p}`]);
  if (!bg) return null;
  const onSuffix = prominence === "default" ? `on-${intent}` : `on-${intent}-${prominence}`;
  const text = pick([
    `--mfy-color-text-${intent}-${onSuffix}`,
    `--mfy-color-text-${intent}-default`,
    `--mfy-color-text-default-default`,
  ]);
  const border = pick([
    `--mfy-color-border-${intent}-${p}`,
    `--mfy-color-border-${intent}-default`,
    `--mfy-color-border-default-default`,
  ]);
  const icon = pick([
    `--mfy-color-icon-${intent}-${onSuffix}`,
    `--mfy-color-icon-${intent}-default`,
    `--mfy-color-icon-default-default`,
  ]);
  if (!text || !border || !icon) return null;
  return { bg, bgHover: hoverTokenFor(bg, has), text, border, icon };
}

/* ------------------------------------------------------------------ */
/* Section 1: hero — anatomy of a surface                              */
/* ------------------------------------------------------------------ */

const HERO_INTENTS = ["brand", "positive", "warning", "danger", "neutral"] as const;

const HERO_LINES: Record<string, { title: string; body: string }> = {
  brand: { title: "New in monofly", body: "The token atlas below generates itself." },
  positive: { title: "Build passed", body: "tokens → ui → blocks → demo, all green." },
  warning: { title: "Rebuild required", body: "packages/* changed — dist is stale." },
  danger: { title: "Delete workspace?", body: "This removes dist/ everywhere." },
  neutral: { title: "Draft saved", body: "Nothing needs your attention." },
};

export function TokenGalleryHero() {
  const { set, soundOn, toggleSound, copy } = useTg();
  const v = useResolvedVar(set);
  const [step, setStep] = useState(0);
  const [focusRole, setFocusRole] = useState<MfyRole | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const intent = HERO_INTENTS[step % HERO_INTENTS.length];
  const recipe = recipeFor(intent, "default", set.has);

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

  const layers: { role: MfyRole; name: string }[] | null = recipe && [
    { role: "background", name: recipe.bg },
    { role: "border", name: recipe.border },
    { role: "text", name: recipe.text },
    { role: "icon", name: recipe.icon },
  ];

  return (
    <Section padding="1600" paddingBottom="800">
      <div className="tg-hero" data-reveal="">
        <div className="tg-hero-copy">
          <p className="tg-eyebrow">monofly color system · live atlas</p>
          <h2 className="tg-display">
            Every surface is <em>four decisions.</em>
          </h2>
          <p className="tg-lede">
            What it sits on. What it says. Where it ends. What it points at. monofly names those
            decisions <code>background</code>, <code>text</code>, <code>border</code> and{" "}
            <code>icon</code> — and every intent keeps all four promises in both themes.
          </p>
          <div className="tg-hero-hints">
            <button
              type="button"
              className="tg-hint tg-hint-button"
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              {soundOn ? "◉ sound on — each intent is a note" : "○ hear the system"}
            </button>
            <span className="tg-hint">
              press <kbd>d</kbd> — every promise re-answers in dark
            </span>
            <span className="tg-hint">click anything colored to copy its var()</span>
          </div>
          <p className="tg-hero-count">
            {set.tokens.length > 0
              ? `${set.tokens.length} role tokens discovered from the loaded stylesheets — nothing below is hardcoded.`
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
                  "--st-bg": v(recipe.bg),
                  "--st-text": v(recipe.text),
                  "--st-border": v(recipe.border),
                  "--st-icon": v(recipe.icon),
                } as CSSProperties
              }
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              onClick={() => setStep((s) => s + 1)}
              role="img"
              aria-label={`A ${intent} surface exploded into its four token layers`}
            >
              <div className="tg-plane tg-plane-background" />
              <div className="tg-plane tg-plane-border" />
              <div className="tg-plane tg-plane-text">
                <strong>{HERO_LINES[intent].title}</strong>
                <span>{HERO_LINES[intent].body}</span>
              </div>
              <div className="tg-plane tg-plane-icon">
                <Glyph />
              </div>
            </div>
            <ul className="tg-legend">
              {layers.map(({ role, name }) => (
                <li key={role}>
                  <button
                    type="button"
                    className="tg-legend-row"
                    onMouseEnter={() => {
                      setFocusRole(role);
                      chime.pluck(noteDegree(intent), role === "background" ? 0 : 1);
                    }}
                    onMouseLeave={() => setFocusRole(null)}
                    onFocus={() => setFocusRole(role)}
                    onBlur={() => setFocusRole(null)}
                    onClick={() => copy(cssVar(name), `var(${name}) → clipboard`, noteDegree(intent))}
                  >
                    <span className="tg-legend-dot" style={{ background: v(name) }} />
                    <span className="tg-legend-role">{ROLE_META[role].verb}</span>
                    <code>{name.replace("--mfy-color-", "")}</code>
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
/* Section 2: the atlas, one role at a time                            */
/* ------------------------------------------------------------------ */

export function TokenRoleSection({ role }: { role: MfyRole }) {
  const { set } = useTg();
  const meta = ROLE_META[role];
  const byIntent = set.grouped.get(role);
  const count = set.tokens.filter((t) => t.role === role).length;

  return (
    <Section padding="1200" variant={role === "background" || role === "border" ? "stroke" : "subtle"}>
      <div className="tg-role" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">--mfy-color-{role}-*</p>
          <h3 className="tg-role-title">
            {meta.title} <span className="tg-role-verb">— {meta.verb}</span>
          </h3>
          <p className="tg-role-blurb">{meta.blurb}</p>
          <p className="tg-role-count">{count} tokens, discovered live</p>
        </header>

        <div className="tg-matrix">
          {INTENT_ORDER.filter((intent) => byIntent?.has(intent)).map((intent) => {
            const tokens = byIntent!.get(intent)!;
            const visible = tokens.filter((t) => !isHoverVariant(t.variant));
            const plain = visible.filter((t) => !t.variant.includes("on-"));
            const onTokens = visible.filter((t) => t.variant.includes("on-"));
            return (
              <div className="tg-matrix-row" key={intent}>
                <div className="tg-matrix-label">
                  <span className="tg-intent-name">{intent}</span>
                  <span className="tg-intent-copy">{INTENT_COPY[intent]}</span>
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

const RECIPE_INTENTS = ["default", "brand", "neutral", "positive", "warning", "danger"] as const;
const PROMINENCES = [
  { key: "default", label: "loud" },
  { key: "secondary", label: "supporting" },
  { key: "tertiary", label: "whisper" },
] as const;

const RECIPE_LINES: Record<string, { title: string; body: string }> = {
  default: { title: "Resting surface", body: "Most of every screen is this quiet." },
  brand: { title: "New in monofly 2.0", body: "One grammar, both themes." },
  neutral: { title: "Draft saved", body: "Nothing needs your attention." },
  positive: { title: "Build passed", body: "tokens → ui → blocks → demo, all green." },
  warning: { title: "Rebuild required", body: "packages/* changed — dist is stale." },
  danger: { title: "Delete workspace?", body: "This removes dist/ everywhere." },
};

export function TokenPairingRecipes() {
  const { set, copy } = useTg();
  const v = useResolvedVar(set);

  return (
    <Section padding="1200">
      <div className="tg-recipes" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">pairings</p>
          <h3 className="tg-role-title">
            Recipes <span className="tg-role-verb">— same intent, matched prominence</span>
          </h3>
          <p className="tg-role-blurb">
            The background wears the intent; text and icon answer with its on-* counterparts; the
            border matches prominence. <strong>Hover any card</strong> — the shift you feel is its
            real -hover token. Click to copy the whole recipe as CSS.
          </p>
        </header>

        <div className="tg-recipe-grid">
          {RECIPE_INTENTS.map((intent) => (
            <div className="tg-recipe-col" key={intent}>
              <h4 className="tg-recipe-intent">{intent}</h4>
              {PROMINENCES.map(({ key, label }) => {
                const recipe = recipeFor(intent, key, set.has);
                if (!recipe) return null;
                const css = [
                  `background: var(${recipe.bg});`,
                  `color: var(${recipe.text});`,
                  `border-color: var(${recipe.border});`,
                  `/* icon */ color: var(${recipe.icon});`,
                ].join("\n");
                return (
                  <button
                    type="button"
                    key={key}
                    className="tg-recipe-card"
                    style={
                      {
                        "--rc-bg": v(recipe.bg),
                        "--rc-bg-hover": recipe.bgHover ? v(recipe.bgHover) : v(recipe.bg),
                        "--rc-text": v(recipe.text),
                        "--rc-border": v(recipe.border),
                        "--rc-icon": v(recipe.icon),
                      } as CSSProperties
                    }
                    onMouseEnter={() => chime.pluck(noteDegree(intent), noteDepth(key))}
                    onClick={() => copy(css, `${intent} · ${label} recipe → clipboard`, noteDegree(intent))}
                  >
                    <span className="tg-recipe-top">
                      <Glyph className="tg-recipe-glyph" />
                      <span className="tg-recipe-prominence">{label}</span>
                    </span>
                    <strong className="tg-recipe-title">{RECIPE_LINES[intent].title}</strong>
                    <span className="tg-recipe-body">{RECIPE_LINES[intent].body}</span>
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

export function TokenPairingLab() {
  const { set, copy } = useTg();
  const v = useResolvedVar(set);
  const [bg, setBg] = useState("--mfy-color-background-brand-default");
  const [text, setText] = useState("--mfy-color-text-brand-on-brand");
  const [border, setBorder] = useState("--mfy-color-border-brand-default");
  const [icon, setIcon] = useState("--mfy-color-icon-brand-on-brand");

  const pickers: { role: MfyRole; value: string; set: (n: string) => void }[] = [
    { role: "background", value: bg, set: setBg },
    { role: "text", value: text, set: setText },
    { role: "border", value: border, set: setBorder },
    { role: "icon", value: icon, set: setIcon },
  ];

  // Contrast is computed from the *resolved* values, so it re-runs — and can
  // change verdicts — when the theme flips. That is the point.
  const { textRatio, iconRatio } = useMemo(() => {
    const base =
      parseColor(set.resolve("--mfy-color-background-default-default")) ?? WHITE;
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
    `  background: var(${bg});`,
    `  color: var(${text});`,
    `  border: 1px solid var(${border});`,
    "}",
    `.surface .icon { color: var(${icon}); }`,
  ].join("\n");

  const verdict = (ratio: number | null, min: number) =>
    ratio == null ? "–" : ratio >= min ? "pass" : "fail";

  return (
    <Section padding="1200" paddingBottom="1600" variant="stroke">
      <div className="tg-lab" data-reveal="">
        <header className="tg-role-head">
          <p className="tg-eyebrow">pairing lab</p>
          <h3 className="tg-role-title">
            Prove a pairing <span className="tg-role-verb">— any four tokens, measured live</span>
          </h3>
          <p className="tg-role-blurb">
            Pick one token per role. The card renders it, the numbers judge it — WCAG contrast,
            recomputed from resolved values, so press <kbd>d</kbd> and watch the verdicts hold (or
            not).
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
            {pickers.map(({ role, value, set: select }) => (
              <fieldset className="tg-lab-picker" key={role}>
                <legend>{role}</legend>
                <div className="tg-lab-chips">
                  {set.tokens
                    .filter((t) => t.role === role && !isHoverVariant(t.variant))
                    .map((t) => (
                      <button
                        type="button"
                        key={t.name}
                        className={`tg-lab-chip tg-lab-chip-${role}`}
                        aria-pressed={t.name === value}
                        title={t.name}
                        style={
                          {
                            "--chip": v(t.name),
                            // on-* colors are minted for a specific fill; show
                            // them on it or dark-resolving ones vanish
                            ...(t.variant.includes("on-")
                              ? { "--chip-bg": v(backdropFor(t, set.has)) }
                              : null),
                          } as CSSProperties
                        }
                        onMouseEnter={() => chime.pluck(noteDegree(t.intent), noteDepth(t.variant))}
                        onClick={() => select(t.name)}
                      >
                        {role === "text" ? "A" : role === "icon" ? <Glyph /> : null}
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
