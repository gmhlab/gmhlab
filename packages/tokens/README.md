# @gmhlab/tokens

The design-token **value layer** for the GMH Lab design system: the `--gmh-*` CSS custom properties — Material Design 3 colour roles and system tokens — with light/dark values, responsive variables, icon sizing, and global base styles.

This package is CSS-only. It carries **no Tailwind directives** and exports no runtime JavaScript — consume the tokens as CSS variables.

> Most consumers do not need to install this directly. `@gmhlab/ui` depends on it and its stylesheet pulls these tokens in automatically.

## Install

```bash
pnpm add @gmhlab/tokens
```

## Usage

```css
@import "@gmhlab/tokens/tokens.css";
```

Then reference tokens anywhere in your CSS:

```css
.card {
  background: var(--gmh-color-surface-container-low);
  color: var(--gmh-color-on-surface);
  border-radius: var(--gmh-shape-corner-medium);
  font: var(--gmh-typescale-body-large);
  gap: var(--gmh-space-400);
}
```

## One layer, Material 3 names

There is one token layer. Its names are Material Design 3's with GMH Lab's
prefix: M3's `--md-sys-X` is `--gmh-X` here and `--md-ref-X` is
`--gmh-ref-X`, so anything written against the M3 spec reads the same.

| Group | Tokens |
| --- | --- |
| Colour roles | `--gmh-color-primary`, `--gmh-color-on-primary-container`, `--gmh-color-surface-container-high`, `--gmh-color-outline-variant`, … |
| Tonal palettes | `--gmh-ref-palette-primary40`, `--gmh-ref-palette-tertiary80`, … |
| Shape | `--gmh-shape-corner-extra-small` … `--gmh-shape-corner-full` |
| Type | `--gmh-typescale-<role>-{font,weight,size,line-height,tracking}`, plus a `font` shorthand `--gmh-typescale-<role>` |
| Elevation, state, motion | `--gmh-elevation-level0…5`, `--gmh-state-*`, `--gmh-motion-*` |
| Not in M3 | `--gmh-space-*`, `--gmh-stroke-*`, `--gmh-icon-size-*`, `--gmh-responsive-*` |

Colour is GMH Lab's: GW navy `#033C5A` is the light-mode `primary`, GW gold
`#AA9868` is `tertiary-container` (a fill — gold *text* is `tertiary`). On top
of M3's roles there are `success`, `warning` and `info` (custom colours in M3's
four-role shape) and four GMH roles: `brand-band`, `on-brand-band`,
`brand-band-accent` (the full-width navy band) and `navy` (GW navy that never
flips).

`src/color.css` is generated — run `pnpm --filter @gmhlab/tokens script:color`.
The script measures every content-on-container pairing and refuses to write a
failing one.

## Light and dark

Light and dark are driven by a **`.dark` class on `<html>`** (not `prefers-color-scheme` directly). Add or remove that class to switch modes; every `--gmh-color-*` role flips with it.

## The brand is fixed

These tokens are GMH Lab's brand, used as-is by every GMH Lab team. They are
not a theming surface: don't redefine them in an app, even though CSS would
let you. If something looks wrong, raise it with the design system so it is
fixed for every site at once.

## License

Proprietary. Copyright (c) 2026 The George Washington University. All rights reserved.

Developed and maintained by the GW Center of Global Mental Health, The George Washington University School of Medicine and Health Sciences. Publication to npm is a distribution convenience and grants no right to use this software. See [LICENSE](./LICENSE) for the full terms; direct licensing inquiries to terrancebrunner@gmail.com.
