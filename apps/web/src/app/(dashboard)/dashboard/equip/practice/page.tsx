"use client";

import { type DashboardLinkComponent, PracticeStudio } from "@gmhlab/blocks";
import Link from "next/link";
import { EQUIP_DEMO_NOTE } from "@/content/dashboard-notes";
import { COMPETENCIES, LEVELS, SCENARIOS } from "@/content/equip-training";
import { WORKSPACE_PHOTOS } from "@/content/workspace-images";

export default function PracticeRoute() {
  return (
    <PracticeStudio
      scenarios={SCENARIOS}
      competencies={COMPETENCIES}
      levels={LEVELS}
      backHref="/dashboard/equip"
      heroImage={WORKSPACE_PHOTOS.groupSession.src}
      note={EQUIP_DEMO_NOTE}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
