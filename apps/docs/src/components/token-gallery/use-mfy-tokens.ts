import { useEffect, useMemo, useState } from "react";

export type MfyRole = "background" | "text" | "border" | "icon";

export interface MfyToken {
  /** Full custom-property name, e.g. `--mfy-color-text-brand-on-brand` */
  name: string;
  role: MfyRole;
  intent: string;
  /** Everything after the intent segment; `"default"` when absent */
  variant: string;
}

const TOKEN_RE = /^--mfy-color-(background|text|border|icon)-([a-z]+)(?:-(.+))?$/;

/**
 * Walk every same-origin stylesheet (including @media/@layer/@supports
 * blocks) and collect each `--mfy-color-*` custom property declared anywhere.
 * The atlas is generated from what the browser actually loaded, so new
 * tokens appear here without touching this file.
 */
function discoverTokenNames(): Set<string> {
  const names = new Set<string>();
  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith("--mfy-color-")) names.add(prop);
        }
        // Some engines skip custom properties when indexing a style
        // declaration; declarations (name followed by `:`) in the raw
        // cssText catch anything the loop above missed.
        for (const m of rule.cssText.matchAll(/--mfy-color-[a-z0-9-]+(?=\s*:)/g)) {
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

function parseToken(name: string): MfyToken | null {
  const m = TOKEN_RE.exec(name);
  if (!m) return null;
  return { name, role: m[1] as MfyRole, intent: m[2], variant: m[3] ?? "default" };
}

export interface MfyTokenSet {
  tokens: MfyToken[];
  /** Fast membership test by full custom-property name */
  has: (name: string) => boolean;
  /** role → intent → tokens, in declaration order */
  grouped: Map<MfyRole, Map<string, MfyToken[]>>;
  /** Resolved computed value (hex string) for the *current* theme */
  resolve: (name: string) => string;
  /** Bumps whenever `<html>`'s class changes (light/dark flip) */
  themeVersion: number;
}

export function useMfyTokens(): MfyTokenSet {
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
    const tokens: MfyToken[] = [];
    for (const name of names) {
      const token = parseToken(name);
      if (token) tokens.push(token);
    }
    const grouped = new Map<MfyRole, Map<string, MfyToken[]>>();
    for (const token of tokens) {
      let byIntent = grouped.get(token.role);
      if (!byIntent) grouped.set(token.role, (byIntent = new Map()));
      let list = byIntent.get(token.intent);
      if (!list) byIntent.set(token.intent, (list = []));
      list.push(token);
    }
    const style = typeof window === "undefined" ? null : getComputedStyle(document.documentElement);
    return {
      tokens,
      has: (name: string) => names.has(name),
      grouped,
      resolve: (name: string) => (style ? style.getPropertyValue(name).trim() : ""),
      themeVersion,
    };
  }, [names, themeVersion]);
}
