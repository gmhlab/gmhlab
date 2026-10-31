"use client";

import { AllProviders, type DataServices } from "@gmhlab/data";
import type { ReactNode } from "react";
import { mockWorkspaceAuthService } from "@gmhlab/core/mocks";
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
  return <AllProviders services={SERVICES}>{children}</AllProviders>;
}
