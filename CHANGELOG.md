# Changelog

All notable changes to the published `@gmhlab/*` packages are recorded here.

`@gmhlab/tokens`, `@gmhlab/ui`, and `@gmhlab/blocks` are released **in lockstep** — they always share one version number and are always published together. One entry below therefore covers all three; the package tags on each line say which one a change affects.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because the packages share a version, a breaking change in any one of them bumps all three — a version bump does not imply every package changed.

These packages are on the **`0.x` line**, where npm treats a minor bump as breaking. So breaking changes go in the **minor** slot (`0.1.0` → `0.2.0`) and everything else — fixes and backwards-compatible features alike — is a **patch** (`0.1.0` → `0.1.1`). See "Versioning" in the README.

## [Unreleased]

<!--
Add entries here as you work, under the headings below. Delete unused headings.
At release time, `pnpm version:minor` (or :patch / :major) bumps the packages —
then rename this section to the new version with today's date and open a fresh
`## [Unreleased]` above it.

### Added      — new features
### Changed    — changes to existing behaviour
### Deprecated — soon-to-be-removed features
### Removed    — features removed in this release
### Fixed      — bug fixes
### Security   — vulnerability fixes
-->

### Changed

- **Breaking** `tokens` `ui` `blocks` — One token layer, prefixed `--gmh-`, named
  after Material Design 3. The `--mfy-*` semantic layer and the `--md-*` M3 layer
  under it are both gone: M3's `--md-sys-X` is now `--gmh-X` and `--md-ref-X` is
  `--gmh-ref-X` (`--gmh-color-on-surface-variant`, `--gmh-shape-corner-small`,
  `--gmh-typescale-body-large`). New roles: `success` / `warning` / `info` (M3
  custom-colour shape), `brand-band` / `on-brand-band` / `brand-band-accent` /
  `navy`, and `--gmh-space-*`, `--gmh-stroke-*`, `--gmh-icon-size-*`.
- **Breaking** `ui` — Tailwind colour utilities are the M3 role names
  (`bg-surface-container-low`, `text-on-surface-variant`, `bg-success-container`);
  the `surface-*` / `content-*` / `line-*` / `mfy-*` utilities, the numeric
  `rounded-100…400` and `shadow-100…600` keys and the `text-size-*` / `text-scale-*`
  keys are removed. `type-*` utilities are now the 15 M3 type roles
  (`type-body-large`, `type-label-large`); M3 elevation is `shadow-level1…5`.
  `bg-secondary` keeps shadcn's meaning (the tonal button).
- **Breaking** `ui` — `Flex` emits `flex-gmh` (was `flex-mfy`), `Grid` emits
  `grid-gmh` (was `grid-mfy`).
- `ui` — `Badge`'s `info` / `warning` / `success` variants use the generated M3
  container pairs.

### Removed

- `tokens` — the MonoFly Figma ingestion pipeline (`script:tokens`, the Figma
  plugin and its JSON exports) and the `theme.css` drift report it produced.
  `script:material` is now `script:color`.

### Fixed

- `ui` `blocks` — translucent mixes (`color-mix(… , transparent)`) interpolate in
  sRGB, not OKLCH. Mixing a near-neutral colour with `transparent` in OKLCH left
  the hue undefined, which renders as hue 0 — the sticky header was tinted pink.

## [0.1.0] — 2026-08-05

First published release. Prior work was unpublished; this entry describes the packages as they first shipped rather than itemising changes against `0.0.0`.

### Added

- **`@gmhlab/tokens`** — the design-token value layer: the `--mfy-*` custom properties, light/dark theme values, responsive variables, icon sizing, and global base styles. CSS-only, exposed at `@gmhlab/tokens/tokens.css`.
- **`@gmhlab/ui`** — the React 19 component library: shadcn/Tailwind primitives built on Base UI, Radix, and React Aria, plus the token-driven MFY layout primitives (`Flex`, `Grid`, `Section`, `Image`), compositions, icons, and the `useMediaQuery` hook. Styles at `@gmhlab/ui/styles.css`.
- **`@gmhlab/blocks`** — composed sections, page templates, slides, and the mock data layer (`AllProviders`, `useAuth`, …). Styles at `@gmhlab/blocks/styles.css`.

### Notes for consumers

- `@gmhlab/ui/styles.css` `@import`s `@gmhlab/tokens/tokens.css` rather than inlining it, so `@gmhlab/tokens` must be resolvable by your CSS toolchain. It installs automatically as a dependency.
- Tailwind must be pointed at the built packages with `@source`, or the utility classes used inside them are silently dropped. See each package's README.
- `@gmhlab/ui` and `@gmhlab/blocks` each ship a `"use client"` banner on the whole bundle, so their components and providers render directly inside React Server Component apps.

[Unreleased]: https://github.com/gmhlab/gmhlab/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/gmhlab/gmhlab/releases/tag/v0.1.0
