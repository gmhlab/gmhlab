# @gmhlab/blocks

Higher-level composed blocks for the GMH Lab design system — record-driven page blocks and slides — built on `@gmhlab/ui` and `@gmhlab/tokens`.

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
@source "../node_modules/@gmhlab/## Usage

Every page block takes its records as props; copy is optional:

```tsx
import { ProjectsPage, type PageCta } from "@gmhlab/blocks";
import { PROJECTS } from "./content";

const cta: PageCta = {
  heading: "Looking to collaborate?",
  body: "We partner with teams adapting this work to new settings.",
  actions: [{ label: "Email us", href: "mailto:hello@example.org" }],
};

export default function Page() {
  return (
    <ProjectsPage
      projects={PROJECTS}
      heroImage="/hero.jpg"
      subtitle="Our research portfolio."
      cta={cta}
    />
  );
}
```

## What's in here

| Group | Contents |
| --- | --- |
| `home/` | `HomePage`, a record-driven landing page |
| `projects/` | `ProjectsPage`, `ProjectDetailPage` and their record contracts |
| `publications/` | `PublicationsPage` and the reference resolver |
| `innovations/` | `InnovationsPage`, `InnovationDetailPage` |
| `shared/` | The `PageCta` / `PageAction` copy types |
| `slides/` | `BrandSlide`, `SlideHeader`, `SlideFooter` |

**These blocks are GMH Lab's, and say so.** Hero subtitles and calls to action
default to the GW Center for Global Mental Health's own copy (exported as
`GMH_PROJECTS_COPY`, `GMH_PUBLICATIONS_COPY`, `GMH_INNOVATIONS_COPY`), and
`Header`/`Footer` in `@gmhlab/ui` default to the GMH Lab mark. Every copy prop
follows one rule:

- omit it → the Center's wording
- pass a value → yours replaces it
- pass `null` → the section is not rendered

The records themselves (projects, publications, innovations) are always yours
to supply.

## Notes

- The package ships with a **`"use client"` banner**, so it works directly in Next.js App Router.
- The data layer (`AllProviders`, `useAuth`, …) lives in `@gmhlab/data`. Domain types (`Product`, `PricingPlan`, …) come from `@gmhlab/core`.

## License

Proprietary. Copyright (c) 2026 The George Washington University. All rights reserved.

Developed and maintained by the GW Center of Global Mental Health, The George Washington University School of Medicine and Health Sciences. Publication to npm is a distribution convenience and grants no right to use this software. See [LICENSE](./LICENSE) for the full terms; direct licensing inquiries to terrancebrunner@gmail.com.
