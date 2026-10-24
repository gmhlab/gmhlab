// GMH Lab colour tokens, generated from a Material Theme Builder export.
//
//   pnpm --filter @gmhlab/tokens script:color
//
// Reads material-theme.json (this directory; the builder's "Export > JSON")
// and writes ../src/color.css. No network.
//
// The output is Material Design 3's colour system under GMH Lab's prefix:
// M3's --md-ref-palette-* and --md-sys-color-* become --gmh-ref-palette-* and
// --gmh-color-*, role names unchanged. There is no second semantic layer on
// top — components use these roles directly.
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
// Two additions M3 does not ship, both in M3's own shape:
//
//   - CUSTOM colours (success, warning, info). Each gets a tonal palette from
//     its seed (the seed's hue, chroma capped to the sRGB gamut at each tone)
//     and the four roles M3 gives a custom colour — x, on-x, x-container,
//     on-x-container — at the same tones the export uses for `error`.
//   - GMH roles. brand-band / on-brand-band / brand-band-accent: a full-width
//     navy band is `primary` in light, but M3's dark `primary` is a light blue
//     meant for controls, so after dark the band is `primary-container`
//     instead. navy: GW navy in both modes, for artwork that must not flip.
//
// Finally every content-on-container pairing is measured, and the script
// refuses to write the file if one falls below its WCAG minimum.

import fs from "node:fs";

const SOURCE = "material-theme.json";
const OUT = "../src/color.css";

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
    // The gold fill stays GW gold after dark.
    tertiaryContainer: "#AA9868",
    onTertiaryContainer: "palette:primary:10",
  },
};

/* Status colours. Seeds are the hues the system used before M3 (Figma's
   green-500 / yellow-400 / blue-500). */
const CUSTOM = {
  success: "#14AE5C",
  warning: "#E8B931",
  info: "#3F81EA",
};

/* GMH roles, as [light, dark] references to scheme roles. */
const GMH_ROLES = {
  brandBand: ["primary", "primaryContainer"],
  onBrandBand: ["onPrimary", "onPrimaryContainer"],
  // Gold for rules and display type ON a brand band: the tertiary palette at
  // T80 in both modes (M3's dark tertiary), since the band is dark in both.
  brandBandAccent: ["palette:tertiary:80", "palette:tertiary:80"],
  // GW navy in both modes, for marks, duotones and fixed artwork that must
  // not flip with the scheme. Not a surface role: use brand-band for bands.
  navy: ["#033C5A", "#033C5A"],
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
const TONES = Object.keys(theme.palettes.primary).map(Number);

const inGamut = (lab) => {
  const fy = (lab[0] + 16) / 116;
  const [x, y, z] = [fInv(fy + lab[1] / 500), fInv(fy), fInv(fy - lab[2] / 200)].map((v, i) => v * WHITE[i]);
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ].every((v) => v >= -0.0005 && v <= 1.0005);
};

/* M3 palettes hold one chroma at every tone and let the gamut clip it; the
   export's brand palettes sit at ~23-29 (Lab). Status colours run a little
   more vivid than the brand, but not at their seeds' full chroma, which
   makes neon containers at T90. */
const CUSTOM_CHROMA = 36;

/** A tonal palette from a seed: the seed's Lab hue at each tone, at
    CUSTOM_CHROMA or the most the sRGB gamut allows there. */
function tonalPalette(seed) {
  const [, a, b] = hexToLab(seed);
  const chroma = Math.min(CUSTOM_CHROMA, Math.hypot(a, b));
  const [ua, ub] = [a / Math.hypot(a, b), b / Math.hypot(a, b)];
  const palette = {};
  for (const tone of TONES) {
    let lo = 0;
    let hi = chroma;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut([tone, ua * mid, ub * mid])) lo = mid;
      else hi = mid;
    }
    palette[tone] = labToHex([tone, ua * lo, ub * lo]);
  }
  return palette;
}

const palettes = { ...theme.palettes };
for (const [name, seed] of Object.entries(CUSTOM)) palettes[name] = tonalPalette(seed);

