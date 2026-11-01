"use client"

import { TeamPage, applyPublishedProfiles } from "@gmhlab/blocks"
import { useProfiles } from "@gmhlab/data"
import { useEffect, useMemo } from "react"

import {
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
  TEAM_HERO_IMAGE,
} from "@/content"

export default function Page() {
  // Approved workspace profiles override the records (title, bio, location,
  // headshot) — that is what a bio approval in the dashboard publishes.
  const { profiles, refresh } = useProfiles();
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const people = useMemo(() => applyPublishedProfiles(TEAM, profiles), [profiles]);

  return (
    <TeamPage
      heroImage={TEAM_HERO_IMAGE}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={people}
      projects={PROJECTS}
      projectsBasePath="/projects"
      publications={PUBLICATIONS}
    />
  );
}
