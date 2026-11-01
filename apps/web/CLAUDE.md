@AGENTS.md

# apps/web — content records

The GW Center's records in `src/content/` feed the page blocks (see `packages/blocks/CLAUDE.md`). Each module's header documents its provenance — read it before editing. The bibliography has the strictest conventions:

## `publications-data.ts` is generated data with hand-maintained conventions

It lives in **`apps/web/src/content/`** (it is the Center's bibliography, not
library code — see `packages/blocks/CLAUDE.md`). It is ~5,200 lines and **343
records** (as of 2026-08-13), merging the Center's
own listing with the *full* OpenAlex records of Brandon A. Kohrt and Sauharda
Rai. Google Scholar has no API and blocks scraping, so OpenAlex is the
substitute — don't reach for Scholar. There is **no generator script in the
repo**: the records were produced by throwaway scripts, so anything added by
hand has to match the existing shape exactly. Five conventions, all of which
fail silently:

- **Both author pulls are unwindowed (2015 onward).** Kohrt was originally
  pulled 2023+ and backfilled. Adding a third author means pulling them
  unwindowed too, or the early years quietly become one author's back
  catalogue while the year facet implies a full archive.
- **`slug` is a pure function of `title`**: Unicode-normalise, drop combining
  marks, map every non-alphanumeric run (including en dashes and apostrophes,
  *not* just spaces) to `-`, lowercase, truncate to **70 chars**, strip the
  trailing `-`. An ASCII-fold that *deletes* punctuation instead of mapping it
  reproduces most slugs but silently breaks the handful containing en dashes.
  Verify a change by regenerating all slugs from titles and diffing.
- **`theme` is precedence-ordered keyword matching**, not best-match: maternal →
  stigma → training → measurement → adolescent, falling back to care-delivery.
  Order is load-bearing because titles routinely hit several buckets
  ("stigma reduction *training*"). This order reproduces 96% of the assignments
  that were hand-checked at 119 records; reordering silently reclassifies the
  corpus.
- **Dedupe is by DOI, and the stored value is a full `https://doi.org/…` URL**
  while OpenAlex returns a bare DOI. Comparing the two forms directly matches
  nothing and lets duplicates through — this happened once and added 18. Records
  with no DOI (4 of them) dedupe on a normalised title instead.
- **OpenAlex `type` is filtered, then mapped onto `kind`.** Excluded: preprints
  (published versions are already present), peer-review records, datasets,
  errata, paratext, supplementary materials, conference abstracts. Kept and
  mapped: article/conference-paper → `Article`, review → `Review`,
  book-chapter/reference-entry → `Chapter`, editorial/letter → `Editorial`,
  book → `Book`. OpenAlex venue names need cleaning (`null` for chapters,
  `"Elsevier eBooks"`); resolve the real book title via Crossref rather than
  falling back to `"Unlisted"`.

**`cover` is derived, not stored**: `PUBLICATIONS` is the literal `RECORDS`
mapped through `journalCover()` (`content/publication-covers.ts`), which matches
on `journal` — exact titles plus the BMC, Lancet, Frontiers, Cambridge Prisms
and JAMA families, following the live site's own reuse of those marks. 13 images
are the live /publications page's uploads (originals and crop notes in
`apps/web/assets/gw-site/publications/`); 27 more (2026-10-28) cover every other
venue with 2+ works, from publisher cover CDNs and PMC mastheads (sources, edits
and the four venues still missing in `apps/web/assets/publication-covers/`).
**Look for a real cover before leaving a venue on the book glyph.** `PublicationCover` (exported from
blocks) renders the cover or, with none, the kit's `publication` (book) glyph on a flat tile — one stand-in for every record, not the theme glyph, which the row already shows; callers
size it with `--publication-cover-size`. A new journal image means a file in
`public/publications/` plus a mapping line, never a field on the records.

Titles never end in a period (APA venues include one), `authors` holds at most
six names with the true total in `authorCount`, and the array is sorted **date
descending** — the page relies on that order. `citations`/`openAccess` are
point-in-time and never re-fetched at runtime.

## Workspace records (`dashboard-*.ts`, `equip-training.ts`)

The member workspace's content (see "The member workspace" in the root
`CLAUDE.md`). Each header documents provenance; in short, **nearly all of it is
demo**: storefront prices (no payment is taken), the noticeboard, the EQUIP
Academy lessons, quizzes and role-play transcript (invented, modelled on the
public EQUIP platform, shown with `EQUIP_DEMO_NOTE`), and the handbook outline.
Project rooms are **derived from `PROJECTS`**, so a new project gets a room; their
resources have no files yet. Never put invented copy under a real person's name.
**Every `TEAM` person has an account** (`workspace-demo-accounts.ts`, seeded
into core's mock store by `configureMockWorkspace` in `data-providers.tsx`)
owning their public profile (`profileSlug`), so `/team` shows each person's
approved profile over their record. Tiers follow the team group (core →
staff, Brandon Kohrt → admin, affiliates with a project → partner, students
and alumni → member). The demo sign-ins are Farhana Alam, Laure Experton,
Ruta Rangel and Brandon Kohrt. Profile fields start from `TEAM`; emails are
`demo.gmhlab.org` addresses. Bump `SEED_ID` when the seed changes, or
browsers keep their stored copy.

`workspace-images.ts` lists the workspace's photographs: nine **Unsplash
stock** images (photographer, place and source page for each), shipped from
`public/workspace/` at 1600px. Same rule as the team page's stock photo: never
caption one as anyone at the Center or as a Center project. **The EQUIP
courses use the community set** (Brazil helping skills, Nepal group session,
Nagpur field discussion; the Nepal home visit behind the EQUIP hero) — the
user's choice after a clinical/training set was tried and reverted; that set
is kept unused in the same file. No hardship or "traditional dress" imagery.
Replace them all with the lab's own consented photos when those exist.
