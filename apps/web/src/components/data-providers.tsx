"use client";

import { AllProviders, type DataServices, ProfilesProvider } from "@gmhlab/data";
import type { ReactNode } from "react";
import {
  configureMockWorkspace,
  mockAccountService,
  mockWorkspaceAuthService,
} from "@gmhlab/core/mocks";
import { WORKSPACE_DEMO_SEED } from "@/content/workspace-demo-accounts";
import {
  siteContactService,
  siteNewsletterService,
  sitePricingService,
  siteProductsService,
} from "./site-services";

/**
 * The site's backends — swap them here and nothing else changes.
 * Module-level so the reference is stable.
 *
 * Auth is core's demo workspace backend (`@gmhlab/core/mocks`, localStorage):
 * open sign-up and four seeded demo accounts, shared with the workspace
 * services in `workspace-providers.tsx`. A real auth backend replaces it here
 * and the workspace services there. Pricing and products are the workspace
 * storefront's catalogue (`content/dashboard-modules.ts`).
 *
 * This file exists because services are objects of functions, which a server
 * component (layout.tsx) cannot pass as props to a client component.
 */
// The demo store is seeded with real team members (content/workspace-demo-
// accounts.ts) before any service runs — this module loads with the root layout.
configureMockWorkspace(WORKSPACE_DEMO_SEED);

const SERVICES: DataServices = {
  auth: mockWorkspaceAuthService,
  pricing: sitePricingService,
  products: siteProductsService,
  // Both email the Center's inbox (globalmh@gwu.edu) through the route
  // handlers in app/api — see server/mail.ts for the configuration.
  newsletter: siteNewsletterService,
  contact: siteContactService,
};

/** `AllProviders` bound to the site's services. Renders no DOM. */
export function DataProviders({ children }: { children?: ReactNode }) {
  // ProfilesProvider sits at the root (the public team page reads it); it
  // must share the workspace's account service, set in workspace-providers.
  return (
    <AllProviders services={SERVICES}>
      <ProfilesProvider service={mockAccountService}>{children}</ProfilesProvider>
    </AllProviders>
  );
}
