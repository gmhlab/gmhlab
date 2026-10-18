# @gmhlab/tokens

The design-token **value layer** for the GMH Lab design system: the `--mfy-*` CSS custom properties, light/dark theme values, responsive variables, icon sizing, and global base styles.

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
  background: var(--mfy-color-background-default-default);
  color: var(--mfy-color-text-default-default);
  gap: var(--mfy-size-space-400);
}
```

## Material 3 colour roles

Colour follows Material Design 3. The standard M3 role tokens are available
directly — `--md-sys-color-primary`, `--md-sys-color-on-surface`,
`--md-sys-color-tertiary-container`, … — alongside the tonal palettes
(`--md-ref-palette-primary40`, …). They are GMH Lab's: GW navy `#033C5A` is the
light-mode primary and GW gold `#AA9868` the tertiary container. The older
`--mfy-color-*` semantic tokens resolve to the same roles.

## Light and dark

Light and dark are driven by a **`.dark` class on `<html>`** (not `prefers-color-scheme` directly). Add or remove that class to switch modes; every `--md-sys-color-*` role and `--mfy-*` semantic token flips with it.

## The brand is fixed

These tokens are GMH Lab's brand, used as-is by every GMH Lab team. They are
not a theming surface: don't redefine them in an app, even though CSS would
let you. If something looks wrong, raise it with the design system so it is
fixed for every site at once.

## License

Proprietary. Copyright (c) 2026 The George Washington University. All rights reserved.

Developed and maintained by the GW Center of Global Mental Health, The George Washington University School of Medicine and Health Sciences. Publication to npm is a distribution convenience and grants no right to use this software. See [LICENSE](./LICENSE) for the full terms; direct licensing inquiries to terrancebrunner@gmail.com.
