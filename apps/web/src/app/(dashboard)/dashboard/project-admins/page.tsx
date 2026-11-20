"use client";

import { ProjectAdminsPage, toast } from "@gmhlab/blocks";
import { useAccount } from "@gmhlab/data";
import { ModuleGate } from "@/components/module-gate";
import { PROJECT_ROOMS } from "@/content/dashboard-workspace";

const PROJECTS = PROJECT_ROOMS.map(({ slug, name, logo }) => ({ slug, name, logo }));

export default function ProjectAdminsRoute() {
  const { queue, setProjectLeads } = useAccount();
  return (
    <ModuleGate id="project-admins">
      {() =>
        queue && (
          <ProjectAdminsPage
            projects={PROJECTS}
            people={queue.people}
            onSave={async (project, ids) => {
              await setProjectLeads(project, ids);
              toast("Project admins updated", PROJECTS.find((p) => p.slug === project)?.name);
            }}
          />
        )
      }
    </ModuleGate>
  );
}
