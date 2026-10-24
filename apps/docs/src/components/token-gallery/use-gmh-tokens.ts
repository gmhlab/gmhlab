import { useEffect, useMemo, useState } from "react";

/** How a colour role is used: a fill, the content on a fill, or an edge. */
export type GmhKind = "fill" | "on" | "line";

export interface GmhToken {
  /** Full custom-property name, e.g. `--gmh-color-on-primary-container` */
  name: string;
  /** The M3 role, e.g. `on-primary-container` */
  role: string;
  /** The colour family the role belongs to (see FAMILY_ORDER) */
  family: string;
  kind: GmhKind;
}

/* Families in display order. `surface` collects the neutral roles; `brand`
   collects the GMH-only roles (the brand band and fixed navy). */
export const FAMILY_ORDER = [
  "surface",
  "primary",
  "secondary",
  "tertiary",
  "error",
  "success",
  "warning",
  "info",
  "brand",
] as const;

const ACCENTS = ["primary", "secondary", "tertiary", "error", "success", "warning", "info"];

function familyOf(role: string): string | null {
  if (role.startsWith("brand-band") || role === "on-brand-band" || role === "navy") return "brand";
  if (role === "inverse-primary") return "surface";
  const bare = role.replace(/^on-/, "");
  const accent = ACCENTS.find((a) => bare === a || bare.startsWith(`${a}-`));
  if (accent) return accent;
  if (/^(surface|inverse|outline|scrim)/.test(bare)) return "surface";
  return null; // background, shadow, surface-tint: not paint roles
}

function kindOf(role: string): GmhKind {
  if (role.startsWith("outline")) return "line";
  if (role.startsWith("on-") || role === "inverse-on-surface" || role === "brand-band-accent") return "on";
  return "fill";
}

const SKIP = new Set(["background", "on-background", "shadow", "surface-tint"]);

/** For a content role, the fill it was minted for. */
export function backdropFor(role: string): string {
  if (role === "brand-band-accent" || role === "on-brand-band") return "brand-band";
  if (role === "inverse-on-surface" || role === "inverse-primary") return "inverse-surface";
  if (role === "on-surface" || role === "on-surface-variant") return "surface";
  if (role.endsWith("-fixed-variant")) return role.replace(/^on-/, "").replace(/-variant$/, "");
  return role.replace(/^on-/, "");
}

/** For a fill, the content role that sits on it (if it has one). */
export function contentFor(role: string, has: (role: string) => boolean): string | null {
  const candidates = [`on-${role}`, role === "brand-band" ? "on-brand-band" : "", role === "inverse-surface" ? "inverse-on-surface" : ""];
  if (role.startsWith("surface")) candidates.push("on-surface");
  return candidates.find((c) => c && has(c)) ?? null;
}

/**
 * Walk every same-origin stylesheet (including @media/@layer/@supports
 * blocks) and collect each `--gmh-color-*` custom property declared anywhere.
 * The atlas is generated from what the browser actually loaded, so new
 * roles appear here without touching this file.
 */
function discoverTokenNames(): Set<string> {
  const names = new Set<string>();
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith("--gmh-color-")) names.add(prop);
        }
        // Some engines skip custom properties when indexing a style
        // declaration; declarations (name followed by `:`) in the raw
        // cssText catch anything the loop above missed.
        for (const m of rule.cssText.matchAll(/--gmh-color-[a-z0-9-]+(?=\s*:)/g)) {
          names.add(m[0]);
        }
      }
      const nested = (rule as CSSGroupingRule).cssRules;
      if (nested && nested.length) visit(nested);
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (sheet.cssRules) visit(sheet.cssRules);
    } catch {
      // cross-origin sheet — nothing of ours in there
    }
  }
  return names;
}

function parseToken(name: string): GmhToken | null {
  const role = name.slice("--gmh-color-".length);
  if (SKIP.has(role)) return null;
  const family = familyOf(role);
  if (!family) return null;
  return { name, role, family, kind: kindOf(role) };
}

export interface GmhTokenSet {
  tokens: GmhToken[];
  /** Fast membership test by role name (`primary-container`) */
  has: (role: string) => boolean;
  /** family → tokens, in declaration order */
  grouped: Map<string, GmhToken[]>;
  /** Resolved computed value of a role for the *current* theme */
  resolve: (role: string) => string;
  /** Bumps whenever `<html>`'s class changes (light/dark flip) */
  themeVersion: number;
}

export const varOf = (role: string) => `--gmh-color-${role}`;

export function useGmhTokens(): GmhTokenSet {
  const [names, setNames] = useState<Set<string>>(() => new Set());
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    const found = discoverTokenNames();
    if (found.size) {
      setNames(found);
      return;
    }
    // Stylesheets can land a beat after first paint in dev; retry once.
    const t = window.setTimeout(() => setNames(discoverTokenNames()), 400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return useMemo(() => {
    const tokens: GmhToken[] = [];
    for (const name of names) {
      const token = parseToken(name);
      if (token) tokens.push(token);
    }
    const grouped = new Map<string, GmhToken[]>();
    for (const token of tokens) {
      let list = grouped.get(token.family);
      if (!list) grouped.set(token.family, (list = []));
      list.push(token);
    }
    const roles = new Set(tokens.map((t) => t.role));
    const style = typeof window === "undefined" ? null : getComputedStyle(document.documentElement);
    return {
      tokens,
      has: (role: string) => roles.has(role),
      grouped,
      resolve: (role: string) => (style ? style.getPropertyValue(varOf(role)).trim() : ""),
      themeVersion,
    };
    // themeVersion is the dependency that re-reads computed style after a flip
  }, [names, themeVersion]);
}
