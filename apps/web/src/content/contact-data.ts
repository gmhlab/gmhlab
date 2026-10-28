/**
 * The GW Center for Global Mental Health contact page: the inquiry routes,
 * the address, and the reply-time promise.
 *
 * Sourced from the live site, captured 2026-10-27:
 *
 *   - **Routes.** The live /contact page is one undifferentiated form (Name,
 *     Email, Message). The five routes here are the reasons people write to
 *     the Center, and each route's `offers` come from the live /about page's
 *     own lists — "Areas of Research", "Capacity Building" and "Consultation"
 *     — redistributed under the route they answer. Nothing is offered here
 *     that the About page does not list, except where noted below.
 *   - **Address.** 2120 L St NW, 6th Floor, Washington, DC 20037 — the live
 *     contact page's "Where we're located".
 *   - **Affiliation.** The GW School of Medicine and Health Sciences
 *     (Department of Psychiatry and Behavioral Sciences) — confirmed
 *     2026-10-28; it is *not* the Milken Institute School of Public Health.
 *     The utility bar and footer say the same.
 *   - **Email.** Not set here: the page uses `GMH_CONTACT_EMAIL`
 *     (globalmh@gwu.edu, the Center's new official address as of 2026-10-28;
 *     every live page still shows info@gwglobalmentalhealth.com). The
 *     live envelope link pre-filled the subject "Stronger Together:
 *     Advocating for Mental Health Worldwide" — a campaign title that made
 *     every email look like a reply to it. The page now sets the subject
 *     from the route the sender chose (`subject`, defaulting to `label`).
 *
 * Open questions for the Center — each one is a guess until confirmed:
 *
 *   - **The Center's name.** Kohrt's bio and the About page say "Center for
 *     Global Mental Health *Equity*"; the crest, the footer © line and the
 *     site title drop "Equity". The address block uses the crest's name.
 *   - **Reply time.** `CONTACT_REPLY_TIME` is a placeholder the Center has
 *     not committed to. It is a promise to every sender — confirm the number
 *     or drop the prop, which removes the line.
 *   - **Routing.** Each inquiry carries its route's `id` as `topic`, so the
 *     contact service can deliver EQUIP requests and press requests to
 *     different people. Which inbox handles which route is the service's
 *     configuration (`components/data-providers.tsx`), not this file's —
 *     today every route goes to globalmh@gwu.edu (`app/api/contact`).
 *   - **EQUIP "licensing".** EQUIP is distributed free by WHO, so the route
 *     says "training and support" rather than licensing.
 *   - **Students and jobs.** The About page lists courses and early-career
 *     development; it does not say whether the Center hosts visiting
 *     scholars. The route is worded as an enquiry, not an offer.
 */

import type { ContactLocation, ContactTopic } from "@gmhlab/blocks";

export const CONTACT_TOPICS: ContactTopic[] = [
  {
    id: "research",
    label: "Research collaboration or partnership",
    glyph: "community",
    summary:
      "We design, adapt and evaluate mental health care with partners in more than 25 countries, from validating tools to running trials.",
    offers: [
      "Cultural adaptation and validation of mental health tools and interventions",
      "Evaluation of mental health provider competency",
      "Reduction of mental health stigma",
      "Passive sensing technology in mental health care",
      "Involving people with lived experience in intervention design",
    ],
    links: [
      { label: "Our projects", href: "/projects" },
      { label: "Publications", href: "/publications" },
    ],
    prompt:
      "Tell us about your setting, your partners and the question you want to answer — and the funding call or timeline, if there is one.",
    organization: "required",
    subject: "Research collaboration",
  },
  {
    id: "equip",
    label: "EQUIP training and support",
    glyph: "competency",
    summary:
      "We lead trainings worldwide on assessing provider competency with EQUIP, the WHO and UNICEF platform, and advise teams putting it to use.",
    offers: [
      "Trainings on assessing provider competency with EQUIP",
      "Consultation on using the EQUIP platform",
      "Adapting competency tools to your setting",
    ],
    links: [{ label: "About EQUIP", href: "/innovations/equip" }],
    prompt:
      "Tell us who you train — their role and roughly how many — where you work, and whether you already use EQUIP.",
    organization: "required",
    subject: "EQUIP training and support",
  },
  {
    id: "people",
    label: "Visiting scholars, students or jobs",
    glyph: "young-people",
    summary:
      "We teach and mentor early-career researchers, especially from low- and middle-income countries.",
    offers: [
      "Global mental health courses in LMIC settings",
      "Networking and professional development for early-career LMIC researchers",
    ],
    links: [{ label: "Meet the team", href: "/team" }],
    prompt:
      "Tell us about your background, what you’d like to work on, and when. If you’re asking about a posted role, name it.",
  },
  {
    id: "media",
    label: "Media and speaking",
    glyph: "lived-experience",
    summary:
      "Our researchers speak on global mental health, stigma, and building care where specialists are scarce.",
    links: [{ label: "Recent publications", href: "/publications" }],
    prompt: "Tell us your outlet, the story or event, and your deadline.",
    subject: "Media request",
  },
  {
    id: "other",
    label: "Something else",
    glyph: "care-delivery",
    summary:
      "Not sure where it fits? Write to us anyway, and we’ll find the right person.",
    prompt: "How can we help?",
    subject: "Website enquiry",
  },
];

export const CENTER_LOCATION: ContactLocation = {
  name: "Center for Global Mental Health",
  affiliation: [
    "Department of Psychiatry and Behavioral Sciences",
    "School of Medicine and Health Sciences",
    "The George Washington University",
  ],
  address: ["2120 L St NW, 6th Floor", "Washington, DC 20037", "United States"],
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=2120+L+St+NW+Washington+DC+20037",
};

/** Unconfirmed — see the header. */
export const CONTACT_REPLY_TIME = "We aim to reply within three business days.";
