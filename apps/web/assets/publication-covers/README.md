# Publication covers sourced beyond the live site

The live site's 13 images (`../gw-site/publications/`) cover 13 venues. On
2026-10-28 every other venue with two or more works in `PUBLICATIONS` was
given its own image. Nothing in this folder is served: `originals/` holds each
download untouched, `apps/web/public/publications/` holds the shipped 192px
squares (JPEG q85, progressive, same as the live-site set), and
`src/content/publication-covers.ts` maps journals onto them.

## Where each came from

**Publisher cover CDNs** (the current issue's real cover; these hosts answer a
plain request even where the journal site is behind Cloudflare):

| Original | Source |
| -------- | ------ |
| `social-science-and-medicine.jpg` | `ars.els-cdn.com/content/image/X02779536.jpg` |
| `brain-behavior-and-immunity.jpg` | `ars.els-cdn.com/content/image/X08891591.jpg` |
| `brain-behavior-and-immunity-health.jpg` | `ars.els-cdn.com/content/image/X26663546.jpg` |
| `biological-psychiatry.jpg` | `ars.els-cdn.com/content/image/X00063223.jpg` |
| `journal-of-psychiatric-research.jpg` | `ars.els-cdn.com/content/image/X00223956.jpg` |
| `psychoneuroendocrinology.jpg` | `ars.els-cdn.com/content/image/X03064530.jpg` |
| `behaviour-research-and-therapy.jpg` | `ars.els-cdn.com/content/image/X00057967.jpg` |
| `culture-medicine-and-psychiatry.png` | `media.springernature.com/full/springer-static/cover-hires/journal/11013` |
| `academic-psychiatry.png` | `…/cover-hires/journal/40596` |
| `european-child-and-adolescent-psychiatry.png` | `…/cover-hires/journal/787` |
| `community-mental-health-journal.png` | `…/cover-hires/journal/10597` |
| `epidemiology-and-psychiatric-sciences.jpg` | the journal page's `og:image` on `static.cambridge.org/covers/EPS_0_0_0/` |
| `british-journal-of-psychiatry.jpg` | the same, `static.cambridge.org/covers/BJP_0_0_0/` |

The Elsevier id is `X` + the print ISSN without its hyphen; the Springer id is
the journal number in its `link.springer.com/journal/<n>` URL.

**PubMed Central mastheads** (`cdn.ncbi.nlm.nih.gov/pmc/banners/logo-<abbr>`,
500×75, saved as `pmc-<abbr>`): `bmjgh`, `bmjmh`, `bmjopen`, `plosone`,
`plosmed`, `plosgph`, `plosmh`, `resprot` (JMIR Research Protocols),
`amjph`, `brazjpsych`, `clinpsycheur`, `worldpsych` (GIF), and `jamasd`, the
JAMA Network mark that PMC shows on every JAMA title. A journal's abbreviation
is in the banner `<img>` of any of its PMC article pages. Not every guessable
abbreviation is the journal you want: `logo-bjp` is the *British Journal of
Pain* and `logo-irp` is *Implementation Research and Practice*.

**MDPI**: `mdpi-ijerph-logo.png` is `mdpi-res.com/img/journals/ijerph-logo.png`
(650×140), sharper than PMC's banner.

## Edits

- **Covers**: scaled to 192 wide and cropped to the top square, where the
  title sits. *Epidemiology and Psychiatric Sciences* sets its title low, so it
  is centre-cropped instead.
- **Mastheads**: cropped to the journal's own mark, trimmed, then padded to a
  square with 16% margin in the banner's ground colour (sampled from its
  top-right pixel), as the live-site wordmarks were. The crops drop PMC chrome
  and neighbours: *BMJ Open*'s "Visit the journal" slab, *JAMA*'s "Click to view
  article" bar, *IJERPH*'s MDPI mark, the APHA strap and tagline (only the
  *AJPH* nameplate is kept), *Brazilian J Psychiatry*'s association and access
  notes, *CPE*'s PsychOpen mark, *World Psychiatry*'s WPA emblem, the PLOS
  banners' coloured frame, and *JMIR Research Protocols*' tagline (painted out
  in the ground colour, since it sits under the title beside the emblem).
  *Clinical Psychology in Europe*'s own site cover is only 148×210, below the
  tile's 192, so its masthead is used.

## Not found

Cloudflare's "verify you are human" check blocks both scripts and the browser
on psychiatryonline.org, Wiley Online Library, Taylor & Francis and bmj.com, and
PMC shows no masthead for these journals. Still on the glyph, by record count:
*Psychiatric Services* (APA, 7), *Early Intervention in Psychiatry* (Wiley, 2),
*International Review of Psychiatry* (T&F, 2), *International Journal of
Culture and Mental Health* (T&F, ceased, 2). A cover saved by hand from the
journal's page drops straight in: put the original here, the 192px square in
`public/publications/`, and add a mapping line.
