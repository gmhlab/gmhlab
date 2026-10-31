"use client";

import { ProjectRooms, toast } from "@gmhlab/blocks";
import { useAccount } from "@gmhlab/data";
import { ModuleGate } from "@/components/module-gate";
import { PROJECT_ROOMS, ROOMS_NOTE } from "@/content/dashboard-workspace";

export default function ProjectsRoute() {
  const { activity, requestAccess } = useAccount();
  return (
    <ModuleGate id="projects">
      {(account) => (
        <ProjectRooms
          account={account}
          rooms={PROJECT_ROOMS}
          pendingProjects={activity.requests.filter((r) => r.status === "pending" && r.project).map((r) => r.project!)}
          onRequestAccess={async (project, note) => {
            await requestAccess({ kind: "project", project, note });
            toast("Request sent", "An admin will review it.");
          }}
          note={ROOMS_NOTE}
        />
      )}
    </ModuleGate>
  );
}
