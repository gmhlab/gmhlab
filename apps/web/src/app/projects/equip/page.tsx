"use client"

import { ProjectDetailPage } from "@gmhlab/blocks"

import {
  EQUIP_PROJECT_DETAIL,
  PROJECTS,
  PROJECT_DETAIL_SLUGS,
  PUBLICATIONS,
  TEAM,
} from "@/content"

export default function Page() {
  return (
    <ProjectDetailPage
      detail={EQUIP_PROJECT_DETAIL}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      publications={PUBLICATIONS}
    />
  );
}
