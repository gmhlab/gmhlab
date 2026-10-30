# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`gmhlab` is a pnpm + Turborepo monorepo template (a duplicate of the `monofly` template, re-scoped to `@gmhlab/*` for publishing) for building React 19 apps on top of a shared component/design-system stack. Node >= 20, package manager is pnpm 11.x. There is no test runner, linter, or formatter configured yet (`vitest` is in the catalog but unused).

`README.md` covers the same ground at a higher level for humans. Prefer the `CLAUDE.md` files where they disagree — they carry the gotchas the README omits.

## Where the rest lives

Claude Code loads a nested `CLAUDE.md` when you work in its directory. Detail lives next to the code it describes:

- **`packages/tokens/CLAUDE.md`** — the single `--gmh-*` token layer and its Material 3 naming rule, the generated `color.css` (never hand-edit it), what still holds from the GW re-skin, and the contrast traps (gold `#AA9868` is a fill, never text).
- **`packages/ui/CLAUDE.md`** — the Tailwind bridge (`tailwind.css`), the two component styling systems and their silent selector traps, adding shadcn components, icons, the GMH logo and crest, the graphics kit, and `useMediaQuery`'s server snapshot.
- **`packages/blocks/CLAUDE.md`** — the shape every record-driven page block shares (copy defaults, links, fail-soft references, faceting), and the project/innovation detail, contact, team and home pages.
- **`apps/web/CLAUDE.md`** — Next.js 16 rules (via `AGENTS.md`) and the content-record conventions, above all `publications-data.ts`.
- **`docs/figma.md`** — the four GMH Figma files (Foundations, UI, Blocks, App) and how they are kept faithful to code. **Read it before any Figma work**; it is not auto-loaded.

## Workspace layout

Workspaces are `apps/*` and `packages/*` (see `pnpm-workspace.yaml`). Internal packages reference each other with `workspace:*`. Build/consume order is **tokens, core → ui, data → blocks → apps** (`core` and `tokens` are independent roots; `data` depends only on `core`, `ui` on `tokens` + `core`). A package restructure ran on 2026-10-18: `core`, `data`, and moving template residue out of `ui`/`blocks` (GMH Lab content stays as overridable defaults) are done. A Material Design 3 migration started the same day; on 2026-10-24 the tokens became one `--gmh-*` layer — see `packages/tokens/CLAUDE.md`.

