// Material Design 3 colour tokens from a Material Theme Builder export.
//
//   pnpm --filter @gmhlab/tokens script:material
//
// Reads material-theme.json (this directory; the builder's "Export > JSON")
// and writes ../src/material.css. No network.
//
// Standard contrast only: the `light` and `dark` schemes. The export's
// medium/high-contrast schemes are ignored on purpose.
//
// The builder tone-maps its source colours — GW navy #033C5A comes back as a
// #28638A primary and GW gold #AA9868 as an ochre tertiary. GMH Lab's brand is
// fixed, so this script keeps M3's structure but not that drift:
//
//   1. Primary- and tertiary-family roles keep the *tone* (CIELAB L*) the
//      builder chose for them, but take the colour at that tone from the
//      export's own `palettes.primary` / `palettes.tertiary`, which hold the
//      source hues faithfully.
//   2. BRAND_PINS then override a few roles with the exact GW values.
//   3. Every other role (secondary, neutrals, error) is the scheme value as
//      exported.
//
// Finally every M3 content-on-container pairing is measured, and the script
// refuses to write the file if one falls below its WCAG minimum.

import fs from "node:fs";

const SOURCE = "material-theme.json";
const OUT = "../src/material.css";

const BRAND_PINS = {
  light: {
    // GW navy, exactly. Tone ~24 rather than M3's 40 — darker, and AAA
    // with white text.
    primary: "#033C5A",
    surfaceTint: "#033C5A",
    // GW gold as the gold fill (buttons, badges, rules), with GW's navy-ink
    // label rather than M3's tertiary-10. #AA9868 is 2.7:1 on a light
    // surface, so it is never `tertiary` itself — that role carries text.
    tertiaryContainer: "#AA9868",
    onTertiaryContainer: "palette:primary:10",
  },
  dark: {
    // The gold fill stays GW gold after dark, as it did before M3.
    tertiaryContainer: "#AA9868",
    onTertiaryContainer: "palette:primary:10",
  },
};

const FAMILY = (role) =>
  /^(on)?(primary|inversePrimary|surfaceTint)|Primary/.test(role)
    ? "primary"
    : /^(on)?tertiary|Tertiary/.test(role)
      ? "tertiary"
      : null;

/* -- Colour maths (sRGB <-> CIELAB D65) ----------------------------------- */

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
};
const rgbToHex = (rgb) =>
  "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const WHITE = [0.95047, 1, 1.08883];
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fInv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
function hexToLab(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const xyz = [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    0.0193339 * r + 0.119192 * g + 0.9503041 * b,
  ].map((v, i) => f(v / WHITE[i]));
  return [116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2])];
}
function labToHex([L, a, b]) {
  const fy = (L + 16) / 116;
  const [x, y, z] = [fInv(fy + a / 500), fInv(fy), fInv(fy - b / 200)].map((v, i) => v * WHITE[i]);
  return rgbToHex(
    [
      3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
      -0.969266 * x + 1.8760108 * y + 0.041556 * z,
      0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
    ].map(toGamma),
  );
}
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (x, y) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};

/** The palette's colour at `tone` (L*), interpolating in Lab between stops. */
function paletteAt(palette, tone) {
  const stops = Object.keys(palette).map(Number).sort((a, b) => a - b);
  if (palette[tone]) return palette[tone].toUpperCase();
  const hi = stops.find((t) => t > tone);
  const lo = [...stops].reverse().find((t) => t < tone);
  const k = (tone - lo) / (hi - lo);
  const [A, B] = [hexToLab(palette[lo]), hexToLab(palette[hi])];
  return labToHex(A.map((v, i) => v + (B[i] - v) * k));
}

/* -- Build ---------------------------------------------------------------- */

const theme = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

function resolve(value, mode) {
  if (!value.startsWith("palette:")) return value.toUpperCase();
  const [, name, tone] = value.split(":");
  return paletteAt(theme.palettes[name], Number(tone));
}

