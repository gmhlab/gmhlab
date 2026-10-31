import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardFrame } from "@/components/dashboard-frame";

export const metadata: Metadata = {
  title: "Workspace · GW Global Mental Health",
};

/**
 * The member workspace. It has its own chrome (the blocks `DashboardShell`)
 * instead of the public site's header and footer, which live in
 * (site)/layout.tsx.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardFrame>{children}</DashboardFrame>;
}
