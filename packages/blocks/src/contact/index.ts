/* The contact page: a care notice, one card per inquiry route, and the form.
 * A **record-driven renderer** like the other page blocks — the routes, the
 * address and the reply-time promise are the consuming app's content (see
 * `apps/web/src/content/contact-data.ts`). The form is exported on its own
 * because ContactPage takes it as a slot: it needs a send function, and page
 * blocks take no function props. */
export * from "./contact-page"
export * from "./contact-form"
export * from "./contact-types"
