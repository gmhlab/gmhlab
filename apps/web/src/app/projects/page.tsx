"use client"

import { ProjectsPage } from "@gmhlab/blocks"

import {
  FEATURED_SLUG,
  PROJECTS,
  PROJECTS_HERO_IMAGE,
  PROJECT_PARTNERS,
  PROJECT_REGIONS,
} from "@/content"

export default function Page() {
  /* `basePath` is the route this page is mounted at. It was "/gmh/projects",
     which matched no route in this app — the app has no basePath — so every
     project card linked to a 404. */
  return (
    <ProjectsPage
      basePath="/projects"
      featuredSlug={FEATURED_SLUG}
      heroImage={PROJECTS_HERO_IMAGE}
      partners={PROJECT_PARTNERS}
      projects={PROJECTS}
      regions={PROJECT_REGIONS}
    />
  );
}
