/* The publications index, built on the @gmhlab/ui
 * layouts/compositions/primitives — the sibling of `../projects` and
 * `../innovations`. Page content only: the site header and footer come from
 * the consuming app's layout.
 *
 * The page is a **record-driven renderer** and holds no bibliography.
 * `publications-types.ts` is the contract a consuming app writes its records
 * against, plus the search helper and the reference resolver that detail pages
 * use to turn slugs into real citations. The records are that app's content —
 * see `apps/web/src/content/` in this repo. */
export * from "./publications-page"
export * from "./publications-types"
