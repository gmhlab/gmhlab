"use client";

import { type DashboardLinkComponent, SlideStudio, exportDeckToPptx, toast } from "@gmhlab/blocks";
import { canAccess } from "@gmhlab/core";
import { useAccount } from "@gmhlab/data";
import Link from "next/link";
import { DASHBOARD_MODULES } from "@/content/dashboard-modules";

const TEMPLATES = DASHBOARD_MODULES.find((m) => m.id === "templates")!;

export default function SlidesRoute() {
  const { account } = useAccount();
  if (!account) return null;
  return (
    <SlideStudio
      presenter={account.name}
      templatesUnlocked={canAccess(account, TEMPLATES)}
      onExport={async (deck, palette, logos) => {
        // Loaded on demand: pptxgenjs is only needed by people who export.
        const { default: PptxGenJS } = await import("pptxgenjs");
        await exportDeckToPptx(PptxGenJS, deck, palette, logos);
        toast("Deck downloaded", "Open it in PowerPoint or Keynote.");
      }}
      linkComponent={Link as unknown as DashboardLinkComponent}
    />
  );
}
