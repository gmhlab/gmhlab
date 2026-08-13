"use client"

import { ProjectsPage } from "@gmhlab/blocks"

export default function Page() {
  /* The route this page is mounted at. It was "/gmh/projects", which matched
     no route in this app — the app has no basePath — so every project card
     linked to a 404. */
  return <ProjectsPage basePath="/projects" />;
}
