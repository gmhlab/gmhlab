# @gmhlab/ui

The React 19 component library for the GMH Lab design system — shadcn/Tailwind primitives built on [Base UI](https://base-ui.com), Radix, and React Aria, plus a set of token-driven layout primitives.

## Install

```bash
pnpm add @gmhlab/ui react react-dom tailwindcss
```

`react`, `react-dom`, and `tailwindcss` are peer dependencies. `@gmhlab/tokens` is installed automatically as a dependency — the stylesheet `@import`s it, so it must be resolvable by your CSS toolchain.

## Setup

Import the stylesheet once, at your app's entry:

```css
@import "@gmhlab/ui/styles.css";
```

Because components ship as **pre-built JS**, Tailwind will not find their class names by scanning your source. Point it at the package's `dist`:

```css
@source "../node_modules/@gmhlab/ui/dist/**/*.js";
```

Then use the components:

```tsx
import { Button, Flex, Badge } from "@gmhlab/ui";

export function Example() {
  return (
    <Flex gap="400">
      <Button>Get started</Button>
      <Badge variant="success">New</Badge>
    </Flex>
  );
}
```

## Two styling systems

The package deliberately contains two, and it matters which one you're extending:

- **shadcn/Tailwind primitives** (`Button`, `Dialog`, `DropdownMenu`, `Input`, `Accordion`, …) — Tailwind v4 utilities via `class-variance-authority`, themed by the Tailwind color variables. These emit `data-slot` attributes and **no semantic class name**: target `[data-slot="navigation-menu"]`, not `.navigation`.
- **MFY layout primitives** (`Flex`, `Grid`, `Section`, `Image`) — plain co-located CSS driven by `--mfy-*` tokens and component-local custom properties. Note `Flex` emits the class **`flex-mfy`**, and `Grid` emits `grid-mfy`.

## Gotchas

- **`Button` with a non-`<button>` `render` prop needs `nativeButton={false}`.** Base UI defaults it to `true`, and swapping the element without it logs a `console.error` on every render. This is invisible to `tsc` and to server rendering.
- **Theming keys off a `.dark` class on `<html>`** — both the `--mfy-*` tokens and the Tailwind theme switch together.
- **Server components need a client wrapper.** Any component using hooks (`Header`, `Footer`, anything calling `useMediaQuery`) must be rendered from a `"use client"` boundary.
- **`useMediaQuery` returns `false` for every query on the server**, so responsive components render their desktop branch into SSR HTML and swap after hydration. Prefer CSS breakpoints where the layout allows it.

## License

Proprietary. Copyright (c) 2026 The George Washington University. All rights reserved.

Developed and maintained by the GW Center of Global Mental Health, The George Washington University School of Medicine and Health Sciences. Publication to npm is a distribution convenience and grants no right to use this software. See [LICENSE](./LICENSE) for the full terms; direct licensing inquiries to terrancebrunner@gmail.com.
