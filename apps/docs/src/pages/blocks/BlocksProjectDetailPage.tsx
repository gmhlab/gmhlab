import { useParams } from "react-router";
import { ProjectDetailPage } from "@gmhlab/blocks";

import {
  PROJECTS,
  PROJECT_DETAILS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";
import { MissingDetail } from "./MissingDetail";

/**
 * One `ProjectDetail` record, rendered as a study protocol. HARBOUR is the
 * fixture's fullest record — it populates every optional section, which is the
 * opposite of what most records do and therefore the useful thing to show.
 *
 * Note what the page does *not* contain: the component names no project. Adding
 * a second detail page here is adding a record and a route, never an edit to
 * the block.
 */
export function BlocksProjectDetailPage() {
  const { slug = "" } = useParams();
  const detail = PROJECT_DETAILS[slug];

  /* `ProjectsPage` links every card, so five of the six project slugs arrive
     here with no record behind them. */
  if (!detail) {
    return (
      <MissingDetail slug={slug} kind="project" indexPath="/blocks/projects" />
    );
  }

  return (
    <DemoFrame
      component="ProjectDetailPage"
      blurb="Arms, objectives ranked primary/secondary with their instruments, a two-track assessment schedule ordered chronologically across both tracks, eligibility, and evidence resolved from the bibliography. The record lists four publications and one slug is deliberately unresolvable, so the evidence list renders three."
      props={`<ProjectDetailPage
  basePath="/blocks/projects"
  detail={PROJECT_DETAILS[slug]}
  detailSlugs={PROJECT_DETAIL_SLUGS}
  projects={PROJECTS}
  publications={PUBLICATIONS}
  publicationsHref="/blocks/publications"
/>`}
    >
      <ProjectDetailPage
        basePath="/blocks/projects"
        detail={detail}
        detailSlugs={PROJECT_DETAIL_SLUGS}
        projects={PROJECTS}
        publications={PUBLICATIONS}
        publicationsHref="/blocks/publications"
      />
    </DemoFrame>
  );
}
