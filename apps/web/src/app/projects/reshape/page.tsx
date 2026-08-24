"use client"

import { ProjectDetailPage } from "@gmhlab/blocks"

import {
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  RESHAPE_DETAIL,
} from "@/content"

export default function Page() {
  return (
    <ProjectDetailPage
      detail={RESHAPE_DETAIL}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      projects={PROJECTS}
      publications={PUBLICATIONS}
    />
  );
}