const schemes = {};
const provenance = {};
for (const mode of ["light", "dark"]) {
  schemes[mode] = {};
  provenance[mode] = {};
  for (const [role, exported] of Object.entries(theme.schemes[mode])) {
    const family = FAMILY(role);
    let value = exported.toUpperCase();
    let note = "export";
    if (family) {
      const tone = Math.round(hexToLab(exported)[0]);
      value = paletteAt(theme.palettes[family], tone);
      note = `${family} T${tone}`;
    }
    if (BRAND_PINS[mode][role]) {
      value = resolve(BRAND_PINS[mode][role], mode);
      note = "GW pin";
    }
    schemes[mode][role] = value;
    provenance[mode][role] = note;
  }
}

/* [foreground, background, minimum] — M3's content/container pairings, plus
   the accent text and outline uses the design system relies on. */
const PAIRS = [
  ["onPrimary", "primary", 4.5],
  ["onPrimaryContainer", "primaryContainer", 4.5],
  ["onSecondary", "secondary", 4.5],
  ["onSecondaryContainer", "secondaryContainer", 4.5],
  ["onTertiary", "tertiary", 4.5],
  ["onTertiaryContainer", "tertiaryContainer", 4.5],
  ["onError", "error", 4.5],
  ["onErrorContainer", "errorContainer", 4.5],
  ["onSurface", "surface", 4.5],
  ["onSurfaceVariant", "surface", 4.5],
  ["onSurfaceVariant", "surfaceContainerHighest", 4.5],
  ["inverseOnSurface", "inverseSurface", 4.5],
  ["primary", "surface", 4.5],
  ["primary", "surfaceContainerHighest", 4.5],
  ["tertiary", "surface", 4.5],
  ["error", "surface", 4.5],
  ["inversePrimary", "inverseSurface", 4.5],
  ["onPrimaryFixed", "primaryFixed", 4.5],
  ["onTertiaryFixed", "tertiaryFixed", 4.5],
  ["outline", "surface", 3],
];

let failed = 0;
const report = [];
for (const mode of ["light", "dark"]) {
  for (const [fg, bg, min] of PAIRS) {
    const ratio = contrast(schemes[mode][fg], schemes[mode][bg]);
    const ok = ratio >= min;
    if (!ok) failed++;
    report.push(`${ok ? "ok  " : "FAIL"} ${mode.padEnd(5)} ${ratio.toFixed(2).padStart(6)}:1 (min ${min})  ${fg} on ${bg}`);
  }
}
console.log(report.join("\n"));
if (failed) {
  console.error(`\n${failed} pairing(s) below minimum — ${OUT} not written.`);
  process.exit(1);
}

/* -- Emit ----------------------------------------------------------------- */

const lines = [];
lines.push(
  "/* Material Design 3 tokens for GMH Lab — GENERATED by scripts/material.mjs",
  " * from scripts/material-theme.json. Do not edit by hand; re-run",
  " * `pnpm --filter @gmhlab/tokens script:material`.",
  " *",
  " * --md-ref-palette-*  the export's tonal palettes, as exported.",
  " * --md-sys-color-*    the standard-contrast light (:root) and dark (.dark)",
  " *                     schemes. Primary/tertiary roles are re-derived from",
  " *                     the palettes at the builder's tones, then GW brand",
  " *                     pins applied; the comment on each line says which. */",
  "",
  ":root {",
);
for (const [name, palette] of Object.entries(theme.palettes)) {
  for (const [tone, hex] of Object.entries(palette)) lines.push(`  --md-ref-palette-${name}${tone}: ${hex.toUpperCase()};`);
  lines.push("");
}
lines.push("  /* light */");
for (const [role, value] of Object.entries(schemes.light)) {
  lines.push(`  --md-sys-color-${kebab(role)}: ${value}; /* ${provenance.light[role]} */`);
}
lines.push("}", "", ".dark {");
for (const [role, value] of Object.entries(schemes.dark)) {
  lines.push(`  --md-sys-color-${kebab(role)}: ${value}; /* ${provenance.dark[role]} */`);
}
lines.push("}", "");
fs.writeFileSync(OUT, lines.join("\n"));
console.log(`\nwrote ${OUT}`);
