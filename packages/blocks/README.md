# @gmhlab/blocks

Higher-level composed blocks for the GMH Lab design system — example sections, record-driven page blocks, and slides — built on `@gmhlab/ui` and `@gmhlab/tokens`.

## Install

```bash
pnpm add @gmhlab/blocks react react-dom tailwindcss
```

`react`, `react-dom`, and `tailwindcss` are peer dependencies. `@gmhlab/ui`, `@gmhlab/tokens`, `@gmhlab/core` and `@gmhlab/data` come along as dependencies.

## Setup

```css
@import "@gmhlab/ui/styles.css";
@import "@gmhlab/blocks/styles.css";
```

As with `@gmhlab/ui`, Tailwind must scan the built package for class names:

```css
@source "../node_modules/@gmhlab/ui/dist/**/*.js";
@source "../node_modules/@gmhlab/## Usage

```tsx
"use client";

import {
  mockAuthService,
  mockPricingService,
  mockProductsService,
} from "@gmhlab/core/mocks";
import { AllProviders } from "@gmhlab/data";
import { PricingGrid, WelcomeHero } from "@gmhlab/blocks";

const services = {
  auth: mockAuthService,
  pricing: mockPricingService,
  products: mockProductsService,
};

export default function Page() {
  return (
    <AllProviders services={services}>
      <WelcomeHero />
      <PricingGrid />
    </AllProviders>
  );
}
```

`PricingGrid` and `ProductGrid` read `usePricing()` / `useProducts()` from
`@gmhlab/data`, so they need its providers above them. Everything else renders
without one. See the `@gmhlab/data` README for the providers.

## What's in here

| Group | Contents |
| --- | --- |
| `examples/` | `WelcomeHero`, `PanelSections`, `ProductDetails`, `FAQs`, plus the data-bound `PricingGrid` and `ProductGrid` — no props, hardcoded content |
| `home/` | `HomePage`, a record-driven landing page |
| `projects/` | `ProjectsPage`, `ProjectDetailPage` and their record contracts |
| `publications/` | `PublicationsPage` and the reference resolver |
| `innovations/` | `InnovationsPage`, `InnovationDetailPage` |
| `slides/` | `BrandSlide`, `SlideHeader`, `SlideFooter` |

The page blocks take their records as props and name no organisation — the
content belongs to the consuming app.

## Notes

- The package ships with a **`"use client"` banner**, so it works directly in Next.js App Router.
- The data layer (`AllProviders`, `useAuth`, …) is **not** exported here — it lives in `@gmhlab/data`. Domain types (`Product`, `PricingPlan`, …) come from `@gmhlab/core`.

ngside the context types.

## License

Proprietary. Copyright (c) 2026 The George Washington University. All rights reserved.

Developed and maintained by the GW Center of Global Mental Health, The George Washington University School of Medicine and Health Sciences. Publication to npm is a distribution convenience and grants no right to use this software. See [LICENSE](./LICENSE) for the full terms; direct licensing inquiries to terrancebrunner@gmail.com.
