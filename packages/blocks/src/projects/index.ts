/* projects-page.{tsx,css} is the GW Center for Global Mental Health projects
 * index, built on the @gmhlab/ui layouts/compositions/primitives — the sibling
 * of `../innovations`. Page content only: the site header and footer come from
 * the consuming app's layout.
 *
 * `projects-data.ts` is exported alongside it so a detail page, a search index
 * or a home-page teaser can read the same portfolio rather than restating it.
 *
 * project-detail-page.{tsx,css} is the detail-level counterpart: one component
 * that renders any `ProjectDetail` record from `project-detail-data.ts`. It
 * names no project, so a second project is a new record rather than a new
 * component.
 */
export * from "./projects-page"
export * from "./projects-data"
export * from "./project-detail-page"
export * from "./project-detail-data"
