# Project graphics from the live site

Pulled on 2026-10-23 from <https://www.gwglobalmentalhealth.com/projects> and
the eleven project pages under it. Every file is the **original upload**,
fetched from `https://static.wixstatic.com/media/<id>` with no Wix transform,
under its original filename where Wix kept one. Nothing in this folder is
served: it is the source of what is in `apps/web/public/projects/`.

## `marks/` — square logos (shipped)

From each project page. These are what the site renders, as
`public/projects/<slug>.png` (`Project.logo` in `src/content/projects-data.ts`; `equip.png` is also the EQUIP innovation's `logo` in `innovations-data.ts` and `innovation-detail-data.ts`).

| Project      | Original                  | Wix id                              | Shipped as        |
| ------------ | ------------------------- | ----------------------------------- | ----------------- |
| ALIVE        | `Alive-Logo-sq.png`       | `d5c560_7ebfaa6193fb4d22b59de47c781b114d` | unchanged   |
| EQUIP        | `EQUIP-logo-sq.png`       | `d5c560_e849f959e41443d7b8434d159fa54800` | unchanged   |
| EQUIP-SU     | `EQUIP-SU-Logo-sq.png`    | `d5c560_4c9fac22ce334da4b2119e13270e7171` | unchanged   |
| HOPE         | `HOPE-logo-sq.png`        | `d5c560_80e9897535b64acbbebefdc7da1a042d` | unchanged   |
| IDEA         | `IDEA-logo-sq.png`        | `d5c560_8d2000475dd74f26a37416fbe3e175d5` | unchanged   |
| RECOUP-NY    | `RECOUP-NY-Logo-sq.png`   | `d5c560_7c8f666e70ed41329610e01ccd6d0ff0` | unchanged   |
| RESHAPE      | `RESHAPE-logo-sq.png`     | `d5c560_3a88447b9eec4fae9c13a0afa685fb69` | unchanged   |
| RESTORE      | `RESTORE-logo-sq.png`     | `d5c560_fbd537363e1e43afb90ba2b1fad2de4a` | background cleared |
| SCAPE-U      | `SCAPE-U-logo-sq.png`     | `d5c560_3a4c871fb4574bf4b4bd2684f36c2ff4` | unchanged   |
| StandStrong  | `StandStrong-logo-sq.png` | `d5c560_42bc0af86c7f45f0bae232bd88d1ada3` | unchanged   |
| UNICEF MMAPP | `UNICEF-MMAP-logo-sq.png` | `d5c560_8edd9a7c841c417c8e5f4cc243e95af7` | unchanged   |

The uploads are only ~304px square, which is already 2× the largest size the
site draws them (8rem), so they ship at their original size — re-encoding them
smaller made most files *larger*. The one edit: RESTORE's upload has an opaque
`#f7f7f7` square behind the mark where the others are transparent, so the
shipped copy has that background flood-filled to transparent from the edges
(the mark's own light tones are untouched).

If the Center has larger or vector originals, replace these — anything over
~256px square, transparent background, is enough.

## `wide/` — index-card logos (not shipped)

The 16:9 versions from the projects index (same marks, letterboxed; ALIVE's is
the wordmark alone). Kept for reference; the rebuilt cards use the square mark.

## `partners/` — funder and partner logos (not shipped)

From the project pages' partner panels: WHO, UNICEF, World Bank, King's College
London, TPO Nepal, GW, Wits Health Consortium, The Carter Center, Global Mental
Health Peer Network, Georgetown, Makerere, War Child, and the You Belong
campaign. Filenames are ours (the uploads are unnamed).

Not on the site. They are other organisations' marks, and WHO's and UNICEF's
emblems in particular have usage rules that need the organisation's permission.
The pages show these partners as word marks instead (`PROJECT_PARTNERS`).
