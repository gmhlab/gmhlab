# CLAUDE.md — packages/blocks

This file provides guidance to Claude Code (claude.ai/code) when working in `packages/blocks`. Repo-wide rules (build order, `dist/` consumption, the fixed brand) are in the root `CLAUDE.md`.

The record-driven page blocks. Their records live in `apps/web/src/content/` (see `apps/web/CLAUDE.md`); `apps/docs/src/fixtures/sample-content.ts` is the synthetic corpus that proves each block is library code.

## The shape every page block shares

These are full GW Center for Global Mental Health pages, rebuilt from the live
site onto the design system. They share one deliberate shape — follow it when
adding a fourth:

- **The content is not in this package.** `@gmhlab/blocks` is published
  publicly, and one organization's portfolio and bibliography are not library
  code. Every page here is a **record-driven renderer**: it takes its records as
  props and names no project, publication or innovation. The records live in
  **`apps/web/src/content/`**. This split is what keeps the package generic —
  it also cut the blocks bundle from 408KB to 161KB.
- **Three files per page**: `<name>-page.tsx`, a co-located `<name>-page.css`,
  and a `<name>-types.ts` holding the *contract* — the record types plus the
  pure helpers that read them (`projectSearchText`, `resolvePublicationRefs`,
  `resolveRelatedProjects`). All are exported from the barrel, so the consuming
  app writes its records against them.
- **Page content only.** No header or footer — the site chrome belongs to
  `apps/web`'s layout (see "The `apps/web` app shell" in the root `CLAUDE.md`).
- **CSS is scoped under a page-level class** (`.projects-page`, …) and uses only
  uniquely-prefixed class names. The deleted `innovations.css` leaked a `*`
  reset and generic names like `.header`/`.btn` into every consumer of
  `@gmhlab/blocks/styles.css`; don't reintroduce that.
- **Links are prop-driven, not hardcoded** — `ProjectsPage` takes a `basePath`
  so the block travels with whatever site mounts it. If you move a route in
  `apps/web`, update the `basePath` passed at the call site.
- **Copy defaults to the GW Center's, and is always overridable.** This is a
  deliberate attribution choice (2026-10-18): other teams adopt these blocks,
  and they should see whose work they are building on. Structural labels
  ("Objectives and measures", "How It Works", "Funders & partners") are fixed;
  copy in the Center's voice comes from `shared/gmh-copy.ts` and follows one
  rule — **omit the prop for the Center's wording, pass a value to replace it,
  pass `null` to drop the section.** Index pages take `title`, `subtitle`,
  `cta: PageCta | null` and extras (`partnersSubheading`, `listHeading`,
  `listSubheading`, `centerBadge`); a `ProjectDetail` record's `cta` defaults
  to `gmhProjectDetailCta(detail)` (which adds "Contact the project" when
  `contact` is set). Keep every new copy default in `gmh-copy.ts`, never inline
  in a page, so the Center's voice stays in one auditable place.
  **Never default a factual claim about a dataset**: `PublicationsPage`'s
  `note` (the Kohrt/Rai provenance line) has no default, because it would be
  false over another team's records — `apps/web` passes `PUBLICATIONS_NOTE`.
  Every link must be overridable: a hardcoded GW mailto with no prop once
  lived in the project detail page. No function-valued props: `apps/web`
  route files may become server components, which cannot pass functions to
  the `"use client"` blocks bundle.
- **Faceted filtering convention**: counts for each facet are computed against
  the *other* active facets (never the whole set), and zero-count options are
  rendered `disabled`, so a chip can never advertise a number and land on an
  empty list. The active option stays enabled so a filter is always reversible.
- **Data provenance is documented in each content module's header** (in
  `apps/web/src/content/`), including which fields are derived rather than
  sourced. Read that header before touching the records — it is the spec, and it
  carries detail this file does not repeat.
- **An index page derives nothing at module scope.** Search indexes, facet
  lists and stat strips are `useMemo`d on the records prop, because the corpus
  is no longer a module-level constant. A new derived value goes in a memo keyed
  on the records, never at file scope.

