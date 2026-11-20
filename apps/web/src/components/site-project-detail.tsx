"use client";

import { ProjectDetailPage, type ProjectDetail } from "@gmhlab/blocks";
import { useFeaturedPublications } from "@gmhlab/data";
import { useEffect } from "react";
import { PROJECTS, PROJECT_DETAIL_SLUGS, PUBLICATIONS, TEAM } from "@/content";

/**
 * A project detail page with the featured publications its admins chose in
 * the project room (`useFeaturedPublications`); without a choice the page
 * features the first works the record lists.
 */
export function SiteProjectDetail({ detail }: { detail: ProjectDetail }) {
  const { featured, refresh } = useFeaturedPublications();
  // Admins choose in the dashboard, so re-read whenever the page mounts.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <ProjectDetailPage
      detail={detail}
      detailSlugs={PROJECT_DETAIL_SLUGS}
      people={TEAM}
      projects={PROJECTS}
      publications={PUBLICATIONS}
      featuredPublications={featured[detail.slug]}
    />
  );
}
