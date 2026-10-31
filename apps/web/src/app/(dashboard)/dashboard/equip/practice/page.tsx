"use client";

import { type DashboardLinkComponent, PracticeStudio } from "@gmhlab/blocks";
import Link from "next/link";
import { EQUIP_DEMO_NOTE } from "@/content/dashboard-notes";
import { COMPETENCIES, LEVELS, SCENARIOS } from "@/content/equip-training";

export default function PracticeRoute() {
  return (
    <PracticeStudio
      scenarios={SCENARIOS}
      competencies={COMPETENCIES}
      levels={LEVELS}
      backHref="/dashboard/equip"
      note={EQUIP_DEMO_NOTE}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
