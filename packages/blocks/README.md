# @gmhlab/blocks

Higher-level composed blocks for the GMH Lab design system — page sections, page templates, slides, and a mock data layer — built on `@gmhlab/ui` and `@gmhlab/tokens`.

## Install

```bash
pnpm add @gmhlab/blocks react react-dom tailwindcss
```

`react`, `react-dom`, and `tailwindcss` are peer dependencies. `@gmhlab/ui` and `@gmhlab/tokens` come along as dependencies.

## Setup

```css
@import "@gmhlab/ui/styles.css";
@import "@gmhlab/blocks/styles.css";
```

As with `@gmhlab/ui`, Tailwind must scan the built package for class names:

```css
@source "../node_modules/@gmhlab/ui/dist/**/*.js";
@source "../node_modules/@gmhlab/blocks/dist/**/*.js";
```

## Usage

```tsx
import { AllProviders, WelcomeHero, PricingGrid } from "@gmhlab/blocks";

export default function Page() {
  return (
    <AllProviders>
      <WelcomeHero />
      <PricingGrid />
    </AllProviders>
  );
}
```

## What's in here

| Group | Contents |
| --- | --- |
| `sections/` | `WelcomeHero`, plus the data-bound `PricingGrid` and `ProductGrid` |
| `templates/` | AppShell, Auth, and Marketing page templates |
| `slides/` | `BrandSlide`, `SlideHeader`, `SlideFooter` |
| `innovations/` | The GMH Innovations page |
| `data/` | Auth/pricing/products contexts, providers, hooks, and mock services — `AllProviders`, `useAuth`, … |

## Notes

- The package ships with a **`"use client"` banner**, so its providers work directly in Next.js App Router without a wrapper.
- **`AllProviders` renders no DOM** — it is only nested context providers, so it won't disturb your layout's flex or grid structure.
- Domain types (`Product`, `PricingPlan`, …) originate in `@gmhlab/ui` and are re-exported here alongside the context types.

## License

UNLICENSED — proprietary. All rights reserved. See the repository root for terms.
