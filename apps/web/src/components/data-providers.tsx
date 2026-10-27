"use client";

import {
  mockAuthService,
  mockContactService,
  mockNewsletterService,
  mockPricingService,
  mockProductsService,
} from "@gmhlab/core/mocks";
import { AllProviders, type DataServices } from "@gmhlab/data";
import type { ReactNode } from "react";

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
  // Accepts every address and stores none — the footer signup is a demo
  // until the Center's mailing list is wired in here.
  newsletter: mockNewsletterService,
  // Sends nothing — the contact form is a demo until a real service, one
  // that routes each inquiry's `topic` to the right inbox, is wired in here.
  contact: mockContactService,
};

/** `AllProviders` bound to the site's services. Renders no DOM. */
export function DataProviders({ children }: { children?: ReactNode }) {
  return <AllProviders services={SERVICES}>{children}</AllProviders>;
}
