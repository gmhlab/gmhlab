"use client";

import { featuredProjectPublications, ProjectRooms, type RoomPublication, toast } from "@gmhlab/blocks";
import { useAccount, useFeaturedPublications, useRooms } from "@gmhlab/data";
import { useMemo } from "react";
import { ModuleGate } from "@/components/module-gate";
import { PROJECT_ROOMS, ROOMS_NOTE } from "@/content/dashboard-workspace";
import { PROJECT_DETAILS } from "@/content/project-detail-data";
import { PUBLICATIONS } from "@/content/publications-data";

/** Each project's works, newest first — what its admins choose from. */
const ROOM_PUBLICATIONS: Record<string, RoomPublication[]> = Object.fromEntries(
  Object.values(PROJECT_DETAILS).map((detail) => [
    detail.slug,
    featuredProjectPublications(detail, PUBLICATIONS).all.map(({ publication }) => ({
      slug: publication.slug,
      title: publication.title,
      journal: publication.journal,
      year: publication.year,
    })),
  ]),
);

export default function ProjectsRoute() {
  const { activity, requestAccess } = useAccount();
  const { messages, post, remove } = useRooms();
  const { featured, set: setFeatured } = useFeaturedPublications();
  // What each page features now: the admins' choice, else the record's default.
  const current = useMemo(
    () =>
      Object.fromEntries(
        Object.values(PROJECT_DETAILS).map((detail) => [
          detail.slug,
          featuredProjectPublications(detail, PUBLICATIONS, featured[detail.slug]).featured.map((e) => e.publication.slug),
        ]),
      ),
    [featured],
  );
  const chosen = useMemo(
    () => Object.fromEntries(Object.entries(featured).map(([slug, list]) => [slug, list.length > 0])),
    [featured],
  );
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
          messages={messages}
          onPostMessage={async (project, body) => {
            await post(project, body);
            toast("Message posted", "Everyone in the room can see it.");
          }}
          onRemoveMessage={remove}
          roomPublications={ROOM_PUBLICATIONS}
          featuredPublications={current}
          featuredChosen={chosen}
          onSaveFeatured={async (project, slugs) => {
            await setFeatured(project, slugs);
            toast(
              slugs.length ? "Featured publications saved" : "Back to the default",
              "The project page shows them first.",
            );
          }}
          note={ROOMS_NOTE}
        />
      )}
    </ModuleGate>
  );
}
