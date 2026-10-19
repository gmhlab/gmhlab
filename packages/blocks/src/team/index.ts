/* The team page and the "People" strip the detail pages reuse. A
 * **record-driven renderer**: it names no one. `team-types.ts` is the
 * contract a consuming app writes its people against; the records are that
 * app's content — see `apps/web/src/content/team-data.ts` in this repo. */
export * from "./team-page"
export * from "./team-types"
