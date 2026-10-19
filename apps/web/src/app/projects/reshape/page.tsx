"use client"

import { ProjectDetailPage } from "@gmhlab/blocks"

import {
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  RESHAPE_DETAIL,
  TEAM,
} from "@/content"

export default function Page() {
  return (
    <ProjectDetailPage
      detail={RESHAPE_DETAIL}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      publications={PUBLICATIONS}
    />
  );
}
