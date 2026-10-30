# CLAUDE.md — packages/ui

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/ui`. Repo-wide rules (build order, `dist/` consumption, the fixed brand) are in the root `CLAUDE.md`.

The component library: the Tailwind bridge, its two styling systems and their selector traps, how shadcn components are added, and the brand assets (icons, logo, graphics kit).

## The Tailwind bridge (`tailwind.css`)

The block is `@theme inline`, so keys are **substituted into utilities rather
than emitted to `:root`** — unused keys cost zero bytes and every utility
resolves its `var()` at the element, so dark mode flips for free. The file's
header comment is the reference; the essentials:

- **Colour keys are the M3 role names, verbatim**: `bg-primary-container`,
  `text-on-surface-variant`, `border-outline-variant`, `bg-success-container`,
  `bg-brand-band`. Roles already encode surface vs. content, so there is no
  prefix scheme. Opacity modifiers work (`bg-tertiary-container/25`).
- **shadcn names are aliases** onto roles (background, foreground, card,
  popover, muted, accent, destructive, border, input, ring, sidebar-*,
  chart-*). Two names exist in both vocabularies: `primary` (same meaning) and
  **`secondary`, which keeps shadcn's meaning — the tonal button
  (`secondary-container`)** — so upstream shadcn code stays correct. M3's solid
  `secondary`/`on-secondary`, `background`/`on-background`, `shadow` and
  `surface-tint` get no utility.
- **Type is `type-<m3-role>`** (`type-body-large`, `type-label-large`): font
  shorthand + tracking. M3 sizes are deliberately **not** `--text-*` keys,
  because the `Text` primitive owns the `text-<word>` class namespace
  (`text.css`: `text-body-small`, `text-heading`, `text-subtitle` …) and a
  same-named utility silently fights it. The shadcn layer claims names there
  too: `--color-input` generates a `text-input` utility, which collided with
  the old `.text-input` class — hence `TextInput` emits **`.text-input-value`**.
  Check any new `text-<word>` class in `text.css` against the colour keys
  *and* the shadcn aliases.
- **Radius**: the shadcn `rounded-*` ramp is the M3 corner scale step for step
  (sm 4, md 8, lg 12, xl 16, 2xl 28, 3xl 32, 4xl 48). **Elevation**:
  `shadow-level1…5`.
- **Spacing is deliberately not mapped**: `--gmh-space-N` already equals
  Tailwind's `N/100` step (`space-400` = `p-4`); a `--spacing-100` key would
  silently redefine `p-100` from 25rem to 4px. Font weights and icon sizes are
  skipped for the same reason.

The Material 3 role list in `@theme inline` is generated from `color.css`'s
role names when the file is rewritten, but nothing regenerates it
automatically: **a new role in `color.mjs` needs a matching `--color-<role>`
line by hand.**

The `Badge` `info`/`warning`/`success` variants use the container pairs
(`bg-success-container text-on-success-container`), not the
alpha-over-solid trick `destructive` uses — a 10% wash of a warning yellow is
not a readable pill.

## Two component styling systems coexist in `@gmhlab/ui`

Be deliberate about which one you're extending. `src/primitives/` components are now mostly **flat single files** (`src/primitives/button.tsx`) — only `icon`, `image`, `logo`, and `text` keep their own subdir; the `layouts/` and `compositions/` groups still use per-component directories (`src/<group>/<name>/<name>.tsx`):

1. **shadcn/Tailwind primitives** (most of `src/primitives/` — button, dialog, dropdown-menu, input, navigation, accordion, …) — Tailwind v4 utility classes via `class-variance-authority` (`cva`), merged with `cn()` (`clsx` + `tailwind-merge`) from `src/lib/utils.ts`. Built on `@base-ui/react` (`button`, `dialog`, `dropdown-menu` — composition via the `render` prop) plus `radix-ui`/`react-aria-components` elsewhere, with `data-slot`/`data-variant`/`data-size` attributes for styling hooks. Theme is driven by the Tailwind color vars in `tailwind.css`.
2. **CSS layout/primitive components** (`src/layouts/` — `flex`, `grid`, `section`; plus `src/primitives/image`) — plain co-located `*.css` files imported directly by each `.tsx`, driven by `--gmh-*` tokens and component-local CSS custom properties (e.g. `--flex-*`). Props map to BEM-ish class names (`flex-gap-600`, `section-variant-stroke`). Not Tailwind-based.

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
- `Flex` emits **`flex-gmh`**, not `flex` (`Grid` emits `grid-gmh`). A `> .flex` child selector matches nothing. Three dead rules in `headers.css` came from exactly this.
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

- It is a **near-square** mark (a little wider than tall), so `logo.css` sizes it by *height* via a `.logo-gmh > svg` rule (`height: var(--gmh-icon-size-extra-large)` = 48px, the size Figma specs) that overrides the generic portrait `.logo > svg` rule (which still supplies `--logo-color`) by source order at equal specificity. Reordering those two rules silently shrinks it. `icons.css` maps `.icon-size-48` to the same token.
- **Its width must stay explicit** — `calc(var(--logo-gmh-height) * 1144.11 / 945)`, not `auto`. The `AnchorOrButton` wrapper renders a `<button>`, which clips its content, and an auto-width replaced element gives that button an unreliable shrink-to-fit width; the result was the mark's right edge being sliced off in the header and footer. For the same reason `.logo-gmh` sets `flex-shrink: 0` (it is a flex item in both rows) and the svg sets `overflow: visible` (the heads touch the viewBox's top edge). If you restyle this, keep all three.
- Its colours are two roles, like the crest's: `--logo-mark-ink` (navy; on-surface after `.dark`; on-brand inside a brand section) and `--logo-mark-gold` (always `#AA9868`, a fill). In both drawings the land is left open, so the continents show the surface behind.

