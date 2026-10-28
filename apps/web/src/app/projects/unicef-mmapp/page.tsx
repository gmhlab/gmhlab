"use client"

import { ProjectDetailPage } from "@gmhlab/blocks"

import {
  UNICEF_MMAP_DETAIL,
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
} from "@/content"

export default function Page() {
  return (
    <ProjectDetailPage
      detail={UNICEF_MMAP_DETAIL}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      publications={PUBLICATIONS}
    />
  );
}