### The project *detail* page is one component driven by records

`projects/project-detail-page.{tsx,css}` renders a `ProjectDetail` record (the
type lives in `project-detail-types.ts`) and **names no project**. Adding a
project detail page is adding a record in `apps/web/src/content/` plus a route
wrapper — never editing the component. `RESHAPE_DETAIL` is the first instance
and the reference to copy.

The same is true of `innovations/innovation-detail-page.{tsx,css}`, which was
converted to this shape at the same time; `EQUIP_DETAIL` is its first record.

The record models a **study protocol** (arms, objectives ranked
primary/secondary with their instruments, a two-track assessment schedule,
eligibility criteria), because that is what these projects actually are. Every
field except the identity block is optional and each section is conditional on
its data, so a platform project with no eligibility criteria renders no
eligibility section rather than an empty heading.

Four things worth knowing before extending it:

- **Publications are slugs into `PUBLICATIONS`, not restated citations.**
  `resolveProjectPublications(detail, publications)` resolves them at render
  time against the bibliography passed in as a prop, so journal, DOI, citation
  count and open-access status come from the real records. The
  per-slug `note` records what a work *is* to the project ("Trial protocol") —
  a relationship the bibliography does not carry. Unknown slugs are dropped,
  so a typo shortens the list rather than breaking a row.
- **Related projects are slugs into `PROJECTS`**, and a card only renders a
  link when its slug is in the `detailSlugs` prop (the app passes
  `PROJECT_DETAIL_SLUGS`). Ten of the eleven projects have no detail record
  yet; linking them all would ship ten 404s. `InnovationsPage` uses the same
  prop for the same reason.
- **The timeline is chronological across both tracks, not grouped by track.**
  That ordering is the point — it shows patient enrollment opening while
  providers are still being reassessed. Timepoint codes (T0, T1, …) are the
  protocol's own nomenclature; `phase` entries carry no code because nothing is
  measured at them.
- **The desktop timeline must not use `display: contents`** on the entry
  wrapper — sparse grid auto-flow then pushes each card one row below its own
  timepoint chip. The media query documents this inline; keep each entry as its
  own three-column grid.

Two more records exist since 2026-10-28 — `UNICEF_MMAP_DETAIL` (a validation
study) and `EQUIP_PROJECT_DETAIL` (a development programme) — and they changed
the contract in ways that matter for the next one:

- **Timeline tracks are placed by their order in `tracks`, never by `id`.**
  The CSS used to key on RESHAPE's `provider`/`patient` ids, so every other
  record's timeline lost its colours and stacked on one side. One track renders
  as a single left rail. A `point` with no `code` is a dated milestone (a dot);
  never invent T-numbers a source does not use.
- **`Objective.rank` is optional.** Omit it when the source does not rank its
  objectives; the section then stops calling the ranks the protocol's.
- **`findings`** renders published results as a "What it found" brand band,
  each card citing a bibliography slug (`source`, fail-soft like
  `publications`). Only published numbers go here.
- **Published work shows the first three works the record lists**, with the
  rest behind a "Show all N" disclosure — so order each record's
  `publications` most-important first (protocol / development paper).
- Section copy that assumed a trial is overridable per record (`armsLabel`,
  `objectivesNote`, `timelineHeading`, `timelineNote`, `eligibilityNote`,
  `findingsNote`).

The EQUIP project page is the research; the platform as a product is the
innovation page (`EQUIP_DETAIL`). They link to each other — keep content on
its own side.

A design-system trap this page hit, which fails silently (a second one —
the default border matching the neutral band — was retired by the 2026-10-07
re-skin; the `border-default-secondary` call sites it left are still fine): grid children of a `Flex container` need
`min-width: 0`, since flex items default to `min-width: auto` and let a grid
push the whole page into horizontal scroll.

### The contact page (`contact/`)

`ContactPage` is contact-as-pitch: a care notice (not a care provider; 988
call/text, findahelpline.com, emergency number) pulled up over the hero so
it is read first, one card per `ContactTopic` saying what the Center offers
under that route, then the form on a brand band beside the address and a
direct email. **Never ship it without the care notice** unless the
organization really is a care provider — people in distress land on contact
pages. Its copy default is `GMH_CONTACT_COPY.careNotice`.

