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
      detailSlugs={PROJECT_DETAIL_SLUGS}
      heroImage={TEAM_HERO_IMAGE}
      people={TEAM}
      projects={PROJECTS}
      projectsBasePath="/projects"
      publications={PUBLICATIONS}
    />
  );
}
