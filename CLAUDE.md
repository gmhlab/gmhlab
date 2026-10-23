# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`gmhlab` is a pnpm + Turborepo monorepo template (a duplicate of the `monofly` template, re-scoped to `@gmhlab/*` for publishing) for building React 19 apps on top of a shared component/design-system stack. Node >= 20, package manager is pnpm 11.x. There is no test runner, linter, or formatter configured yet (`vitest` is in the catalog but unused).

`README.md` covers the same ground at a higher level and was reconciled with this file on 2026-08-03. Prefer this file where they disagree — it carries the gotchas the README omits.

## Workspace layout

Workspaces are `apps/*` and `packages/*` (see `pnpm-workspace.yaml`). Internal packages reference each other with `workspace:*`. Build/consume order is **tokens, core → ui, data → blocks → apps** (`core` and `tokens` are independent roots; `data` depends only on `core`, `ui` on `tokens` + `core`). A package restructure ran on 2026-10-18: `core`, `data`, and moving template residue out of `ui`/`blocks` (GMH Lab content stays as overridable defaults) are done. A Material Design 3 migration started the same day — see "The brand is fixed" below.

- `packages/tokens` (`@gmhlab/tokens`) — the **design-token value layer** (the `--mfy-*` namespace). `src/index.css` chains `responsive.css` → `variables.css` → `icons.css` → `globals.css` (`reset.css` exists but is currently commented out). This is a pure value/theme layer — it carries **no** Tailwind directives. `variables.css` is the full token set and is **hand-maintained** — it began as generator output but has since been edited (the GMH brand ramp prepended and `@media (prefers-color-scheme: dark)` swapped for the `.dark` class). It is **GMH Lab's brand, and fixed** — teams do not re-theme it; see "The brand is fixed" below. The generator now writes `src/theme.css` *alongside* it as a drift report; see "Design tokens from Figma" below. `src/index.ts` is now **CSS-only** (`import "./index.css"`) — the former typed `tokens` JS object was removed as an unused stub that drifted from `variables.css`; consume tokens as CSS vars. CSS is exposed to consumers as **`@gmhlab/tokens/tokens.css`** (physical file is `dist/index.css`). Published (not `private` — `ui`'s CSS imports it at runtime); has no runtime/peer deps.
- `packages/core` (`@gmhlab/core`) — the **framework-agnostic domain layer**: shared record types (`Product`, `PricingPlan`, `User`, …), the service interfaces a backend implements (`AuthService`, `PricingService`, `ProductsService`), and pure helpers (`filterProducts`, `sortProducts`, `searchProducts`, `cartTotal`). No React, no CSS, **no data** — the main entry must stay DOM-free. Invented demo records and mock services live behind a second entry, **`@gmhlab/core/mocks`** (`MOCK_PRODUCTS`, `mockAuthService`, …; two tsup entries), so they only reach bundles that import them on purpose. Session persistence is the `AuthService`'s own job (`login` stores, `getCurrentUser` restores) — providers never touch storage. Only types shared *across* packages belong here; a block's own record contract stays co-located with the block.
- `packages/data` (`@gmhlab/data`) — the **React side of the data layer**: auth/pricing/products contexts, providers (`AuthProvider`, `PricingProvider`, `ProductsProvider`, `AllProviders`) and hooks (`useAuth`, `usePricing`, `useProducts`), plus the `*ContextType` interfaces and `DataServices`. **Every provider takes its backend as a required `service` prop** (`AllProviders` takes `services={{ auth, pricing, products }}`) — there are no defaults, so `@gmhlab/core/mocks` reaches a bundle only when the app passes the mocks in. Each provider re-runs its load when `service` changes, so services must be stable references (module-level constants). Does not re-export core's types. Only `useAuth` has a consumer in the repo (`apps/web`'s header) — `usePricing`/`useProducts` lost theirs when the MonoFly examples were deleted. Bundled with a `"use client"` banner; `external`s `react`, `react-dom`, `@gmhlab/core`; no CSS, `sideEffects: false`. `ProductsProvider` still persists cart/favorites/recently-viewed to `localStorage` itself — that is UI state, unlike the session, which is the `AuthService`'s job.
- `packages/ui` (`@gmhlab/ui`) — the component library. `src/styles/index.css` is just two imports: `@gmhlab/tokens/tokens.css` (the value layer) followed by `./tailwind.css` (the Tailwind glue). The tokens CSS is **not** inlined: because tsup's `.css` loader is `copy`, esbuild never parses the file, so `dist/index.css` ships a literal `@import "@gmhlab/tokens/tokens.css"` on line 1 (its *relative* imports do get inlined). `@gmhlab/tokens` is therefore a genuine runtime dependency that must be published and resolvable by the consumer's CSS toolchain — it cannot be made `private`. The barrel (`src/index.ts`) imports `./styles/index.css` and re-exports `compositions` (cards, footers, forms, headers, sections), `graphics` (the GMH graphics kit — see "The graphics kit" below), `hooks` (`useMediaQuery`), `icons`, `images` (SVGs bundled as data URLs via tsup's `.svg` `dataurl` loader), `layouts`, `lib/utils`, and `primitives`. `src/types/react.d.ts` is an ambient-only augmentation (not exported) that widens `React.CSSProperties` to accept `--*` keys — this is what lets the MFY layout/primitive components pass custom properties via `style={{ "--flex-gap": … }}` without a cast. Deleting it breaks typecheck across the repo.
- `packages/blocks` (`@gmhlab/blocks`) — higher-level composed blocks built from `ui` + `tokens`. `src/` groups, **all seven re-exported from the barrel**: `home/` (`HomePage`, the record-driven landing page — see "The GW landing page" below), `innovations/`, `projects/`, `publications/`, `team/` (the GW site pages — **record-driven renderers only**; the records live in `apps/web/src/content/`, see "GW page blocks" below), `shared/` (the `PageCta`/`PageAction` copy types, plus `gmh-copy.ts` — the GW Center's default copy, exported as `GMH_*_COPY`; the `PageCtaSection`/`PageActions` components in `shared/page-cta.tsx` are internal, not exported), and `slides/` (`BrandSlide`, `SlideHeader`, `SlideFooter` with co-located CSS). The MonoFly `examples/` sections and the `/showcase` route were **deleted** (2026-10-18) — demo content with hardcoded SDS/Figma copy. The data layer moved out to `@gmhlab/data`; blocks no longer depends on it or on `@gmhlab/core`. blocks is bundled with a `"use client"` banner. tsup `external`s `react`, `react-dom`, `@gmhlab/ui` and `@gmhlab/tokens` so they resolve from the consumer rather than being bundled. **Every new workspace dependency must be added to that list** — a bundled copy of a package that defines React contexts splits context identity, and hooks then throw "must be used within a provider" at runtime with no type error. CSS exposed as `@gmhlab/blocks/styles.css`.
- `apps/docs` (`docs`) — Vite + React 19 reference app that consumes every package. Uses `react-router` (`createBrowserRouter` in `src/App.tsx`, pages under `src/pages/`, shared `RootLayout`). `ComponentsPage` is the `@gmhlab/ui` gallery and `BlocksPage` is its `@gmhlab/blocks` counterpart; the seven **record-driven page blocks** get live demo routes under `/blocks/*` (`src/pages/blocks/`), fed by the synthetic corpus in **`src/fixtures/sample-content.ts`** — an invented institute, since a block that could only render the GW Center's records would not be library code. Those routes are mounted a level down from where `apps/web` mounts the same blocks, which is what exercises the `basePath` prop; the fixture also carries one deliberately unresolvable publication slug so the fail-soft reference resolution is visible. Each demo route wrapper passes its own `basePath`, so moving a route means editing the wrapper too.
- `apps/web` (`web`) — Next.js 16 App Router site consuming every package (own copy of `theme-provider`). Routes: `/` (the GW landing page — `HomePage` fed `HOME_CONTENT`), plus five GW pages that are each a thin wrapper passing content records into a block — `/projects`, `/projects/reshape`, `/publications`, `/innovations`, `/innovations/equip`, and `/team`. **`src/content/` holds those records** (the landing page, the portfolio, the 343-work bibliography, the innovations, the team, and the RESHAPE/EQUIP detail records). Team headshots are static files in `public/team/` — served by Vercel's CDN, no bucket. Project logos are `public/projects/<slug>.png` (`Project.logo`); the untouched originals pulled from the live Wix site (plus the wide index logos and the unshipped partner logos) are in **`apps/web/assets/gw-site/`**, which is not served — its README records each file's source and any edit. The index-page copy (subtitles, CTAs) is **not** here — it is the blocks' default (`shared/gmh-copy.ts`), so the route files pass none. The exception is `PUBLICATIONS_NOTE` in `publications-data.ts`, which the publications route passes as `note`. — see "GW page blocks" below. Tailwind runs via `@tailwindcss/postcss` (not the Vite plugin); `src/app/globals.css` follows the same pattern as the docs app (import ui/blocks styles + `@source` the package `dist`s). Scripts: `dev` (`next dev`), `build` (`next build`), `start`, `typecheck`. Site chrome lives in the layout — see "The apps/web app shell" below.

All the packages share the same build shape (`core` and `data` excepted where noted): tsup (`esm` + `.d.ts`, `.css` "copy" loader), a `build` + `typecheck` script, `files: ["dist"]`, `sideEffects: ["*.css"]`, and a `src/globals.d.ts` ambient `declare module "*.css"` (required, or the DTS/typecheck step fails with TS2882). `ui`/`blocks` tsup `external`s `react`/`react-dom` plus their workspace deps (`ui` externals `@gmhlab/core`; `ui` uses only its types today); `tokens` and `core` external nothing. `core` and `data` have no `.css` and no `globals.d.ts`, and are `sideEffects: false`; `data` externals `react`/`react-dom`/`@gmhlab/core`. Runtime deps are referenced via `catalog:`; `react`/`react-dom` are `peerDependencies` (blocks also peers `tailwindcss`).

## Commands

Run from the repo root unless noted. Turbo orchestrates per-package scripts.

```bash
pnpm install
pnpm build       # turbo build — builds tokens, core → ui, data → blocks (tsup), then the apps (tsc -b && vite build; next build for web), in dependency order
pnpm dev         # turbo dev — runs both apps' dev servers (docs Vite, web next dev; persistent, uncached)
pnpm typecheck   # turbo typecheck — tsc --noEmit across all packages
pnpm tarball     # pnpm --filter @gmhlab/ui pack --dry-run — preview the ui package tarball contents
```

Release scripts operate on `./packages/*` only (the apps are never published):

```bash
pnpm version:show    # print each package's name + current version
pnpm version:patch   # npm version patch --no-git-tag-version, across all packages
pnpm release:check   # build + typecheck + publish --dry-run — rehearse without publishing
pnpm release         # build + typecheck + publish --access public
```

`prepublishOnly` in each package hard-fails under plain `npm`: npm does not resolve
the `workspace:`/`catalog:` protocols and would publish a broken manifest. Always
use `pnpm publish`. CI releases from `.github/workflows/release.yml`, which fires
on `v*` tags (plus a `dry_run` manual dispatch) and runs `pnpm build` +
`pnpm typecheck` before publishing. `README.md` documents that flow and an
annotated-tag trap that the scripts alone do not cover.

There is no single-test command — no test runner is configured (see "What this is").

### Gotcha: `pnpm typecheck` needs a prior build on a cold checkout

`turbo.json`'s `typecheck` task `dependsOn: ["^typecheck"]`, not `["^build"]`. Because `blocks`/apps type-check against the *built* `dist/` `.d.ts` of `ui`/`tokens` (see the critical workflow detail below), a fresh `pnpm typecheck` with no existing `dist/` fails with "cannot find module `@gmhlab/ui`". Run `pnpm build` first (or change that `dependsOn` to `["^build"]`).

### Gotcha: the docs app's `typecheck` script is a no-op

`apps/docs` has a solution-style `tsconfig.json` (`"files": []` + references), so its `typecheck` script (`tsc --noEmit`) checks nothing. The real app type-check is `tsc -b`, which runs as part of the app's `build` script. `apps/web` has a normal Next.js tsconfig, so its `tsc --noEmit` is a real check.

Per-package (use `pnpm --filter <name> <script>`):

```bash
pnpm --filter @gmhlab/ui build       # tsup: esm bundle + .d.ts, copies *.css into dist
pnpm --filter docs build              # tsc -b && vite build (the app's production build)
pnpm --filter docs preview            # serve the built app
```

## Critical workflow detail: apps consume packages from `dist/`, not source

The apps import `@gmhlab/ui`/`@gmhlab/blocks`, which resolve through package.json `exports` to each package's `dist/`. There is no src alias anywhere — the former `apps/demo` carried a dev-only one, and it was removed with that app. Consequences:

- The packages must be built (`dist/` must exist) before an app will run or typecheck against current code.
- `pnpm dev` only starts the apps' dev servers — the packages have no `dev`/watch task, so **changes to `packages/*` source are not reflected until you rebuild** (`pnpm --filter @gmhlab/ui build`, etc.). When iterating on a package, rebuild it (or run tsup in watch) alongside `pnpm dev`.
- Each app's globals.css (`src/styles/globals.css` in docs, `src/app/globals.css` in web) `@source`s both `packages/ui/dist/**/*.js` and `packages/blocks/dist/**/*.js` so Tailwind scans the *built* packages for class names. Unbuilt classes won't be generated.

## The `apps/web` app shell

`src/app/layout.tsx` owns the site chrome — `<SiteHeader />`, `<main className="site-main">{children}</main>`, `<SiteFooter />`. **Pages render sections only and must not include their own header or footer.** `InnovationsPage` was deliberately stripped of the nav bar and footer its wireframe had for this reason.

Three things make the shell work:

- **`DataProviders` (`src/components/data-providers.tsx`) is where the site picks its backends.** It is a `"use client"` wrapper binding `@gmhlab/data`'s `AllProviders` to the `@gmhlab/core/mocks` services in a module-level constant. It must stay a client file: services are objects of functions, and the server-component layout cannot pass functions as props to a client component. Swapping in real services is a one-file change there. (`apps/docs` has no RSC boundary, so `BlocksPage` passes its mock `SERVICES` to `AllProviders` directly.)
- **`AllProviders` renders no DOM** (it is only nested context providers), so the header, `<main>` and footer are the `<body>`'s own flex children. `globals.css` makes `body` a `min-height: 100vh` flex column with `.site-main { flex: 1 }` — that is what lets the ui `Footer`'s `margin-top: auto` actually pin to the bottom.
- **`site-header.tsx` / `site-footer.tsx` are thin client wrappers around the ui `Header`/`Footer`.** `site-header.tsx` also exports `SiteUtilityBar` (the ui `UtilityBar`, a non-sticky deep-navy strip rendered *above* the sticky header) and passes the header a `wordmark`. `Header` is no longer a brand section: it is translucent paper over a backdrop blur with gold-underline nav links, and its scroll shadow is a CSS scroll-driven animation (no JS). `Header` and `Footer` take a **`logo` prop** that defaults to `<GmhLogo />` (GMH Lab's mark — adopters should see whose system it is); pass another mark, or `null` for none. `Footer` also takes `columns`, `aside` and `legal`. There is **no placeholder content**: `navItems`/`columns` default to empty and `aside` to nothing (the former Figma placeholder nav/columns and the Figma social links are gone; `SocialButtons` now takes `links`). With `logo={null}`, the header wordmark becomes the exposed home link rather than an `aria-hidden` duplicate. `layout.tsx` is a server component (it exports `metadata`). Note that **both** `@gmhlab/ui` and `@gmhlab/blocks` now ship a `"use client"` banner on the whole bundle (see each `tsup.config.ts`), so the wrappers are no longer strictly required for the directive's sake — they are kept as the app's own boundary. Don't cite the banner's absence as the reason they exist; that was true of an earlier build config.

## Styling architecture: value layer vs. Tailwind glue

The split is deliberate — know which side you're editing:

- **`@gmhlab/tokens` = values only.** The Material 3 colour roles (`material.css`, generated — see below), all `--mfy-*` primitives, light/dark theme vars, responsive vars, icon sizing, and global base styles (`--global-*`). No Tailwind directives.
- **`@gmhlab/ui/src/styles/tailwind.css` = Tailwind glue, compiled by the *consumer's* Tailwind.** Holds `@custom-variant dark (&:is(.dark *))`, `@theme inline` (maps Tailwind color/radius/font vars onto shadcn `--background`/`--primary`/… vars, *and* onto the full `--mfy-*` set — see below), the shadcn `:root` + `.dark` OKLCH color definitions, the `type-*` `@utility` block, and an `@layer base` block. Because this is shipped as CSS (via the `.css` copy loader, not compiled by tsup), the app's Tailwind is what processes `@theme`/`@apply`.

Both light/dark systems key off the **same `.dark` class** on `<html>`, so the `--mfy-*` token theme and the shadcn/Tailwind theme switch together.

### The brand is fixed (since 2026-10-18)

**Every team using these packages works for GMH Lab, and the brand —
colours, type, shape, the look — is not theirs to override.** Teams supply
their own records and copy through props (GMH Lab copy is the default); they
do not re-theme. A theming contract that let teams redefine the brand ramps
was built and then reverted the same day for this reason — don't rebuild one,
and don't document override hooks. CSS variables cannot be technically
locked, so this is enforced by docs and review.

What *is* required, so a brand change happens in one place:

- **No literal brand colours anywhere** — not in component CSS, not in
  `variables.css` semantic tokens. Tint from a token instead:
  `color-mix(in oklch, var(--mfy-color-brand-800) 9%, transparent)`. The
  header and card shadows (`rgb(3 60 90 / …)`) and the `border-default-default`
  hairline (literal in both modes) were converted on 2026-10-18. Neutral
  black/white alphas (blanket, overlay, scrim, swatch) are fine.
- **Material 3 migration in progress (2026-10-18).** The system is moving to
  Material Design 3, sourced from a Material Theme Builder export seeded with
  GW navy `#033C5A` and gold `#AA9868`, standard contrast only. Decisions: the
  exact GW colours are pinned inside the M3 roles (the builder's own tone
  mapping shifts navy to `#28638A` and gold to an ochre), full M3 in phases
  (colour → shape/type/elevation/state → component variants), the M3 type
  scale uses the GMH brand faces, not Roboto, and **where M3 and the old GW
  behaviour differ, prefer whichever looks better** — don't preserve old
  quirks for their own sake.

### Material 3 colour (phase 1, 2026-10-18)

- **`packages/tokens/src/material.css` is generated** —
  `pnpm --filter @gmhlab/tokens script:material` runs `scripts/material.mjs`
  over `scripts/material-theme.json` (a committed copy of the builder export;
  `.files/` is gitignored). Never hand-edit it. It emits `--md-ref-palette-*`
  and `--md-sys-color-*` (M3's standard names) for `:root` (light) and
  `.dark`. Primary/tertiary roles keep the builder's *tone* but take the
  colour from the export's own palettes (which hold the true GW hues), then
  `BRAND_PINS` apply: light `primary` = `#033C5A`, `tertiary-container` =
  `#AA9868` with navy-ink `on-tertiary-container` in both modes. Other roles
  are the export's values. The script measures every M3 content/container
  pairing and refuses to write on a failure — to change a colour, change the
  JSON or the pins and re-run.
- **The `--mfy-color-*` semantic tokens are a bridge** onto those roles for
  the default, brand, accent, danger and disabled groups (mapping documented
  at the top of the colour block in `variables.css`); those groups have no
  `.dark` entries because the M3 roles flip themselves. **Brand bands are the
  exception**: `background-brand-default` is `primary` in light and
  `primary-container` (T30 navy) in dark, because M3's dark `primary` is a
  light blue meant for controls. Positive, warning, neutral (slate) and
  utilities have no M3 role and still sit on their ramps.
- **shadcn aliases in `tailwind.css` point at `--md-sys-color-*` directly**:
  `--primary` = filled button (dark mode is M3's light blue — the old "primary
  turns gold after dark" rule is gone), `--secondary` = tonal button
  (`secondary-container`), `--input` = `outline`, `--ring` and the global focus
  ring = `tertiary` (gold that passes 3:1; `#AA9868` itself does not).
- **Not migrated yet:** ~25 raw ramp references in component CSS
  (`--mfy-color-gold-300` on navy surfaces, `brand-900` utility bar, duotone
  image, section/footer glows). They still render GW colours, so the brand is
  intact, but later phases should move them to M3 roles. The `stone` ramp is
  now unreferenced by the semantic layer.

### Material 3 foundations (phase 2, 2026-10-18)

`packages/tokens/src/material-system.css` (hand-maintained, M3 spec values)
holds `--md-sys-shape-corner-*`, `--md-sys-typescale-*`, `--md-sys-elevation-level0…5`,
`--md-sys-state-*` opacities and `--md-sys-motion-*` easing/durations. The
`--mfy-*` equivalents bridge onto them, so components changed without edits:

- **Shape.** `--mfy-size-radius-100/200/400` → corner extra-small/small/medium
  (4/8/12px — one step rounder than the old 2/4/8). The shadcn `rounded-*`
  ramp is now the M3 corner scale step for step (sm 4, md 8, lg 12, xl 16,
  2xl 28, 3xl 32, 4xl 48) instead of multiples of `--radius`.
- **Type.** M3's 15 roles in the GMH faces: `--md-ref-typeface-brand`
  (Baskerville stack) for display and headline, `--md-ref-typeface-plain`
  (Avenir Next / Nunito Sans) for title, body and label. Text primitives map
  hero → display-large, page title → display-medium, subtitle → title-large,
  heading → headline-small, subheading and body → body-large, small →
  body-medium. Tracking is 0 for display, headline and body (M3's values are
  Roboto-tuned and made Avenir look airy); title and label keep the spec.
  The medium weight (500) is real: both apps now load Nunito Sans 500.
- **Elevation.** `--mfy-effects-shadows-drop-shadow-*` → M3 levels. In M3,
  elevation is mostly surface colour (`surface-container-*`); shadows are for
  things that float.
- **State.** The bridge's hover layers use
  `calc(var(--md-sys-state-hover-state-layer-opacity) * 100%)` in `color-mix`,
  disabled uses the 12%/38% tokens. Components do not yet apply state layers
  themselves — that is phase 3 (component variants), along with M3 component
  shapes (pill buttons, 28px dialogs) and motion.

### The GW palette (2026-10-07 — colour superseded by M3, see above)

The colour bullets below describe the pre-M3 values and are kept as history;
the radius, font, heading-colour and `@layer base` notes still hold.

The system was re-skinned to the GW reference design (`.files/gw-global-mental-health.html`). What changed in `variables.css`, and why:

- **Primary is unchanged** — `brand-800` already was GW navy `#033c5a`.
- **Secondary brand colour = GW gold `#aa9868`**, primitive ramp `--mfy-color-gold-50…950` (anchored at 500; 100/300 pinned to the reference's `#f0ebe0`/`#d8cdb2`), semantic group **`accent`** mirroring the brand group step for step (`background-accent-*`, `text-accent-*`, `on-accent`, …; Tailwind `surface-accent`, `content-accent`, `line-accent`, `icon-accent`, plus clean `gold-*`). Not called "secondary": that word is already a *step* name (`surface-secondary`). `#aa9868` is **2.7:1 on paper** — rules, fills, borders and solid buttons only (with navy text, 5.8:1). Gold *text* is `text-accent-default` = gold-700 (AA on all light surfaces); display italics use gold-600. The reference HTML's own 12px gold eyebrows fail AA — don't copy its colours literally.
- **The `default` group sits on a new `stone` ramp** (warm paper at the light end, GW navy-ink at the dark end) instead of `gray`. Dark mode is navy-ink, not charcoal.
- **Brand surfaces stay navy after dark.** `background-brand-default/hover` and `text/icon-brand-on-brand` no longer flip to a pale tint in `.dark`; instead the shadcn `--primary` turns gold in `.dark` (in `tailwind.css`), since a navy button on a navy-ink page has no affordance.
- Radii were crisper (2/4/8px) — superseded by the M3 corner scale in phase 2; headings (`heading-font-*`) are Baskerville regular, and family stacks put the macOS faces first with a web fallback reachable through an optional hook: `var(--mfy-typography-family-{serif,sans}-web, "Libre Baskerville" | "Nunito Sans")`. `apps/web` fills the hook from `next/font`; `apps/docs` loads the literal families from Google Fonts.
- **Heading colour** is navy via `--text-heading-color` (set in `globals.css`, consumed by the Text title/heading classes). **Any surface that paints its own foreground must reset it to `currentColor`** — `Section`/`Card` brand variants do, as do the two hand-painted brand panels in blocks. Forget it and a heading goes navy-on-navy.
- **`globals.css` element defaults are in `@layer base`.** Unlayered, `button { font: … }` beat every Tailwind utility on a `<button>` — `Button`'s `text-sm font-semibold` was silently ignored, and only Buttons rendered as `<a>` looked right. Never move element rules back out of the layer.

**There is no `--sds-*` namespace.** The repo descends from SDS and the prefix
was renamed to `--mfy-*`. The repo is at zero `sds-` references; anything pasted
in from an SDS source needs the same rename. Note that unset custom properties
fail silently — a stale `--sds-*` reference means no border, no padding and a
transparent background rather than an error.

The shadcn vars in `tailwind.css` are a thin **alias layer** over the M3 `--md-sys-color-*` roles (status tones over `--mfy-*`), which is why almost nothing needs a `.dark` entry — the aliased role already flips. Only vars with no semantic source live in `.dark`: the chart ramp, and `--info`. Beyond the stock shadcn set the file also defines three **status tones** consumed by `Badge`'s `info`/`warning`/`success` variants:

- `--warning` / `--success` alias `--mfy-color-background-{warning,positive}-secondary` + `--mfy-color-text-{warning,positive}-default`, so they theme for free.
- `--info` has **no MFY semantic set** (there is no `info` alongside danger/warning/positive — only the raw `--mfy-color-blue-*` ramp), so it aliases `blue-200`/`blue-800` and needs the explicit `.dark` override. Adding an `info` set to `variables.css` would let those two lines go.
- Note the asymmetry with `--destructive`, which is the *solid* danger surface: these three are **subtle pairs** (tinted surface + readable on-surface text) because that is what a status pill needs. `bg-destructive/10` works for red but 10% of `yellow-400` is not a readable pill, so the status variants do not use that alpha trick.

### The full `--mfy-*` token set is reachable from Tailwind utilities

Beyond the shadcn aliases, `tailwind.css` maps essentially every `--mfy-*` token
into `@theme inline`, so `bg-surface-brand` and `text-content-secondary` work
without an arbitrary `[var(--mfy-…)]` value. Because the block is `inline`, the
keys are **substituted into utilities rather than emitted to `:root`** — unused
keys cost zero bytes, and every utility resolves its `var()` at the element, so
dark mode flips for free. The file's own header comment is the reference; the
essentials:

- **Colors carry a role dimension Tailwind's flat namespace lacks** — `text-default-secondary`
  is `gray-500` while `background-default-secondary` is `gray-100`, so one key
  cannot serve both. The role becomes the prefix: `background-*` → **`surface-*`**,
  `text-*` → **`content-*`**, `border-*` → **`line-*`**, `icon-*` → **`icon-*`**.
  The rest is mechanical — drop the role word, drop every `default`, drop the
  `utilities` group word, collapse `{group}-on-{group}` to `on-{group}`. So
  `background-default-default` → `surface-default`, `text-default-secondary` →
  `content-secondary`, `text-brand-on-brand` → `content-on-brand`. Collision-free
  across all 157 semantic tokens (accent included) with one marked exception (`icon-annotation`).
- **The accessibility traps above apply under the new names too**: `content-tertiary`
  is the ~2:1 hairline tone and `content-on-brand-secondary` inverts.
  (`line-default` is now an alpha hairline that reads on every surface; it no
  longer equals `surface-tertiary`.)
- **Raw ramps are namespaced `mfy-`** (`bg-mfy-gray-300`) because Tailwind ships
  its own gray/blue/red/green/pink/yellow/slate and this repo uses them. Only
  `brand-*` gets a clean name, since Tailwind has no brand palette.
- **Semantic type sizes sit behind a `size` segment** — `text-size-heading-large`,
  not `text-heading-large` — because the `Text` primitive already owns the bare
  `text-<semantic>` namespace (`text.tsx` emits `text-heading`, `text-subtitle`,
  `text-body-small` … as plain classes backed by `text.css`). Two of those
  collided before the prefix went in. The raw ramp is unprefixed (`text-scale-05`).
  The **shadcn alias layer claims names in that namespace too**: `--color-input`
  makes Tailwind generate a `text-input` utility, which collided with the `Text`
  primitive's own `.text-input` class — hence `TextInput` now emits
  **`.text-input-value`**. Whichever rule Tailwind orders last wins, so the
  symptom is a font that silently becomes a colour. Check any new
  `text-<word>` class in `text.css` against both the `@theme inline` keys *and*
  the shadcn aliases.
- **`--mfy-font-*` are `font` shorthands, not families**, so they cannot live in
  the `--font-*` namespace (Tailwind would emit them as `font-family`). They are
  static utilities instead: `type-title-hero`, `type-body-small-strong`. Since
  the M3 phase 2 bridge each shorthand carries its role's line-height
  (`size/line-height`), so they no longer reset it to `normal` — but they do
  still override any earlier `line-height`, which is why `text.css` keeps its
  `.text-line-height-*` overrides at the end of the file.
- **Spacing is deliberately not mapped.** MFY's scale is already stock Tailwind:
  `--mfy-size-space-N` equals Tailwind's `N/100` step exactly (`space-400` = 1rem
  = `p-4`, `space-050` = `p-0.5`). Adding `--spacing-100` would not add a value,
  it would silently redefine `p-100` from 25rem to 4px. Font weights and icon
  sizes are skipped for the same reason (value-identical to stock).

Nothing generates `tailwind.css` — it is hand-maintained like `variables.css`.
Adding a token to `variables.css` means applying the rule above by hand.

## The Figma files

- **`xoEDlF54N0QE84TMGlSYvw` ("GMH Lab - Foundations")**, built 2026-10-19 from `packages/tokens`, is the new foundations library, the first of three (ui and blocks files to follow). It has 540 variables in eight collections: `Palette` (M3 tonal palettes plus the GW ramps, no scopes), `Scheme` (the 49 `--md-sys-color-*` roles, Light/Dark), `Color` (the 157 `--mfy-color-*` semantic tokens, Light/Dark), `Shape`, `Size`, `Typography`, `State` and `Motion`. It also has 19 text styles bound to the Typography variables, 5 `Elevation/Level` effect styles, and the `GMH Crest` / `GMH Logo` component sets (Colorway=Navy/White). Every variable's WEB code syntax is its CSS name. Where code computes a colour (`color-mix` hovers, disabled alphas), Figma stores the resolved value and the formula sits in the variable description, so **re-resolve those when the tokens change**; nothing syncs them.

The older two:

- **`a8t0tmguLdEKoVMc3wVoL7` ("GMH Lab DSP")** is the live component library — this is the one to read when implementing or updating a component. It holds the `Header` component set (`platform` Desktop/Mobile × `state` Default/Open, node `2287:22651`), the `Badge` page (`3241:2`), the GMH brand mark (`5007:49`), and the variable collections: `Color Primitives` (1 mode), `Color` (MonoFly Light / MonoFly Dark), `Typography Primitives`, `Typography`, `Size`, `Responsive` (Desktop/Mobile/Tablet).
- **`jdTRzc3vWF5pEOUna8rrkR` ("MonoFly DSP")** is the token source only — see below.

**`get_metadata` with no `nodeId` is misleading here**: it returns only `Cover` and `Logo` for *either* key, because it reports the currently-open desktop file rather than the key you passed. Query a concrete node id, or use `search_design_system` to locate a component.

Component descriptions in the GMH Lab DSP still say **`@monofly/ui`**, not `@gmhlab/ui` — file-wide, not a one-off. Don't "fix" a single one and create an inconsistency.

### Figma write gotcha: `clone()` drops `componentPropertyReferences`

Cloning a variant to add a new one to a component set silently loses the children's property wiring, so the set's TEXT/BOOLEAN properties accept values that never render. After `clone()` + `appendChild`, re-set them explicitly on the children (`txt.componentPropertyReferences = { characters: "Text#…" }`). Verify by reading them back, not by looking at `componentProperties` on an instance — that reports the value correctly either way.

## Design tokens from Figma

Token source is **`jdTRzc3vWF5pEOUna8rrkR`** ("MonoFly DSP"); key and PAT live in `packages/tokens/.env`.

**Ingestion is a Figma plugin, not the REST API.** `/v1/files/{key}/variables/local` requires the Enterprise-only `file_variables:read` scope, which this plan cannot grant — regenerating the token will not help. Run `scripts/plugins/figma-plugin-token-json` inside Figma; it renders two panes, which you paste over `scripts/tokens.json` and `scripts/styles.json`. Both panes come from one run, which matters: the two files are joined by Figma variable id, and mixing versions silently degrades font tokens to `undefined undefined …` (`app.mjs` warns on this).

**Transform is offline.** `pnpm --filter @gmhlab/tokens script:tokens` reads those two JSON files and writes `src/theme.css`. No network, no `.env` needed.

```bash
pnpm --filter @gmhlab/tokens script:tokens   # tokens.json + styles.json -> src/theme.css
```

Two traps:

- **`theme.css` is a drift report, not shippable output.** `src/index.css` imports `variables.css`, and `variables.css` is ahead of Figma: Figma's `brand-*` ramp is still placeholder gray. Adopting `theme.css` wholesale would delete the brand colour.
- **`COLLECTION_DATA` in `app.mjs` hardcodes Figma mode names** (`monofly_light`/`monofly_dark`). Rename a mode in Figma and the matching CSS block silently emits empty (`:root { ; }`) rather than erroring. Renaming a mode is effectively a code change.

`scripts/plugins/figma-plugin-token-json/code.js` must keep `NAMESPACE` identical to `app.mjs` (`com.figma.monofly`) — a mismatch collapses every token to a single `default` mode and drops all light/dark data, again silently.

## Muted text and the remaining contrast traps

Since the M3 bridge (2026-10-18), muted text is `text-default-secondary` →
`on-surface-variant` (8.9:1 on the light surface), and
`text-default-tertiary` → `outline` (~4.2:1) — an outline role, still not
body text. `text-brand-on-brand-secondary` no longer inverts; it is the same
as `on-brand`, so the old navy-on-navy trap is retired. `border-default-default`
→ `outline-variant` (opaque). Blocks CSS comments that cite `#757575`,
`#d9d9d9`, `#b3b3b3` or stone steps describe pre-M3 values.

Gold remains the one live trap: `#AA9868` (`tertiary-container`) is ~2.7:1 on
a light surface — fills, rules and solid buttons only; gold text is
`tertiary`. Light mode is still where contrast breaks; never verify in dark
alone. Measure rather than eyeball, converting `lab()`/`oklch()` through a
canvas 2d `fillStyle` first.

## Generating section mockups (Nano Banana Pro)

`docs/nano-banana-prompts.md` is the method; `docs/prompts/` is the reusable
material (start at its `README.md`) — the canonical design-system block with this
repo's real hex values, blank section/page templates, eight ready-made section
patterns, edit-loop snippets, and the render→token→Tailwind mapping with its trap
checklist. Two things to know before using any of it: generate **one section per
image at 3:2** (the model caps at 4096², so a full-page render is illegible at the
bottom), and treat every measurement in the output as fiction — it will look like
a grid and won't be. Note also that `docs/` is repo documentation, unrelated to
the `apps/docs` workspace.

## GW page blocks (`innovations/`, `projects/`, `publications/`)

These are full GW Center for Global Mental Health pages, rebuilt from the live
site onto the design system. They share one deliberate shape — follow it when
adding a fourth:

- **The content is not in this package.** `@gmhlab/blocks` is published
  publicly, and one organization's portfolio and bibliography are not library
  code. Every page here is a **record-driven renderer**: it takes its records as
  props and names no project, publication or innovation. The records live in
  **`apps/web/src/content/`**. This split is what keeps the package generic —
  it also cut the blocks bundle from 408KB to 161KB.
- **Three files per page**: `<name>-page.tsx`, a co-located `<name>-page.css`,
  and a `<name>-types.ts` holding the *contract* — the record types plus the
  pure helpers that read them (`projectSearchText`, `resolvePublicationRefs`,
  `resolveRelatedProjects`). All are exported from the barrel, so the consuming
  app writes its records against them.
- **Page content only.** No header or footer — the site chrome belongs to
  `apps/web`'s layout (see "The `apps/web` app shell").
- **CSS is scoped under a page-level class** (`.projects-page`, …) and uses only
  uniquely-prefixed class names. The deleted `innovations.css` leaked a `*`
  reset and generic names like `.header`/`.btn` into every consumer of
  `@gmhlab/blocks/styles.css`; don't reintroduce that.
- **Links are prop-driven, not hardcoded** — `ProjectsPage` takes a `basePath`
  so the block travels with whatever site mounts it. If you move a route in
  `apps/web`, update the `basePath` passed at the call site.
- **Copy defaults to the GW Center's, and is always overridable.** This is a
  deliberate attribution choice (2026-10-18): other teams adopt these blocks,
  and they should see whose work they are building on. Structural labels
  ("Objectives and measures", "How It Works", "Funders & partners") are fixed;
  copy in the Center's voice comes from `shared/gmh-copy.ts` and follows one
  rule — **omit the prop for the Center's wording, pass a value to replace it,
  pass `null` to drop the section.** Index pages take `title`, `subtitle`,
  `cta: PageCta | null` and extras (`partnersSubheading`, `listHeading`,
  `listSubheading`, `centerBadge`); a `ProjectDetail` record's `cta` defaults
  to `gmhProjectDetailCta(detail)` (which adds "Contact the project" when
  `contact` is set). Keep every new copy default in `gmh-copy.ts`, never inline
  in a page, so the Center's voice stays in one auditable place.
  **Never default a factual claim about a dataset**: `PublicationsPage`'s
  `note` (the Kohrt/Rai provenance line) has no default, because it would be
  false over another team's records — `apps/web` passes `PUBLICATIONS_NOTE`.
  Every link must be overridable: a hardcoded GW mailto with no prop once
  lived in the project detail page. No function-valued props: `apps/web`
  route files may become server components, which cannot pass functions to
  the `"use client"` blocks bundle.
- **Faceted filtering convention**: counts for each facet are computed against
  the *other* active facets (never the whole set), and zero-count options are
  rendered `disabled`, so a chip can never advertise a number and land on an
  empty list. The active option stays enabled so a filter is always reversible.
- **Data provenance is documented in each content module's header** (in
  `apps/web/src/content/`), including which fields are derived rather than
  sourced. Read that header before touching the records — it is the spec, and it
  carries detail this file does not repeat.
- **An index page derives nothing at module scope.** Search indexes, facet
  lists and stat strips are `useMemo`d on the records prop, because the corpus
  is no longer a module-level constant. A new derived value goes in a memo keyed
  on the records, never at file scope.

### The project *detail* page is one component driven by records

`projects/project-detail-page.{tsx,css}` renders a `ProjectDetail` record (the
type lives in `project-detail-types.ts`) and **names no project**. Adding a
project detail page is adding a record in `apps/web/src/content/` plus a route
wrapper — never editing the component. `RESHAPE_DETAIL` is the first instance
and the reference to copy.

The same is true of `innovations/innovation-detail-page.{tsx,css}`, which was
converted to this shape at the same time; `EQUIP_DETAIL` is its first record.

The record models a **study protocol** (arms, objectives ranked
primary/secondary with their instruments, a two-track assessment schedule,
eligibility criteria), because that is what these projects actually are. Every
field except the identity block is optional and each section is conditional on
its data, so a platform project with no eligibility criteria renders no
eligibility section rather than an empty heading.

Four things worth knowing before extending it:

- **Publications are slugs into `PUBLICATIONS`, not restated citations.**
  `resolveProjectPublications(detail, publications)` resolves them at render
  time against the bibliography passed in as a prop, so journal, DOI, citation
  count and open-access status come from the real records. The
  per-slug `note` records what a work *is* to the project ("Trial protocol") —
  a relationship the bibliography does not carry. Unknown slugs are dropped,
  so a typo shortens the list rather than breaking a row.
- **Related projects are slugs into `PROJECTS`**, and a card only renders a
  link when its slug is in the `detailSlugs` prop (the app passes
  `PROJECT_DETAIL_SLUGS`). Ten of the eleven projects have no detail record
  yet; linking them all would ship ten 404s. `InnovationsPage` uses the same
  prop for the same reason.
- **The timeline is chronological across both tracks, not grouped by track.**
  That ordering is the point — it shows patient enrollment opening while
  providers are still being reassessed. Timepoint codes (T0, T1, …) are the
  protocol's own nomenclature; `phase` entries carry no code because nothing is
  measured at them.
- **The desktop timeline must not use `display: contents`** on the entry
  wrapper — sparse grid auto-flow then pushes each card one row below its own
  timepoint chip. The media query documents this inline; keep each entry as its
  own three-column grid.

A design-system trap this page hit, which fails silently (a second one —
the default border matching the neutral band — was retired by the 2026-10-07
re-skin; the `border-default-secondary` call sites it left are still fine): grid children of a `Flex container` need
`min-width: 0`, since flex items default to `min-width: auto` and let a grid
push the whole page into horizontal scroll.

### The team page (`team/`)

`TeamPage` renders `Person` records (`team-types.ts`) in four groups — core,
affiliate, student, alumni — with **one person format**: credentials inline
after the name, `location` meaning *where they are based* (never nationality),
alt text = the name. A person with no `photo` gets an initials monogram; there
is deliberately no fallback image, because the live site's alumni photos were
Wix stock standing in for real people. Bios expand in place (`<details>`),
with selected publications resolved by **exact** `authorNames` match against
the bibliography (surname matching ties people to namesakes — "de Jong" in
`PUBLICATIONS` is Joop, not Ruth). `PeopleSection` + `projectPeople()` give
the project and innovation detail pages their People strip (pass `people` and
`teamHref`), so project ↔ person links run both ways. `team-data.ts`'s header
lists every correction made against the live site and every open question.

### The GW landing page (`home/`)

`HomePage` takes one `HomeContent` record (`home-types.ts`); every section after
`hero`/`stats` is optional and conditional on its record. `apps/web/src/content/home-data.ts`
**derives every figure** (stat band, per-theme publication counts on the cards,
the funder wall) from `PROJECTS`/`PUBLICATIONS` — don't type numbers in. The one
sourced figure (the care-gap field, 24 of 100) carries its WHO citation on the
page. The live site deliberately has **no pull quote**: the reference's quote is
unattributed design copy and must not be put under a real GW role; the docs demo
exercises that section with the synthetic institute. Placeholder photos have
`alt=""` because describing a random picsum scene would be false.

Motion is progressive and server-safe: `useReveal` marks on-screen elements
visible *before* enabling the hidden state, and `StatsCard countUp` only counts
cards that mount below the fold, so SSR HTML never blinks to 0. Everything is off
under `prefers-reduced-motion`.

New ui pieces it introduced, all reusable: `TextEyebrow`, `TextBlockquote`, the
`eyebrow` prop on `TextContentHeading`/`TextContentTitle`, `Image treatment="duotone"`
(navy shadows, gold highlights), `Button`/`Badge` `variant="accent"`,
`Section variant="tint"`, the restyled `StatsCard`, and the brand-band gold glow
on every `Section variant="brand"`.

### `publications-data.ts` is generated data with hand-maintained conventions

It lives in **`apps/web/src/content/`** (it is the Center's bibliography, not
library code — see "GW page blocks" above). It is ~5,200 lines and **343
records** (as of 2026-08-13), merging the Center's
own listing with the *full* OpenAlex records of Brandon A. Kohrt and Sauharda
Rai. Google Scholar has no API and blocks scraping, so OpenAlex is the
substitute — don't reach for Scholar. There is **no generator script in the
repo**: the records were produced by throwaway scripts, so anything added by
hand has to match the existing shape exactly. Five conventions, all of which
fail silently:

- **Both author pulls are unwindowed (2015 onward).** Kohrt was originally
  pulled 2023+ and backfilled. Adding a third author means pulling them
  unwindowed too, or the early years quietly become one author's back
  catalogue while the year facet implies a full archive.
- **`slug` is a pure function of `title`**: Unicode-normalise, drop combining
  marks, map every non-alphanumeric run (including en dashes and apostrophes,
  *not* just spaces) to `-`, lowercase, truncate to **70 chars**, strip the
  trailing `-`. An ASCII-fold that *deletes* punctuation instead of mapping it
  reproduces most slugs but silently breaks the handful containing en dashes.
  Verify a change by regenerating all slugs from titles and diffing.
- **`theme` is precedence-ordered keyword matching**, not best-match: maternal →
  stigma → training → measurement → adolescent, falling back to care-delivery.
  Order is load-bearing because titles routinely hit several buckets
  ("stigma reduction *training*"). This order reproduces 96% of the assignments
  that were hand-checked at 119 records; reordering silently reclassifies the
  corpus.
- **Dedupe is by DOI, and the stored value is a full `https://doi.org/…` URL**
  while OpenAlex returns a bare DOI. Comparing the two forms directly matches
  nothing and lets duplicates through — this happened once and added 18. Records
  with no DOI (4 of them) dedupe on a normalised title instead.
- **OpenAlex `type` is filtered, then mapped onto `kind`.** Excluded: preprints
  (published versions are already present), peer-review records, datasets,
  errata, paratext, supplementary materials, conference abstracts. Kept and
  mapped: article/conference-paper → `Article`, review → `Review`,
  book-chapter/reference-entry → `Chapter`, editorial/letter → `Editorial`,
  book → `Book`. OpenAlex venue names need cleaning (`null` for chapters,
  `"Elsevier eBooks"`); resolve the real book title via Crossref rather than
  falling back to `"Unlisted"`.

Titles never end in a period (APA venues include one), `authors` holds at most
six names with the true total in `authorCount`, and the array is sorted **date
descending** — the page relies on that order. `citations`/`openAccess` are
point-in-time and never re-fetched at runtime.

## Two component styling systems coexist in `@gmhlab/ui`

Be deliberate about which one you're extending. `src/primitives/` components are now mostly **flat single files** (`src/primitives/button.tsx`) — only `icon`, `image`, `logo`, and `text` keep their own subdir; the `layouts/` and `compositions/` groups still use per-component directories (`src/<group>/<name>/<name>.tsx`):

1. **shadcn/Tailwind primitives** (most of `src/primitives/` — button, dialog, dropdown-menu, input, navigation, accordion, …) — Tailwind v4 utility classes via `class-variance-authority` (`cva`), merged with `cn()` (`clsx` + `tailwind-merge`) from `src/lib/utils.ts`. Built on `@base-ui/react` (`button`, `dialog`, `dropdown-menu` — composition via the `render` prop) plus `radix-ui`/`react-aria-components` elsewhere, with `data-slot`/`data-variant`/`data-size` attributes for styling hooks. Theme is driven by the Tailwind color vars in `tailwind.css`.
2. **MFY layout/primitive components** (`src/layouts/` — `flex`, `grid`, `section`; plus `src/primitives/image`) — plain co-located `*.css` files imported directly by each `.tsx`, driven by `--mfy-*` tokens and component-local CSS custom properties (e.g. `--flex-*`). Props map to BEM-ish class names (`flex-gap-600`, `section-variant-stroke`). Not Tailwind-based.

**Selector traps when writing CSS against these**, all of which fail silently — the rule simply never matches, or the layout quietly does the wrong thing:

- **Bare `data-horizontal:` / `data-vertical:` variants never match.** Base UI
  emits only `data-orientation="horizontal|vertical"` — there is no bare
  attribute anywhere in its dist — but shadcn's `base-vega` templates ship
  `data-horizontal:h-px` style classes. Write
  `data-[orientation=horizontal]:…` instead. Nothing errors — the style just
  never applies. `slider`, `separator`, `button-group` and `field` are all
  converted, and no bare variant left in `src/` is unemitted; re-check against
  Base UI's dist rather than assuming, since it is the only source of truth for
  which attributes exist.
- **`group-has-*` and `group-data-*` are not interchangeable.** `field.tsx`
  carried `group-has-data-horizontal/field:` where the orientation attribute
  lives on the **group element itself** (`Field` sets both `group/field` and
  `data-orientation`), so even the corrected bracket form would have missed —
  `group-has-*` looks for a *descendant*. It is now
  `group-data-[orientation=horizontal]/field:`, matching the
  `group-data-[disabled=true]/field:` pattern already in the same file.
- `Flex` emits **`flex-mfy`**, not `flex` (`Grid` emits `grid-mfy`). A `> .flex` child selector matches nothing. Three dead rules in `headers.css` came from exactly this.
- shadcn primitives emit `data-slot` attributes plus Tailwind utilities and **no semantic class**. There is no `.navigation`, `.badge`, etc. — target `[data-slot="navigation-menu"]`.
- `FlexItem`'s `size` prop (`major`/`minor`/`half`) only does anything when the parent `Flex` has `type="half" | "quarter" | "third"`. Under the default `type="auto"` it is inert.
- `.card-content > *` is forced to `width: 100%`, so an intrinsically-sized child (a `Badge` pill) stretches across the card unless you wrap it.
- **Cards in a row are not equal height by default.** `Flex` maps `alignSecondary` straight onto `align-items`, and it defaults to `start` — so a `CardGrid` needs an explicit `alignSecondary="stretch"`. Even then, `.card` is itself a column flex box whose `.card-content` has no `flex-grow`, so pinning anything to a card's bottom edge (`margin-top: auto`) also needs `.card-content { flex: 1 }` from the calling page.
- `.card-asset` is a flex container that **stretches its child to the card's full height**. An asset meant to be a compact tile needs `align-items: flex-start` on `.card-asset`, or it becomes a full-height rail.
- `Card`'s `interactionProps` renders an absolutely-positioned overlay anchor (`z-index: 1`) covering the whole card. It gives you a card-wide click target and hover/focus states for free, but it **swallows any other link inside the card** — so a card cannot have both a card-wide target and working inner links. Pick one.

## Adding shadcn components

Per `README.md`, add components from the consuming app and they land in `packages/ui/src/primitives`:

```bash
pnpm dlx shadcn@latest add button -c apps/docs
```

shadcn config (`style: base-vega` — the Base UI variant, which is what `button`/`dialog`/`dropdown-menu` were pulled from; `radix-vega` would give you Radix-based versions of the same components — `baseColor: neutral`, lucide icons) and the `@gmhlab/ui` aliases (`utils: @gmhlab/ui/lib/utils`, `ui: @gmhlab/ui/components`) live in `components.json` files kept under `.files/` (a gitignored working-files scratch dir — `.files` is in `.gitignore`). After adding a component, keep it as a **flat** `src/primitives/<name>.tsx` file (the current convention — only `icon`/`image`/`logo`/`text` retain their own subdirs), export it from `src/primitives/index.ts`, and rebuild `ui`.

Three wrinkles when adding or editing exports:

- **`Button` with a non-`<button>` `render` prop needs `nativeButton={false}`.** `Button` spreads into Base UI's button primitive, whose `nativeButton` defaults to `true`; swapping the element (`render={<a href="…" />}`, or a router `<Link>`) without also passing `nativeButton={false}` makes Base UI keep native button semantics it can no longer rely on, and it logs a `console.error` **on every render**. This is invisible to `tsc` *and* to server rendering — it only shows up in a real browser, so neither `pnpm typecheck` nor `next build` will catch it. `SocialButtons` in `footers.tsx` and `PageActions` in `blocks/src/shared/page-cta.tsx` are the reference call sites. `Badge` is unaffected: it calls `useRender` directly rather than going through the Base UI button.
- **`cn()` is imported relatively everywhere — keep it that way.** All 22 primitives that use it import `../lib/utils`. `packages/ui/tsconfig.json` still carries a `"@/*": ["./src/*"]` path mapping, but **nothing in `src/` uses it**; shadcn emits `@/lib/utils`, so rewrite that import when you add a component. The alias resolves under `tsc`, but it is not in the tsup/consumer resolution path a published `dist` relies on.
- **Barrels under `compositions/` are maintained in two places.** `compositions/index.ts` re-exports *individual files* (`./sections/card-grids`, `./sections/heroes`, `./sections/panels`), and `compositions/sections/index.ts` is a separate list. A new file under `sections/` must be added to **both** or it won't reach the package barrel.

## Icons

`src/icons/` components render through `Icon` (`src/primitives/icon/`), which **hardcodes `viewBox="0 0 16 16"`**. Artwork authored on a different grid must be scaled inside the component rather than by changing the viewBox — `IconXLogo` wraps its 24-unit path in `<g transform="scale(0.6667)">` for exactly this reason. `IconXLogo` is also the only **filled** icon in the set (`fill="var(--svg-stroke-color)"`); every other icon is a stroked outline, so a new brand glyph copied from Figma will usually need the same treatment.

## The logo

`src/primitives/logo/` holds one mark, `gmh-logo.tsx` (`GmhLogo`, four figures holding a globe, two-tone, 1144.11×945, in two drawings — see below), styled by `logo.css` and wrapped in `AnchorOrButton`. The unreferenced `Logo` and `Logo2` were deleted on 2026-10-18. `Header`/`Footer` render it through their `logo` prop, which defaults to it.

It also holds the **crest lockup**, `gmh-crest-logo.tsx` (`GmhCrestLogo`, 595×144: crest + "Center for Global Mental Health" + the university line). It is generated from the designer's two colourways in `logo/source/gmh-crest-{light,dark}.svg` (same geometry; not bundled or published). The two baked colourways became three CSS roles in `logo.css`: `--logo-crest-ink` (navy, on-surface after `.dark`, on-brand inside a brand section), `--logo-crest-gold`, and `--logo-crest-detail` (the globe's navy detail, navy in both). Figma's outside-stroke mask around the university line was flattened to two `<rect>` rules, so there are no ids to collide. It is 64px tall and illegible much smaller, so it is a desktop piece: `Header`'s **`lockup`** prop shows it in place of `logo` + `wordmark` from 600px up (CSS, no SSR flash), while `logo` still serves the mobile row and sheet. `apps/web` passes it; the ui default is unchanged.

It **defaults `href="/"`**, so a logo in site chrome navigates home without the call site opting in, and `AnchorOrButton` renders an `<a>` rather than a `<button>`. Two consequences: pass `href={undefined}` (not `href=""`) for a non-navigating logo — `AnchorOrButton` branches on `"href" in props`, so a present-but-undefined `href` would emit an `<a>` with no destination, which is why the component spreads the key conditionally. And `aria-label` is now destructure-and-default rather than hardcoded after the spread, so consumers can override it; it reports "…, home" as a link and "… logo" as a button. `AnchorOrButton` renders `RACLink`, a plain `<a>` — **clicking the logo in `apps/web` is a full page reload**, because neither app wires react-aria-components' `RouterProvider` to its router.

`GmhLogo` was regenerated on 2026-10-19 from the designer's files, replacing the single-colour Figma mark (`a8t0tmguLdEKoVMc3wVoL7` node `5007:49`, which Figma still holds). The mark ships in **two drawings** of the same geometry, both in `logo/gmh-mark-art.tsx` and each from a navy + gold / white + gold pair of sources: **simple** (`source/gmh-mark-simple-{light,dark}.svg`, a stylised evenodd globe) is `GmhLogo`'s default and the favicons — at 48px the coastlines would be noise; **detailed** (`source/gmh-mark-{light,dark}.svg`, real coastlines) is `GmhLogo variant="detailed"` and the contour hero's centrepiece. Regenerate rather than hand-edit the path data. Things to know about its CSS:

- It is a **near-square** mark (a little wider than tall), so `logo.css` sizes it by *height* via a `.logo-gmh > svg` rule (`height: var(--mfy-typography-scale-08)` = 48px, the size Figma specs) that overrides the generic portrait `.logo > svg` rule (which still supplies `--logo-color`) by source order at equal specificity. Reordering those two rules silently shrinks it. The typography token is deliberate: there is no `--mfy-size-icon-*` at 48px (`large` is 40px), and `icons.css` already maps `.icon-size-48` to that same token.
- **Its width must stay explicit** — `calc(var(--logo-gmh-height) * 1144.11 / 945)`, not `auto`. The `AnchorOrButton` wrapper renders a `<button>`, which clips its content, and an auto-width replaced element gives that button an unreliable shrink-to-fit width; the result was the mark's right edge being sliced off in the header and footer. For the same reason `.logo-gmh` sets `flex-shrink: 0` (it is a flex item in both rows) and the svg sets `overflow: visible` (the heads touch the viewBox's top edge). If you restyle this, keep all three.
- Its colours are two roles, like the crest's: `--logo-mark-ink` (navy; on-surface after `.dark`; on-brand inside a brand section) and `--logo-mark-gold` (always `#AA9868`, a fill). In both drawings the land is left open, so the continents show the surface behind.

`section.css` overrides `--logo-mark-ink`, `--logo-crest-ink` and the generic `--logo-color` (for a consumer's own single-colour mark) to `--mfy-color-icon-brand-on-brand` inside `.section-variant-brand` — that is what re-colours the footer logo. `apps/web/src/app/icon.svg` and `apps/docs/public/favicon.svg` are the light colourway with a `prefers-color-scheme: dark` style that turns the ink white.

## The graphics kit (`@gmhlab/ui` `src/graphics/`, 2026-10-19)

Ported from the designer's "GMH Graphics Kit — v1" (the bundled HTML lives in `.files/gmh-graphics-kit-v1.html`, gitignored). Components: `ContourGlobe` (hero backdrop; `centerpiece` = `"globe"`, `"mark"` — the GMH mark in a clearing — or `"none"`; the mark's paths are shared with `GmhLogo` via `logo/gmh-mark-art.tsx`), `CareRings` (reach motif), `ResearchGlyph` (`RESEARCH_GLYPHS`: the kit's eight plus `maternal` and `sensing`, drawn to the same 48-grid/1.75-stroke/one-gold-accent rules), `BrandShape` (`BRAND_SHAPES`: eight duotone spot shapes), `WaveDivider`, `FigureBand`, `PathwayRule`, and `PhotoBackdrop` (a hero photo in the navy/gold duotone under a wash of the band's own surface — reading strength on the left, open on the right, faded at the bottom; it fades in on load so the gold ground never flashes). All `aria-hidden` unless given `label`.

- **Colour is four roles, never literals** (`graphics.css`): `--graphic-ink` (navy; pale after `.dark` and in brand bands/brand cards; paper again in a light card inside a brand band), `--graphic-gold`, `--graphic-ground` (knock-outs), plus derived tints. The roles are set *on* `.graphic`, so overrides must target `.parent .graphic`, not the parent. In a filled button set `--graphic-ink: currentColor` (publications facet chips do).
- **Gradient/clip/pattern ids go through `useSvgId`** (sanitised `useId`) — two graphics sharing an id paint the first one's definition.
- **Backdrops**: `backdrop` (ContourGlobe) or `className="graphic-backdrop"` fills the parent; a `Section` containing one is isolated and clipped via `.section:has(> .graphic-backdrop)`. Over left-aligned copy add `graphic-fade-start` (masks the left side on desktop, dims the whole thing below 900px) — without it the contours and markers run through the text.
- **Every `Section variant="brand"` except the footer and the home stats and research bands carries the contour texture** (footers.css, `.home-stats-band` and `.home-focus-band` switch it off with `::before { content: none }`) as a `::before` (mask `--graphic-contour-mask` from graphics.css, on-brand ink, top 28rem), and is `isolation: isolate`. Don't give brand sections another `::before`. `.graphic-contours` applies the same texture to any element (the glyph panels on the home research cards and the innovation detail hero).
- **`WaveDivider`** is the first child of a brand section that follows a light one; it carves the band's top in `--graphic-wave-fill` (default page surface; `.innovations-page` sets the neutral hero surface) and the section adds top padding for it.
- **Where it is applied**: every hero layers a photo under its graphics. Index pages render `PageHero` (`blocks/src/shared/page-hero.tsx`, internal): a neutral band with a motif (projects/innovations globe, publications contours, team care rings) over `heroImage` through `PhotoBackdrop` when given — `heroImage` is optional, and it no longer switches to the old scrim image hero. `HomeHero.background`, `ProjectDetail.heroImage` and `InnovationDetail.heroImage` do the same for the home and detail heroes. `apps/web` passes placeholder photos from `content/hero-images.ts` (picsum/Unsplash — swap before launch). Home: the hero draws `ContourGlobe centerpiece="mark"` (the designer's "Contour hero — logo backdrop": contours fading into a clearing around the GMH mark) when `hero.image` is omitted, as `apps/web` does, and the globe framing the photo when one is given (with a gold bracket frame); wave into the stats band, glyph panels on research cards on a plain brand band (`HomeFocusItem.glyph` on a navy contour panel; `image` wins if both), partners on a neutral band, blob-cropped quote photo (`graphic-mask-blob`), care rings behind the CTA. `Innovation.glyph`, `InnovationComponent.glyph` and `InnovationDetail.glyph` replaced emoji `icon`s. `PUBLICATION_THEME_GLYPHS` maps each theme to a glyph (chips, rows, home cards). `PageCtaSection` opens on a `FigureBand`. Detail heroes carry faded contours; innovation "How It Works" steps are styled as the pathway rule.



## Catalog dependencies

Shared dependency versions are pinned centrally in `pnpm-workspace.yaml` under `catalog:`. Reference them in package.json as `"<dep>": "catalog:"` rather than hardcoding versions, so React, Tailwind, tsup, Vite, etc. stay aligned across packages. (Current catalog notably pins TypeScript `^6`, Vite `^8`, Next `^16`, Tailwind `^4`, react-router `^8`; `motion` and `@base-ui/react` are also available.)

## Responsive switching: `useMediaQuery` renders the desktop tree on the server

`src/hooks/useMediaQuery.tsx` (breakpoints mobile 375 / tablet 600 / desktop 1024) is a `useSyncExternalStore` over `matchMedia` whose `getServerSnapshot` returns **`false` for every query**. Any component that branches on it — `Header` (`isMobile`), `Card` (`direction`), `TextContentTitle` (hero vs page title) — therefore renders its **desktop** branch into the Next SSR HTML and swaps after hydration. Visible as a flash in `apps/web`.

Where the layout can be expressed in CSS, prefer that: the tokens layer already ships `--mfy-responsive-display-flex-to-none` / `-none-to-flex` (and the `.display-*` helpers in `globals.css`) for exactly this. A component that switches in JS must also keep its CSS breakpoints in step by hand — `headers.{tsx,css}` both pivot at 600px and each carries a comment pointing at the other.

## Theming in the apps

`src/components/theme-provider.tsx` (a copy in each of the two apps) is a self-contained light/dark/system provider (no external dep): persists to `localStorage`, toggles `.light`/`.dark` on `<html>`, follows `prefers-color-scheme` for `system`, and binds the **`d` key** to toggle dark mode. It lives in the apps, not in `@gmhlab/ui`.