- `packages/tokens` (`@gmhlab/tokens`) — the **design-token value layer**: one layer, the `--gmh-*` namespace, Material Design 3 names (see `packages/tokens/CLAUDE.md`). `src/index.css` chains `responsive.css` → `color.css` → `system.css` → `icons.css` → `globals.css` (`reset.css` exists but is commented out). This is a pure value/theme layer — it carries **no** Tailwind directives. `color.css` is **generated** (`script:color`); `system.css` is hand-maintained. It is **GMH Lab's brand, and fixed** — teams do not re-theme it; see "The brand is fixed" below. `src/index.ts` is **CSS-only** (`import "./index.css"`); consume tokens as CSS vars. CSS is exposed to consumers as **`@gmhlab/tokens/tokens.css`** (physical file is `dist/index.css`). Published (not `private` — `ui`'s CSS imports it at runtime); has no runtime/peer deps.
- `packages/core` (`@gmhlab/core`) — the **framework-agnostic domain layer**: shared record types (`Product`, `PricingPlan`, `User`, …), the service interfaces a backend implements (`AuthService`, `PricingService`, `ProductsService`, `NewsletterService`, `ContactService` with its `ContactInquiry`), and pure helpers (`filterProducts`, `sortProducts`, `searchProducts`, `cartTotal`, `isEmailAddress`). No React, no CSS, **no data** — the main entry must stay DOM-free. Invented demo records and mock services live behind a second entry, **`@gmhlab/core/mocks`** (`MOCK_PRODUCTS`, `mockAuthService`, …; two tsup entries), so they only reach bundles that import them on purpose. Session persistence is the `AuthService`'s own job (`login` stores, `getCurrentUser` restores) — providers never touch storage. Only types shared *across* packages belong here; a block's own record contract stays co-located with the block.
- `packages/data` (`@gmhlab/data`) — the **React side of the data layer**: auth/pricing/products contexts, providers (`AuthProvider`, `PricingProvider`, `ProductsProvider`, `NewsletterProvider`, `ContactProvider`, `AllProviders`) and hooks (`useAuth`, `usePricing`, `useProducts`, `useNewsletter`, `useContact`), plus the `*ContextType` interfaces and `DataServices`. **Every provider takes its backend as a required `service` prop** (`AllProviders` takes `services={{ auth, pricing, products, newsletter, contact }}`) — there are no defaults, so `@gmhlab/core/mocks` reaches a bundle only when the app passes the mocks in. Each provider re-runs its load when `service` changes, so services must be stable references (module-level constants). Does not re-export core's types. `useAuth` (`apps/web`'s header) and `useNewsletter` (its footer signup) and `useContact` (its contact form) have consumers in the repo — `usePricing`/`useProducts` lost theirs when the MonoFly examples were deleted. Bundled with a `"use client"` banner; `external`s `react`, `react-dom`, `@gmhlab/core`; no CSS, `sideEffects: false`. `ProductsProvider` still persists cart/favorites/recently-viewed to `localStorage` itself — that is UI state, unlike the session, which is the `AuthService`'s job.
- `packages/ui` (`@gmhlab/ui`) — the component library. `src/styles/index.css` is just two imports: `@gmhlab/tokens/tokens.css` (the value layer) followed by `./tailwind.css` (the Tailwind glue). The tokens CSS is **not** inlined: because tsup's `.css` loader is `copy`, esbuild never parses the file, so `dist/index.css` ships a literal `@import "@gmhlab/tokens/tokens.css"` on line 1 (its *relative* imports do get inlined). `@gmhlab/tokens` is therefore a genuine runtime dependency that must be published and resolvable by the consumer's CSS toolchain — it cannot be made `private`. The barrel (`src/index.ts`) imports `./styles/index.css` and re-exports `compositions` (cards, footers, forms, headers, sections), `graphics` (the GMH graphics kit — see `packages/ui/CLAUDE.md`), `hooks` (`useMediaQuery`), `icons`, `images` (SVGs bundled as data URLs via tsup's `.svg` `dataurl` loader), `layouts`, `lib/utils`, and `primitives`. `src/types/react.d.ts` is an ambient-only augmentation (not exported) that widens `React.CSSProperties` to accept `--*` keys — this is what lets the CSS layout/primitive components pass custom properties via `style={{ "--flex-gap": … }}` without a cast. Deleting it breaks typecheck across the repo.
- `packages/blocks` (`@gmhlab/blocks`) — higher-level composed blocks built from `ui` + `tokens`. `src/` groups, **all eight re-exported from the barrel**: `contact/` (`ContactPage`, `ContactForm`, `contactMailto` and the `ContactTopic`/`ContactLocation`/`CareNotice` records — see `packages/blocks/CLAUDE.md`), `home/` (`HomePage`, the record-driven landing page — see `packages/blocks/CLAUDE.md`), `innovations/`, `projects/`, `publications/`, `team/` (the GW site pages — **record-driven renderers only**; the records live in `apps/web/src/content/`, see `packages/blocks/CLAUDE.md`), `shared/` (the `PageCta`/`PageAction` copy types, plus `gmh-copy.ts` — the GW Center's default copy, exported as `GMH_*_COPY`; the `PageCtaSection`/`PageActions` components in `shared/page-cta.tsx` are internal, not exported), and `slides/` (`BrandSlide`, `SlideHeader`, `SlideFooter` with co-located CSS). The MonoFly `examples/` sections and the `/showcase` route were **deleted** (2026-10-18) — demo content with hardcoded SDS/Figma copy. The data layer moved out to `@gmhlab/data`; blocks no longer depends on it; it depends on `@gmhlab/core` again (2026-10-27) for `ContactInquiry` and `isEmailAddress` only. blocks is bundled with a `"use client"` banner. tsup `external`s `react`, `react-dom`, `@gmhlab/core`, `@gmhlab/ui` and `@gmhlab/tokens` so they resolve from the consumer rather than being bundled. **Every new workspace dependency must be added to that list** — a bundled copy of a package that defines React contexts splits context identity, and hooks then throw "must be used within a provider" at runtime with no type error. CSS exposed as `@gmhlab/blocks/styles.css`.
- `apps/docs` (`docs`) — Vite + React 19 reference app that consumes every package. Uses `react-router` (`createBrowserRouter` in `src/App.tsx`, pages under `src/pages/`, shared `RootLayout`). `ComponentsPage` is the `@gmhlab/ui` gallery and `BlocksPage` is its `@gmhlab/blocks` counterpart; the seven **record-driven page blocks** get live demo routes under `/blocks/*` (`src/pages/blocks/`), fed by the synthetic corpus in **`src/fixtures/sample-content.ts`** — an invented institute, since a block that could only render the GW Center's records would not be library code. Those routes are mounted a level down from where `apps/web` mounts the same blocks, which is what exercises the `basePath` prop; the fixture also carries one deliberately unresolvable publication slug so the fail-soft reference resolution is visible. Each demo route wrapper passes its own `basePath`, so moving a route means editing the wrapper too.
- `apps/web` (`web`) — Next.js 16 App Router site consuming every package (own copy of `theme-provider`). **It is Next.js 16, which differs from what you know: `apps/web/AGENTS.md` (loaded through `apps/web/CLAUDE.md`) says to read the guide in `node_modules/next/dist/docs/` before writing Next code** — metadata file conventions such as `apple-icon.png` included. Routes: `/` (the GW landing page — `HomePage` fed `HOME_CONTENT`), plus GW pages that are each a thin wrapper passing content records into a block — `/team`, `/projects`, four project detail routes (`/projects/reshape`, `/projects/equip`, `/projects/unicef-mmapp`, `/projects/recoup-ny`), `/innovations`, `/innovations/equip`, `/publications`, and `/contact` (a **server component** that exports `metadata` and hands `ContactPage` the client `SiteContactForm` as its `form` slot). **`src/content/` holds those records** (the landing page, the portfolio, the 343-work bibliography, the innovations, the team, and the project and innovation detail records). Team headshots are static files in `public/team/` — served by Vercel's CDN, no bucket. Project logos are `public/projects/<slug>.png` (`Project.logo`; EQUIP's is reused by `Innovation.logo`/`InnovationDetail.logo`, all rendered by the internal `shared/project-mark.tsx`); the untouched originals pulled from the live Wix site (plus the wide index logos and the unshipped partner logos) are in **`apps/web/assets/gw-site/`**, which is not served — its README records each file's source and any edit. The index-page copy (subtitles, CTAs) is **not** here — it is the blocks' default (`shared/gmh-copy.ts`), so the route files pass none. The exception is `PUBLICATIONS_NOTE` in `publications-data.ts`, which the publications route passes as `note`. — page-block conventions are in `packages/blocks/CLAUDE.md`, content-record conventions (the bibliography above all) in `apps/web/CLAUDE.md`. Tailwind runs via `@tailwindcss/postcss` (not the Vite plugin); `src/app/globals.css` follows the same pattern as the docs app (import ui/blocks styles + `@source` the package `dist`s). Scripts: `dev` (`next dev`), `build` (`next build`), `start`, `typecheck`. Site chrome lives in the layout — see "The apps/web app shell" below.

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
- **`site-header.tsx` / `site-footer.tsx` are thin client wrappers around the ui `Header`/`Footer`.** `site-header.tsx` also exports `SiteUtilityBar` (the ui `UtilityBar`, a non-sticky deep-navy strip rendered *above* the sticky header) and passes the header a `wordmark`. `Header` is no longer a brand section: it is translucent paper over a backdrop blur with gold-underline nav links, and its scroll shadow is a CSS scroll-driven animation (no JS). `Header` and `Footer` take a **`logo` prop** that defaults to `<GmhLogo />` (GMH Lab's mark — adopters should see whose system it is); pass another mark, or `null` for none. `Footer` also takes `columns`, `aside`, `legal` and `newsletter` — a slot for the ui **`NewsletterSignup`** panel (beside the columns, bottom-aligned, from 1200px; full width under them below, where the panel's own container query lays it out copy-left/form-right). `site-footer.tsx` feeds it `useNewsletter().subscribe`, so the mailing list is swapped in `DataProviders` like every other backend; in `apps/web` it is `siteNewsletterService`, which emails each signup to globalmh@gwu.edu (there is no list provider yet). `NewsletterSignup` has no `fineprint` default on purpose — it is a promise about the list (the app passes "Unsubscribe any time"). Its error text uses `brand-band-error` (M3 error T80, pinned in both modes, since light `error` is unreadable on navy). There is **no placeholder content**: `navItems`/`columns` default to empty and `aside` to nothing (the former Figma placeholder nav/columns and the Figma social links are gone; `SocialButtons` now takes `links`). With `logo={null}`, the header wordmark becomes the exposed home link rather than an `aria-hidden` duplicate. `layout.tsx` is a server component (it exports `metadata`). Note that **both** `@gmhlab/ui` and `@gmhlab/blocks` now ship a `"use client"` banner on the whole bundle (see each `tsup.config.ts`), so the wrappers are no longer strictly required for the directive's sake — they are kept as the app's own boundary. Don't cite the banner's absence as the reason they exist; that was true of an earlier build config.

## Styling architecture: value layer vs. Tailwind glue

The split is deliberate — know which side you're editing:

- **`@gmhlab/tokens` = values only, one layer, `--gmh-*`.** `color.css` (generated), `system.css` (shape, type, elevation, state, motion, plus space/stroke/icon sizes), `responsive.css`, `icons.css`, `globals.css`. No Tailwind directives.
- **`@gmhlab/ui/src/styles/tailwind.css` = Tailwind glue, compiled by the *consumer's* Tailwind.** Holds `@custom-variant dark (&:is(.dark *))`, `@theme inline` (M3 roles → Tailwind colour keys, shadcn aliases, radius, elevation, fonts), the shadcn `:root` alias block, the `type-*` `@utility` block, and an `@layer base` block. Because this is shipped as CSS (via the `.css` copy loader, not compiled by tsup), the app's Tailwind is what processes `@theme`/`@apply`.

Both key off the **same `.dark` class** on `<html>`. The token layer itself is documented in `packages/tokens/CLAUDE.md`, the Tailwind bridge in `packages/ui/CLAUDE.md`.

### The brand is fixed (since 2026-10-18)

**Every team using these packages works for GMH Lab, and the brand —
colours, type, shape, the look — is not theirs to override.** Teams supply
their own records and copy through props (GMH Lab copy is the default); they
do not re-theme. A theming contract that let teams redefine the brand ramps
was built and then reverted the same day for this reason — don't rebuild one,
and don't document override hooks. CSS variables cannot be technically
locked, so this is enforced by docs and review.

- **No literal brand colours anywhere** — tint from a token instead:
  `color-mix(in srgb, var(--gmh-color-navy) 9%, transparent)`. Neutral
  black/white alphas are fine, but prefer `--gmh-color-scrim` /
  `--gmh-color-shadow` mixes.
- **The colour source is a Material Theme Builder export** seeded with GW navy
  `#033C5A` and gold `#AA9868`, standard contrast only. The exact GW colours are
  pinned inside the M3 roles (the builder's own tone mapping shifts navy to
  `#28638A` and gold to an ochre). **Where M3 and old GW behaviour differ,
  prefer whichever looks better** — don't preserve old quirks for their own
  sake. Still to do (phase 3): components applying state layers themselves,
  M3 component shapes (pill buttons, 28px dialogs) and motion.

## Catalog dependencies

Shared dependency versions are pinned centrally in `pnpm-workspace.yaml` under `catalog:`. Reference them in package.json as `"<dep>": "catalog:"` rather than hardcoding versions, so React, Tailwind, tsup, Vite, etc. stay aligned across packages. (Current catalog notably pins TypeScript `^6`, Vite `^8`, Next `^16`, Tailwind `^4`, react-router `^8`; `motion` and `@base-ui/react` are also available.)

## Theming in the apps

`src/components/theme-provider.tsx` (a copy in each of the two apps) is a self-contained light/dark/system provider (no external dep): persists to `localStorage`, toggles `.light`/`.dark` on `<html>`, follows `prefers-color-scheme` for `system`, and binds the **`d` key** to toggle dark mode. It lives in the apps, not in `@gmhlab/ui`.
