"use client"

import { ProjectDetailPage } from "@gmhlab/blocks"

import {
  RECOUP_NY_DETAIL,
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
} from "@/content"

export default function Page() {
  return (
    <ProjectDetailPage
      detail={RECOUP_NY_DETAIL}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      publications={PUBLICATIONS}
    />
  );
}
