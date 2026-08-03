import { createContext } from "react";
import type { PricingContextType } from "../types/pricing";

/**
 * Pricing context
 */
export const PricingContext = createContext<PricingContextType | null>(null);