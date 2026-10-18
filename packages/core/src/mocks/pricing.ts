import type { PricingPlans, PricingService } from "../pricing";
import { delay } from "./delay";

/** Invented demo plans. */
export const MOCK_PRICING_PLANS: PricingPlans = {
  monthly: [
    {
      id: "beginner-monthly",
      name: "Beginner",
      description: "Perfect for getting started",
      price: 5,
      currency: "$",
      interval: "month",
      features: ["Promises", "Intentions", "240 credits"],
      sku: "1-beginner",
    },
    {
      id: "advanced-monthly",
      name: "Advanced",
      description: "For growing businesses",
      price: 10,
      currency: "$",
      interval: "month",
      features: ["Kept promises", "Better intentions", "480 credits"],
      popular: true,
      sku: "2-advanced",
    },
    {
      id: "business-monthly",
      name: "Business",
      description: "Enterprise-grade features",
      price: 25,
      currency: "$",
      interval: "month",
      features: ["Kept promises", "Best intentions", "Infinite credits"],
      sku: "3-business",
    },
  ],
  annual: [
    {
      id: "beginner-annual",
      name: "Beginner",
      description: "Perfect for getting started",
      price: 50,
      currency: "$",
      interval: "year",
      features: ["Promises", "Intentions", "240 credits"],
      sku: "1-beginner",
    },
    {
      id: "advanced-annual",
      name: "Advanced",
      description: "For growing businesses",
      price: 100,
      currency: "$",
      interval: "year",
      features: ["Kept promises", "Better intentions", "480 credits"],
      popular: true,
      sku: "2-advanced",
    },
    {
      id: "business-annual",
      name: "Business",
      description: "Enterprise-grade features",
      price: 250,
      currency: "$",
      interval: "year",
      features: ["Kept promises", "Best intentions", "Infinite credits"],
      sku: "3-business",
    },
  ],
};

export const mockPricingService: PricingService = {
  async getPlans() {
    await delay(800);
    return MOCK_PRICING_PLANS;
  },
};
