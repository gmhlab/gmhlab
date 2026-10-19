import { TeamPage } from "@gmhlab/blocks";

import {
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
  TEAM_HERO_IMAGE,
  TEAM_PAGE_COPY,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The team page over the synthetic institute. `projectsBasePath` is
 * "/blocks/projects" because that is where this app mounts the projects block;
 * the detail demos pass `teamHref="/blocks/team"` for the link back.
 */
export function BlocksTeamPage() {
  return (
    <DemoFrame
      component="TeamPage"
      blurb="One person format across core team, affiliates, students and alumni: credentials inline, an initials monogram where there is no photo, bios that expand in place with selected publications resolved from the bibliography, and project tags that double as a filter. Alumni sort newest first and show where they went."
      props={`<TeamPage
  {...TEAM_PAGE_COPY}
  detailSlugs={PROJECT_DETAIL_SLUGS}
  heroImage={TEAM_HERO_IMAGE}
  people={TEAM}
  projects={PROJECTS}
  projectsBasePath="/blocks/projects"
  publications={PUBLICATIONS}
/>`}
    >
      <TeamPage
        {...TEAM_PAGE_COPY}
        detailSlugs={PROJECT_DETAIL_SLUGS}
        heroImage={TEAM_HERO_IMAGE}
        people={TEAM}
        projects={PROJECTS}
        projectsBasePath="/blocks/projects"
        publications={PUBLICATIONS}
      />
    </DemoFrame>
  );
}
