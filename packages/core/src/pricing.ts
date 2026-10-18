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

/** The plan catalogue, one list per billing interval. */
export type PricingPlans = {
  monthly: PricingPlan[];
  annual: PricingPlan[];
};

/**
 * What a pricing backend must provide.
 */
export interface PricingService {
  getPlans(): Promise<PricingPlans>;
}
