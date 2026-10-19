import type { PageCta } from "./page-copy";

/**
 * The GW Center for Global Mental Health's own copy — the default voice of
 * every page block in this package.
 *
 * @gmhlab/blocks is GMH Lab's design system, and teams that adopt it should be
 * able to see whose work they are building on, so the blocks render the
 * Center's wording unless told otherwise. Each copy prop follows one rule:
 *
 *   - omit it      → the Center's default, from this file
 *   - pass a value → your own copy replaces it
 *   - pass `null`  → the section or line is not rendered
 *
 * Kept out of the defaults on purpose: anything that makes a factual claim
 * about a specific dataset (the publications page's provenance `note`), since
 * it would be false when rendered over another team's records.
 */

export const GMH_CONTACT_EMAIL = "info@gwglobalmentalhealth.com";

const emailTheCenter = {
  label: "Email the Center",
  href: `mailto:${GMH_CONTACT_EMAIL}`,
};

export const GMH_PROJECTS_COPY = {
  subtitle:
    "Research and implementation initiatives building mental health care that works where specialists are scarce — from cluster-randomized trials to a global training platform.",
  partnersSubheading:
    "The organizations funding and delivering this work alongside the Center",
  cta: {
    heading: "Looking to collaborate?",
    body: "We partner with universities, ministries, and community organizations to adapt, deliver, and evaluate mental health care in low-resource settings.",
    actions: [
      emailTheCenter,
      { label: "Read our publications", href: "/publications", variant: "secondary" },
    ],
  } satisfies PageCta,
};

export const GMH_PUBLICATIONS_COPY = {
  subtitle:
    "Peer-reviewed research from the Center and its collaborators — trials, measurement studies, and implementation work across global mental health.",
  centerBadge: "Center publication",
  cta: {
    heading: "Work with our researchers",
    body: "We collaborate on trials, measurement studies, and implementation research across low- and middle-income settings.",
    actions: [
      emailTheCenter,
      { label: "Browse our projects", href: "/projects", variant: "secondary" },
    ],
  } satisfies PageCta,
};

export const GMH_INNOVATIONS_COPY = {
  subtitle:
    "Scalable tools and technologies developed through community partnership and rigorous research to close the global mental health treatment gap.",
  listHeading: "Our Tools & Technologies",
  listSubheading:
    "Evidence-based solutions designed for low-resource settings worldwide",
  cta: {
    heading: "Implement Our Innovations",
    body: "Interested in using EQUIP, our assessment tools, or other innovations in your setting? We provide training, consultation, and implementation support.",
    // `#` until the Center has a training-request and contact page to link.
    actions: [
      { label: "Request Training", href: "#" },
      { label: "Contact Us", href: "#", variant: "secondary" },
    ],
  } satisfies PageCta,
};

export const GMH_TEAM_COPY = {
  subtitle:
    "Researchers, clinicians and students working with partners worldwide to make mental health care equitable where specialists are scarce.",
  cta: {
    heading: "Looking to collaborate?",
    body: "We work with universities, ministries and community organizations, and welcome enquiries from prospective students and fellows.",
    actions: [
      emailTheCenter,
      { label: "Browse our projects", href: "/projects", variant: "secondary" },
    ],
  } satisfies PageCta,
};

/**
 * The project detail page's default CTA, built from the record: a "Contact
 * the project" button when the record names a contact, then the Center.
 */
export function gmhProjectDetailCta(detail: {
  name: string;
  contact?: { email: string };
}): PageCta {
  return {
    heading: `Work with us on ${detail.name}`,
    body: "We share protocols, training materials and measurement tools with teams adapting this work to their own setting.",
    actions: [
      ...(detail.contact
        ? [
            {
              label: "Contact the project",
              href: `mailto:${detail.contact.email}`,
              variant: "secondary" as const,
            },
          ]
        : []),
      { ...emailTheCenter, variant: "outline" as const },
    ],
  };
}
