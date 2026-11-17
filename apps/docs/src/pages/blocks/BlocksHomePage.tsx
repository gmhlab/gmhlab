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
      blurb="A research centre's landing page in the workspace's lit language: a lit navy hero with its figures as glass tiles, the gold wave, the signature gap figure, tilt cards with kit cover art on a lit band, a pull quote, a partner wall and a closing lit card. Every section after the stats is optional."
      props={`<HomePage content={HOME_CONTENT} />`}
    >
      <HomePage content={HOME_CONTENT} />
    </DemoFrame>
  );
}
