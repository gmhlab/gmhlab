# @gmhlab/core

The framework-agnostic domain layer for the GMH Lab design system: shared record
types, the service interfaces a backend implements, and pure helpers over those
records. No React, no CSS, and **no data**.

## Install

```bash
pnpm add @gmhlab/core
```

## What's in it

| Domain | Types | Service interface | Helpers |
| --- | --- | --- | --- |
| Auth | `User`, `Credentials` | `AuthService` | — |
| Pricing | `PricingPlan`, `PricingInterval`, `PricingPlans` | `PricingService` | — |
| Products | `Product`, `ProductFilter`, `ProductSort`, `ProductCart`, `ProductCartItem`, `SearchParams` | `ProductsService` | `filterProducts`, `sortProducts`, `searchProducts`, `cartTotal` |

A real site implements the interfaces against its own backend:

```ts
import type { ProductsService } from "@gmhlab/core";

export const productsService: ProductsService = {
  async getProducts() {
    const res = await fetch("/api/products");
    return res.json();
  },
};
```

## Demo data: `@gmhlab/core/mocks`

Invented records and mock services live behind a separate entry point, so they
only reach a bundle that imports them on purpose:

```ts
import { mockProductsService, MOCK_PRODUCTS } from "@gmhlab/core/mocks";
```

Exports `mockAuthService` (any credentials except `error@example.com`, session
kept in `localStorage`), `mockPricingService` / `MOCK_PRICING_PLANS`, and
`mockProductsService` / `MOCK_PRODUCTS`. The services add a short artificial
delay so loading states are visible.
