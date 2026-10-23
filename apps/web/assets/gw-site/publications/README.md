# Publication covers from the live site

Pulled on 2026-10-23 from <https://www.gwglobalmentalhealth.com/publications>,
which shows one image per work: the venue's cover or masthead (alt text
"Journal logo for respective publication"). Its 19 works use 13 distinct
images. Every file in `originals/` is the **original upload**, fetched from
`https://static.wixstatic.com/media/<id>` with no Wix transform, under its
original filename. Nothing in this folder is served: it is the source of
`apps/web/public/publications/`, and `src/content/publication-covers.ts` maps
journals onto it.

| Original                             | Wix id                                    | Size      | Shipped as                                    | Edit |
| ------------------------------------ | ----------------------------------------- | --------- | --------------------------------------------- | ---- |
| `BJPsychOpen-logo.jpg`               | `d5c560_19a8783253904d2fb89c0ba2a50e5963` | 1080²     | `bjpsych-open.jpg`                            | resized |
| `BMC-logo.jpg`                       | `d5c560_9f9f30df5e734873ab01b48255fa4524` | 400²      | `bmc.jpg`                                     | trimmed |
| `Cambridge-Prisms-logo.jpg`          | `d5c560_6e73c323ccb94c75b7582065dad56d61` | 400²      | `cambridge-prisms.jpg`                        | resized |
| `Frontiers-logo.jpg`                 | `d5c560_6046b58cc4c34140aaefeb61f21a1285` | 400²      | `frontiers.jpg`                               | trimmed |
| `JAD-logo.jpg`                       | `d5c560_b2bd4e842f234e91ad881053089e3f91` | 400²      | `journal-of-affective-disorders.jpg`          | resized |
| `Journal-Adolescent-Health-logo.jpg` | `d5c560_8a12cc19c6fa4ebfbf04598f9751c8c9` | 225²      | `journal-of-adolescent-health.jpg`            | resized |
| `Lancet-logo.jpg`                    | `d5c560_fe5f87d449e44826b1b27d8c899624db` | 400²      | `lancet.jpg`                                  | trimmed |
| `Sci-Reports-Nature.jpg`             | `d5c560_453b243b2e1c4e67b636b21ef2a55dfa` | 1000×625  | `scientific-reports.jpg`                      | squared |
| `Tasmans-logo.jpg`                   | `d5c560_736fc03198e04adb911cbaa26adef698` | 400²      | `tasmans-psychiatry.jpg`                      | resized |
| `Translational-Psych-logo.jpg`       | `d5c560_1e1ace889ea44fbca01930084d249379` | 400²      | `translational-psychiatry.jpg`                | resized |
| `Trends-logo.jpg`                    | `d5c560_c8937b757a09495fb8196b9b3b7b0e42` | 400²      | `trends-in-psychiatry-and-psychotherapy.jpg`  | trimmed |
| `jaacap-logo.png`                    | `d5c560_d802e144a6734e7e945375707d947e52` | 225²      | `jaacap.jpg`                                  | resized, PNG → JPEG |
| `ssm-logo.jpg`                       | `d5c560_bf4351f3e34140a4884cf2b80b2b11e8` | 400²      | `ssm-mental-health.jpg`                       | resized |

Every shipped file is a 192px square JPEG (q85, progressive), 3–10KB. That is
2.6× the largest tile the site draws (4.5rem). The edits, by kind:

- **trimmed**: the four wordmarks on a white ground (BMC, Frontiers, The
  Lancet, Trends) sat small inside a lot of white, which left them illegible
  at tile size. Their white border was cropped to the mark and then padded
  back out to a square with 16% margin on the longer side, in the image's own
  white.
- **squared**: Scientific Reports' upload is a 16:10 masthead. Cropping it to
  a square would cut the wordmark, so it was extended instead: its red
  *nature* bar continued upward and its white ground downward, keeping the
  whole lockup centred.
- **resized**: already square and full-bleed; scaled only.

Two of the images are publisher marks (BMC, The Lancet), and the live site
already uses them across a family of titles; `publication-covers.ts` does the
same and lists the families. If the Center gets the publishers' current cover
art, replace these files — anything ≥192px square works.
