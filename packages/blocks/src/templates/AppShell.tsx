import { ReactNode } from "react";
import { cn } from "@gmhlab/ui";
import { Sidebar } from "./Sidebars";
import "./templates.css";

export type AppShellProps = {
  brand?: ReactNode;
  nav?: ReactNode;
  sidebarFooter?: ReactNode;
  topbar?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function AppShell({
  brand,
  nav,
  sidebarFooter,
  topbar,
  children,
  className,
}: AppShellProps) {
  return (
    <div className={cn("template-page-root template-app-shell", className)}>
      <Sidebar brand={brand} footer={sidebarFooter}>
        {nav}
      </Sidebar>

      <main className="template-main" id="main-content" tabIndex={-1}>
        {topbar}
        {children}
      </main>
    </div>
  );
}
