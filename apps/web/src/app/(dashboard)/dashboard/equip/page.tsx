"use client";

import { type DashboardLinkComponent, EquipAcademy } from "@gmhlab/blocks";
import { useAccount, useLearning } from "@gmhlab/data";
import Link from "next/link";
import { EQUIP_DEMO_NOTE } from "@/content/dashboard-notes";
import { COURSES } from "@/content/equip-training";

export default function EquipRoute() {
  const { account } = useAccount();
  const { progress } = useLearning();
  if (!account) return null;
  return (
    <EquipAcademy
      account={account}
      courses={COURSES}
      progress={progress}
      basePath="/dashboard/equip"
      practiceHref="/dashboard/equip/practice"
      storeHref="/dashboard#store"
      note={EQUIP_DEMO_NOTE}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
