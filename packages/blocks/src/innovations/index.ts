/* innovations-page.{tsx,css} is the Innovations page built on the @gmhlab/ui
 * layouts/compositions/primitives. Page content only — the site header and
 * footer come from the consuming app's layout.
 *
 * It replaces the original innovations.{tsx,css} wireframe, whose page-level
 * CSS (unlayered `*` reset, hardcoded `body` colors, generic class names like
 * `.header`/`.hero`/`.btn`) leaked into every consumer of
 * @gmhlab/blocks/styles.css. Both are deleted; innovations.html is kept as the
 * reference render of the original design. */
export * from "./innovations-page"
/* The detail-level counterpart, rebuilt from
 * `.files/gw-innovation-detail-wireframe.html` on the same terms. */
export * from "./innovation-detail-page"
