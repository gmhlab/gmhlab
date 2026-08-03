/**
 * Pricing plan types
 */
export type PricingInterval = "month" | "year";

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: PricingInterval;
  features: string[];
  popular?: boolean;
  sku: string;
};
