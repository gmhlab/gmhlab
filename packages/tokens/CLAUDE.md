# CLAUDE.md — packages/tokens

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/tokens`. Repo-wide rules (build order, `dist/` consumption, the fixed brand) are in the root `CLAUDE.md`.

The `--gmh-*` value layer: what the tokens are, how `color.css` is generated, and the contrast rules every consumer inherits. The Tailwind bridge that maps these tokens to utilities lives in `@gmhlab/ui` — see `packages/ui/CLAUDE.md`.

## One token layer, Material 3 names (since 2026-10-24)

There used to be two layers — M3's `--md-*` roles with a `--mfy-*` semantic
bridge on top. **Both are gone; don't reintroduce either, and don't add an
alias layer for old names.** The rule is mechanical: M3's `--md-sys-X` is
`--gmh-X`, `--md-ref-X` is `--gmh-ref-X`, names otherwise unchanged:

- **Colour roles** `--gmh-color-<m3-role>` — `primary`, `on-primary-container`,
  `surface-container-low`, `on-surface-variant`, `outline-variant`, `inverse-surface`, …
  Tonal palettes `--gmh-ref-palette-<family><tone>`.
- **Shape** `--gmh-shape-corner-*` (4/8/12/16/20/28/32/48px, full). **Type**
  `--gmh-typescale-<role>-{font,weight,size,line-height,tracking}` for M3's 15
  roles, plus a `font` shorthand `--gmh-typescale-<role>` (tracking is not part
  of `font`; set it alongside). **Elevation** `--gmh-elevation-level0…5`.
  **State** `--gmh-state-*-opacity`. **Motion** `--gmh-motion-*`.
- **GMH additions, in M3's shape**: custom colours `success` / `warning` /
  `info` (x, on-x, x-container, on-x-container, generated from seeds);
  `brand-band` / `on-brand-band` (the full-width navy band: `primary` in light,
  `primary-container` after dark, because M3's dark `primary` is a light blue
  for controls), `brand-band-accent` (gold for text and rules on the band,
  tertiary T80), `navy` (GW navy in both modes — marks, duotones, fixed artwork;
  not a surface). Typefaces `--gmh-ref-typeface-{brand,plain,mono}` with
  web-font hooks `--gmh-ref-typeface-{brand,plain}-web`; weight `semibold`
  (600) alongside M3's 400/500/700.
- **Not in M3**: `--gmh-space-N` (= Tailwind's `N/100` step), `--gmh-stroke-{border,focus-ring}`,
  `--gmh-icon-size-{small,medium,large,extra-large}` (24/32/40/48), `--gmh-blur`,
  `--gmh-responsive-*`.

Mapping old intent onto roles, for reading old code or designs: page surface →
`surface`; tinted band → `surface-container-low`; muted text →
`on-surface-variant`; hairline → `outline-variant`; stronger edge / tertiary
text tone → `outline` (~4.2:1, **not body text**); brand text/icons →
`primary`; brand band → `brand-band`; tonal brand tint → `secondary-container`;
neutral slab → `inverse-surface`; gold fill → `tertiary-container`; gold text →
`tertiary`. Hovers are M3 state layers, written in place:
`color-mix(in srgb, var(--gmh-color-X), var(--gmh-color-on-X) calc(var(--gmh-state-hover-state-layer-opacity) * 100%))`.
Lighter steps of a fill are a mix toward the surface in place
(`color-mix(in srgb, var(--gmh-color-tertiary-container) 24%, var(--gmh-color-surface))`),
not new tokens.

**Mix in sRGB, never OKLCH**, whenever one side is `transparent` or a
near-neutral: an OKLCH mix there leaves the hue undefined and Chrome renders
it as hue 0 — the sticky header was tinted pink for a week because of it. The
repo is at zero `in oklch` mixes outside the dead `components.css`.

Type role choices: body = `body-large`, small = `body-medium`, strong body =
`title-medium`, strong small / button-ish labels = `label-large`, 12px
eyebrows = `label-medium` size, subtitle = `title-large`, heading =
`headline-small`, page title = `display-medium`, hero = `display-large`. Tracking
is 0 for display, headline, body-large and body-medium (M3's values are
Roboto-tuned). The medium weight (500) is real: both apps load Nunito Sans
400/500/600/700.

## `color.css` is generated

`pnpm --filter @gmhlab/tokens script:color` runs `scripts/color.mjs` over
`scripts/material-theme.json` (a committed copy of the builder export;
`.files/` is gitignored). **Never hand-edit `color.css`.** Primary/tertiary
roles keep the builder's *tone* but take the colour from the export's own
palettes (which hold the true GW hues), then `BRAND_PINS` apply: light
`primary` = `#033C5A`, `tertiary-container` = `#AA9868` with navy-ink
`on-tertiary-container` in both modes. Custom colours (`CUSTOM`) get a tonal
palette from their seed at a capped chroma (`CUSTOM_CHROMA`, 36 Lab — uncapped
seeds make neon containers) and the tones the export uses for `error`. GMH
roles are `GMH_ROLES`. The script measures every content/container pairing
(status and brand band included) and refuses to write on a failure — to
change a colour, change the JSON, the pins, the seeds or `GMH_ROLES` and
re-run. `system.css` is hand-maintained (M3 spec values).

## Things that still hold from the GW re-skin (2026-10-07)

- Headings are Baskerville regular (display/headline roles use the brand
  face); family stacks put the macOS faces first with a web fallback reachable
  through the `-web` hooks. `apps/web` fills them from `next/font`;
  `apps/docs` loads the literal families from Google Fonts.
- **Heading colour** is navy via `--text-heading-color` (`--gmh-color-primary`,
  set in `globals.css`, consumed by the Text title/heading classes). **Any
  surface that paints its own foreground must reset it to `currentColor`** —
  `Section`/`Card` brand variants do, as do the two hand-painted brand panels
  in blocks. Forget it and a heading goes navy-on-navy.
- **`globals.css` element defaults are in `@layer base`.** Unlayered,
  `button { font: … }` beat every Tailwind utility on a `<button>`. Never move
  element rules back out of the layer.

**There is no `--sds-*` or `--mfy-*` namespace.** The repo descends from SDS
(→ `--mfy-*` → `--gmh-*`) and is at zero references to either. Unset custom
properties fail silently — a stale name means no border, no padding and a
transparent background rather than an error — so after any token change, check
that every `var(--gmh-*)` in the built `dist/` CSS/JS has a definition.

## Contrast traps

Muted text is `on-surface-variant` (8.9:1 on the light surface). `outline`
(~4.2:1) is an outline role, not body text. Blocks CSS comments that cite
`#757575`, `#d9d9d9`, `#b3b3b3` or stone steps describe pre-M3 values.

Gold is the one live trap: `#AA9868` (`tertiary-container`) is ~2.7:1 on a
light surface — fills, rules and solid buttons only; gold text is `tertiary`,
and gold on a brand band is `brand-band-accent`. Light mode is still where
contrast breaks; never verify in dark alone. Measure rather than eyeball,
converting `lab()`/`oklch()` through a canvas 2d `fillStyle` first.
