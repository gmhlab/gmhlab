import { type ReactNode, useEffect, useMemo, useState } from "react";
import { PricingContext } from "../contexts/PricingContext";
import type { PricingPlan } from "@gmhlab/core";
// Hardwired until @gmhlab/data takes the service as a prop.
import { mockPricingService as pricingService } from "@gmhlab/core/mocks";

/**
 * Pricing provider with full state management
 */
export function PricingProvider({ children }: { children?: ReactNode }) {
  const [monthlyPlans, setMonthlyPlans] = useState<PricingPlan[]>([]);
  const [annualPlans, setAnnualPlans] = useState<PricingPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan>();
  const [isLoading, setIsLoading] = useState(true);

  // Load pricing plans on mount
  useEffect(() => {
    async function loadPlans() {
      setIsLoading(true);

      try {
        const { monthly, annual } = await pricingService.getPlans();
        setMonthlyPlans(monthly);
        setAnnualPlans(annual);
        setCurrentPlan(monthly[0]);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      monthlyPlans,
      annualPlans,
      currentPlan,
      isLoading,
      setCurrentPlan,
    }),
    [monthlyPlans, annualPlans, currentPlan, isLoading, setCurrentPlan],
  );

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}