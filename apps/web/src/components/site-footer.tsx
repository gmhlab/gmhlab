"use client";

import { useNewsletter } from "@gmhlab/data";
import { Footer, NewsletterSignup, type FooterColumn } from "@gmhlab/ui";

/**
 * Every link here resolves to a route this app actually serves. Three columns
 * at most: the ui Footer lays out as quarters, and the logo takes the first.
 */
const COLUMNS: FooterColumn[] = [
  {
    title: "The Center",
    links: [{ label: "Our team", href: "/team" }],
  },
  {
    title: "Research",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "RESHAPE", href: "/projects/reshape" },
      { label: "Innovations", href: "/innovations" },
      { label: "EQUIP", href: "/innovations/equip" },
      { label: "Publications", href: "/publications" },
    ],
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
 */
export function SiteFooter() {
  const { subscribe } = useNewsletter();
  return (
    <Footer
      columns={COLUMNS}
      newsletter={
        <NewsletterSignup
          onSubscribe={subscribe}
          description="News from the Center and our partners: new research, project milestones and publications."
          fineprint="Just your email address. Unsubscribe any time."
        />
      }
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
