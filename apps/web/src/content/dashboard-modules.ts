import type { DashboardAnnouncement, DashboardEvent, DashboardModule } from "@gmhlab/blocks";
import type { PricingPlans, Product } from "@gmhlab/core";

/**
 * The workspace's module catalogue, its storefront plans and the home
 * noticeboard. The record types are the blocks' contract
 * (`packages/blocks/src/dashboard/dashboard-types.ts`); access is core's
 * `Access`, checked by core's `canAccess`.
 *
 * Provenance: everything here is the workspace's own product copy, written
 * for the 2026-10-31 dashboard build. **Prices are a storefront demo** — no
 * payment is taken, nothing is sold, and the Center has not decided to charge
 * for anything. Swap `price`/`DASHBOARD_PLANS` for real values (or drop the
 * storefront) before launch. The noticeboard is invented too.
 */

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: "equip",
    icon: "training",
    title: "EQUIP Academy",
    tagline: "Competency-based training for helpers",
    description:
      "Courses on foundational helping skills, structured role plays and competency assessment, with a practice studio for rating sessions against expert scores.",
    href: "/dashboard/equip",
    category: "Training",
    art: { kind: "glyph", name: "competency" },
    access: { kind: "open" },
    includes: ["Foundational helping skills, free", "Practice rating studio", "Certificates of completion"],
    nav: "Learn",
  },
  {
    id: "brand",
    icon: "palette",
    title: "Brand studio",
    tagline: "Navy, gold and how to use them",
    description:
      "The GMH palette read live from the design tokens, the rules that keep gold legible, a contrast checker and the type scale — copy any value in one click.",
    href: "/dashboard/brand",
    category: "Brand",
    art: { kind: "shape", name: "quarter-sun" },
    access: { kind: "open" },
    includes: ["Live colour tokens", "Contrast checker", "Do and don't examples"],
    nav: "Create",
  },
  {
    id: "graphics",
    icon: "shapes",
    title: "Graphics kit",
    tagline: "Glyphs, shapes and backdrops",
    description:
      "Every graphic in the GMH kit, previewed on light, dark and navy grounds and downloadable as SVG with the brand colours baked in.",
    href: "/dashboard/graphics",
    category: "Brand",
    art: { kind: "shape", name: "rising-rings" },
    access: { kind: "open" },
    includes: ["11 research glyphs", "8 brand shapes", "SVG download"],
    nav: "Create",
  },
  {
    id: "slides",
    icon: "slides",
    title: "Slide studio",
    tagline: "On-brand decks in minutes",
    description:
      "Build title, statement and stat slides from a form, export a real PowerPoint file, and follow the step-by-step tutorial for building your own.",
    href: "/dashboard/slides",
    category: "Brand",
    art: { kind: "shape", name: "arch" },
    access: { kind: "open" },
    includes: ["PowerPoint export", "Five slide layouts", "PowerPoint tutorial"],
    nav: "Create",
  },
  {
    id: "signature",
    icon: "mail",
    title: "Email signature",
    tagline: "A consistent sign-off for everyone",
    description:
      "Fill in your details and copy a signature that pastes cleanly into Outlook and Gmail, in the lab's type and colours.",
    href: "/dashboard/signature",
    category: "Brand",
    art: { kind: "shape", name: "pill" },
    access: { kind: "open" },
    includes: ["Outlook and Gmail ready", "Copies as rich text"],
    nav: "Create",
  },
  {
    id: "competency-pack",
    icon: "training",
    title: "Role-play rating pack",
    tagline: "Printable forms and scripted role plays",
    description:
      "Rating sheets for every competency, six scripted role plays with actor notes, and a facilitator's guide for running assessments in a workshop.",
    href: "/dashboard/equip/practice",
    category: "Training",
    art: { kind: "glyph", name: "measurement" },
    access: { kind: "plan", plan: "practitioner" },
    price: 29,
    includes: ["8 competency rating sheets", "6 scripted role plays", "Facilitator's guide"],
    // No `nav`: it lives inside another module's page.
  },
  {
    id: "templates",
    icon: "slides",
    title: "Posters & one-pagers",
    tagline: "Conference-ready layouts",
    description:
      "Poster, one-pager and report-cover templates in the lab's grid, with guidance on figures, logos and partner lockups.",
    href: "/dashboard/slides#templates",
    category: "Brand",
    art: { kind: "shape", name: "brackets" },
    access: { kind: "plan", plan: "practitioner" },
    price: 19,
    includes: ["A0 and 48×36 posters", "Project one-pager", "Report cover"],
    // No `nav`: it lives inside another module's page.
  },
  {
    id: "projects",
    icon: "folder",
    title: "Project rooms",
    tagline: "Resources for each project's partners",
    description:
      "One room per project you partner on: protocols, training materials, measures and contacts, kept apart so each team sees its own.",
    href: "/dashboard/projects",
    category: "Projects",
    art: { kind: "glyph", name: "community" },
    access: { kind: "project" },
    includes: ["Protocols and measures", "Partner contacts", "Shared files"],
    nav: "Workspace",
  },
  {
    id: "photos",
    icon: "images",
    title: "Photo library",
    tagline: "Consented images for lab use",
    description:
      "The lab's photographs with credits, tags and recorded consent. Upload your own from the field; nothing goes in without consent.",
    href: "/dashboard/photos",
    category: "Media",
    art: { kind: "glyph", name: "lived-experience" },
    access: { kind: "project" },
    includes: ["Search by tag", "Credit and consent on every photo", "Field uploads"],
    nav: "Workspace",
  },
  {
    id: "cohorts",
    icon: "chart",
    title: "Cohort insights",
    tagline: "Competency growth across a team",
    description:
      "Track a training cohort's competency ratings over time and see which skills need another session.",
    href: "/dashboard/equip",
    category: "Training",
    art: { kind: "glyph", name: "sensing" },
    access: { kind: "plan", plan: "institution" },
    includes: ["Team seats", "Before/after comparisons", "Export to CSV"],
    soon: true,
    // No `nav`: it lives inside another module's page.
  },
  {
    id: "onboarding",
    icon: "book",
    title: "Lab handbook",
    tagline: "Policies, authorship and your first week",
    description:
      "Data handling, authorship norms, travel and the new-starter checklist, in one place for staff.",
    href: "/dashboard/handbook",
    category: "Lab",
    art: { kind: "glyph", name: "publication" },
    access: { kind: "tier", min: "staff" },
    includes: ["New-starter checklist", "Data handling policy", "Authorship norms"],
    nav: "Lab",
  },
  {
    id: "reviews",
    icon: "shield",
    title: "Reviews",
    tagline: "Approve bios and access requests",
    description:
      "The admin queue: profile changes waiting to go public, and members asking to join a project or the staff.",
    href: "/dashboard/admin",
    category: "Lab",
    art: { kind: "shape", name: "held" },
    access: { kind: "tier", min: "admin" },
    includes: ["Bio review with a diff", "Access requests"],
    nav: "Lab",
  },
];

