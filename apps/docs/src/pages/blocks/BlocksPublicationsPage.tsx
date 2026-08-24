import { PublicationsPage } from "@gmhlab/blocks";

import {
  PUBLICATIONS,
  PUBLICATIONS_HERO_IMAGE,
  PUBLICATION_THEMES,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The bibliography index on eight synthetic records rather than the GW site's
 * 343. Small on purpose: the facet interactions are legible at this size, and
 * the paging control is not.
 */
export function BlocksPublicationsPage() {
  return (
    <DemoFrame
      component="PublicationsPage"
      blurb="Full-text search across title, journal, authors, summary, theme and projects, plus year / theme / project facets, an open-access toggle, sort and paging. Facet counts respond to the other active facets, so the numbers on the chips always match what selecting them produces."
      props={`<PublicationsPage
  heroImage={PUBLICATIONS_HERO_IMAGE}
  projectsHref="/blocks/projects"
  publications={PUBLICATIONS}
  themes={PUBLICATION_THEMES}
/>`}
    >
      <PublicationsPage
        heroImage={PUBLICATIONS_HERO_IMAGE}
        projectsHref="/blocks/projects"
        publications={PUBLICATIONS}
        themes={PUBLICATION_THEMES}
      />
    </DemoFrame>
  );
}
