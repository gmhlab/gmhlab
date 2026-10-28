"use client";

import {
  mockAuthService,
  mockPricingService,
  mockProductsService,
} from "@gmhlab/core/mocks";
import { AllProviders, type DataServices } from "@gmhlab/data";
import type { ReactNode } from "react";
import { siteContactService, siteNewsletterService } from "./site-services";

/**
 * The site's backends. Mock services until the site has real ones — swap them
 * here and nothing else changes. Module-level so the reference is stable.
 *
 * This file exists because services are objects of functions, which a server
 * component (layout.tsx) cannot pass as props to a client component.
 */
const SERVICES: DataServices = {
  auth: mockAuthService,
  pricing: mockPricingService,
  products: mockProductsService,
  // Both email the Center's inbox (globalmh@gwu.edu) through the route
  // handlers in app/api — see server/mail.ts for the configuration.
  newsletter: siteNewsletterService,
  contact: siteContactService,
};

/** `AllProviders` bound to the site's services. Renders no DOM. */
export function DataProviders({ children }: { children?: ReactNode }) {
  return <AllProviders services={SERVICES}>{children}</AllProviders>;
}
