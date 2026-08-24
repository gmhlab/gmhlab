/* The projects index and detail pages, built on the @gmhlab/ui
 * layouts/compositions/primitives — the sibling of `../innovations`. Page
 * content only: the site header and footer come from the consuming app's
 * layout.
 *
 * Both pages are **record-driven renderers**: they name no project and hold no
 * portfolio. `projects-types.ts` and `project-detail-types.ts` are the
 * contracts a consuming app writes its records against, together with the pure
 * helpers that read them. The records are that app's content — see
 * `apps/web/src/content/` in this repo.
 *
 * Adding a project detail page is adding a record plus a one-line route
 * wrapper, never editing a component. */
export * from "./projects-page"
export * from "./projects-types"
export * from "./project-detail-page"
export * from "./project-detail-types"
