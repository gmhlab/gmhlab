/* The innovations index and detail pages, built on the @gmhlab/ui
 * layouts/compositions/primitives — the sibling of `../projects`. Page content
 * only: the site header and footer come from the consuming app's layout.
 *
 * They replace the original innovations.{tsx,css} wireframe, whose page-level
 * CSS (unlayered `*` reset, hardcoded `body` colors, generic class names like
 * `.header`/`.hero`/`.btn`) leaked into every consumer of
 * @gmhlab/blocks/styles.css.
 *
 * Both pages are **record-driven renderers**: they name no innovation.
 * `innovations-types.ts` and `innovation-detail-types.ts` are the contracts a
 * consuming app writes its records against; the records are that app's content
 * — see `apps/web/src/content/` in this repo. */
export * from "./innovations-page"
export * from "./innovations-types"
export * from "./innovation-detail-page"
export * from "./innovation-detail-types"
