import { createBrowserRouter, RouterProvider } from "react-router";

import { RootLayout } from "./RootLayout";
import { HomePage } from "./pages/HomePage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { TokensPage } from "./pages/TokensPage";
import { SlidesPage } from "./pages/SlidesPage";
import { FlexPage } from "./pages/FlexPage";
import { ButtonMigrationPage } from "./pages/ButtonMigrationPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "components", element: <ComponentsPage /> },
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
