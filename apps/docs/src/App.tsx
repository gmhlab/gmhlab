import { createBrowserRouter, RouterProvider } from "react-router";

import { RootLayout } from "./RootLayout";
import { HomePage } from "./pages/HomePage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { BlocksPage } from "./pages/BlocksPage";
import { TokensPage } from "./pages/TokensPage";
import { SlidesPage } from "./pages/SlidesPage";
import { FlexPage } from "./pages/FlexPage";
import { ButtonMigrationPage } from "./pages/ButtonMigrationPage";
import { BlocksProjectsPage } from "./pages/blocks/BlocksProjectsPage";
import { BlocksProjectDetailPage } from "./pages/blocks/BlocksProjectDetailPage";
import { BlocksPublicationsPage } from "./pages/blocks/BlocksPublicationsPage";
import { BlocksInnovationsPage } from "./pages/blocks/BlocksInnovationsPage";
import { BlocksInnovationDetailPage } from "./pages/blocks/BlocksInnovationDetailPage";

/**
 * The `blocks/*` routes mirror the five GW routes in `apps/web`, one level
 * down: the page blocks build every internal href from a `basePath` prop, and
 * mounting them off the root here is what proves that prop does its job. Each
 * wrapper passes the matching `basePath`; changing a path below means changing
 * it there too.
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "components", element: <ComponentsPage /> },
      { path: "blocks", element: <BlocksPage /> },
      { path: "blocks/projects", element: <BlocksProjectsPage /> },
      { path: "blocks/projects/:slug", element: <BlocksProjectDetailPage /> },
      { path: "blocks/publications", element: <BlocksPublicationsPage /> },
      { path: "blocks/innovations", element: <BlocksInnovationsPage /> },
      {
        path: "blocks/innovations/:slug",
        element: <BlocksInnovationDetailPage />,
      },
      { path: "tokens", element: <TokensPage /> },
      { path: "slides", element: <SlidesPage /> },
      { path: "flex", element: <FlexPage /> },
      { path: "button-migration", element: <ButtonMigrationPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
