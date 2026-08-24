"use client"

import { InnovationsPage } from "@gmhlab/blocks"

import {
  INNOVATIONS,
  INNOVATIONS_HERO_IMAGE,
  INNOVATION_DETAIL_SLUGS,
  INNOVATION_PARTNERS,
} from "@/content"

export default function Page() {
  return (
    <InnovationsPage
      basePath="/innovations"
      detailSlugs={INNOVATION_DETAIL_SLUGS}
      heroImage={INNOVATIONS_HERO_IMAGE}
      innovations={INNOVATIONS}
      partners={INNOVATION_PARTNERS}
    />
  );
}
