import clsx from "clsx";
import { useMediaQuery } from "../../hooks";
import { IconInstagram, IconLinkedin, IconXLogo, IconYoutube } from "../../icons";
import { Flex, FlexItem, Section, type SectionProps } from "../../layouts";
import {
  Button,
  GmhLogo,
  TextLink,
  TextLinkList,
  TextListItem,
} from "../../primitives";
import type { ReactNode } from "react";
import "./footers.css";

export type FooterLink = {
  label: string;
  href: string;
};
export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

/** The design-system default, from Figma's footer (7717:4142). A real site
 * passes its own `columns`. */
export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Use cases",
    links: ["UI design", "UX design", "Wireframing", "Diagramming", "Brainstorming", "Online whiteboard", "Team collaboration"].map((label) => ({ label, href: "#" })),
  },
  {
    title: "Explore",
    links: ["Design", "Prototyping", "Development features", "Design systems", "Collaboration features", "Design process", "FigJam"].map((label) => ({ label, href: "#" })),
  },
  {
    title: "Resources",
    links: ["Blog", "Best practices", "Colors", "Color wheel", "Support", "Developers", "Resource library"].map((label) => ({ label, href: "#" })),
  },
];

export type FooterProps = Omit<SectionProps, "variant" | "padding" | "src"> & {
  /** Link columns. Defaults to {@link DEFAULT_FOOTER_COLUMNS}. */
  columns?: FooterColumn[];
  /**
   * Rendered under the logo. Defaults to {@link SocialButtons} — whose links
   * point at Figma's accounts, so a real site should pass its own (or `null`).
   */
  aside?: ReactNode;
  /** The base row under the hairline — copyright and credits. Omitted when unset. */
  legal?: ReactNode;
};
export function Footer({
  className,
  columns = DEFAULT_FOOTER_COLUMNS,
  aside = <SocialButtons />,
  legal,
  ...props
}: FooterProps) {
  const { isTabletDown } = useMediaQuery();
  const listDensity = isTabletDown ? "tight" : "default";
  return (
    <Section
      className={clsx("footer", className)}
      elementType="footer"
      variant="brand"
      paddingTop="1600"
      paddingBottom={legal ? "800" : "4000"}
      style={{ marginTop: "auto" }}
      {...props}
    >
      <Flex direction="column" gap="800" container>
        <Flex wrap type="quarter" gap="600" className="footer-columns">
          <FlexItem size="minor">
            <Flex direction="column" gap="600" alignSecondary="start">
              <FlexItem>
                <GmhLogo className="footer-logo" />
              </FlexItem>
              {aside && <FlexItem>{aside}</FlexItem>}
            </Flex>
          </FlexItem>
          {columns.map((column) => (
            <TextLinkList
              key={column.title}
              density={listDensity}
              title={<span className="footer-column-title">{column.title}</span>}
            >
              {column.links.map((link) => (
                <TextListItem key={link.label}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </TextListItem>
              ))}
            </TextLinkList>
          ))}
        </Flex>
        {legal && <div className="footer-legal">{legal}</div>}
      </Flex>
    </Section>
  );
}

export function SocialButtons() {
  return (
    <Flex alignSecondary="center" gap="100">
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="X"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.x.com/figma" />}
      >
        <IconXLogo />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="Instagram"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://instagram.com/figma" />}
      >
        <IconInstagram />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="YouTube"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.youtube.com/@Figma" />}
      >
        <IconYoutube />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        nativeButton={false}
        aria-label="LinkedIn"
        className="rounded-full hover:[--icon-color:var(--mfy-color-icon-default-default)]"
        render={<a href="https://www.linkedin.com/company/figma/" />}
      >
        <IconLinkedin />
      </Button>
    </Flex>
  );
}
