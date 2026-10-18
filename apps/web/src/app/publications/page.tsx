"use client"

import { PublicationsPage } from "@gmhlab/blocks"

import {
  PUBLICATIONS,
  PUBLICATIONS_HERO_IMAGE,
  PUBLICATION_THEMES,
  PUBLICATIONS_NOTE,
} from "@/content"

export default function Page() {
  return (
    <PublicationsPage
      heroImage={PUBLICATIONS_HERO_IMAGE}
      note={PUBLICATIONS_NOTE}
      publications={PUBLICATIONS}
      themes={PUBLICATION_THEMES}
    />
  );
}
