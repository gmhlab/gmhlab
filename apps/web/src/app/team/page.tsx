"use client"

import { TeamPage } from "@gmhlab/blocks"

import {
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
  TEAM_HERO_IMAGE,
} from "@/content"

export default function Page() {
  return (
    <TeamPage
      heroImage={TEAM_HERO_IMAGE}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      projectsBasePath="/projects"
      publications={PUBLICATIONS}
    />
  );
}
