/* publications-page.{tsx,css} is the GW Center for Global Mental Health
 * publications index, built on the @gmhlab/ui layouts/compositions/primitives
 * — the sibling of `../projects` and `../innovations`. Page content only: the
 * site header and footer come from the consuming app's layout.
 *
 * `publications-data.ts` is exported alongside it so a project detail page or
 * a home-page teaser can read the same record rather than restating it. That
 * file's header documents where the data comes from and what is derived. */
export * from "./publications-page"
export * from "./publications-data"
