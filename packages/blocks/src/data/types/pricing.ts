import type { PricingPlan } from "@gmhlab/ui";

export type { PricingInterval, PricingPlan } from "@gmhlab/ui";

/**
 * Pricing context type
 */
export interface PricingContextType {
  /**
   * Available monthly plans
   */
  monthlyPlans: PricingPlan[];
  /**
   * Available annual plans
   */
  annualPlans: PricingPlan[];
  /**
   * Current plan
   */
  currentPlan?: PricingPlan;
  /**
   * Whether pricing data is loading
   */
  isLoading: boolean;
  /**
   * Set the current plan
   */
  setCurrentPlan: (plan: PricingPlan) => void;
}
