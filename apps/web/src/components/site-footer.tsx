"use client";

import { Footer, type FooterColumn } from "@gmhlab/ui";

/** Every link here resolves to a route this app actually serves. */
const COLUMNS: FooterColumn[] = [
  {
    title: "Research",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "RESHAPE", href: "/projects/reshape" },
      { label: "Innovations", href: "/innovations" },
      { label: "EQUIP", href: "/innovations/equip" },
    ],
  },
  {
    title: "Publications",
    links: [{ label: "Bibliography", href: "/publications" }],
  },
  {
    title: "The University",
    links: [
      { label: "Milken Institute SPH", href: "https://publichealth.gwu.edu/" },
      { label: "George Washington University", href: "https://www.gwu.edu/" },
    ],
  },
];

/**
 * The site's own boundary around the ui Footer — kept as the app's client
 * edge (layout.tsx is a server component). The ui bundle ships a
 * "use client" banner of its own, so this is not what makes Footer work.
 *
 * `aside={null}`: the default social buttons point at Figma's accounts.
 */
export function SiteFooter() {
  return (
    <Footer
      columns={COLUMNS}
      aside={null}
      legal={
        <>
          <span>
            © {new Date().getFullYear()} The George Washington University ·
            Washington, DC
          </span>
          <span>Built with @gmhlab/ui · @gmhlab/tokens · @gmhlab/blocks</span>
        </>
      }
    />
  );
}
