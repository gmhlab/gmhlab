import { ProjectsPage } from "@gmhlab/blocks";

import {
  FEATURED_SLUG,
  PROJECTS,
  PROJECTS_HERO_IMAGE,
  PROJECT_PARTNERS,
  PROJECT_REGIONS,
} from "../../fixtures/sample-content";
import { DemoFrame } from "./DemoFrame";

/**
 * The same wrapper shape `apps/web/src/app/projects/page.tsx` uses — records in,
 * page out. `basePath` is "/blocks/projects" rather than "/projects" because
 * that is where this app mounts the block; getting it wrong is what makes every
 * card link to a 404.
 */
export function BlocksProjectsPage() {
  return (
    <DemoFrame
      component="ProjectsPage"
      blurb="A faceted portfolio index. Search runs on a memoised haystack keyed on the records; the status and region chips carry counts computed against the other active facet, and an option that would empty the list renders disabled."
      props={`<ProjectsPage
  basePath="/blocks/projects"
  featuredSlug={FEATURED_SLUG}
  heroImage={PROJECTS_HERO_IMAGE}
  partners={PROJECT_PARTNERS}
  projects={PROJECTS}
  regions={PROJECT_REGIONS}
  publicationsHref="/blocks/publications"
/>`}
    >
      <ProjectsPage
        basePath="/blocks/projects"
        featuredSlug={FEATURED_SLUG}
        heroImage={PROJECTS_HERO_IMAGE}
        partners={PROJECT_PARTNERS}
        projects={PROJECTS}
        publicationsHref="/blocks/publications"
        regions={PROJECT_REGIONS}
      />
    </DemoFrame>
  );
}
