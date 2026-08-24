"use client"

import { PublicationsPage } from "@gmhlab/blocks"

import {
  PUBLICATIONS,
  PUBLICATIONS_HERO_IMAGE,
  PUBLICATION_THEMES,
} from "@/content"

export default function Page() {
  return (
    <PublicationsPage
      heroImage={PUBLICATIONS_HERO_IMAGE}
      publications={PUBLICATIONS}
      themes={PUBLICATION_THEMES}
    />
  );
}
