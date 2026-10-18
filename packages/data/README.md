# @gmhlab/data

React bindings for the GMH Lab data layer: auth, pricing and products contexts,
their providers, and the hooks that read them. The providers hold the UI state
(loading, errors, the cart, search and filters); the backend is whatever
implements the `@gmhlab/core` service interfaces, passed in as a prop.

## Install

```bash
pnpm add @gmhlab/data @gmhlab/core
```

`react` and `react-dom` are peer dependencies. The bundle ships a `"use client"`
banner, so the providers work directly in Next.js App Router apps.

## Usage

Every provider takes its service. There are no defaults — the demo services are
opt-in from `@gmhlab/core/mocks`:

```tsx
"use client";

import {
  mockAuthService,
  mockPricingService,
  mockProductsService,
} from "@gmhlab/core/mocks";
import { AllProviders, type DataServices } from "@gmhlab/data";

// Module-level, so the reference is stable across renders.
const services: DataServices = {
  auth: mockAuthService,
  pricing: mockPricingService,
  products: mockProductsService,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <AllProviders services={services}>{children}</AllProviders>;
}
```

Then read state anywhere below it with `useAuth()`, `usePricing()` or
`useProducts()`. Each throws if its provider is missing.

Two things to know:

- **Pass stable service objects.** Each provider re-runs its load (session
  restore, plans, catalogue) when its `service` changes, so an object literal
  built during render reloads on every render.
- **In Next.js, choose the services in a client component.** A service is an
  object of functions, which a server component cannot pass as a prop to a
  client one — wrap `AllProviders` in a `"use client"` file as above and render
  that from your layout.

Need only some domains? Compose the individual providers:

```tsx
<AuthProvider service={authService}>
  <ProductsProvider service={productsService}>{children}</ProductsProvider>
</AuthProvider>
```

## Exports

| Domain | Provider | Hook | Context type |
| --- | --- | --- | --- |
| Auth | `AuthProvider` | `useAuth` | `AuthContextType` |
| Pricing | `PricingProvider` | `usePricing` | `PricingContextType` |
| Products | `ProductsProvider` | `useProducts` | `ProductsContextType` |

Plus `AllProviders` and its `DataServices` type. Domain types (`User`,
`Product`, …) are not re-exported — import them from `@gmhlab/core`.

## Bundling

Consumers that are themselves libraries must mark `@gmhlab/data` as external.
A bundled copy defines its own contexts, so its hooks never see the app's
providers and throw "must be used within a provider" at runtime — with no
type error to warn you.
