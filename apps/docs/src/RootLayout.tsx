import { Outlet } from "react-router";
import { SiteHeader } from "./components/site-header";

export function RootLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