/** The storefront's plans (core's `PricingPlan` shape). Demo prices. */
export const DASHBOARD_PLANS: PricingPlans = {
  monthly: [
    {
      id: "member-monthly",
      name: "Member",
      description: "Everything you need to work on-brand and start training.",
      price: 0,
      currency: "$",
      interval: "month",
      features: [
        "Brand studio, graphics kit and slide studio",
        "Foundational helping skills course",
        "Email signature generator",
      ],
      sku: "member",
    },
    {
      id: "practitioner-monthly",
      name: "Practitioner",
      description: "For trainers and supervisors running EQUIP with their teams.",
      price: 9,
      currency: "$",
      interval: "month",
      features: [
        "Every EQUIP Academy course",
        "Certificates of completion",
        "Role-play rating pack",
        "Posters and one-pager templates",
      ],
      popular: true,
      sku: "practitioner",
    },
    {
      id: "institution-monthly",
      name: "Institution",
      description: "For programmes training whole cohorts of helpers.",
      price: 39,
      currency: "$",
      interval: "month",
      features: [
        "Everything in Practitioner",
        "Ten team seats",
        "Cohort insights (coming soon)",
        "Onboarding call with the lab",
      ],
      sku: "institution",
    },
  ],
  annual: [
    {
      id: "member-annual",
      name: "Member",
      description: "Everything you need to work on-brand and start training.",
      price: 0,
      currency: "$",
      interval: "year",
      features: [
        "Brand studio, graphics kit and slide studio",
        "Foundational helping skills course",
        "Email signature generator",
      ],
      sku: "member",
    },
    {
      id: "practitioner-annual",
      name: "Practitioner",
      description: "For trainers and supervisors running EQUIP with their teams.",
      price: 90,
      currency: "$",
      interval: "year",
      features: [
        "Every EQUIP Academy course",
        "Certificates of completion",
        "Role-play rating pack",
        "Posters and one-pager templates",
      ],
      popular: true,
      sku: "practitioner",
    },
    {
      id: "institution-annual",
      name: "Institution",
      description: "For programmes training whole cohorts of helpers.",
      price: 390,
      currency: "$",
      interval: "year",
      features: [
        "Everything in Practitioner",
        "Ten team seats",
        "Cohort insights (coming soon)",
        "Onboarding call with the lab",
      ],
      sku: "institution",
    },
  ],
};

/**
 * The buyable modules as core `Product`s, so the storefront runs on
 * `@gmhlab/data`'s `ProductsProvider` cart like any other catalogue.
 */
export const DASHBOARD_PRODUCTS: Product[] = DASHBOARD_MODULES.filter(
  (m) => m.price !== undefined && !m.soon,
).map((m) => ({
  id: m.id,
  name: m.title,
  description: m.description,
  price: m.price!,
  currency: "$",
  rating: 5,
  imageUrl: "",
  category: m.category,
  inStock: true,
  tags: [m.category.toLowerCase()],
}));

/** The home noticeboard. Invented demo items; replace with real news. */
export const DASHBOARD_FEED: {
  announcements: DashboardAnnouncement[];
  events: DashboardEvent[];
} = {
  announcements: [
    {
      id: "a1",
      label: "New",
      title: "The practice rating studio is open",
      body: "Rate a scripted role play against expert scores and see where your ratings drift.",
      href: "/dashboard/equip/practice",
    },
    {
      id: "a2",
      label: "Brand",
      title: "Slide studio exports PowerPoint",
      body: "Build a deck from a form and download a real .pptx in the lab's colours.",
      href: "/dashboard/slides",
    },
    {
      id: "a3",
      label: "Reminder",
      title: "Bios now go through review",
      body: "Edit your profile any time; changes to your public title and bio go live once approved.",
      href: "/dashboard/account",
    },
  ],
  events: [
    { id: "e1", date: "2026-11-06", title: "Lab meeting", detail: "Fridays · 10:00 ET" },
    { id: "e2", date: "2026-11-12", title: "EQUIP onboarding webinar", detail: "For new trainers · 60 min" },
    { id: "e3", date: "2026-11-20", title: "Writing retreat", detail: "Staff and students · all day" },
  ],
};
