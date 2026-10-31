"use client";

import {
  mockAccountService,
  mockCheckoutService,
  mockLearningService,
  mockMediaService,
} from "@gmhlab/core/mocks";
import { WorkspaceProviders, type WorkspaceServices } from "@gmhlab/data";
import type { ReactNode } from "react";

/**
 * The member workspace's backends — core's demo workspace (localStorage), the
 * same store `DataProviders`' auth service signs into. Swap these four for
 * real services here. Module-level so the references are stable.
 */
const SERVICES: WorkspaceServices = {
  account: mockAccountService,
  learning: mockLearningService,
  media: mockMediaService,
  checkout: mockCheckoutService,
};

/** Renders no DOM. Mounted by the dashboard layout only. */
export function SiteWorkspaceProviders({ children }: { children?: ReactNode }) {
  return <WorkspaceProviders services={SERVICES}>{children}</WorkspaceProviders>;
}