`section.css` overrides `--logo-mark-ink`, `--logo-crest-ink` and the generic `--logo-color` (for a consumer's own single-colour mark) to `--gmh-color-on-brand-band` inside `.section-variant-brand` — that is what re-colours the footer logo. `apps/web/src/app/icon.svg` and `apps/docs/public/favicon.svg` are the light colourway with a `prefers-color-scheme: dark` style that turns the ink white. `apps/web/src/app/apple-icon.png` (180×180, the simple mark on opaque light-surface paper — iOS ignores SVG icons and rounds the corners itself) is rendered from `source/gmh-mark-simple-light.svg`; re-render it if the mark changes rather than editing pixels.

## The graphics kit (`@gmhlab/ui` `src/graphics/`, 2026-10-19)

Ported from the designer's "GMH Graphics Kit — v1" (the bundled HTML lives in `.files/gmh-graphics-kit-v1.html`, gitignored). Components: `ContourGlobe` (hero backdrop; `centerpiece` = `"globe"`, `"mark"` — the GMH mark in a clearing — or `"none"`; the mark's paths are shared with `GmhLogo` via `logo/gmh-mark-art.tsx`), `CareRings` (reach motif), `ResearchGlyph` (`RESEARCH_GLYPHS`: the kit's eight plus `maternal`, `sensing` and `publication` (the book standing in for a missing journal cover), drawn to the same 48-grid/1.75-stroke/one-gold-accent rules), `BrandShape` (`BRAND_SHAPES`: eight duotone spot shapes), `WaveDivider`, `FigureBand`, `PathwayRule`, and `PhotoBackdrop` (a hero photo in the navy/gold duotone under a wash of the band's own surface — reading strength on the left, open on the right, faded at the bottom; it fades in on load so the gold ground never flashes). All `aria-hidden` unless given `label`.

