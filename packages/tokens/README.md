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

## Theming

Light and dark are driven by a **`.dark` class on `<html>`** (not `prefers-color-scheme` directly). Add or remove that class to switch themes; every `--mfy-*` semantic token flips with it.

## License

UNLICENSED — proprietary. All rights reserved. See the repository root for terms.
