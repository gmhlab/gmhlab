import { InnovationsPage } from "@gmhlab/blocks";

import {
  INNOVATIONS,
  INNOVATIONS_HERO_IMAGE,
  INNOVATION_DETAIL_SLUGS,
  INNOVATION_PARTNERS,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The innovations index. `detailSlugs` holds one slug, so exactly one of the
 * three cards is a link — which is the convention working, not a gap: a card
 * links only when there is a detail record behind it.
 */
export function BlocksInnovationsPage() {
  return (
    <DemoFrame
      component="InnovationsPage"
      blurb="The index. Only ATLAS appears in detailSlugs, so only that card links; the other two render as plain cards rather than as links to a 404."
      props={`<InnovationsPage
  basePath="/blocks/innovations"
  detailSlugs={INNOVATION_DETAIL_SLUGS}
  heroImage={INNOVATIONS_HERO_IMAGE}
  innovations={INNOVATIONS}
  partners={INNOVATION_PARTNERS}
/>`}
    >
      <InnovationsPage
        basePath="/blocks/innovations"
        detailSlugs={INNOVATION_DETAIL_SLUGS}
        heroImage={INNOVATIONS_HERO_IMAGE}
        innovations={INNOVATIONS}
        partners={INNOVATION_PARTNERS}
      />
    </DemoFrame>
  );
}
