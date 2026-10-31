"use client";

import { ReviewQueuePage, toast } from "@gmhlab/blocks";
import { useAccount } from "@gmhlab/data";
import { ModuleGate } from "@/components/module-gate";
import { PROJECT_OPTIONS } from "@/content/dashboard-workspace";

export default function AdminRoute() {
  const { queue, decideSubmission, decideRequest } = useAccount();
  return (
    <ModuleGate id="reviews">
      {() =>
        queue && (
          <ReviewQueuePage
            queue={queue}
            projects={PROJECT_OPTIONS}
            onDecideSubmission={async (id, approve, note) => {
              await decideSubmission(id, approve, note);
              toast(approve ? "Approved" : "Declined", approve ? "The new title and bio are now the live profile." : undefined);
            }}
            onDecideRequest={async (id, approve) => {
              await decideRequest(id, approve);
              toast(approve ? "Access granted" : "Request declined");
            }}
          />
        )
      }
    </ModuleGate>
  );
}
