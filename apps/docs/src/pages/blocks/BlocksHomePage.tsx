import { HomePage } from "@gmhlab/blocks";

import { HOME_CONTENT } from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The landing page. Unlike the other demos it takes one record, not several
 * props: a home page is a composition of sections, each optional, so the
 * record IS the page. This one fills every section, including the pull quote
 * `apps/web` leaves out.
 */
export function BlocksHomePage() {
  return (
    <DemoFrame
      component="HomePage"
      blurb="A research centre's landing page: serif hero over drawn contour lines, a counting stat band, the signature gap figure, duotone link cards, a pull quote, a partner wall and a closing CTA. Every section after the stats is optional."
      props={`<HomePage content={HOME_CONTENT} />`}
    >
      <HomePage content={HOME_CONTENT} />
    </DemoFrame>
  );
}
