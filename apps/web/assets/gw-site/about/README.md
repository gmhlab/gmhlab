# About-page photographs from the live site

Pulled on 2026-10-25 from <https://www.gwglobalmentalhealth.com/about>. The
home page's "How we work" section ships them as `public/home/*.jpg`, each set
beside the pillar the about page set it beside.

The originals are **not** kept here — they are 3–20MB each (up to 7270px
wide). Re-fetch one from `https://static.wixstatic.com/media/<id>` with no
Wix transform.

| Shipped as              | About-page pillar | Wix id                                         | Live alt text |
| ----------------------- | ----------------- | ---------------------------------------------- | ------------- |
| `research.jpg`          | Areas of Research | `nsplsh_d6898d915f964da2bd83cec525cf496a~mv2.jpg` | "People playing carom ball in Nepal" |
| `capacity-building.jpg` | Capacity Building | `nsplsh_34702587c10e4d77811c44df2c268cda~mv2.jpg` | "Mental health worker dancing in a circle with children in Nepal" |
| `consultation.jpg`      | Consultation      | `11062b_569d42f6215f4a86a9b15e094153ef07~mv2.jpg` | "Man consulting and presenting to a group of mental health professionals" |

Each was resized to 1100px on the long edge (JPEG quality 70) with `sips`;
there is no other edit. The section crops them to 4:5 in CSS.

**These are stock, not Center fieldwork.** `nsplsh_` is Wix's Unsplash
library and `11062b_` is Wix's own free media. Don't caption them as Center
projects or as a place — the live alt text says Nepal, but nothing in the
photos confirms it — which is why the rebuilt site gives them descriptive alt
text and no caption. Replace them with the Center's own photographs when it has
them; anything over ~900×1125px works.

The page's 12 partner logos are not taken, for the reason given in
`../projects/README.md` (other organisations' marks); most are already in
`../projects/partners/`. The headshots are the team page's.