function resolve(value) {
  if (!value.startsWith("palette:")) return value.toUpperCase();
  const [, name, tone] = value.split(":");
  return paletteAt(palettes[name], Number(tone));
}

const schemes = {};
const provenance = {};
for (const [index, mode] of ["light", "dark"].entries()) {
  schemes[mode] = {};
  provenance[mode] = {};
  const scheme = theme.schemes[mode];
  for (const [role, exported] of Object.entries(scheme)) {
    const family = FAMILY(role);
    let value = exported.toUpperCase();
    let note = "export";
    if (family) {
      const tone = Math.round(hexToLab(exported)[0]);
      value = paletteAt(palettes[family], tone);
      note = `${family} T${tone}`;
    }
    if (BRAND_PINS[mode][role]) {
      value = resolve(BRAND_PINS[mode][role]);
      note = "GW pin";
    }
    schemes[mode][role] = value;
    provenance[mode][role] = note;
  }

  // Custom colours sit at the tones the export uses for the error family.
  const errorTone = (role) => Math.round(hexToLab(scheme[role])[0] / 5) * 5;
  for (const name of Object.keys(CUSTOM)) {
    const Name = name[0].toUpperCase() + name.slice(1);
    for (const [role, errorRole] of [
      [name, "error"],
      [`on${Name}`, "onError"],
      [`${name}Container`, "errorContainer"],
      [`on${Name}Container`, "onErrorContainer"],
    ]) {
      const tone = errorTone(errorRole);
      schemes[mode][role] = paletteAt(palettes[name], tone);
      provenance[mode][role] = `${name} T${tone}`;
    }
  }

  for (const [role, refs] of Object.entries(GMH_ROLES)) {
    const ref = refs[index];
    const literal = ref.startsWith("#");
    schemes[mode][role] = ref.startsWith("palette:") || literal ? resolve(ref) : schemes[mode][ref];
    provenance[mode][role] = literal ? "GW pin" : ref.startsWith("palette:") ? ref.split(":").slice(1).join(" T") : `= ${kebab(ref)}`;
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
  ...Object.keys(CUSTOM).flatMap((name) => {
    const Name = name[0].toUpperCase() + name.slice(1);
    return [
      [`on${Name}Container`, `${name}Container`, 4.5],
      [name, "surface", 3],
    ];
  }),
  ["onBrandBand", "brandBand", 4.5],
  ["brandBandAccent", "brandBand", 4.5],
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
  "/* GMH Lab colour — GENERATED by scripts/color.mjs from",
  " * scripts/material-theme.json. Do not edit by hand; re-run",
  " * `pnpm --filter @gmhlab/tokens script:color`.",
  " *",
  " * Material Design 3's colour system under the --gmh- prefix:",
  " *   --gmh-ref-palette-*  tonal palettes (the export's, plus success,",
  " *                        warning and info generated from their seeds).",
  " *   --gmh-color-*        the standard-contrast light (:root) and dark",
  " *                        (.dark) schemes, M3 role names unchanged, plus the",
  " *                        custom status roles and the brand-band roles.",
  " * The comment on each role says where its value came from. */",
  "",
  ":root {",
);
for (const [name, palette] of Object.entries(palettes)) {
  for (const tone of TONES) lines.push(`  --gmh-ref-palette-${name}${tone}: ${palette[tone].toUpperCase()};`);
  lines.push("");
}
lines.push("  /* light */");
for (const [role, value] of Object.entries(schemes.light)) {
  lines.push(`  --gmh-color-${kebab(role)}: ${value}; /* ${provenance.light[role]} */`);
}
lines.push("}", "", ".dark {");
for (const [role, value] of Object.entries(schemes.dark)) {
  lines.push(`  --gmh-color-${kebab(role)}: ${value}; /* ${provenance.dark[role]} */`);
}
lines.push("}", "");
fs.writeFileSync(OUT, lines.join("\n"));
console.log(`\nwrote ${OUT}`);