- **The form is a slot, not a prop function.** `ContactForm` needs a send
  function, and page blocks take none, so the app wraps it
  (`apps/web/src/components/site-contact-form.tsx`, `useContact().send`) and
  passes the element as `form`. The page shares the topics, chosen route,
  `replyTime` and email with it through an internal context.
- **The chosen route is shared and deep-linkable.** A card's "Write to us
  about this" chooses the route, scrolls to `#contact-form` and focuses the
  chip; `?topic=<id>` does the same on load. `GMH_INNOVATIONS_COPY`'s CTA
  links `/contact?topic=equip#contact-form`. The direct email and the
  failure fallback take the route as their subject (`contactMailto`), and the
  fallback carries the typed message, so a failed send loses nothing.
- **Routing is the service's job.** `ContactInquiry.topic` is the route id;
  which inbox gets which route belongs in the `ContactService`, set in
  `data-providers.tsx`. In `apps/web` that is `siteContactService`
  (`components/site-services.ts`), which POSTs to `app/api/contact`; that
  route emails every route to globalmh@gwu.edu through Resend
  (`src/server/mail.ts`, needs `RESEND_API_KEY` + `MAIL_FROM`). The newsletter
  signup does the same via `app/api/newsletter`. The docs app keeps the mocks
  (`error@example.com` demos the failure state).
- **`replyTime` has no default** — a promise only the inbox owner can make.
  `apps/web/src/content/contact-data.ts`'s header lists what is still
  unconfirmed: the reply time and the Center's exact name. The affiliation is
  settled: the GW **School of Medicine and Health Sciences** (Psychiatry and
  Behavioral Sciences), **not** the Milken Institute School of Public Health —
  the address block, utility bar and footer all say SMHS.

### The team page (`team/`)

`TeamPage` renders `Person` records (`team-types.ts`) in four groups — core,
affiliate, student, alumni — with **one person format**: credentials inline
after the name, `location` meaning *where they are based* (never nationality),
alt text = the name. A person with no `photo` gets an initials monogram; there
is deliberately no fallback image, because the live site's alumni photos were
Wix stock standing in for real people. Bios expand in place (`<details>`),
with selected publications resolved by **exact** `authorNames` match against
the bibliography (surname matching ties people to namesakes — "de Jong" in
`PUBLICATIONS` is Joop, not Ruth). `PeopleSection` + `projectPeople()` give
the project and innovation detail pages their People strip (pass `people` and
`teamHref`), so project ↔ person links run both ways. `team-data.ts`'s header
lists every correction made against the live site and every open question.

### The GW landing page (`home/`)

`HomePage` takes one `HomeContent` record (`home-types.ts`); every section after
`hero`/`stats` is optional and conditional on its record. `apps/web/src/content/home-data.ts`
**derives every figure** (stat band, per-theme publication counts on the cards,
the funder wall) from `PROJECTS`/`PUBLICATIONS` — don't type numbers in. The one
sourced figure (the care-gap field, 24 of 100) carries its WHO citation on the
page. The live site deliberately has **no pull quote**: the reference's quote is
unattributed design copy and must not be put under a real GW role; the docs demo
exercises that section with the synthetic institute. Placeholder photos have
`alt=""` because describing a random picsum scene would be false.

Motion is progressive and server-safe: `useReveal` marks on-screen elements
visible *before* enabling the hidden state, and `StatsCard countUp` only counts
cards that mount below the fold, so SSR HTML never blinks to 0. Everything is off
under `prefers-reduced-motion`.

New ui pieces it introduced, all reusable: `TextEyebrow`, `TextBlockquote`, the
`eyebrow` prop on `TextContentHeading`/`TextContentTitle`, `Image treatment="duotone"`
(navy shadows, gold highlights), `Button`/`Badge` `variant="accent"`,
`Section variant="tint"`, the restyled `StatsCard`, and the brand-band gold glow
on every `Section variant="brand"`.
