# EQUIP "How do I use it?" illustrations from the live site

Pulled on 2026-10-23 from the **"How do I use it?"** section of
<https://www.gwglobalmentalhealth.com/innovations/equip>. That page is a Wix
embed of an earlier build of this repo, so the files are served from
`https://gmhlab.github.io/monorepo/<name>.png`; each is the original upload,
under its original filename. Nothing in this folder is served: it is the
source of `apps/web/public/innovations/equip/`.

The section has five steps; the rebuilt EQUIP page's cycle has four, so four
illustrations are used, matched by meaning rather than position:

| Original        | Size      | Live step                                     | Used under                   |
| --------------- | --------- | --------------------------------------------- | ---------------------------- |
| `rate.png`      | 2048²     | 3 · Rate — check off the observed behaviors   | 1 · Baseline Assessment      |
| `feedback.png`  | 2048²     | 5 · Feedback — give competency-based feedback | 2 · Targeted Training        |
| `observe.png`   | 2048²     | 2 · Observe — watch provider sessions         | 3 · Supervised Practice      |
| `visualize.png` | 2048²     | 4 · Visualize — generate charts and graphs    | 4 · Ongoing Evaluation       |
| `prepare.png`   | 2048²     | 1 · Prepare — set up your team on the platform | not used (shipped, unreferenced) |

All five are shipped as **720×720 WebP** (q88, 18–31KB, down from ~3MB PNGs).
That is 3× the 15rem (240px) tile the page draws them in. The navy and gold
ink is untouched; the edits are to the ground and the framing:

- **Ground cleaned.** The grounds were a noisy off-white (values 237–255 with
  faint tints), which shows as a blotchy square on a white tile. Every
  near-white, near-grey pixel (all channels ≥ 232, spread ≤ 12) was set to
  pure white. The tile is white in both modes, so the illustration's ground
  and the tile are one surface.
- **Art sized to match.** The drawings sit at different sizes in their
  squares: `feedback.png` has its own white margin, `observe.png` and
  `prepare.png` run to the edges. Side by side, that made some steps look
  bigger than others. Each was trimmed to its ink and re-centred on a white
  square so the art's longer side is 88.5% of it, `feedback.png`'s own
  proportion. Ink means a darkest channel below 160 (navy is ~29, gold ~80),
  so stray specks do not count: `visualize.png` has a grey smudge in its
  top-left corner, which is whitened along with everything outside the ink.

The page adds a further 12% padding inside each tile (`innovation-detail-page.css`).

The live page gave all five the same alt text ("Trainer reviewing materials
with a mental health worker"), which is wrong for four of them; the records
describe each one.

To re-make the shipped files, start from these originals, not from the WebPs.