- **Colour is four roles, never literals** (`graphics.css`): `--graphic-ink` (navy; pale after `.dark` and in brand bands/brand cards; paper again in a light card inside a brand band), `--graphic-gold`, `--graphic-ground` (knock-outs), plus derived tints. The roles are set *on* `.graphic`, so overrides must target `.parent .graphic`, not the parent. In a filled button set `--graphic-ink: currentColor` (publications facet chips do).
- **Gradient/clip/pattern ids go through `useSvgId`** (sanitised `useId`) — two graphics sharing an id paint the first one's definition.
- **Backdrops**: `backdrop` (ContourGlobe) or `className="graphic-backdrop"` fills the parent; a `Section` containing one is isolated and clipped via `.section:has(> .graphic-backdrop)`. Over left-aligned copy add `graphic-fade-start` (masks the left side on desktop, dims the whole thing below 900px) — without it the contours and markers run through the text.
- **Every `Section variant="brand"` except the footer and the home stats and research bands carries the contour texture** (footers.css, `.home-stats-band` and `.home-focus-band` switch it off with `::before { content: none }`) as a `::before` (mask `--graphic-contour-mask` from graphics.css, on-brand ink, top 28rem), and is `isolation: isolate`. Don't give brand sections another `::before`. `.graphic-contours` applies the same texture to any element (the glyph panels on the home research cards and the innovation detail hero).
- **`WaveDivider`** is the first child of a brand section that follows a light one; it carves the band's top in `--graphic-wave-fill` (default page surface; `.innovations-page` sets the neutral hero surface) and the section adds top padding for it.
- **Where it is applied**: every hero layers a photo under its graphics. Index pages render `PageHero` (`blocks/src/shared/page-hero.tsx`, internal): a neutral band with a motif (projects/innovations globe, publications contours, team care rings) over `heroImage` through `PhotoBackdrop` when given — `heroImage` is optional, and it no longer switches to the old scrim image hero. `HomeHero.background`, `ProjectDetail.heroImage` and `InnovationDetail.heroImage` do the same for the home and detail heroes. `apps/web` passes placeholder photos from `content/hero-images.ts` (picsum/Unsplash — swap before launch). Home: the hero draws `ContourGlobe centerpiece="mark"` (the designer's "Contour hero — logo backdrop": contours fading into a clearing around the GMH mark) when `hero.image` is omitted, as `apps/web` does, and the globe framing the photo when one is given (with a gold bracket frame); wave into the stats band, glyph panels on research cards on a plain brand band (`HomeFocusItem.glyph` on a navy contour panel; `image` wins if both), partners on a neutral band, blob-cropped quote photo (`graphic-mask-blob`), care rings behind the CTA. `Innovation.glyph`, `InnovationComponent.glyph` and `InnovationDetail.glyph` replaced emoji `icon`s. `PUBLICATION_THEME_GLYPHS` maps each theme to a glyph (chips, rows, home cards). `PageCtaSection` opens on a `FigureBand`. Detail heroes carry faded contours; innovation "How It Works" steps are styled as the pathway rule.

## Responsive switching: `useMediaQuery` renders the desktop tree on the server

`src/hooks/useMediaQuery.tsx` (breakpoints mobile 375 / tablet 600 / desktop 1024) is a `useSyncExternalStore` over `matchMedia` whose `getServerSnapshot` returns **`false` for every query**. Any component that branches on it — `Header` (`isMobile`), `Card` (`direction`), `TextContentTitle` (hero vs page title) — therefore renders its **desktop** branch into the Next SSR HTML and swaps after hydration. Visible as a flash in `apps/web`.

Where the layout can be expressed in CSS, prefer that: the tokens layer already ships `--gmh-responsive-display-flex-to-none` / `-none-to-flex` (and the `.display-*` helpers in `globals.css`) for exactly this. A component that switches in JS must also keep its CSS breakpoints in step by hand — `headers.{tsx,css}` both pivot at 600px and each carries a comment pointing at the other.
