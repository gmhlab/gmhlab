import { useParams } from "react-router";
import { InnovationDetailPage } from "@gmhlab/blocks";

import { INNOVATION_DETAILS, PUBLICATIONS } from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";
import { MissingDetail } from "./MissingDetail";

/**
 * The innovation detail page. Same record-driven shape as the project detail
 * page, different document: a project page argues that a study is well
 * designed, this one answers what the thing is, how it works, who runs it,
 * what the evidence is, and how to adopt it.
 */
export function BlocksInnovationDetailPage() {
  const { slug = "" } = useParams();
  const detail = INNOVATION_DETAILS[slug];

  /* Reachable only by typing a URL: the index links ATLAS alone, which is
     `detailSlugs` doing its job. */
  if (!detail) {
    return (
      <MissingDetail
        slug={slug}
        kind="innovation"
        indexPath="/blocks/innovations"
      />
    );
  }

  return (
    <DemoFrame
      component="InnovationDetailPage"
      blurb="Adoption-shaped: a stat hero, a numbered process cycle, the parts it ships as, its deployments, evidence resolved from the bibliography, related work, and a closing CTA. Every section is conditional on its data."
      props={`<InnovationDetailPage
  basePath="/blocks/innovations"
  detail={INNOVATION_DETAILS[slug]}
  homeHref="/blocks"
  indexLabel="Innovations"
  publications={PUBLICATIONS}
  publicationsHref="/blocks/publications"
/>`}
    >
      <InnovationDetailPage
        basePath="/blocks/innovations"
        detail={detail}
        homeHref="/blocks"
        indexLabel="Innovations"
        publications={PUBLICATIONS}
        publicationsHref="/blocks/publications"
      />
    </DemoFrame>
  );
}
