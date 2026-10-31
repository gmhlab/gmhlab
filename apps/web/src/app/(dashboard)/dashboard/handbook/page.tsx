"use client";

import { HandbookPage } from "@gmhlab/blocks";
import { ModuleGate } from "@/components/module-gate";
import { HANDBOOK_CHECKLIST, HANDBOOK_NOTE, HANDBOOK_SECTIONS } from "@/content/dashboard-workspace";

export default function HandbookRoute() {
  return (
    <ModuleGate id="onboarding">
      {() => <HandbookPage sections={HANDBOOK_SECTIONS} checklist={HANDBOOK_CHECKLIST} note={HANDBOOK_NOTE} />}
    </ModuleGate>
  );
}
